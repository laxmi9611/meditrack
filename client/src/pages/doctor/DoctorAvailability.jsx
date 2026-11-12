import { useEffect, useState } from "react";
import API from "../../services/api";
import { DAYS } from "../../utils/specialties";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const DoctorAvailability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "13:00",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/doctors/me");
        setSlots(data.availability || []);
      } catch (err) {
        // no profile
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addSlot = () => {
    if (form.startTime >= form.endTime) {
      toast.error("End time must be after start time");
      return;
    }
    const duplicate = slots.find(
      (s) =>
        s.day === form.day &&
        s.startTime === form.startTime &&
        s.endTime === form.endTime
    );
    if (duplicate) {
      toast.error("This slot already exists");
      return;
    }
    setSlots([...slots, { ...form }]);
    setForm({ ...form, startTime: "09:00", endTime: "13:00" });
  };

  const removeSlot = (idx) => {
    setSlots(slots.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put("/doctors/availability", { availability: slots });
      toast.success("Availability saved! ✅");
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Set Availability</h1>
      <p style={styles.subtext}>
        Define the days and times when patients can book appointments
      </p>

      <div style={styles.addCard}>
        <h3 style={styles.addTitle}>Add Time Slot</h3>
        <div style={styles.addRow}>
          <select
            style={styles.input}
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="time"
            style={styles.input}
            value={form.startTime}
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
          />
          <span style={styles.toText}>to</span>
          <input
            type="time"
            style={styles.input}
            value={form.endTime}
            onChange={(e) =>
              setForm({ ...form, endTime: e.target.value })
            }
          />
          <button onClick={addSlot} style={styles.addBtn}>
            + Add
          </button>
        </div>
      </div>

      <div style={styles.slotsSection}>
        <h3 style={styles.slotTitle}>
          Your Slots ({slots.length})
        </h3>

        {slots.length === 0 ? (
          <div style={styles.empty}>
            <p>No availability set. Add a slot above.</p>
          </div>
        ) : (
          <div style={styles.slotGrid}>
            {slots.map((s, i) => (
              <div key={i} style={styles.slot}>
                <div>
                  <div style={styles.slotDay}>{s.day}</div>
                  <div style={styles.slotTime}>
                    {s.startTime} - {s.endTime}
                  </div>
                </div>
                <button
                  onClick={() => removeSlot(i)}
                  style={styles.removeBtn}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleSave}
          style={styles.saveBtn}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Availability"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px", margin: "auto", padding: "2rem" },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b", marginBottom: "2rem" },
  addCard: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "2rem",
  },
  addTitle: {
    fontSize: "1rem",
    color: "#0f172a",
    marginBottom: "1rem",
    fontWeight: "700",
  },
  addRow: {
    display: "flex",
    gap: "0.6rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  input: {
    padding: "0.7rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.9rem",
    outline: "none",
    background: "#fff",
    flex: 1,
    minWidth: "120px",
  },
  toText: { color: "#64748b", fontSize: "0.85rem" },
  addBtn: {
    padding: "0.7rem 1.3rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  slotsSection: {},
  slotTitle: {
    fontSize: "1.1rem",
    color: "#0f172a",
    marginBottom: "1rem",
    fontWeight: "700",
  },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "0.8rem",
    marginBottom: "1.5rem",
  },
  slot: {
    background: "#f0fdfa",
    padding: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccfbf1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotDay: { fontSize: "0.85rem", fontWeight: "700", color: "#0f766e" },
  slotTime: { fontSize: "0.8rem", color: "#334155", marginTop: "0.2rem" },
  removeBtn: {
    background: "transparent",
    color: "#dc2626",
    fontSize: "1rem",
    padding: "0.2rem 0.4rem",
  },
  empty: {
    textAlign: "center",
    padding: "3rem 1rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
    color: "#64748b",
    marginBottom: "1.5rem",
  },
  saveBtn: {
    padding: "0.9rem 2rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
};

export default DoctorAvailability;