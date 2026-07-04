import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_BASE =
    import.meta.env.MODE === 'development'
      ? 'http://localhost:4000'
      : 'https://campus-book-sx4m.onrender.com';

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load bookings' });
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.post(
        `${API_BASE}/api/bookings/cancel`,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchMyBookings();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to cancel booking' });
    }
  };

  const formatDate = (date) =>
    !date || isNaN(new Date(date))
      ? "—"
      : new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

  const formatTime = (date) =>
    !date || isNaN(new Date(date))
      ? "—"
      : new Date(date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

  const isUpcoming = (endTime) => new Date(endTime) > new Date();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#eff6ff] to-[#e0e7ff] p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          My Bookings
        </h1>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p>No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const slot = booking.slot;
              const facility = slot?.facility;
              const sport = facility?.sport;

              return (
                <motion.div
                  key={booking._id}
                  className="bg-white p-6 rounded-xl shadow-md border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex justify-between items-center">

                    <div>
                      <h2 className="text-xl font-bold mb-1">
                        {sport?.name}
                      </h2>

                      <p className="text-gray-600">
                        Facility: {facility?.name}
                      </p>

                      <p className="text-gray-600">
                        {formatDate(slot.startTime)}
                      </p>

                      <p className="text-gray-600">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </p>
                    </div>

                    <div className="text-right space-y-2">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isUpcoming(slot.endTime)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isUpcoming(slot.endTime) ? 'Upcoming' : 'Completed'}
                      </div>

                      {isUpcoming(slot.endTime) && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;