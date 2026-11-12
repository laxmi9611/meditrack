import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const NotificationBell = () => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const { data } = await API.get("/notifications/unread");
      setCount(data.count);
    } catch (err) {
      // silent
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/notifications" style={styles.bell}>
      🔔
      {count > 0 && <span style={styles.badge}>{count > 9 ? "9+" : count}</span>}
    </Link>
  );
};

const styles = {
  bell: {
    position: "relative",
    fontSize: "1.3rem",
    textDecoration: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-10px",
    background: "#dc2626",
    color: "#fff",
    fontSize: "0.65rem",
    padding: "0.15rem 0.4rem",
    borderRadius: "10px",
    fontWeight: "700",
    minWidth: "18px",
    textAlign: "center",
    lineHeight: 1.2,
  },
};

export default NotificationBell;