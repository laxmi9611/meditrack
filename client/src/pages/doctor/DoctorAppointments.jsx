import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { formatDate, formatTime, formatPrice } from "../../utils/formatDate";
import { APPOINTMENT_STATUSES } from "../../utils/specialties";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const fetchData = async () => {
    try {
      const { data } = await API.get("/appointments/my");
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const filtered = appointments.filter((a) => {
    if (filter === "pending") return a.status === "pending";
    if (filter === "confirmed") return a.status === "confirmed";
    if (filter === "completed") return a.status === "completed";
    return true;
  });

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Appointments</h1>
      <p style={styles.subtext}>
        Manage incoming appointment requests from patients
      </p>

      <div style={styles.filters}>
        {[
          { key: "pending", label: "⏳ Pending" },
          { key: "confirmed", label: "✅ Confirmed" },
          { key: "completed", label: "🎉 Completed" },
          { key: "all", label: "All" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={filter === f.key ? styles.filterActive : styles.filterBtn}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📅</div>
          <p style={styles.emptyText}>
            No {filter !== "all" ? filter : ""} appointments
          </p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((apt) => {
            const patient = apt.patient || {};
            const status =
              APPOINTMENT_STATUSES[apt.status] || {};
            return (
              <div key={apt._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.patient}>
                    {patient.avatar ? (
                      <img
                        src={patient.avatar}
                        alt=""
                        style={styles.avatar}
                      />
                    ) : (
                      <div style={styles.avatarFallback}>
                        {patient.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div style={styles.name}>{patient.name}</div>
                      <div style={styles.email}>{patient.email}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      ...styles.status,
                      background: status.color,
                    }}
                  >
                    {status.label}
                  </span>
                </div>

                <div style={styles.details}>
                  <div>📅 {formatDate(apt.date)}</div>
                  <div>
                    🕐 {formatTime(apt.timeSlot?.start)} -{" "}
                    {formatTime(apt.timeSlot?.end)}
                  </div>
                  <div>
                    💊{" "}
                    {apt.consultationType === "video"
                      ? "Video"
                      : "In-person"}
                  </div>
                  <div>💰 {formatPrice(apt.fee)}</div>
                </div>

                <div style={styles.reason}>
                  <strong>Reason:</strong> {apt.reason}
                </div>

                <div style={styles.actions}>
                  <button
                    onClick={() =>
                      navigate(`/doctor/appointments/${apt._id}`)
                    }
                    style={styles.viewBtn}
                  >
                    View Details
                  </button>
                  {apt.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(apt._id, "confirmed")
                        }
                        style={styles.confirmBtn}
                      >
                        ✅ Confirm
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(apt._id, "rejected")
                        }
                        style={styles.rejectBtn}
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  {apt.status === "confirmed" && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/video-call/${apt._id}`)
                        }
                        style={styles.videoBtn}
                      >
                        🎥 Join Call
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/doctor/appointments/${apt._id}`)
                        }
                        style={styles.prescribeBtn}
                      >
                        💊 Prescribe
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "900px", margin: "auto", padding: "2rem" },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b", marginBottom: "2rem" },
  filters: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
    overflowX: "auto",
    paddingBottom: "0.3rem",
  },
  filterBtn: {
    padding: "0.6rem 1.2rem",
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "20px",
    color: "#64748b",
    fontSize: "0.85rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  filterActive: {
    padding: "0.6rem 1.2rem",
    background: "#0d9488",
    border: "1.5px solid #0d9488",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  list: { display: "flex", flexDirection: "column", gap: "1rem" },
  card: {
    background: "#fff",
    padding: "1.3rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  patient: { display: "flex", alignItems: "center", gap: "0.7rem" },
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
  email: { fontSize: "0.8rem", color: "#64748b" },
  status: {
    color: "#fff",
    padding: "0.25rem 0.7rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "0.5rem",
    padding: "0.7rem 0",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "0.85rem",
    color: "#334155",
  },
  reason: {
    marginTop: "0.8rem",
    fontSize: "0.85rem",
    color: "#475569",
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
    flexWrap: "wrap",
  },
  viewBtn: {
    padding: "0.55rem 1rem",
    background: "#f1f5f9",
    color: "#334155",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  confirmBtn: {
    padding: "0.55rem 1rem",
    background: "#10b981",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  rejectBtn: {
    padding: "0.55rem 1rem",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
    border: "1px solid #fecaca",
  },
  videoBtn: {
    padding: "0.55rem 1rem",
    background: "#0d9488",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  prescribeBtn: {
    padding: "0.55rem 1rem",
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
  },
  emptyIcon: { fontSize: "3.5rem", marginBottom: "0.8rem" },
  emptyText: { color: "#64748b" },
};

export default DoctorAppointments;