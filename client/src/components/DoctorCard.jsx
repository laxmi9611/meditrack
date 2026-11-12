import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import { formatPrice } from "../utils/formatDate";

const DoctorCard = ({ doctor }) => {
  const user = doctor.user || {};
  const specialty = doctor.specialty || {};

  return (
    <Link to={`/doctor/${doctor._id}`} style={styles.card}>
      <div style={styles.header}>
        {user.avatar ? (
          <img src={user.avatar} alt="" style={styles.avatar} />
        ) : (
          <div style={styles.avatarFallback}>
            {user.name?.[0]?.toUpperCase() || "D"}
          </div>
        )}
        <div style={styles.info}>
          <h3 style={styles.name}>{user.name || "Doctor"}</h3>
          <p style={styles.specialty}>
            {specialty.icon} {specialty.name || "General"}
          </p>
        </div>
      </div>

      <div style={styles.details}>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Experience</span>
          <span style={styles.detailValue}>
            {doctor.experience} {doctor.experience === 1 ? "year" : "years"}
          </span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Consultation Fee</span>
          <span style={styles.fee}>{formatPrice(doctor.consultationFee)}</span>
        </div>
      </div>

      <div style={styles.ratingRow}>
        <RatingStars rating={doctor.rating || 0} showNumber />
        <span style={styles.reviews}>({doctor.numReviews || 0} reviews)</span>
      </div>

      <div style={styles.bookBtn}>View Profile →</div>
    </Link>
  );
};

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "1.2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.9rem",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  header: { display: "flex", gap: "0.8rem", alignItems: "center" },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccfbf1",
  },
  avatarFallback: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "1.3rem",
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  name: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "0.2rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  specialty: { fontSize: "0.85rem", color: "#0d9488", fontWeight: "600" },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    paddingTop: "0.6rem",
    borderTop: "1px solid #f1f5f9",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: { fontSize: "0.8rem", color: "#64748b" },
  detailValue: { fontSize: "0.85rem", color: "#0f172a", fontWeight: "600" },
  fee: { fontSize: "0.95rem", color: "#0f766e", fontWeight: "700" },
  ratingRow: { display: "flex", alignItems: "center", gap: "0.4rem" },
  reviews: { fontSize: "0.75rem", color: "#94a3b8" },
  bookBtn: {
    padding: "0.6rem",
    background: "#f0fdfa",
    color: "#0f766e",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "0.85rem",
    fontWeight: "600",
    marginTop: "0.3rem",
  },
};

export default DoctorCard;