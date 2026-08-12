import Slot from '../models/Slot.js';
import Booking from '../models/Booking.js';

// Delete slots created more than 2 days ago to limit storage usage.
export const cleanupOldSlots = async () => {
  try {
    const expirationDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const expiringSlots = await Slot.find({
      createdAt: { $lt: expirationDate }
    }).select('_id');
    const expiringSlotIds = expiringSlots.map((s) => s._id);

    if (expiringSlotIds.length > 0) {
      // Cancel any still-active bookings for these slots BEFORE the slots are
      // deleted, so we never leave a booking pointing at a null slot
      // (that null-ref was the cause of the "Cannot read properties of
      // null (reading 'startTime')" crash on new bookings).
      const cancelResult = await Booking.updateMany(
        { slot: { $in: expiringSlotIds }, bookingStatus: 'active' },
        { bookingStatus: 'cancelled', cancelledAt: new Date() }
      );
      if (cancelResult.modifiedCount > 0) {
        console.log(`Auto-cancelled ${cancelResult.modifiedCount} bookings whose slots are expiring`);
      }
    }

    const result = await Slot.deleteMany({
      _id: { $in: expiringSlotIds }
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
