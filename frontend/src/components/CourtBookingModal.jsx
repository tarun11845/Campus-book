import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import axios from "axios";

const CourtBookingModal = ({ slot, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const API_BASE =
    import.meta.env.MODE === "development"
      ? "http://localhost:4000"
      : "";

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE}/api/bookings`,
        { slotId: slot._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      showMessage("success", "Court booked successfully!");
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      showMessage("error", err.response?.data?.error || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d)) return "—";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" />
              <h2 className="text-xl font-bold">
                {slot.courtName ? slot.courtName : (slot.facility?.name || "Court")} - Court Booking
              </h2>
            </div>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {message.text && (
              <div
                className={`p-3 rounded ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <div>
              <p className="font-medium">
                {formatTime(slot.startTime)} -{" "}
                {formatTime(slot.endTime)}
              </p>
              <p className="text-sm text-gray-600">
                Entire court booking
              </p>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end">
            <button
              onClick={handleBooking}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Booking..." : "Confirm Court Booking"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CourtBookingModal;
