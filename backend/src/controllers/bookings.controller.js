import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Slot from "../models/Slot.js";
import Sport from "../models/Sport.js";
import User from "../models/User.js";
// Helper function
const mapUserGenderToSlotGender = (gender) => {
  if (gender === "male") return "boys";
  if (gender === "female") return "girls";
  return null;
};

/* =========================
   CREATE BOOKING
========================= */
export const createBooking = async (req, res) => {
  const { slotId } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();

  try {
    // session.withTransaction() runs the callback inside a transaction and
    // automatically retries it if MongoDB reports a TransientTransactionError
    // — which is exactly what happens when two concurrent requests both try
    // to update the same Slot document (e.g. two students booking the last
    // seat at the same instant). The loser gets retried and, on retry, sees
    // the other's already-committed change.
    await session.withTransaction(async () => {
      const slot = await Slot.findById(slotId)
        .populate("facility")
        .session(session);

      if (!slot) throw new Error("Slot not found");
      if (slot.isCancelled) throw new Error("Slot cancelled by admin");
      if (slot.endTime <= new Date()) throw new Error("Cannot book past slot");

      const user = await User.findById(userId).session(session);

      // Facility level gender check
      if (
        slot.facility.allowedGender !== "both" &&
        slot.facility.allowedGender !== user.gender
      ) {
        throw new Error("Not allowed for your gender");
      }

      // Slot level gender check
      if (slot.gender && slot.gender !== "both") {
        const requiredSlotGender = mapUserGenderToSlotGender(user.gender);
        if (!requiredSlotGender || slot.gender !== requiredSlotGender) {
          throw new Error("Not allowed for your gender");
        }
      }

      // Overlap check
      const userBookings = await Booking.find({
        user: userId,
        bookingStatus: "active"
      })
        .populate("slot")
        .session(session);

      const isOverlapping = userBookings.some((booking) => {
        const bookedSlot = booking.slot;
        // booking.slot can be null if the referenced Slot was auto-deleted
        // (2-day TTL / cleanup job) while the booking itself is still active.
        if (!bookedSlot) return false;
        return (
          bookedSlot.startTime < slot.endTime &&
          bookedSlot.endTime > slot.startTime
        );
      });

      if (isOverlapping)
        throw new Error(
          "You already have a booking during this time period. Please choose a different slot."
        );

      // Atomic capacity check-and-increment. This single findOneAndUpdate
      // is the actual fix for the race condition described above: the
      // condition (bookedCount < capacity) and the increment happen as
      // one atomic operation on one document, so two concurrent requests
      // can't both read "9 booked, capacity 10" and both proceed —
      // MongoDB serializes writes to the same document, and the loser
      // either sees the updated count on retry or gets a clean
      // "Slot is full" instead of silently overbooking.
      const reservedSlot = await Slot.findOneAndUpdate(
        { _id: slotId, $expr: { $lt: ["$bookedCount", "$capacity"] } },
        { $inc: { bookedCount: 1 } },
        { new: true, session }
      );

      if (!reservedSlot) throw new Error("Slot is full");

      await Booking.create(
        [{ user: userId, slot: slotId, bookingStatus: "active" }],
        { session }
      );
    });

    res.status(201).json({ message: "Booking successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

/* =========================
   GET MY BOOKINGS
========================= */
export const getMyBookings = async (req, res) => {
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
};

/* =========================
   ADMIN GET ALL BOOKINGS
========================= */
export const getAllBookings = async (req, res) => {
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
};

/* =========================
   USER CANCEL BOOKING
========================= */
export const cancelBooking = async (req, res) => {
  const { bookingId } = req.body;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const booking = await Booking.findById(bookingId).session(session);
      if (!booking || booking.bookingStatus !== "active") {
        throw new Error("NOT_FOUND");
      }

      booking.bookingStatus = "cancelled";
      booking.cancelledAt = new Date();
      await booking.save({ session });

      // Free up the seat. If the slot has since been auto-deleted (TTL
      // cleanup), there's nothing to decrement — that's fine, the booking
      // cancellation itself still goes through.
      await Slot.findByIdAndUpdate(
        booking.slot,
        { $inc: { bookedCount: -1 } },
        { session }
      );
    });

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Booking not found" });
    }
    console.error("Error cancelling booking:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  } finally {
    session.endSession();
  }
};

/* =========================
   ADMIN CANCEL BOOKING
========================= */
export const adminCancelBooking = async (req, res) => {
  const { bookingId } = req.body;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const booking = await Booking.findById(bookingId).session(session);
      if (!booking) throw new Error("NOT_FOUND");

      // Only free up the seat if it was actually still counted as active —
      // an already-cancelled booking shouldn't decrement bookedCount again.
      const wasActive = booking.bookingStatus === "active";

      booking.bookingStatus = "admin_cancelled";
      booking.cancelledAt = new Date();
      await booking.save({ session });

      if (wasActive) {
        await Slot.findByIdAndUpdate(
          booking.slot,
          { $inc: { bookedCount: -1 } },
          { session }
        );
      }
    });

    res.json({ message: "Booking cancelled by admin" });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Not found" });
    }
    console.error("Error cancelling booking:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  } finally {
    session.endSession();
  }
};