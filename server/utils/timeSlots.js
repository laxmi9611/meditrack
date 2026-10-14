// Generate time slots from 9 AM to 6 PM
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 18; hour++) {
    const start = `${hour.toString().padStart(2, "0")}:00`;
    const end = `${(hour + 1).toString().padStart(2, "0")}:00`;
    slots.push({ start, end });
  }
  return slots;
};

// Check if two time slots overlap
const slotsOverlap = (slot1, slot2) => {
  return slot1.start < slot2.end && slot2.start < slot1.end;
};

module.exports = { generateTimeSlots, slotsOverlap };