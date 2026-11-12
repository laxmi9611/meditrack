import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={styles.container}>
    <div style={styles.icon}>🏥</div>
    <h1 style={styles.code}>404</h1>
    <h2 style={styles.title}>Page Not Found</h2>
    <p style={styles.text}>
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" style={styles.btn}>
      Go Home
    </Link>
  </div>
);

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    textAlign: "center",
  },
  icon: { fontSize: "4rem", marginBottom: "1rem" },
  code: { fontSize: "5rem", color: "#0d9488", marginBottom: "0.5rem" },
  title: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.8rem" },
  text: { color: "#64748b", marginBottom: "2rem", maxWidth: "400px" },
  btn: {
    padding: "0.9rem 2rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1rem",
  },
};

export default NotFound;