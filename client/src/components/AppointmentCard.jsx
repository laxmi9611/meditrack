import { Link } from "react-router-dom";
import { formatDate, formatTime, formatPrice } from "../utils/formatDate";
import { APPOINTMENT_STATUSES } from "../utils/specialties";

const AppointmentCard = ({ appointment, viewAs = "patient" }) => {
  const status = APPOINTMENT_STATUSES[appointment.status] || {
    label: appointment.status,
    color: "#64748b",
  };
  const other =
    viewAs === "patient" ? appointment.doctor : appointment.patient;
  const specialty = appointment.doctorProfile?.specialty;

  return (
    <Link to={`/appointments/${appointment._id}`} style={styles.card}>
      <div style={styles.header}>
        <div style={styles.user}>
          {other?.avatar ? (
            <img src={other.avatar} alt="" style={styles.avatar} />
          ) : (
            <div style={styles.avatarFallback}>
              {other?.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <div style={styles.name}>{other?.name || "Unknown"}</div>
            {viewAs === "patient" && specialty && (
              <div style={styles.specialty}>
                {specialty.icon} {specialty.name}
              </div>
            )}
            {viewAs === "doctor" && (
              <div style={styles.specialty}>Patient</div>
            )}
          </div>
        </div>
        <span style={{ ...styles.status, background: status.color }}>
          {status.label}
        </span>
      </div>

      <div style={styles.details}>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>📅 Date</span>
          <span style={styles.detailValue}>{formatDate(appointment.date)}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>🕐 Time</span>
          <span style={styles.detailValue}>
            {formatTime(appointment.timeSlot?.start)} -{" "}
            {formatTime(appointment.timeSlot?.end)}
          </span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>💊 Type</span>
          <span style={styles.detailValue}>
            {appointment.consultationType === "video" ? "🎥 Video" : "🏥 In-person"}
          </span>
        </div>
      </div>

      <div style={styles.footer}>
        <span style={styles.reason}>{appointment.reason?.slice(0, 60)}...</span>
        <span style={styles.fee}>{formatPrice(appointment.fee)}</span>
      </div>
    </Link>
  );
};

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.1rem",
    display: "block",
    marginBottom: "0.9rem",
    transition: "box-shadow 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.8rem",
  },
  user: { display: "flex", alignItems: "center", gap: "0.7rem" },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  name: { fontSize: "0.95rem", fontWeight: "600", color: "#0f172a" },
  specialty: { fontSize: "0.8rem", color: "#64748b", marginTop: "0.1rem" },
  status: {
    color: "#fff",
    padding: "0.25rem 0.7rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "0.6rem",
    padding: "0.7rem 0",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
  },
  detailItem: { display: "flex", flexDirection: "column", gap: "0.2rem" },
  detailLabel: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  detailValue: { fontSize: "0.85rem", color: "#0f172a", fontWeight: "500" },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.7rem",
  },
  reason: { fontSize: "0.8rem", color: "#64748b", flex: 1 },
  fee: { fontSize: "1rem", fontWeight: "700", color: "#0f766e" },
};

export default AppointmentCard;