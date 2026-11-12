const StatCard = ({ icon, value, label, color = "#0d9488", subtitle }) => {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.icon, background: `${color}15`, color }}>
        {icon}
      </div>
      <div style={styles.content}>
        <div style={styles.value}>{value}</div>
        <div style={styles.label}>{label}</div>
        {subtitle && <div style={styles.subtitle}>{subtitle}</div>}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  },
  icon: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    flexShrink: 0,
  },
  content: { flex: 1 },
  value: {
    fontSize: "1.7rem",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 1.2,
  },
  label: {
    fontSize: "0.85rem",
    color: "#64748b",
    marginTop: "0.2rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "600",
  },
  subtitle: { fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" },
};

export default StatCard;