import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatPrice, formatDate } from "../utils/formatDate";
import RatingStars from "../components/RatingStars";
import Loader from "../components/Loader";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docRes, revRes] = await Promise.all([
          API.get(`/doctors/${id}`),
          API.get(`/reviews/doctor/${id}`).catch(() => ({ data: [] })),
        ]);
        setDoctor(docRes.data);
        setReviews(revRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (!doctor) return <p style={{ padding: "2rem" }}>Doctor not found</p>;

  const doctorUser = doctor.user || {};
  const specialty = doctor.specialty || {};

  return (
    <div style={styles.container}>
      <Link to="/doctors" style={styles.backBtn}>
        ← Back to Doctors
      </Link>

      <div style={styles.heroCard}>
        <div style={styles.heroLeft}>
          {doctorUser.avatar ? (
            <img src={doctorUser.avatar} alt="" style={styles.heroAvatar} />
          ) : (
            <div style={styles.heroAvatarFallback}>
              {doctorUser.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div style={styles.heroRight}>
          <h1 style={styles.name}>Dr. {doctorUser.name}</h1>
          <p style={styles.specialty}>
            {specialty.icon} {specialty.name}
          </p>

          <div style={styles.ratingRow}>
            <RatingStars rating={doctor.rating || 0} size={18} showNumber />
            <span style={styles.reviewCount}>
              ({doctor.numReviews || 0} reviews)
            </span>
          </div>

          <div style={styles.quickStats}>
            <div style={styles.quickStat}>
              <div style={styles.quickStatValue}>{doctor.experience}+</div>
              <div style={styles.quickStatLabel}>Years Exp.</div>
            </div>
            <div style={styles.quickStat}>
              <div style={styles.quickStatValue}>
                {formatPrice(doctor.consultationFee)}
              </div>
              <div style={styles.quickStatLabel}>Consultation</div>
            </div>
            <div style={styles.quickStat}>
              <div style={styles.quickStatValue}>{reviews.length}</div>
              <div style={styles.quickStatLabel}>Reviews</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (!user) return navigate("/login");
              if (user.role !== "patient") {
                alert("Only patients can book appointments");
                return;
              }
              navigate(`/book/${id}`);
            }}
            style={styles.bookBtn}
          >
            📅 Book Appointment
          </button>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab("about")}
          style={activeTab === "about" ? styles.activeTab : styles.tab}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab("availability")}
          style={activeTab === "availability" ? styles.activeTab : styles.tab}
        >
          Availability
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          style={activeTab === "reviews" ? styles.activeTab : styles.tab}
        >
          Reviews ({reviews.length})
        </button>
      </div>

      <div style={styles.tabContent}>
        {activeTab === "about" && (
          <div style={styles.aboutSection}>
            <Section title="Qualification">
              <p style={styles.text}>{doctor.qualification}</p>
            </Section>
            {doctor.about && (
              <Section title="About">
                <p style={styles.text}>{doctor.about}</p>
              </Section>
            )}
            {doctor.languages?.length > 0 && (
              <Section title="Languages">
                <div style={styles.chips}>
                  {doctor.languages.map((lang, i) => (
                    <span key={i} style={styles.chip}>
                      {lang}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {activeTab === "availability" && (
          <div>
            {doctor.availability?.length === 0 ? (
              <p style={styles.empty}>No availability set yet.</p>
            ) : (
              <div style={styles.availabilityGrid}>
                {doctor.availability?.map((slot, i) => (
                  <div key={i} style={styles.availSlot}>
                    <div style={styles.availDay}>{slot.day}</div>
                    <div style={styles.availTime}>
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {reviews.length === 0 ? (
              <p style={styles.empty}>No reviews yet.</p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} style={styles.review}>
                  <div style={styles.reviewHeader}>
                    {r.patient?.avatar ? (
                      <img src={r.patient.avatar} alt="" style={styles.rAvatar} />
                    ) : (
                      <div style={styles.rAvatarFallback}>
                        {r.patient?.name?.[0]}
                      </div>
                    )}
                    <div>
                      <div style={styles.rName}>{r.patient?.name}</div>
                      <div style={styles.rDate}>{formatDate(r.createdAt)}</div>
                    </div>
                    <RatingStars rating={r.rating} size={14} />
                  </div>
                  <p style={styles.rText}>{r.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    {children}
  </div>
);

const styles = {
  container: { maxWidth: "1000px", margin: "auto", padding: "2rem" },
  backBtn: {
    display: "inline-block",
    color: "#0d9488",
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  heroCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "2rem",
    border: "1px solid #e2e8f0",
    display: "flex",
    gap: "2rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  heroLeft: { flexShrink: 0 },
  heroAvatar: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #ccfbf1",
  },
  heroAvatarFallback: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "3rem",
    fontWeight: "700",
  },
  heroRight: { flex: 1, minWidth: "280px" },
  name: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.3rem" },
  specialty: {
    fontSize: "1rem",
    color: "#0d9488",
    fontWeight: "600",
    marginBottom: "0.8rem",
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "1.5rem",
  },
  reviewCount: { color: "#64748b", fontSize: "0.9rem" },
  quickStats: { display: "flex", gap: "2rem", marginBottom: "1.5rem" },
  quickStat: {},
  quickStatValue: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#0f172a",
  },
  quickStatLabel: {
    fontSize: "0.8rem",
    color: "#64748b",
    textTransform: "uppercase",
  },
  bookBtn: {
    padding: "0.9rem 2rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1rem",
  },
  tabs: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.5rem",
    borderBottom: "2px solid #e2e8f0",
  },
  tab: {
    padding: "0.8rem 1.2rem",
    background: "transparent",
    color: "#64748b",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  activeTab: {
    padding: "0.8rem 1.2rem",
    background: "transparent",
    color: "#0d9488",
    fontSize: "0.95rem",
    fontWeight: "700",
    borderBottom: "2px solid #0d9488",
    marginBottom: "-2px",
  },
  tabContent: {
    background: "#fff",
    borderRadius: "14px",
    padding: "2rem",
    border: "1px solid #e2e8f0",
  },
  sectionTitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "0.5rem",
    fontWeight: "700",
  },
  text: { color: "#334155", lineHeight: "1.7", fontSize: "0.95rem" },
  chips: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  chip: {
    background: "#f0fdfa",
    color: "#0f766e",
    padding: "0.4rem 0.9rem",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  availabilityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "0.8rem",
  },
  availSlot: {
    background: "#f0fdfa",
    padding: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccfbf1",
  },
  availDay: {
    fontSize: "0.9rem",
    fontWeight: "700",
    color: "#0f766e",
    marginBottom: "0.3rem",
  },
  availTime: { fontSize: "0.85rem", color: "#334155" },
  empty: { color: "#64748b", textAlign: "center", padding: "2rem" },
  review: {
    padding: "1rem 0",
    borderBottom: "1px solid #f1f5f9",
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    marginBottom: "0.7rem",
  },
  rAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  rAvatarFallback: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "#0d9488",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  rName: { fontSize: "0.9rem", fontWeight: "600", color: "#0f172a" },
  rDate: { fontSize: "0.75rem", color: "#94a3b8" },
  rText: { color: "#475569", fontSize: "0.9rem", lineHeight: "1.6" },
};

export default DoctorDetail;