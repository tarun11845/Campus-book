import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },

    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },

    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },

    courtName: {
      type: String,
      default: null,
    },

    capacity: {
      type: Number,
      required: true,
    },

    // Atomic occupancy counter, incremented/decremented alongside each
    // Booking create/cancel via a single conditional findOneAndUpdate.
    // This is what actually prevents overbooking under concurrent
    // requests — counting active Booking documents at read time (the old
    // approach) has a race: two simultaneous requests can each read the
    // same "9 booked" count before either has committed, and both pass
    // the capacity check. bookedCount fixes this because MongoDB
    // guarantees the read-check-and-write inside a single
    // findOneAndUpdate happens atomically for that one document.
    bookedCount: {
      type: Number,
      default: 0,
    },

    gender: {
      type: String,
      enum: ["boys", "girls", "both"],
      default: "both",
    },
  },
  { timestamps: true }
);

// Automatically remove slots 2 days after creation to limit storage growth.
SlotSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 2 });

export default mongoose.model("Slot", SlotSchema);

// this 
