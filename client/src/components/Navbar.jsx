import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const getMenuItems = () => {
    if (!user) return [];
    if (user.role === "patient") {
      return [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/doctors", label: "Find Doctors" },
        { path: "/appointments", label: "My Appointments" },
        { path: "/prescriptions", label: "Prescriptions" },
      ];
    }
    if (user.role === "doctor") {
      return [
        { path: "/doctor/dashboard", label: "Dashboard" },
        { path: "/doctor/appointments", label: "Appointments" },
        { path: "/doctor/availability", label: "Availability" },
        { path: "/doctor/patients", label: "Patients" },
      ];
    }
    if (user.role === "admin") {
      return [
        { path: "/admin", label: "Dashboard" },
        { path: "/admin/doctors", label: "Doctors" },
        { path: "/admin/users", label: "Users" },
        { path: "/admin/appointments", label: "Appointments" },
      ];
    }
    return [];
  };

  return (
    <nav style={styles.nav}>
      <Link to={user ? "/dashboard" : "/"} style={styles.logo}>
        <span style={styles.logoIcon}>🏥</span> MediTrack
      </Link>

      <div style={styles.center}>
        {getMenuItems().map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={isActive(item.path) ? styles.activeLink : styles.link}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            <NotificationBell />
            <Link to="/profile" style={styles.profileLink}>
              {user.avatar ? (
                <img src={user.avatar} alt="" style={styles.avatar} />
              ) : (
                <div style={styles.avatarFallback}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </Link>
            <button onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.registerBtn}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 2rem",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  logo: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#0d9488",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  logoIcon: { fontSize: "1.5rem" },
  center: { display: "flex", gap: "1.5rem", alignItems: "center" },
  right: { display: "flex", alignItems: "center", gap: "1rem" },
  link: { color: "#64748b", fontSize: "0.95rem", transition: "color 0.2s" },
  activeLink: {
    color: "#0d9488",
    fontSize: "0.95rem",
    fontWeight: "600",
    borderBottom: "2px solid #0d9488",
    paddingBottom: "2px",
  },
  registerBtn: {
    padding: "0.5rem 1.1rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  logout: {
    padding: "0.4rem 0.9rem",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  profileLink: { display: "flex" },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #0d9488",
  },
  avatarFallback: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
};

export default Navbar;