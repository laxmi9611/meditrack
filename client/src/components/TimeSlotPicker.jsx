import { TIME_SLOTS } from "../utils/specialties";
import { formatTime } from "../utils/formatDate";

const TimeSlotPicker = ({ selectedSlot, onSelect, bookedSlots = [] }) => {
  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {TIME_SLOTS.map((slot) => {
          const isBooked = bookedSlots.includes(slot.start);
          const isSelected =
            selectedSlot?.start === slot.start &&
            selectedSlot?.end === slot.end;

          return (
            <button
              key={slot.start}
              type="button"
              disabled={isBooked}
              onClick={() => onSelect(slot)}
              style={{
                ...styles.slot,
                ...(isSelected ? styles.selected : {}),
                ...(isBooked ? styles.booked : {}),
              }}
              title={isBooked ? "Already booked" : ""}
            >
              {formatTime(slot.start)} - {formatTime(slot.end)}
            </button>
          );
        })}
      </div>
      {bookedSlots.length > 0 && (
        <p style={styles.hint}>
          ⚠️ Grey slots are already booked
        </p>
      )}
    </div>
  );
};

const styles = {
  container: { marginTop: "0.5rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "0.6rem",
  },
  slot: {
    padding: "0.7rem",
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "#0f172a",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  selected: {
    background: "#0d9488",
    color: "#fff",
    borderColor: "#0d9488",
    fontWeight: "600",
  },
  booked: {
    background: "#f1f5f9",
    color: "#94a3b8",
    cursor: "not-allowed",
    textDecoration: "line-through",
  },
  hint: {
    fontSize: "0.8rem",
    color: "#f59e0b",
    marginTop: "0.7rem",
  },
};

export default TimeSlotPicker;