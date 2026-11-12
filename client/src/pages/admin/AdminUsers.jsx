import { useEffect, useState } from "react";
import API from "../../services/api";
import Loader from "../../components/Loader";
import { formatDate } from "../../utils/formatDate";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get("/admin/users");
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const filtered = users.filter((u) => {
    const matchRole = filter === "all" || u.role === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>👥 All Users</h1>
      <p style={styles.subtext}>{users.length} total users on the platform</p>

      <div style={styles.filters}>
        <input
          style={styles.search}
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={styles.select}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="patient">Patients</option>
          <option value="doctor">Doctors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <p>No users found</p>
        </div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>User</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
          {filtered.map((u) => (
            <div key={u._id} style={styles.tableRow}>
              <div style={styles.userCell}>
                {u.avatar ? (
                  <img src={u.avatar} alt="" style={styles.avatar} />
                ) : (
                  <div style={styles.avatarFallback}>
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={styles.name}>{u.name}</div>
                  <div style={styles.email}>{u.email}</div>
                </div>
              </div>
              <span style={roleStyle(u.role)}>{u.role}</span>
              <span style={styles.date}>{formatDate(u.createdAt)}</span>
              <button
                onClick={() => handleDelete(u._id, u.name)}
                style={styles.deleteBtn}
                title="Delete user"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const roleStyle = (role) => {
  const colors = {
    patient: { bg: "#e0f2fe", color: "#0369a1" },
    doctor: { bg: "#d1fae5", color: "#065f46" },
    admin: { bg: "#fef3c7", color: "#92400e" },
  };
  const c = colors[role] || colors.patient;
  return {
    background: c.bg,
    color: c.color,
    padding: "0.25rem 0.7rem",
    borderRadius: "10px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "capitalize",
    width: "fit-content",
  };
};

const styles = {
  container: { maxWidth: "1000px", margin: "auto", padding: "2rem" },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b", marginBottom: "1.5rem" },
  filters: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  search: {
    flex: 1,
    minWidth: "220px",
    padding: "0.7rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.9rem",
    outline: "none",
  },
  select: {
    padding: "0.7rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.9rem",
    background: "#fff",
    outline: "none",
  },
  table: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 60px",
    padding: "0.9rem 1rem",
    background: "#f8fafc",
    fontWeight: "600",
    fontSize: "0.8rem",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 60px",
    padding: "1rem",
    borderTop: "1px solid #f1f5f9",
    alignItems: "center",
    fontSize: "0.85rem",
  },
  userCell: { display: "flex", alignItems: "center", gap: "0.7rem" },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "0.9rem",
    flexShrink: 0,
  },
  name: { fontWeight: "600", color: "#0f172a" },
  email: { color: "#64748b", fontSize: "0.75rem" },
  date: { color: "#64748b" },
  deleteBtn: {
    background: "transparent",
    fontSize: "1.1rem",
    padding: "0.3rem",
    cursor: "pointer",
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

export default AdminUsers;