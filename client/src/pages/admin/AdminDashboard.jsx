import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import { formatDate, formatPrice } from "../../utils/formatDate";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <p style={{ padding: "2rem" }}>Error loading data</p>;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartData = (data.monthlyStats || []).map((s) => ({
    name: `${months[s._id.month - 1]}`,
    appointments: s.count,
  }));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Admin Dashboard 👑</h1>
          <p style={styles.subtext}>Platform overview and statistics</p>
        </div>
        <div style={styles.actions}>
          <Link to="/admin/doctors" style={styles.actionBtn}>
            👨‍⚕️ Doctors
          </Link>
          <Link to="/admin/users" style={styles.actionBtn}>
            👥 Users
          </Link>
          <Link to="/admin/appointments" style={styles.actionBtn}>
            📅 Appointments
          </Link>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <StatCard
          icon="👤"
          value={data.totalPatients}
          label="Patients"
          color="#0d9488"
        />
        <StatCard
          icon="👨‍⚕️"
          value={data.totalDoctors}
          label="Doctors"
          color="#3b82f6"
        />
        <StatCard
          icon="📅"
          value={data.totalAppointments}
          label="Appointments"
          color="#f59e0b"
        />
        <StatCard
          icon="⏳"
          value={data.pendingDoctors}
          label="Pending Approval"
          color="#ef4444"
        />
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeading}>📊 Monthly Appointments</h2>
        <div style={styles.chartBox}>
          {chartData.length === 0 ? (
            <p style={styles.emptyChart}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Bar
                  dataKey="appointments"
                  fill="#0d9488"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeading}>🕐 Recent Appointments</h2>
        {data.recentAppointments?.length === 0 ? (
          <p style={styles.empty}>No appointments yet</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Patient</span>
              <span>Doctor</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            {data.recentAppointments?.map((a) => (
              <div key={a._id} style={styles.tableRow}>
                <span>{a.patient?.name || "N/A"}</span>
                <span>Dr. {a.doctor?.name || "N/A"}</span>
                <span>{formatDate(a.date)}</span>
                <span style={styles.statusPill}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "1200px", margin: "auto", padding: "2rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  heading: { fontSize: "1.7rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b" },
  actions: { display: "flex", gap: "0.6rem", flexWrap: "wrap" },
  actionBtn: {
    padding: "0.6rem 1.1rem",
    background: "#f0fdfa",
    color: "#0f766e",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.2rem",
    marginBottom: "3rem",
  },
  section: { marginBottom: "3rem" },
  subHeading: {
    fontSize: "1.2rem",
    color: "#0f172a",
    marginBottom: "1.2rem",
  },
  chartBox: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  emptyChart: { textAlign: "center", color: "#64748b", padding: "2rem" },
  empty: { color: "#64748b", padding: "2rem", textAlign: "center" },
  table: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    padding: "1rem",
    background: "#f8fafc",
    fontWeight: "600",
    fontSize: "0.85rem",
    color: "#475569",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    padding: "1rem",
    borderTop: "1px solid #f1f5f9",
    fontSize: "0.9rem",
    color: "#334155",
    alignItems: "center",
  },
  statusPill: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "0.2rem 0.6rem",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "capitalize",
    width: "fit-content",
  },
};

export default AdminDashboard;