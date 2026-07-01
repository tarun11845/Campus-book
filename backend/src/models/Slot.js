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
