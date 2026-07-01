import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true
    },

    bookingStatus: {
      type: String,
      enum: ["active", "cancelled", "admin_cancelled"],
      default: "active"
    },

    cancelledAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
