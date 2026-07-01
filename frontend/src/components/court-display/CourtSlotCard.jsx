import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const CourtSlotCard = ({ slot, onSlotClick }) => {   
    console.log("Rendering CourtSlotCard for slot:", slot);

  const formatTime = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date)) return "—";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCapacityStatus = () => {
    const occupied = slot.occupied || 0;
    const capacity = slot.capacity || 1;
    const available = capacity - occupied;

    if (available === 0)
      return { status: "full" };
    else if (occupied > 0)
      return { status: "partial" };
    else
      return { status: "available" };
  };

  const capacityStatus = getCapacityStatus();
  const occupied = slot.occupied || 0;
  const capacity = slot.capacity || 1;
  const available = capacity - occupied;

  return (
    <motion.div
      className={`p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${
        capacityStatus.status === "full"
          ? "border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 opacity-75"
          : capacityStatus.status === "available"
          ? "border-green-200 hover:border-green-400 hover:shadow-2xl hover:scale-[1.03] bg-gradient-to-br from-green-50 to-emerald-50"
          : "border-emerald-200 hover:border-emerald-400 hover:shadow-2xl hover:scale-[1.03] bg-gradient-to-br from-emerald-50 to-cyan-50"
      }`}
      onClick={() => capacityStatus.status !== "full" && onSlotClick(slot)}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
            <MapPin className="w-8 h-8 text-white" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </h3>
            <p className="text-sm text-gray-700 font-medium">
              {slot.courtName ? slot.courtName : (slot.facility?.name || "Court")}
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold border-2 shadow-lg ${
            capacityStatus.status === "available"
              ? "bg-green-100 text-green-800 border-green-300"
              : capacityStatus.status === "partial"
              ? "bg-amber-100 text-amber-800 border-amber-300"
              : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          <span className="capitalize">{capacityStatus.status}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl border-2 border-emerald-200 shadow-lg">
          <div>
            <h4 className="text-xl font-bold text-gray-800">
              Court Booking
            </h4>
            <p className="text-sm text-gray-700 font-medium">
              30-minute match slot
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600">
              {occupied}/{capacity}
            </div>
            <div className="text-sm text-gray-700 font-semibold">
              {available} spots available
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourtSlotCard;
