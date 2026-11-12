import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/StatCard";
import AppointmentCard from "../../components/AppointmentCard";
import Loader from "../../components/Loader";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aptRes, profRes] = await Promise.all([
          API.get("/appointments/my"),
          API.get("/doctors/me").catch(() => ({ data: null })),
        ]);
        setAppointments(aptRes.data);
        setProfile(profRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toDateString();
  const todayApts = appointments.filter(
    (a) => new Date(a.date).toDateString() === today
  );
  const pending = appointments.filter((a) => a.status === "pending");
  const confirmed = appointments.filter((a) => a.status === "confirmed");
  const completed = appointments.filter((a) => a.status === "completed");

  if (loading) return <Loader />;

  if (!profile) {
    return (
      <div style={styles.setupContainer}>
        <div style={styles.setupCard}>
          <div style={styles.setupIcon}>👨‍⚕️</div>
          <h1 style={styles.setupTitle}>Complete Your Profile</h1>
          <p style={styles.setupText}>
            Set up your doctor profile to start receiving appointments.
          </p>
          <Link to="/doctor/profile" style={styles.setupBtn}>
            Set Up Profile →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Welcome, Dr. {user.name} 👋</h1>
          <p style={styles.subtext}>
            {profile.isApproved
              ? "Your profile is verified ✅"
              : "⏳ Awaiting admin approval"}
          </p>
        </div>
        <Link to="/doctor/appointments" style={styles.viewBtn}>
          View All Appointments
        </Link>
      </div>

      <div style={styles.statsGrid}>
        <StatCard
          icon="📅"
          value={todayApts.length}
          label="Today"
          color="#0d9488"
        />
        <StatCard
          icon="⏳"
          value={pending.length}
          label="Pending"
          color="#f59e0b"
        />
        <StatCard
          icon="✅"
          value={confirmed.length}
          label="Confirmed"
          color="#3b82f6"
        />
        <StatCard
          icon="🎉"
          value={completed.length}
          label="Completed"
          color="#10b981"
        />
      </div>

      <div style={styles.actions}>
        <h2 style={styles.subHeading}>Quick Actions</h2>
        <div style={styles.actionGrid}>
          <Link to="/doctor/appointments" style={styles.actionCard}>
            <div style={styles.actionIcon}>📋</div>
            <div style={styles.actionTitle}>Appointments</div>
            <div style={styles.actionText}>Manage requests</div>
          </Link>
          <Link to="/doctor/availability" style={styles.actionCard}>
            <div style={styles.actionIcon}>🕐</div>
            <div style={styles.actionTitle}>Availability</div>
            <div style={styles.actionText}>Set your hours</div>
          </Link>
          <Link to="/doctor/patients" style={styles.actionCard}>
            <div style={styles.actionIcon}>👥</div>
            <div style={styles.actionTitle}>Patients</div>
            <div style={styles.actionText}>View history</div>
          </Link>
          <Link to="/profile" style={styles.actionCard}>
            <div style={styles.actionIcon}>⚙️</div>
            <div style={styles.actionTitle}>Profile</div>
            <div style={styles.actionText}>Update info</div>
          </Link>
        </div>
      </div>

      <div>
        <div style={styles.sectionHeader}>
          <h2 style={styles.subHeading}>Today's Appointments</h2>
        </div>

        {todayApts.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>☕</div>
            <p style={styles.emptyText}>
              No appointments today. Enjoy your day!
            </p>
          </div>
        ) : (
          todayApts.map((apt) => (
            <AppointmentCard
              key={apt._id}
              appointment={apt}
              viewAs="doctor"
            />
          ))
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
  viewBtn: {
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
  actions: { marginBottom: "3rem" },
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
  },
  actionIcon: { fontSize: "1.8rem", marginBottom: "0.3rem" },
  actionTitle: { fontSize: "0.95rem", fontWeight: "600", color: "#0f172a" },
  actionText: { fontSize: "0.8rem", color: "#64748b" },
  sectionHeader: { marginBottom: "1.2rem" },
  empty: {
    textAlign: "center",
    padding: "3rem 2rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
  },
  emptyIcon: { fontSize: "3rem", marginBottom: "0.8rem" },
  emptyText: { color: "#64748b" },
  setupContainer: {
    minHeight: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  setupCard: {
    background: "#fff",
    padding: "3rem 2rem",
    borderRadius: "16px",
    textAlign: "center",
    maxWidth: "500px",
    border: "1px solid #ccfbf1",
    boxShadow: "0 4px 24px rgba(13, 148, 136, 0.08)",
  },
  setupIcon: { fontSize: "4rem", marginBottom: "1rem" },
  setupTitle: { fontSize: "1.5rem", color: "#0f172a", marginBottom: "0.8rem" },
  setupText: {
    color: "#64748b",
    marginBottom: "2rem",
    lineHeight: 1.6,
  },
  setupBtn: {
    display: "inline-block",
    padding: "0.9rem 2rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
  },
};

export default DoctorDashboard;