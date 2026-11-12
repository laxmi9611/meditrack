import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { formatDate } from "../utils/formatDate";
import Loader from "../components/Loader";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/prescriptions/my");
        setPrescriptions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>💊 Prescriptions</h1>
          <p style={styles.subtext}>
            {prescriptions.length} prescriptions
          </p>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>💊</div>
          <p style={styles.emptyText}>No prescriptions yet</p>
          <p style={styles.emptyHint}>
            Prescriptions appear here after your doctor writes one
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {prescriptions.map((p) => (
            <Link
              key={p._id}
              to={`/prescriptions/${p._id}`}
              style={styles.card}
            >
              <div style={styles.cardHeader}>
                <div style={styles.icon}>💊</div>
                <div style={styles.dateBadge}>
                  {formatDate(p.createdAt)}
                </div>
              </div>
              <h3 style={styles.diagnosis}>{p.diagnosis}</h3>
              <p style={styles.doctorName}>
                Dr. {p.doctor?.name || "Unknown"}
              </p>
              <div style={styles.medCount}>
                {p.medicines?.length || 0} medicine
                {p.medicines?.length !== 1 ? "s" : ""}
              </div>
              <div style={styles.cardFooter}>
                View Prescription →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "1000px", margin: "auto", padding: "2rem" },
  header: { marginBottom: "1.5rem" },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.2rem" },
  subtext: { color: "#64748b" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.2rem",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "1.3rem",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.3rem",
  },
  icon: { fontSize: "1.8rem" },
  dateBadge: {
    fontSize: "0.75rem",
    color: "#64748b",
    background: "#f1f5f9",
    padding: "0.25rem 0.6rem",
    borderRadius: "10px",
    fontWeight: "600",
  },
  diagnosis: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 1.4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  doctorName: { fontSize: "0.85rem", color: "#0d9488", fontWeight: "600" },
  medCount: { fontSize: "0.8rem", color: "#64748b" },
  cardFooter: {
    marginTop: "0.7rem",
    paddingTop: "0.7rem",
    borderTop: "1px solid #f1f5f9",
    fontSize: "0.85rem",
    color: "#0f766e",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
  },
  emptyIcon: { fontSize: "3.5rem", marginBottom: "0.8rem" },
  emptyText: { fontSize: "1.1rem", color: "#0f172a", marginBottom: "0.4rem" },
  emptyHint: { color: "#64748b", fontSize: "0.9rem" },
};

export default Prescriptions;