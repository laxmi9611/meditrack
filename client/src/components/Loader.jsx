const Loader = ({ message = "Loading..." }) => (
  <div style={styles.container}>
    <div style={styles.spinner}></div>
    <p style={styles.text}>{message}</p>
  </div>
);

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem",
    gap: "1rem",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #0d9488",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: { color: "#64748b", fontSize: "0.9rem" },
};

export default Loader;