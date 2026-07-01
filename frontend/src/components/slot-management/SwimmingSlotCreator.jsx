import { motion } from "framer-motion";
import { Plus, Droplets, Clock, Users } from "lucide-react";

const SwimmingSlotCreator = ({
  selectedDate,
  loading,
  onCreateSlots,
  customSlots,
  onCustomSlotsChange,
}) => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl shadow-xl border-2 border-emerald-200 p-8">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Droplets className="w-8 h-8 text-emerald-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Create Swimming Pool Slots
          </h3>
        </div>

        {/* Custom Slot Configuration */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* Morning (Boys) */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-gray-700">
                Morning (Boys)
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
                className="w-8 h-8 bg-emerald-100 rounded-lg font-bold"
              >
                -
              </button>

              <span className="text-2xl font-bold text-emerald-600">
                {customSlots.morningCount}
              </span>

              <button
                onClick={() =>
                  onCustomSlotsChange({
                    ...customSlots,
                    morningCount: Math.min(10, customSlots.morningCount + 1),
                  })
                }
                className="w-8 h-8 bg-emerald-100 rounded-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Evening (Girls) */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-700">
                Evening (Girls)
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
                className="w-8 h-8 bg-rose-100 rounded-lg font-bold"
              >
                -
              </button>

              <span className="text-2xl font-bold text-rose-600">
                {customSlots.eveningCount}
              </span>

              <button
                onClick={() =>
                  onCustomSlotsChange({
                    ...customSlots,
                    eveningCount: Math.min(10, customSlots.eveningCount + 1),
                  })
                }
                className="w-8 h-8 bg-rose-100 rounded-lg font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <motion.button
          onClick={onCreateSlots}
          disabled={loading}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl"
        >
          <Plus className="w-6 h-6 inline mr-2" />
          {loading ? "Creating..." : "Create Swimming Slots"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SwimmingSlotCreator;
