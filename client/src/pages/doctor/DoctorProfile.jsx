import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    specialty: "",
    experience: "",
    qualification: "",
    about: "",
    consultationFee: "",
    languages: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const specRes = await API.get("/doctors/specialties");
        setSpecialties(specRes.data);

        try {
          const profRes = await API.get("/doctors/me");
          const p = profRes.data;
          setForm({
            specialty: p.specialty?._id || "",
            experience: p.experience || "",
            qualification: p.qualification || "",
            about: p.about || "",
            consultationFee: p.consultationFee || "",
            languages: (p.languages || []).join(", "),
          });
        } catch (e) {
          // no profile yet
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
        languages: form.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
      };
      await API.post("/doctors/profile", payload);
      toast.success("Profile saved! 🎉");
      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Doctor Profile</h1>
      <p style={styles.subtext}>
        Fill in your details to start receiving appointments
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Specialty *</label>
        <select
          style={styles.input}
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          required
        >
          <option value="">Select specialty</option>
          {specialties.map((s) => (
            <option key={s._id} value={s._id}>
              {s.icon} {s.name}
            </option>
          ))}
        </select>

        <label style={styles.label}>Years of Experience *</label>
        <input
          type="number"
          min="0"
          style={styles.input}
          value={form.experience}
          onChange={(e) => setForm({ ...form, experience: e.target.value })}
          required
        />

        <label style={styles.label}>Qualification *</label>
        <input
          style={styles.input}
          placeholder="e.g., MBBS, MD (Cardiology)"
          value={form.qualification}
          onChange={(e) =>
            setForm({ ...form, qualification: e.target.value })
          }
          required
        />

        <label style={styles.label}>About</label>
        <textarea
          style={styles.textarea}
          rows={4}
          placeholder="Tell patients about your practice, approach, and expertise..."
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        />

        <label style={styles.label}>Consultation Fee (₹) *</label>
        <input
          type="number"
          min="0"
          style={styles.input}
          value={form.consultationFee}
          onChange={(e) =>
            setForm({ ...form, consultationFee: e.target.value })
          }
          required
        />

        <label style={styles.label}>Languages (comma-separated)</label>
        <input
          style={styles.input}
          placeholder="e.g., English, Hindi, Marathi"
          value={form.languages}
          onChange={(e) => setForm({ ...form, languages: e.target.value })}
        />

        <button type="submit" style={styles.button} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: "720px", margin: "auto", padding: "2rem" },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b", marginBottom: "2rem" },
  form: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#334155",
    marginTop: "0.6rem",
  },
  input: {
    padding: "0.8rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
    background: "#fff",
  },
  textarea: {
    padding: "0.8rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
  },
  button: {
    marginTop: "1.5rem",
    padding: "0.9rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
  },
};

export default DoctorProfile;