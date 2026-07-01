import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";
import Sport from "../models/Sport.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const mapUserGenderToSlotGender = (gender) => {
  if (gender === "male") return "boys";
  if (gender === "female") return "girls";
  return null;
};

/* =========================
   CREATE BOOKING
========================= */
router.post("/", auth(), async (req, res) => {
  const { slotId } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const slot = await Slot.findById(slotId)
      .populate("facility")
      .session(session);

    if (!slot) throw new Error("Slot not found");
    if (slot.isCancelled) throw new Error("Slot cancelled by admin");
    if (slot.endTime <= new Date())
      throw new Error("Cannot book past slot");

    const user = await User.findById(userId).session(session);

    // Gender check only applies to swimming and facilities with gender restrictions
    if (
      slot.facility.allowedGender !== "both" &&
      slot.facility.allowedGender !== user.gender
    ) {
      throw new Error("Not allowed for your gender");
    }

    if (slot.gender && slot.gender !== "both") {
      const requiredSlotGender = mapUserGenderToSlotGender(user.gender);
      if (!requiredSlotGender || slot.gender !== requiredSlotGender) {
        throw new Error("Not allowed for your gender");
      }
    }

    const activeCount = await Booking.countDocuments({
      slot: slotId,
      bookingStatus: "active"
    }).session(session);

    if (activeCount >= slot.capacity)
      throw new Error("Slot is full");

    const userBookings = await Booking.find({
      user: userId,
      bookingStatus: "active"
    })
      .populate("slot")
      .session(session);

    const isOverlapping = userBookings.some((booking) => {
      const bookedSlot = booking.slot;
      return (
        bookedSlot.startTime < slot.endTime &&
        bookedSlot.endTime > slot.startTime
      );
    });

    if (isOverlapping)
      throw new Error(
        "You already have a booking during this time period. Please choose a different slot."
      );

    await Booking.create(
      [{
        user: userId,
        slot: slotId,
        bookingStatus: "active"
      }],
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ message: "Booking successful" });

  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});


/* =========================
   GET MY BOOKINGS
========================= */
router.get("/my-bookings", auth(), async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
      bookingStatus: "active"
    })
      .populate({
        path: "slot",
        populate: {
          path: "facility",
          populate: {
            path: "sport",
            select: "name"
          }
        }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/* =========================
   ADMIN GET ALL BOOKINGS
========================= */
router.get("/all", auth("admin"), async (req, res) => {
  try {
    const { sport, date } = req.query;
    let sportRecord = null;

    if (sport) {
      sportRecord = await Sport.findOne({
        name: { $regex: `^${sport}$`, $options: "i" }
      });

      if (!sportRecord) {
        return res.status(400).json({ error: `Sport "${sport}" not found` });
      }
    }

    const targetDate = date ? new Date(date) : null;
    const nextDate = targetDate ? new Date(targetDate) : null;
    if (nextDate) {
      nextDate.setHours(0, 0, 0, 0);
      nextDate.setDate(nextDate.getDate() + 1);
    }

    const bookings = await Booking.find({ bookingStatus: "active" })
      .populate("user", "name email")
      .populate({
        path: "slot",
        populate: {
          path: "facility",
          populate: {
            path: "sport",
            select: "name"
          }
        }
      })
      .sort({ createdAt: -1 });

    const filteredBookings = bookings.filter((booking) => {
      const sportMatch = sportRecord
        ? booking.slot?.facility?.sport?._id?.toString() === sportRecord._id.toString()
        : true;
      if (!sportMatch) return false;

      if (!targetDate) return true;

      const slotStart = booking.slot?.startTime;
      return slotStart >= targetDate && slotStart < nextDate;
    });

    res.json(filteredBookings);
  } catch (err) {
    console.error("Error fetching admin bookings:", err);
    res.status(500).json({ error: "Failed to fetch admin bookings" });
  }
});


/* =========================
   USER CANCEL BOOKING
========================= */
router.post("/cancel", auth(), async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking || booking.bookingStatus !== "active")
    return res.status(404).json({ error: "Booking not found" });

  booking.bookingStatus = "cancelled";
  booking.cancelledAt = new Date();
  await booking.save();

  res.json({ message: "Booking cancelled" });
});


/* =========================
   ADMIN CANCEL BOOKING
========================= */
router.post("/admin-cancel", auth("admin"), async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking)
    return res.status(404).json({ error: "Not found" });

  booking.bookingStatus = "admin_cancelled";
  booking.cancelledAt = new Date();
  await booking.save();

  res.json({ message: "Booking cancelled by admin" });
});

export default router;
