import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import BookingsTable from "./booking-management/BookingsTable";
import BookingStats from "./booking-management/BookingStats";
import MessageDisplay from "./slot-management/MessageDisplay";

const BookingsManagement = ({ sportKey }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const API_BASE =
    import.meta.env.MODE === "development"
      ? "http://localhost:4000"
      : "";

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE}/api/bookings/all?sport=${sportKey}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setBookings(response.data);
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.error || "Failed to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  }, [API_BASE, sportKey]);

  const cancelBooking = useCallback(
    async (bookingId) => {
      if (!window.confirm("Are you sure you want to cancel this booking?"))
        return;

      setLoading(true);
      try {
        await axios.post(
          `${API_BASE}/api/bookings/admin-cancel`,
          { bookingId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        showMessage("success", "Booking cancelled successfully");
        fetchBookings();
      } catch (error) {
        showMessage(
          "error",
          error.response?.data?.error || "Failed to cancel booking"
        );
      } finally {
        setLoading(false);
      }
    },
    [API_BASE, fetchBookings]
  );

  const bookingStats = useMemo(() => {
    return {
      total: bookings.length,
      active: bookings.filter(b => b.bookingStatus === "active").length,
      cancelled: bookings.filter(b => b.bookingStatus !== "active").length,
    };
  }, [bookings]);

  useEffect(() => {
    if (sportKey) {
      fetchBookings();
    }
  }, [fetchBookings, sportKey]);

  return (
    <div className="space-y-6">
      <MessageDisplay message={message} />

      <motion.div
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {sportKey?.charAt(0).toUpperCase() + sportKey?.slice(1)} Bookings
          </h2>

          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        <BookingsTable
          bookings={bookings}
          loading={loading}
          onCancelBooking={cancelBooking}
        />
      </motion.div>

      <BookingStats bookingStats={bookingStats} />
    </div>
  );
};

export default BookingsManagement;
