import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const WritePrescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    diagnosis: "",
    advice: "",
    followUpDate: "",
  });

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", duration: "", notes: "" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/appointments/${id}`);
        setAppointment(data);
      } catch (err) {
        toast.error("Appointment not found");
        navigate("/doctor/appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const updateMedicine = (idx, field, value) => {
    const updated = [...medicines];
    updated[idx][field] = value;
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", duration: "", notes: "" },
    ]);
  };

  const removeMedicine = (idx) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validMedicines = medicines.filter(
      (m) => m.name && m.dosage && m.duration
    );
    if (validMedicines.length === 0) {
      toast.error("Add at least one medicine");
      return;
    }

    setSaving(true);
    try {
      const { data } = await API.post("/prescriptions", {
        appointmentId: id,
        diagnosis: form.diagnosis,
        medicines: validMedicines,
        advice: form.advice,
        followUpDate: form.followUpDate || null,
      });
      toast.success("Prescription created! 💊");
      navigate(`/prescriptions/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!appointment) return null;

  const patient = appointment.patient || {};

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate(-1)}
        style={styles.backBtn}
      >
        ← Back
      </button>

      <h1 style={styles.heading}>Write Prescription</h1>

      <div style={styles.patientCard}>
        <div style={styles.patientInfo}>
          {patient.avatar ? (
            <img
              src={patient.avatar}
              alt=""
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatarFallback}>
              {patient.name?.[0]}
            </div>
          )}
          <div>
            <div style={styles.patientName}>{patient.name}</div>
            <div style={styles.patientEmail}>{patient.email}</div>
          </div>
        </div>
        <div style={styles.reasonBox}>
          <strong>Reason:</strong> {appointment.reason}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Diagnosis *</label>
        <textarea
          style={styles.textarea}
          value={form.diagnosis}
          onChange={(e) =>
            setForm({ ...form, diagnosis: e.target.value })
          }
          rows={2}
          placeholder="Enter diagnosis..."
          required
        />

        <div style={styles.medHeader}>
          <label style={styles.label}>Medicines *</label>
          <button
            type="button"
            onClick={addMedicine}
            style={styles.addMedBtn}
          >
            + Add Medicine
          </button>
        </div>

        {medicines.map((med, i) => (
          <div key={i} style={styles.medCard}>
            <div style={styles.medCardHeader}>
              <span style={styles.medNumber}>Medicine {i + 1}</span>
              {medicines.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicine(i)}
                  style={styles.removeMedBtn}
                >
                  ✕
                </button>
              )}
            </div>
            <input
              style={styles.input}
              placeholder="Medicine name *"
              value={med.name}
              onChange={(e) =>
                updateMedicine(i, "name", e.target.value)
              }
              required
            />
            <div style={styles.row}>
              <input
                style={styles.input}
                placeholder="Dosage (e.g., 1 tablet twice a day) *"
                value={med.dosage}
                onChange={(e) =>
                  updateMedicine(i, "dosage", e.target.value)
                }
                required
              />
              <input
                style={styles.input}
                placeholder="Duration (e.g., 5 days) *"
                value={med.duration}
                onChange={(e) =>
                  updateMedicine(i, "duration", e.target.value)
                }
                required
              />
            </div>
            <input
              style={styles.input}
              placeholder="Notes (optional)"
              value={med.notes}
              onChange={(e) =>
                updateMedicine(i, "notes", e.target.value)
              }
            />
          </div>
        ))}

        <label style={styles.label}>Advice</label>
        <textarea
          style={styles.textarea}
          value={form.advice}
          onChange={(e) => setForm({ ...form, advice: e.target.value })}
          rows={3}
          placeholder="Rest, diet, precautions..."
        />

        <label style={styles.label}>Follow-up Date</label>
        <input
          type="date"
          style={styles.input}
          value={form.followUpDate}
          onChange={(e) =>
            setForm({ ...form, followUpDate: e.target.value })
          }
        />

        <button type="submit" style={styles.submitBtn} disabled={saving}>
          {saving ? "Saving..." : "Save Prescription"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "780px", margin: "auto", padding: "2rem" },
  backBtn: {
    background: "transparent",
    color: "#0d9488",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  heading: { fontSize: "1.7rem", color: "#0f172a", marginBottom: "1.5rem" },
  patientCard: {
    background: "#f0fdfa",
    padding: "1.2rem",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    border: "1px solid #ccfbf1",
  },
  patientInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    marginBottom: "0.7rem",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#0d9488",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
  patientName: { fontSize: "1rem", fontWeight: "700", color: "#0f172a" },
  patientEmail: { fontSize: "0.85rem", color: "#64748b" },
  reasonBox: { fontSize: "0.9rem", color: "#334155" },
  form: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#334155",
    marginTop: "0.5rem",
  },
  medHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
  },
  addMedBtn: {
    padding: "0.5rem 1rem",
    background: "#f0fdfa",
    color: "#0f766e",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  medCard: {
    background: "#f8fafc",
    padding: "1rem",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
    border: "1px solid #e2e8f0",
  },
  medCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medNumber: {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#0f766e",
    textTransform: "uppercase",
  },
  removeMedBtn: {
    background: "transparent",
    color: "#dc2626",
    fontSize: "1rem",
    padding: "0.2rem 0.4rem",
  },
  input: {
    padding: "0.7rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.9rem",
    outline: "none",
    background: "#fff",
    flex: 1,
  },
  textarea: {
    padding: "0.7rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.9rem",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
  },
  row: { display: "flex", gap: "0.6rem", flexWrap: "wrap" },
  submitBtn: {
    marginTop: "1.5rem",
    padding: "0.9rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
  },
};

export default WritePrescription;