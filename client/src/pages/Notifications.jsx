import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { formatDateTime } from "../utils/formatDate";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      toast.success("All marked as read");
    } catch (err) {
      toast.error("Failed");
    }
  };

  const handleClick = async (n) => {
    // Mark as read
    if (!n.read) {
      try {
        await API.put(`/notifications/${n._id}/read`);
        setNotifications(
          notifications.map((x) =>
            x._id === n._id ? { ...x, read: true } : x
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
    // Navigate
    if (n.appointment) navigate(`/appointments/${n.appointment}`);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>🔔 Notifications</h1>
          <p style={styles.subtext}>
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} style={styles.markBtn}>
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🔔</div>
          <p style={styles.emptyText}>No notifications yet</p>
        </div>
      ) : (
        <div style={styles.list}>
          {notifications.map((n) => (
            <button
              key={n._id}
              onClick={() => handleClick(n)}
              style={{
                ...styles.item,
                ...(n.read ? {} : styles.itemUnread),
              }}
            >
              <div style={styles.dotWrap}>
                {!n.read && <div style={styles.dot}></div>}
              </div>
              <div style={styles.content}>
                <div style={styles.message}>{n.message}</div>
                <div style={styles.time}>{formatDateTime(n.createdAt)}</div>
              </div>
              <span style={styles.typeIcon}>
                {getIcon(n.type)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const getIcon = (type) => {
  if (type?.includes("confirmed")) return "✅";
  if (type?.includes("rejected")) return "❌";
  if (type?.includes("cancelled")) return "🚫";
  if (type?.includes("booked")) return "📅";
  if (type?.includes("prescription")) return "💊";
  if (type?.includes("review")) return "⭐";
  if (type?.includes("verified")) return "🎉";
  return "🔔";
};

const styles = {
  container: { maxWidth: "720px", margin: "auto", padding: "2rem" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.2rem" },
  subtext: { color: "#64748b", fontSize: "0.9rem" },
  markBtn: {
    padding: "0.55rem 1.1rem",
    background: "#f0fdfa",
    color: "#0f766e",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  list: { display: "flex", flexDirection: "column", gap: "0.6rem" },
  item: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    textAlign: "left",
    width: "100%",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  itemUnread: {
    background: "#f0fdfa",
    borderColor: "#ccfbf1",
  },
  dotWrap: { width: "10px", flexShrink: 0 },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#0d9488",
  },
  content: { flex: 1, minWidth: 0 },
  message: {
    fontSize: "0.9rem",
    color: "#0f172a",
    marginBottom: "0.2rem",
    fontWeight: "500",
    lineHeight: 1.4,
  },
  time: { fontSize: "0.75rem", color: "#94a3b8" },
  typeIcon: { fontSize: "1.5rem", flexShrink: 0 },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
  },
  emptyIcon: { fontSize: "3.5rem", marginBottom: "0.8rem" },
  emptyText: { color: "#64748b", fontSize: "1.05rem" },
};

export default Notifications;