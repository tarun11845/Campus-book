import mongoose from "mongoose";

const FacilitySchema = new mongoose.Schema(
  {
    sport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true
    },

    name: { type: String, required: true },

    maxPlayers: { type: Number, required: true },

    allowedGender: {
      type: String,
      enum: ["male", "female", "both"],
      default: "both"
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Facility", FacilitySchema);
