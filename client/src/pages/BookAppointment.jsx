import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { formatPrice, formatDate } from "../utils/formatDate";
import TimeSlotPicker from "../components/TimeSlotPicker";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    date: "",
    timeSlot: null,
    reason: "",
    symptoms: "",
    consultationType: "in-person",
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await API.get(`/doctors/${id}`);
        setDoctor(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (!form.date) return;
    const fetchSlots = async () => {
      try {
        const { data } = await API.get(
          `/appointments/booked-slots?doctorId=${id}&date=${form.date}`
        );
        setBookedSlots(data.bookedSlots || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSlots();
  }, [form.date, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.timeSlot) {
      toast.error("Please select a time slot");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await API.post("/appointments", {
        doctorId: id,
        date: form.date,
        timeSlot: form.timeSlot,
        reason: form.reason,
        symptoms: form.symptoms,
        consultationType: form.consultationType,
      });
      toast.success("Appointment booked! 🎉");
      navigate(`/appointments/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  if (loading) return <Loader />;
  if (!doctor) return <p style={{ padding: "2rem" }}>Doctor not found</p>;

  const specialty = doctor.specialty || {};

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>

      <h1 style={styles.heading}>Book Appointment</h1>

      <div style={styles.doctorPreview}>
        <div style={styles.doctorInfo}>
          {doctor.user?.avatar ? (
            <img
              src={doctor.user.avatar}
              alt=""
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatarFallback}>
              {doctor.user?.name?.[0]}
            </div>
          )}
          <div>
            <div style={styles.docName}>Dr. {doctor.user?.name}</div>
            <div style={styles.docSpecialty}>
              {specialty.icon} {specialty.name}
            </div>
          </div>
        </div>
        <div style={styles.docFee}>
          <div style={styles.feeValue}>
            {formatPrice(doctor.consultationFee)}
          </div>
          <div style={styles.feeLabel}>Consultation Fee</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.section}>
          <label style={styles.label}>Select Date *</label>
          <input
            type="date"
            min={minDate}
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value, timeSlot: null })
            }
            style={styles.input}
            required
          />
        </div>

        {form.date && (
          <div style={styles.section}>
            <label style={styles.label}>Select Time Slot *</label>
            <TimeSlotPicker
              selectedSlot={form.timeSlot}
              onSelect={(slot) => setForm({ ...form, timeSlot: slot })}
              bookedSlots={bookedSlots}
            />
          </div>
        )}

        <div style={styles.section}>
          <label style={styles.label}>Consultation Type</label>
          <div style={styles.typeRow}>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, consultationType: "in-person" })
              }
              style={{
                ...styles.typeBtn,
                ...(form.consultationType === "in-person"
                  ? styles.typeActive
                  : {}),
              }}
            >
              🏥 In-person
            </button>
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, consultationType: "video" })
              }
              style={{
                ...styles.typeBtn,
                ...(form.consultationType === "video"
                  ? styles.typeActive
                  : {}),
              }}
            >
              🎥 Video Call
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Reason for Visit *</label>
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Briefly describe your concern..."
            rows={2}
            style={styles.textarea}
            required
          />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Symptoms (optional)</label>
          <textarea
            value={form.symptoms}
            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
            placeholder="Any specific symptoms you're experiencing..."
            rows={3}
            style={styles.textarea}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !form.timeSlot}
          style={{
            ...styles.submitBtn,
            opacity: submitting || !form.timeSlot ? 0.6 : 1,
          }}
        >
          {submitting ? "Booking..." : "Confirm Appointment"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "720px", margin: "auto", padding: "2rem" },
  backBtn: {
    background: "transparent",
    color: "#0d9488",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  heading: {
    fontSize: "1.7rem",
    color: "#0f172a",
    marginBottom: "1.5rem",
  },
  doctorPreview: {
    background: "#fff",
    padding: "1.2rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  doctorInfo: { display: "flex", alignItems: "center", gap: "0.8rem" },
  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "1.2rem",
  },
  docName: { fontSize: "1rem", fontWeight: "700", color: "#0f172a" },
  docSpecialty: { fontSize: "0.85rem", color: "#0d9488", fontWeight: "600" },
  docFee: { textAlign: "right" },
  feeValue: { fontSize: "1.3rem", fontWeight: "700", color: "#0f766e" },
  feeLabel: {
    fontSize: "0.75rem",
    color: "#64748b",
    textTransform: "uppercase",
  },
  form: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
  },
  section: { marginBottom: "1.5rem" },
  label: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.8rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "0.8rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
  },
  typeRow: { display: "flex", gap: "0.8rem" },
  typeBtn: {
    flex: 1,
    padding: "0.9rem",
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#64748b",
    transition: "all 0.2s",
  },
  typeActive: {
    background: "#f0fdfa",
    borderColor: "#0d9488",
    color: "#0f766e",
  },
  submitBtn: {
    width: "100%",
    padding: "1rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "700",
    marginTop: "1rem",
  },
};

export default BookAppointment;