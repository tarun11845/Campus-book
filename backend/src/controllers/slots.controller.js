import Slot from "../models/Slot.js";
import Facility from "../models/Facility.js";
import Sport from "../models/Sport.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

// ========================
// HELPER FUNCTIONS
// ========================
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

// Build a Date for a given calendar date + hour/minute *in IST (UTC+5:30)*,
// regardless of what timezone the server process itself runs in (Render
// defaults to UTC, which previously made "6:00" mean 6:00 UTC = 11:30 AM IST).
// `dateInput` can be a Date or a "YYYY-MM-DD" string.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const buildISTDate = (dateInput, hours, minutes = 0) => {
  const d = new Date(dateInput);
  // Shift the instant by +5:30 first, then read the UTC calendar fields.
  // This gives the correct IST calendar date whether dateInput is a plain
  // "YYYY-MM-DD" string (parsed as UTC midnight) or a full ISO timestamp
  // like selectedDate.toISOString() from the admin UI (which can land on
  // the *previous* UTC day when it represents IST local midnight).
  const istShifted = new Date(d.getTime() + IST_OFFSET_MS);
  const y = istShifted.getUTCFullYear();
  const m = istShifted.getUTCMonth();
  const day = istShifted.getUTCDate();
  const mm = String(m + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const hh = String(hours).padStart(2, "0");
  const min = String(minutes).padStart(2, "0");
  // Explicit +05:30 offset makes this timezone-independent of the server.
  return new Date(`${y}-${mm}-${dd}T${hh}:${min}:00.000+05:30`);
};

// ========================
// CREATE SLOTS (ADMIN)
// ========================
export const createSlots = async (req, res) => {
  console.log("CREATE SLOT BODY:", req.body);

  try {
    const { date, sportKey, morningCount = 8, eveningCount = 8, courtNames = [] } = req.body;

    if (!date || !sportKey) {
      return res.status(400).json({ error: "Date and sportKey required" });
    }

    // Find sport by key — case insensitive
    const sport = await Sport.findOne({
      name: { $regex: `^${sportKey}$`, $options: "i" }
    });

    if (!sport) {
      const allSports = await Sport.find({});
      console.error("Sport not found. Available sports:", allSports.map(s => s.name));
      return res.status(400).json({
        error: `Sport "${sportKey}" not found. Available sports: ${allSports.map(s => s.name).join(", ")}`
      });
    }

    // Find facilities for this sport
    const facilities = await Facility.find({ sport: sport._id });
    if (!facilities.length) {
      return res.status(400).json({ error: "No facility found for this sport" });
    }

    const slotsToCreate = [];

    if (sportKey.toLowerCase() === "swimming") {
      for (const facility of facilities) {
        // MORNING — GIRLS (6:00 AM - 8:00 AM IST)
        for (let i = 0; i < morningCount; i++) {
          const start = buildISTDate(date, 6, i * 30);
          const end = new Date(start.getTime() + 30 * 60 * 1000);

          slotsToCreate.push({
            sport: sport._id,
            facility: facility._id,
            startTime: start,
            endTime: end,
            capacity: facility.maxPlayers,
            gender: "girls",
          });
        }

        // EVENING — BOYS (6:00 PM - 8:00 PM IST)
        for (let i = 0; i < eveningCount; i++) {
          const start = buildISTDate(date, 18, i * 30);
          const end = new Date(start.getTime() + 30 * 60 * 1000);

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
      // Courts (Tennis, Badminton, Basketball)
      const courtsToUse = courtNames.length > 0 ? courtNames : ["Court A"];

      for (const courtName of courtsToUse) {
        // MORNING (6:00 AM - 10:00 AM IST)
        for (let i = 0; i < morningCount; i++) {
          const start = buildISTDate(date, 6, i * 30);
          const end = new Date(start.getTime() + 30 * 60 * 1000);

          slotsToCreate.push({
            sport: sport._id,
            facility: facilities[0]._id,
            courtName,
            startTime: start,
            endTime: end,
            capacity: 1,
            gender: "both",
          });
        }

        // EVENING (4:00 PM - 8:00 PM IST)
        for (let i = 0; i < eveningCount; i++) {
          const start = buildISTDate(date, 16, i * 30);
          const end = new Date(start.getTime() + 30 * 60 * 1000);

          slotsToCreate.push({
            sport: sport._id,
            facility: facilities[0]._id,
            courtName,
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
};

// ========================
// GET SLOTS (STUDENT)
// ========================
export const getSlots = async (req, res) => {
  try {
    const { sportKey, from, to } = req.query;

    console.log("LIST QUERY:", req.query);

    if (!sportKey || !from || !to) {
      return res.status(400).json({ error: "sportKey, from and to are required" });
    }

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

    // Add occupancy count to each slot
    const slotsWithOccupancy = await Promise.all(
      slots.map(async (slot) => {
        const occupied = await Booking.countDocuments({
          slot: slot._id,
          bookingStatus: "active"
        });
        return { ...slot.toObject(), occupied };
      })
    );

    res.json(slotsWithOccupancy);

  } catch (err) {
    console.error("LIST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};