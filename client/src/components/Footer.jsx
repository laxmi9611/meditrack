const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © 2026 MediTrack — Built with ❤️ for better healthcare
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: "auto",
    padding: "1.5rem",
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.9rem",
    borderTop: "1px solid #e2e8f0",
    background: "#fff",
  },
  text: { margin: 0 },
};

export default Footer;