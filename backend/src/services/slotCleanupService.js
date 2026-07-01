import Slot from '../models/Slot.js';

// Delete slots created more than 2 days ago to limit storage usage.
export const cleanupOldSlots = async () => {
  try {
    const expirationDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const result = await Slot.deleteMany({
      createdAt: { $lt: expirationDate }
    });

    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} slots older than 2 days`);
    } else {
      console.log('No old slots to delete');
    }
  } catch (error) {
    console.error('Error deleting old slots:', error);
  }
};

// Check if slot already exists for same facility & start time
export const checkSlotExists = async (facilityId, startTime) => {
  try {
    const existingSlot = await Slot.findOne({
      facility: facilityId,
      startTime: new Date(startTime)
    });

    return !!existingSlot;
  } catch (error) {
    console.error('Error checking slot existence:', error);
    return false;
  }
};

// Run cleanup every hour
setInterval(cleanupOldSlots, 60 * 60 * 1000);

// Run on startup
cleanupOldSlots();
