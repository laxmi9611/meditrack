import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import AppointmentCard from "../components/AppointmentCard";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const upcoming = appointments.filter(
    (a) =>
      new Date(a.date) >= new Date() &&
      (a.status === "pending" || a.status === "confirmed")
  );
  const completed = appointments.filter((a) => a.status === "completed");

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Hello, {user.name} 👋</h1>
          <p style={styles.subtext}>Here's your health overview</p>
        </div>
        <Link to="/doctors" style={styles.bookBtn}>
          + Book Appointment
        </Link>
      </div>

      <div style={styles.statsGrid}>
        <StatCard
          icon="📅"
          value={appointments.length}
          label="Total Appointments"
          color="#0d9488"
        />
        <StatCard
          icon="⏰"
          value={upcoming.length}
          label="Upcoming"
          color="#f59e0b"
        />
        <StatCard
          icon="✅"
          value={completed}
          label="Completed"
          color="#3b82f6"
        />
      </div>

      <div style={styles.quickActions}>
        <h2 style={styles.subHeading}>Quick Actions</h2>
        <div style={styles.actionGrid}>
          <Link to="/doctors" style={styles.actionCard}>
            <div style={styles.actionIcon}>🔍</div>
            <div style={styles.actionTitle}>Find Doctors</div>
            <div style={styles.actionText}>Browse by specialty</div>
          </Link>
          <Link to="/appointments" style={styles.actionCard}>
            <div style={styles.actionIcon}>📋</div>
            <div style={styles.actionTitle}>My Appointments</div>
            <div style={styles.actionText}>View all bookings</div>
          </Link>
          <Link to="/prescriptions" style={styles.actionCard}>
            <div style={styles.actionIcon}>💊</div>
            <div style={styles.actionTitle}>Prescriptions</div>
            <div style={styles.actionText}>Download PDFs</div>
          </Link>
          <Link to="/profile" style={styles.actionCard}>
            <div style={styles.actionIcon}>⚙️</div>
            <div style={styles.actionTitle}>Profile</div>
            <div style={styles.actionText}>Update your info</div>
          </Link>
        </div>
      </div>

      <div style={styles.appointmentsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.subHeading}>Upcoming Appointments</h2>
          <Link to="/appointments" style={styles.viewAll}>
            View all →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📅</div>
            <p style={styles.emptyText}>No upcoming appointments</p>
            <Link to="/doctors" style={styles.emptyBtn}>
              Book your first appointment
            </Link>
          </div>
        ) : (
          <div>
            {upcoming.slice(0, 3).map((apt) => (
              <AppointmentCard key={apt._id} appointment={apt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "1100px", margin: "auto", padding: "2rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  heading: { fontSize: "1.7rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b", fontSize: "0.95rem" },
  bookBtn: {
    padding: "0.75rem 1.4rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.2rem",
    marginBottom: "3rem",
  },
  quickActions: { marginBottom: "3rem" },
  subHeading: { fontSize: "1.25rem", marginBottom: "1.2rem", color: "#0f172a" },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1.2rem",
  },
  actionCard: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  actionIcon: { fontSize: "1.8rem", marginBottom: "0.3rem" },
  actionTitle: { fontSize: "0.95rem", fontWeight: "600", color: "#0f172a" },
  actionText: { fontSize: "0.8rem", color: "#64748b" },
  appointmentsSection: {},
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.2rem",
  },
  viewAll: { color: "#0d9488", fontSize: "0.9rem", fontWeight: "600" },
  empty: {
    textAlign: "center",
    padding: "3rem 2rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
  },
  emptyIcon: { fontSize: "3rem", marginBottom: "0.8rem" },
  emptyText: { color: "#64748b", marginBottom: "1.2rem" },
  emptyBtn: {
    display: "inline-block",
    padding: "0.7rem 1.4rem",
    background: "#f0fdfa",
    color: "#0f766e",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
};

export default Dashboard;