import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Waves } from "lucide-react";
import axios from "axios";

import DateSelector from "./slot-management/DateSelector";
import SlotCreator from "./slot-management/SlotCreator";
import CourtSlotCreator from "./slot-management/CourtSlotCreator";
import MessageDisplay from "./slot-management/MessageDisplay";

const SlotManagement = ({ sportKey }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [existingSlots, setExistingSlots] = useState([]); 
  console.log("Creating slot for sport:", sportKey);

  const [customSlots, setCustomSlots] = useState({
    morningCount: 5,
    eveningCount: 5,
  });

  const API_BASE =
    import.meta.env.MODE === "development"
      ? "http://localhost:4000"
      : 'https://campus-book-sx4m.onrender.com';

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const fetchExistingSlots = async (date) => {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await axios.get(
        `${API_BASE}/api/slots/list?from=${startOfDay.toISOString()}&to=${endOfDay.toISOString()}&sportKey=${sportKey}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setExistingSlots(response.data);
    } catch (error) {
      console.error("Failed to fetch existing slots:", error);
      setExistingSlots([]);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchExistingSlots(date);
  };

  const createSlots = async (courtNames = []) => {
    if (!selectedDate) {
      showMessage("error", "Please select a date");
      return;
    }

    if (
      customSlots.morningCount === 0 &&
      customSlots.eveningCount === 0
    ) {
      showMessage("error", "Select at least one slot");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        sportKey: sportKey,
        date: selectedDate.toISOString(),
        morningCount: customSlots.morningCount,
        eveningCount: customSlots.eveningCount,
      };

      // Add courtNames for non-swimming sports
      if (sportKey.toLowerCase() !== "swimming" && courtNames.length > 0) {
        payload.courtNames = courtNames;
      }

      await axios.post(
        `${API_BASE}/api/slots`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      showMessage("success", "Slots created successfully");
      fetchExistingSlots(selectedDate);
    } catch (error) {
      showMessage(
        "error",
        error.response?.data?.error || "Failed to create slots"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExistingSlots(selectedDate);
  }, [sportKey]);

  return (
    <div className="space-y-6">
      <MessageDisplay message={message} />

      <div className="grid lg:grid-cols-2 gap-8">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        {/* CONDITION HERE */}
        {sportKey === "swimming" ? (
          <SlotCreator
            selectedDate={selectedDate}
            loading={loading}
            onCreateSlots={createSlots}
            customSlots={customSlots}
            onCustomSlotsChange={setCustomSlots}
          />
        ) : (
          <CourtSlotCreator
            selectedDate={selectedDate}
            loading={loading}
            onCreateSlots={createSlots}
            customSlots={customSlots}
            onCustomSlotsChange={setCustomSlots}
            sportName={
              sportKey.charAt(0).toUpperCase() +
              sportKey.slice(1)
            }
          />
        )}
      </div>

      {/* Existing Slots */}
      {existingSlots.length > 0 && (
        <motion.div
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Waves className="w-5 h-5 text-blue-600" />
            <span>Existing Slots</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingSlots.map((slot) => (
              <div
                key={slot._id}
                className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium">
                      {slot.startTime && !isNaN(new Date(slot.startTime))
                        ? new Date(slot.startTime).toLocaleTimeString("en-IN", {
                            timeZone: 'Asia/Kolkata',
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}{" "}
                      -{" "}
                      {slot.endTime && !isNaN(new Date(slot.endTime))
                        ? new Date(slot.endTime).toLocaleTimeString("en-IN", {
                            timeZone: 'Asia/Kolkata',
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}
                    </div>
                    {slot.courtName && (
                      <div className="text-sm text-gray-600 mt-1">
                        {slot.courtName}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="font-bold">
                      {slot.occupied || 0}/{slot.capacity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SlotManagement;