import express from "express";
import mongoose from "mongoose";
import Slot from "../models/Slot.js";
import Facility from "../models/Facility.js";
import Sport from "../models/Sport.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const mapUserGenderToSlotGender = (gender) => {
  if (gender === "male") return "boys";
  if (gender === "female") return "girls";
  return null;
};

const resolveUserGender = async (req) => {
  if (req.user?.gender) return req.user.gender;
  if (!req.user?.id) return null;
  const user = await User.findById(req.user.id).select("gender");
  return user?.gender || null;
};

/*
Fixed Timings:
Swimming - Morning: 6:00 AM – 8:00 AM (4 slots), Evening: 6:00 PM – 8:00 PM (4 slots)
Courts - Morning: 6:00 AM – 10:00 AM, Evening: 4:00 PM – 8:00 PM
Each slot: 30 minutes
*/


// ========================
// CREATE SLOTS (ADMIN)
// ========================
router.post("/", auth("admin"), async (req, res) => {
  console.log("CREATE SLOT BODY:", req.body);

  try {
    const { date, sportKey, morningCount = 4, eveningCount = 4, courtNames = [] } = req.body;

    if (!date || !sportKey) {
      return res.status(400).json({ error: "Date and sportKey required" });
    }

    // Find sport by key (name) - exact match with case-insensitive
    console.log("Searching for sport with key:", sportKey);
    const sport = await Sport.findOne({ 
      name: { $regex: `^${sportKey}$`, $options: "i" } 
    });
    
    if (!sport) {
      // Log all available sports for debugging
      const allSports = await Sport.find({});
      console.error("Sport not found. Available sports:", allSports.map(s => s.name));
      return res.status(400).json({ 
        error: `Sport "${sportKey}" not found. Available sports: ${allSports.map(s => s.name).join(", ")}` 
      });
    }

    console.log("Found sport:", sport.name, sport._id);

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // Find facilities for this sport
    const facilities = await Facility.find({ sport: sport._id });

    if (!facilities.length) {
      return res.status(400).json({ error: "No facility found for this sport" });
    }

    const slotsToCreate = [];

    // For swimming - gender-based separation
    if (sportKey.toLowerCase() === "swimming") {
      for (const facility of facilities) {
        // MORNING - GIRLS
        for (let i = 0; i < morningCount; i++) {
          const start = new Date(selectedDate);
          start.setHours(6, i * 30, 0, 0);

          const end = new Date(start);
          end.setMinutes(start.getMinutes() + 30);

          slotsToCreate.push({
            sport: sport._id,
            facility: facility._id,
            startTime: start,
            endTime: end,
            capacity: facility.maxPlayers,
            gender: "girls",
          });
        }

        // EVENING - BOYS
        for (let i = 0; i < eveningCount; i++) {
          const start = new Date(selectedDate);
          start.setHours(18, i * 30, 0, 0);

          const end = new Date(start);
          end.setMinutes(start.getMinutes() + 30);

          slotsToCreate.push({
            sport: sport._id,
            facility: facility._id,
            startTime: start,
            endTime: end,
            capacity: facility.maxPlayers,
            gender: "boys",
          });
        }
      }
    } else {
      // For courts (tennis, badminton, basketball, etc.)
      const courtsToUse = courtNames.length > 0 ? courtNames : ["Court A"];

      for (const courtName of courtsToUse) {
        // MORNING (6:00 AM - 10:00 AM)
        for (let i = 0; i < morningCount; i++) {
          const start = new Date(selectedDate);
          start.setHours(6, i * 30, 0, 0);

          const end = new Date(start);
          end.setMinutes(start.getMinutes() + 30);

          slotsToCreate.push({
            sport: sport._id,
            facility: facilities[0]._id,
            courtName: courtName,
            startTime: start,
            endTime: end,
            capacity: 1,
            gender: "both",
          });
        }

        // EVENING (4:00 PM - 8:00 PM)
        for (let i = 0; i < eveningCount; i++) {
          const start = new Date(selectedDate);
          start.setHours(16, i * 30, 0, 0);

          const end = new Date(start);
          end.setMinutes(start.getMinutes() + 30);

          slotsToCreate.push({
            sport: sport._id,
            facility: facilities[0]._id,
            courtName: courtName,
            startTime: start,
            endTime: end,
            capacity: 1,
            gender: "both",
          });
        }
      }
    }

    await Slot.insertMany(slotsToCreate);

    res.status(201).json({
      message: `${slotsToCreate.length} slots created successfully`,
    });

  } catch (err) {
    console.error("CREATE SLOT ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});



// ========================
// GET SLOTS (STUDENT)
// ========================
router.get("/list", auth(), async (req, res) => {
  try {
    const { sportKey, from, to } = req.query;
    
    console.log("LIST QUERY:", req.query); 

    if (!sportKey || !from || !to) {
      return res.status(400).json({
        error: "sportKey, from and to are required"
      });
    }

    // Find sport by key - exact match with case-insensitive
    const sport = await Sport.findOne({ 
      name: { $regex: `^${sportKey}$`, $options: "i" } 
    });
    if (!sport) {
      const allSports = await Sport.find({});
      return res.status(400).json({ 
        error: `Sport "${sportKey}" not found. Available: ${allSports.map(s => s.name).join(", ")}` 
      });
    }

    const query = {
      sport: sport._id,
      startTime: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    };

    if (sportKey.toLowerCase() === "swimming") {
      const userGender = await resolveUserGender(req);
      const desiredSlotGender = mapUserGenderToSlotGender(userGender);
      if (!desiredSlotGender) {
        return res.status(400).json({ error: "Unable to resolve user gender" });
      }
      query.gender = { $in: [desiredSlotGender, "both"] };
    }

    const slots = await Slot.find(query)
      .populate("facility")
      .populate("sport")
      .sort({ startTime: 1 });

    // Calculate occupied count for each slot
    const slotsWithOccupancy = await Promise.all(
      slots.map(async (slot) => {
        const occupied = await Booking.countDocuments({
          slot: slot._id,
          bookingStatus: "active"
        });
        
        return {
          ...slot.toObject(),
          occupied
        };
      })
    );

    res.json(slotsWithOccupancy);

  } catch (err) {
    console.error("LIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
