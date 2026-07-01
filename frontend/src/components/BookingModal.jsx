import CourtBookingModal from "./CourtBookingModal";
import SwimmingBookingModal from "./SwimmingBookingModal";

const BookingModal = ({ slot, sportKey, onClose, onSuccess }) => {
  if (!slot) return null;

  // Check if it's swimming based on sportKey or slot.sport.name
  const isSwimming = 
    sportKey === "swimming" || 
    (slot.sport?.name?.toLowerCase() === "swimming") ||
    (typeof slot.sport === "string" && slot.sport.toLowerCase() === "swimming");

  if (isSwimming) {
    return (
      <SwimmingBookingModal
        slot={slot}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <CourtBookingModal
      slot={slot}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

export default BookingModal;
