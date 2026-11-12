import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import AppointmentCard from "../components/AppointmentCard";
import Loader from "../components/Loader";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
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
    fetchData();
  }, []);

  const filters = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const getFiltered = () => {
    if (filter === "all") return appointments;
    if (filter === "upcoming")
      return appointments.filter(
        (a) => a.status === "pending" || a.status === "confirmed"
      );
    if (filter === "completed")
      return appointments.filter((a) => a.status === "completed");
    if (filter === "cancelled")
      return appointments.filter(
        (a) => a.status === "cancelled" || a.status === "rejected"
      );
    return appointments;
  };

  const filtered = getFiltered();

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>My Appointments</h1>
          <p style={styles.subtext}>
            {appointments.length} total appointments
          </p>
        </div>
        <Link to="/doctors" style={styles.bookBtn}>
          + New Appointment
        </Link>
      </div>

      <div style={styles.filters}>
        {filters.map((f) => (
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
          <Link to="/doctors" style={styles.emptyBtn}>
            Book an appointment
          </Link>
        </div>
      ) : (
        <div>
          {filtered.map((apt) => (
            <AppointmentCard key={apt._id} appointment={apt} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "900px", margin: "auto", padding: "2rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b" },
  bookBtn: {
    padding: "0.75rem 1.4rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
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
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
  },
  emptyIcon: { fontSize: "3.5rem", marginBottom: "0.8rem" },
  emptyText: { color: "#64748b", marginBottom: "1.2rem", fontSize: "1.05rem" },
  emptyBtn: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    background: "#f0fdfa",
    color: "#0f766e",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
};

export default MyAppointments;