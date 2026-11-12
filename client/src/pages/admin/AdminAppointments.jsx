import { useEffect, useState } from "react";
import API from "../../services/api";
import Loader from "../../components/Loader";
import { formatDate, formatTime, formatPrice } from "../../utils/formatDate";
import { APPOINTMENT_STATUSES } from "../../utils/specialties";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/admin/appointments");
        setAppointments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = appointments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📅 All Appointments</h1>
      <p style={styles.subtext}>
        {appointments.length} total appointments on the platform
      </p>

      <div style={styles.filters}>
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "confirmed", label: "Confirmed" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
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
          <p>No appointments found</p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((apt) => {
            const status = APPOINTMENT_STATUSES[apt.status] || {};
            return (
              <div key={apt._id} style={styles.card}>
                <div style={styles.row}>
                  <div style={styles.patientCol}>
                    <div style={styles.label}>PATIENT</div>
                    <div style={styles.val}>{apt.patient?.name || "N/A"}</div>
                    <div style={styles.sub}>{apt.patient?.email}</div>
                  </div>

                  <div style={styles.doctorCol}>
                    <div style={styles.label}>DOCTOR</div>
                    <div style={styles.val}>
                      Dr. {apt.doctor?.name || "N/A"}
                    </div>
                    <div style={styles.sub}>{apt.doctor?.email}</div>
                  </div>

                  <div style={styles.dateCol}>
                    <div style={styles.label}>SCHEDULE</div>
                    <div style={styles.val}>
                      {formatDate(apt.date)}
                    </div>
                    <div style={styles.sub}>
                      {formatTime(apt.timeSlot?.start)} -{" "}
                      {formatTime(apt.timeSlot?.end)}
                    </div>
                  </div>

                  <div style={styles.feeCol}>
                    <div style={styles.label}>FEE</div>
                    <div style={styles.feeVal}>{formatPrice(apt.fee)}</div>
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

                <div style={styles.reasonRow}>
                  <strong>Reason:</strong> {apt.reason}
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
  container: { maxWidth: "1200px", margin: "auto", padding: "2rem" },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b", marginBottom: "1.5rem" },
  filters: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
    overflowX: "auto",
    paddingBottom: "0.3rem",
  },
  filterBtn: {
    padding: "0.55rem 1.1rem",
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "20px",
    color: "#64748b",
    fontSize: "0.85rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  filterActive: {
    padding: "0.55rem 1.1rem",
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
    padding: "1.2rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1.5fr 1.2fr 0.8fr auto",
    gap: "1rem",
    alignItems: "center",
    paddingBottom: "0.8rem",
    borderBottom: "1px solid #f1f5f9",
  },
  patientCol: {},
  doctorCol: {},
  dateCol: {},
  feeCol: {},
  label: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    fontWeight: "700",
    letterSpacing: "0.5px",
    marginBottom: "0.2rem",
  },
  val: { fontSize: "0.9rem", fontWeight: "600", color: "#0f172a" },
  sub: { fontSize: "0.75rem", color: "#64748b", marginTop: "0.1rem" },
  feeVal: { fontSize: "1rem", fontWeight: "700", color: "#0f766e" },
  status: {
    color: "#fff",
    padding: "0.35rem 0.9rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    width: "fit-content",
  },
  reasonRow: {
    fontSize: "0.85rem",
    color: "#475569",
    paddingTop: "0.7rem",
    lineHeight: 1.5,
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
    color: "#64748b",
  },
};

export default AdminAppointments;