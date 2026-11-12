import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Usage: <RoleRoute roles={["doctor"]}> <DoctorDashboard /> </RoleRoute>
const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;