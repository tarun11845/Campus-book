#!/usr/bin/env node
// One-time cleanup: removes duplicate Slot documents (same facility,
// courtName, startTime and gender) that piled up from clicking
// "Create Slots" multiple times before the duplicate-prevention fix.
// Keeps the OLDEST copy of each duplicate group (by _id / createdAt),
// deletes the rest. Safe to delete this file after running it once.
//
// Usage (from the backend/ folder):
//   node cleanup-duplicate-slots.js
//
// Make sure your .env (with MONGODB_URI) is set up the same way it is
// for seed.js / the running server.

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const SlotSchema = new mongoose.Schema(
  {
    facility: { type: mongoose.Schema.Types.ObjectId, ref: "Facility", required: true },
    sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    courtName: { type: String, default: null },
    capacity: { type: Number, required: true },
    gender: { type: String, enum: ["boys", "girls", "both"], default: "both" },
  },
  { timestamps: true }
);
const Slot = mongoose.model("Slot", SlotSchema);

const BookingSchema = new mongoose.Schema({}, { strict: false });
const Booking = mongoose.model("Booking", BookingSchema);

async function run() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nitk-pool-booking");
  console.log("Connected\n");

  const allSlots = await Slot.find({}).sort({ createdAt: 1 }); // oldest first
  console.log(`Found ${allSlots.length} total slots.`);

  const seen = new Map(); // key -> slot to KEEP (the first/oldest one)
  const duplicateIds = [];

  for (const slot of allSlots) {
    const key = `${slot.facility}_${slot.courtName || ""}_${slot.startTime.getTime()}_${slot.gender}`;
    if (seen.has(key)) {
      duplicateIds.push(slot._id);
    } else {
      seen.set(key, slot._id);
    }
  }

  console.log(`Identified ${duplicateIds.length} duplicate slot(s) to remove.\n`);

  if (duplicateIds.length === 0) {
    console.log("Nothing to clean up. ");
  } else {
    // Safety check: don't delete a duplicate slot that already has a real
    // booking against it — flag those instead of silently removing them.
    const bookedDuplicates = await Booking.find({
      slot: { $in: duplicateIds },
      bookingStatus: "active",
    }).select("slot");

    const bookedSlotIds = new Set(bookedDuplicates.map((b) => String(b.slot)));
    const safeToDelete = duplicateIds.filter((id) => !bookedSlotIds.has(String(id)));
    const skippedBecauseBooked = duplicateIds.length - safeToDelete.length;

    const result = await Slot.deleteMany({ _id: { $in: safeToDelete } });
    console.log(` Deleted ${result.deletedCount} duplicate slot(s).`);
    if (skippedBecauseBooked > 0) {
      console.log(
        ` Skipped ${skippedBecauseBooked} duplicate(s) that already have an active booking — review those manually.`
      );
    }
  }

  await mongoose.disconnect();
  console.log("\n Disconnected.");
}

run().catch((err) => {
  console.error(" Cleanup failed:", err);
  process.exit(1);
});
