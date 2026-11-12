import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 🏥`);
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.iconWrap}>
          <span style={styles.icon}>🏥</span>
        </div>
        <h1 style={styles.title}>Welcome to MediTrack</h1>
        <p style={styles.subtitle}>Login to your account</p>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.text}>
          New here? <Link to="/register" style={styles.link}>Create account</Link>
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
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    border: "1px solid #ccfbf1",
  },
  iconWrap: { textAlign: "center" },
  icon: { fontSize: "3rem" },
  title: { textAlign: "center", color: "#0f172a", fontSize: "1.5rem" },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
  },
  input: {
    padding: "0.85rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border 0.2s",
  },
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

export default Login;