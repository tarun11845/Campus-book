#!/usr/bin/env node
// One-time backfill: the Slot model now has a `bookedCount` field used to
// atomically enforce capacity (see bookings.controller.js). Existing slots
// created before this change default to bookedCount = 0, which is wrong
// for any slot that already has active bookings against it — this script
// recalculates the correct count for every slot from the Booking
// collection (the actual source of truth) and sets it once.
//
// Safe to run more than once (it always recomputes from scratch).
// Safe to delete this file after running it.
//
// Usage (from the backend/ folder):
//   node backfill-slot-booked-count.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const SlotSchema = new mongoose.Schema({}, { strict: false });
const Slot = mongoose.model("Slot", SlotSchema);

const BookingSchema = new mongoose.Schema({}, { strict: false });
const Booking = mongoose.model("Booking", BookingSchema);

async function run() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nitk-pool-booking");
  console.log("✅ Connected\n");

  const counts = await Booking.aggregate([
    { $match: { bookingStatus: "active" } },
    { $group: { _id: "$slot", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

  const allSlots = await Slot.find({}).select("_id bookedCount");
  console.log(`Found ${allSlots.length} slots. Updating bookedCount for each...\n`);

  let changed = 0;
  for (const slot of allSlots) {
    const correctCount = countMap.get(String(slot._id)) || 0;
    if (slot.bookedCount !== correctCount) {
      await Slot.updateOne({ _id: slot._id }, { $set: { bookedCount: correctCount } });
      changed++;
    }
  }

  console.log(`✅ Updated bookedCount on ${changed} slot(s) (${allSlots.length - changed} were already correct).`);

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected.");
}

run().catch((err) => {
  console.error("❌ Backfill failed:", err);
  process.exit(1);
});
