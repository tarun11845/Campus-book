import { motion } from "framer-motion";
import { Plus, MapPin, Clock, Users, Trash2 } from "lucide-react";
import { useState } from "react";

const CourtSlotCreator = ({
  selectedDate,
  loading,
  onCreateSlots,
  customSlots,
  onCustomSlotsChange,
  sportName = "Basketball",
}) => {
  const [courts, setCourts] = useState(["Court A", "Court B"]);
  const [newCourt, setNewCourt] = useState("");

  const addCourt = () => {
    if (newCourt.trim() && !courts.includes(newCourt)) {
      setCourts([...courts, newCourt]);
      setNewCourt("");
    }
  };

  const removeCourt = (courtName) => {
    setCourts(courts.filter(c => c !== courtName));
  };

  const handleCreateSlots = () => {
    onCreateSlots(courts);
  };

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl shadow-xl border-2 border-emerald-200 p-8">

        {/* Header */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <MapPin className="w-8 h-8 text-emerald-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Create {sportName} Court Slots
          </h3>
        </div>

        {/* Selected Date */}
        {selectedDate && (
          <div className="mb-6 p-6 bg-gradient-to-r from-emerald-100 to-cyan-100 rounded-2xl border-2 border-emerald-300">
            <h4 className="font-bold text-emerald-800 mb-3 text-lg">
              Selected Date:
            </h4>
            <div className="text-xl font-bold text-emerald-700">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="text-sm text-emerald-600 mt-2 font-medium">
              {customSlots.morningCount} morning court slots +{" "}
              {customSlots.eveningCount} evening court slots ×{" "}
              <span className="font-bold">{courts.length}</span> court
              {courts.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        {/* Courts Selection */}
        <div className="mb-6 p-6 bg-white rounded-2xl border-2 border-emerald-200 shadow-lg">
          <h4 className="font-bold text-gray-800 mb-4 text-lg">
            Select Courts
          </h4>

          <div className="space-y-4">
            {/* Existing Courts */}
            <div className="space-y-2">
              {courts.length > 0 && (
                <div className="text-sm text-gray-600 font-medium mb-2">
                  Selected Courts:
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {courts.map((court) => (
                  <motion.div
                    key={court}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white px-4 py-2 rounded-lg"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    <span className="font-semibold">{court}</span>
                    <button
                      onClick={() => removeCourt(court)}
                      className="hover:bg-red-500 rounded-full p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Add New Court */}
            <div className="flex gap-2 pt-4 border-t border-emerald-200">
              <input
                type="text"
                value={newCourt}
                onChange={(e) => setNewCourt(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCourt()}
                placeholder="e.g., Court C, Court D"
                className="flex-1 px-4 py-2 border-2 border-emerald-300 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={addCourt}
                disabled={!newCourt.trim()}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Slot Config */}
        <div className="mb-6 p-6 bg-white rounded-2xl border-2 border-emerald-200 shadow-lg">
          <h4 className="font-bold text-gray-800 mb-4 text-lg">
            Customize Court Slot Configuration
          </h4>

          <div className="grid grid-cols-2 gap-6">

            {/* Morning Court Slots */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-gray-700">
                  Morning Court Slots
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    onCustomSlotsChange({
                      ...customSlots,
                      morningCount: Math.max(0, customSlots.morningCount - 1),
                    })
                  }
                  className="w-8 h-8 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-bold transition-colors"
                >
                  -
                </button>

                <span className="text-2xl font-bold text-emerald-600 w-8 text-center">
                  {customSlots.morningCount}
                </span>

                <button
                  onClick={() =>
                    onCustomSlotsChange({
                      ...customSlots,
                      morningCount: Math.min(10, customSlots.morningCount + 1),
                    })
                  }
                  className="w-8 h-8 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-bold transition-colors"
                >
                  +
                </button>
              </div>

              <div className="text-xs text-gray-600">
                Times: 6:00 AM - 10:00 AM
              </div>
            </div>

            {/* Evening Court Slots */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="font-semibold text-gray-700">
                  Evening Court Slots
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    onCustomSlotsChange({
                      ...customSlots,
                      eveningCount: Math.max(0, customSlots.eveningCount - 1),
                    })
                  }
                  className="w-8 h-8 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-bold transition-colors"
                >
                  -
                </button>

                <span className="text-2xl font-bold text-emerald-600 w-8 text-center">
                  {customSlots.eveningCount}
                </span>

                <button
                  onClick={() =>
                    onCustomSlotsChange({
                      ...customSlots,
                      eveningCount: Math.min(10, customSlots.eveningCount + 1),
                    })
                  }
                  className="w-8 h-8 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-bold transition-colors"
                >
                  +
                </button>
              </div>

              <div className="text-xs text-gray-600">
                Times: 4:00 PM - 8:00 PM
              </div>
            </div>

          </div>

          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-sm text-emerald-700 font-medium">
              Total Court Slots:{" "}
              {(customSlots.morningCount + customSlots.eveningCount) * courts.length}{" "}
              slots
            </div>
            <div className="text-xs text-emerald-600">
              {courts.length} court{courts.length !== 1 ? "s" : ""} × (
              {customSlots.morningCount + customSlots.eveningCount} slots each) •
              30 minutes • 1 booking per court
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleCreateSlots}
          disabled={
            loading ||
            !selectedDate ||
            courts.length === 0 ||
            (customSlots.morningCount === 0 &&
              customSlots.eveningCount === 0)
          }
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-300 inline-flex items-center space-x-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-6 h-6" />
          <span>
            {loading
              ? "Creating..."
              : `Create ${sportName} Court Slots (${courts.length} court${courts.length !== 1 ? "s" : ""})`}
          </span>
        </motion.button>

        <p className="text-sm text-gray-600 mt-4 font-medium">
          Creates{" "}
          {(customSlots.morningCount + customSlots.eveningCount) * courts.length}{" "}
          {sportName} court slots with your custom configuration
        </p>
      </div>
    </motion.div>
  );
};

export default CourtSlotCreator;
