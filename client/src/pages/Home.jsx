import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Your Health, <span style={styles.highlight}>Our Priority</span> 🏥
          </h1>
          <p style={styles.heroText}>
            Connect with top doctors, book appointments, get digital
            prescriptions, and consult via video — all in one place.
          </p>
          <div style={styles.heroButtons}>
            {user ? (
              <Link to="/dashboard" style={styles.heroBtn}>
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" style={styles.heroBtn}>
                  Get Started →
                </Link>
                <Link to="/login" style={styles.heroBtnOutline}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Everything you need 💊</h2>
        <div style={styles.grid}>
          <FeatureCard
            icon="👨‍⚕️"
            title="Verified Doctors"
            text="Browse doctors from every specialty and choose the best fit"
          />
          <FeatureCard
            icon="📅"
            title="Easy Booking"
            text="Book appointments with time slots in just a few clicks"
          />
          <FeatureCard
            icon="🎥"
            title="Video Consultations"
            text="Consult from home with secure Jitsi-powered video calls"
          />
          <FeatureCard
            icon="💊"
            title="Digital Prescriptions"
            text="Download doctor-written prescriptions as PDFs instantly"
          />
          <FeatureCard
            icon="📋"
            title="Medical History"
            text="Your complete health records, always accessible"
          />
          <FeatureCard
            icon="🔔"
            title="Smart Reminders"
            text="Email notifications for every appointment update"
          />
        </div>
      </section>

      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to take charge of your health?</h2>
        <p style={styles.ctaText}>
          Join thousands of patients using MediTrack every day.
        </p>
        {!user && (
          <Link to="/register" style={styles.ctaBtn}>
            Create Free Account
          </Link>
        )}
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, text }) => (
  <div style={styles.card}>
    <div style={styles.cardIcon}>{icon}</div>
    <h3 style={styles.cardTitle}>{title}</h3>
    <p style={styles.cardText}>{text}</p>
  </div>
);

const styles = {
  hero: {
    background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    color: "#fff",
    padding: "5rem 2rem",
    textAlign: "center",
  },
  heroContent: { maxWidth: "780px", margin: "auto" },
  heroTitle: {
    fontSize: "3rem",
    marginBottom: "1.2rem",
    lineHeight: 1.2,
    fontWeight: "800",
  },
  highlight: { color: "#fef08a" },
  heroText: {
    fontSize: "1.15rem",
    marginBottom: "2.2rem",
    opacity: 0.95,
    lineHeight: 1.7,
  },
  heroButtons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  heroBtn: {
    display: "inline-block",
    padding: "1rem 2.2rem",
    background: "#fff",
    color: "#0d9488",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "1rem",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  },
  heroBtnOutline: {
    display: "inline-block",
    padding: "1rem 2.2rem",
    background: "transparent",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1rem",
    border: "2px solid rgba(255,255,255,0.5)",
  },
  features: {
    maxWidth: "1150px",
    margin: "auto",
    padding: "5rem 2rem",
  },
  sectionTitle: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "3.5rem",
    color: "#0f172a",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardIcon: { fontSize: "2.5rem", marginBottom: "1rem" },
  cardTitle: {
    fontSize: "1.15rem",
    marginBottom: "0.5rem",
    color: "#0f172a",
  },
  cardText: { color: "#64748b", lineHeight: "1.6", fontSize: "0.9rem" },
  cta: {
    background: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
    padding: "4rem 2rem",
    textAlign: "center",
  },
  ctaTitle: { fontSize: "1.8rem", marginBottom: "0.8rem", color: "#0f172a" },
  ctaText: { color: "#64748b", marginBottom: "2rem" },
  ctaBtn: {
    display: "inline-block",
    padding: "1rem 2.5rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "1rem",
  },
};

export default Home;