const RatingStars = ({ rating = 0, size = 16, showNumber = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div style={styles.container}>
      <span style={{ fontSize: `${size}px`, color: "#f59e0b" }}>
        {"★".repeat(fullStars)}
      </span>
      {hasHalf && (
        <span style={{ fontSize: `${size}px`, color: "#f59e0b" }}>½</span>
      )}
      <span style={{ fontSize: `${size}px`, color: "#cbd5e1" }}>
        {"★".repeat(emptyStars)}
      </span>
      {showNumber && (
        <span style={styles.number}>({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

const styles = {
  container: { display: "inline-flex", alignItems: "center", gap: "0.3rem" },
  number: { fontSize: "0.85rem", color: "#64748b" },
};

export default RatingStars;