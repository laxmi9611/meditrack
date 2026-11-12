import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to MediTrack, ${user.name}! 🏥`);
      if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join MediTrack today</p>

        <input
          style={styles.input}
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength={6}
          required
        />
        <input
          style={styles.input}
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <label style={styles.label}>I am a</label>
        <div style={styles.roleRow}>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "patient" })}
            style={{
              ...styles.roleBtn,
              ...(form.role === "patient" ? styles.roleActive : {}),
            }}
          >
            <span style={styles.roleIcon}>👤</span>
            Patient
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "doctor" })}
            style={{
              ...styles.roleBtn,
              ...(form.role === "doctor" ? styles.roleActive : {}),
            }}
          >
            <span style={styles.roleIcon}>👨‍⚕️</span>
            Doctor
          </button>
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "calc(100vh - 130px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  form: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(13, 148, 136, 0.08)",
    width: "100%",
    maxWidth: "440px",
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
    border: "1px solid #ccfbf1",
  },
  title: { textAlign: "center", color: "#0f172a", fontSize: "1.5rem" },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.9rem",
    marginBottom: "0.4rem",
  },
  input: {
    padding: "0.85rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
    background: "#fff",
  },
  label: {
    fontSize: "0.85rem",
    color: "#64748b",
    fontWeight: "600",
    marginTop: "0.3rem",
  },
  roleRow: { display: "flex", gap: "0.8rem" },
  roleBtn: {
    flex: 1,
    padding: "0.9rem",
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.3rem",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#64748b",
    transition: "all 0.2s",
  },
  roleActive: {
    background: "#f0fdfa",
    borderColor: "#0d9488",
    color: "#0f766e",
  },
  roleIcon: { fontSize: "1.5rem" },
  button: {
    padding: "0.85rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    marginTop: "0.5rem",
  },
  text: { textAlign: "center", color: "#64748b", fontSize: "0.9rem" },
  link: { color: "#0d9488", fontWeight: "600" },
};

export default Register;