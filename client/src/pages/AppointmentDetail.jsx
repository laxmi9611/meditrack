import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  formatDate,
  formatTime,
  formatPrice,
  calculateAge,
} from "../utils/formatDate";
import { APPOINTMENT_STATUSES } from "../utils/specialties";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchAppointment = async () => {
    try {
      const { data } = await API.get(`/appointments/${id}`);
      setAppointment(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await API.put(`/appointments/${id}/cancel`);
      toast.success("Appointment cancelled");
      fetchAppointment();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reviews", {
        appointmentId: id,
        rating: review.rating,
        comment: review.comment,
      });
      toast.success("Review submitted! ⭐");
      setShowReviewForm(false);
      fetchAppointment();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading) return <Loader />;
  if (!appointment) return <p style={{ padding: "2rem" }}>Not found</p>;

  const status = APPOINTMENT_STATUSES[appointment.status] || {};
  const doctor = appointment.doctor || {};
  const patient = appointment.patient || {};
  const specialty = appointment.doctorProfile?.specialty;
  const isDoctor = user.role === "doctor";
  const isPatient = user.role === "patient";
  const isPast = new Date(appointment.date) < new Date();

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>

      <div style={styles.headerCard}>
        <div style={styles.headerTop}>
          <span style={{ ...styles.status, background: status.color }}>
            {status.label}
          </span>
          <span style={styles.orderId}>#{appointment._id.slice(-8)}</span>
        </div>

        <div style={styles.parties}>
          {isPatient && (
            <DoctorInfo doctor={doctor} specialty={specialty} />
          )}
          {isDoctor && (
            <PatientInfo patient={patient} />
          )}
          {user.role === "admin" && (
            <>
              <DoctorInfo doctor={doctor} specialty={specialty} />
              <div style={styles.divider}>|</div>
              <PatientInfo patient={patient} />
            </>
          )}
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Appointment Details</h3>
          <Row label="Date" value={formatDate(appointment.date)} />
          <Row
            label="Time"
            value={`${formatTime(appointment.timeSlot.start)} - ${formatTime(
              appointment.timeSlot.end
            )}`}
          />
          <Row
            label="Consultation"
            value={
              appointment.consultationType === "video"
                ? "🎥 Video Call"
                : "🏥 In-person"
            }
          />
          <Row label="Fee" value={formatPrice(appointment.fee)} highlight />
        </div>

        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Reason for Visit</h3>
          <p style={styles.text}>{appointment.reason}</p>
          {appointment.symptoms && (
            <>
              <h4 style={styles.subTitle}>Symptoms</h4>
              <p style={styles.text}>{appointment.symptoms}</p>
            </>
          )}
        </div>
      </div>

      {appointment.doctorNotes && (
        <div style={styles.infoCard}>
          <h3 style={styles.cardTitle}>Doctor's Notes</h3>
          <p style={styles.text}>{appointment.doctorNotes}</p>
        </div>
      )}

      <div style={styles.actions}>
        {appointment.consultationType === "video" &&
          appointment.status === "confirmed" && (
            <Link to={`/video-call/${appointment._id}`} style={styles.videoBtn}>
              🎥 Join Video Call
            </Link>
          )}

        {appointment.prescription && (
          <Link
            to={`/prescriptions/${
             typeof appointment.prescription === "object"
              ? appointment.prescription._id
              : appointment.prescription
            }`}
            style={styles.pdfBtn}
         >
            💊 View Prescription
         </Link>
       )}  

        {isDoctor &&
          appointment.status === "pending" && (
            <>
              <button
                onClick={() => navigate(`/doctor/appointments/${id}`)}
                style={styles.primaryBtn}
              >
                ✅ Manage Appointment
              </button>
            </>
          )}

        {isPatient &&
          appointment.status !== "completed" &&
          appointment.status !== "cancelled" && (
            <button onClick={handleCancel} style={styles.dangerBtn}>
              Cancel Appointment
            </button>
          )}

        {isPatient &&
          appointment.status === "completed" &&
          !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              style={styles.primaryBtn}
            >
              ⭐ Leave a Review
            </button>
          )}
      </div>

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
          <h3 style={styles.cardTitle}>Write a Review</h3>
          <div style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setReview({ ...review, rating: n })}
                style={{
                  ...styles.star,
                  color: n <= review.rating ? "#f59e0b" : "#cbd5e1",
                }}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={review.comment}
            onChange={(e) =>
              setReview({ ...review, comment: e.target.value })
            }
            placeholder="Share your experience..."
            rows={3}
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.primaryBtn}>
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

const DoctorInfo = ({ doctor, specialty }) => (
  <div style={styles.party}>
    {doctor.avatar ? (
      <img src={doctor.avatar} alt="" style={styles.partyAvatar} />
    ) : (
      <div style={styles.partyAvatarFallback}>{doctor.name?.[0]}</div>
    )}
    <div>
      <div style={styles.partyRole}>Doctor</div>
      <div style={styles.partyName}>Dr. {doctor.name}</div>
      {specialty && (
        <div style={styles.partySub}>
          {specialty.icon} {specialty.name}
        </div>
      )}
    </div>
  </div>
);

const PatientInfo = ({ patient }) => (
  <div style={styles.party}>
    {patient.avatar ? (
      <img src={patient.avatar} alt="" style={styles.partyAvatar} />
    ) : (
      <div style={styles.partyAvatarFallback}>{patient.name?.[0]}</div>
    )}
    <div>
      <div style={styles.partyRole}>Patient</div>
      <div style={styles.partyName}>{patient.name}</div>
      {patient.dateOfBirth && (
        <div style={styles.partySub}>
          Age: {calculateAge(patient.dateOfBirth)}
        </div>
      )}
    </div>
  </div>
);

const Row = ({ label, value, highlight }) => (
  <div style={styles.row}>
    <span style={styles.rowLabel}>{label}</span>
    <span style={highlight ? styles.rowValueHighlight : styles.rowValue}>
      {value}
    </span>
  </div>
);

const styles = {
  container: { maxWidth: "900px", margin: "auto", padding: "2rem" },
  backBtn: {
    background: "transparent",
    color: "#0d9488",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  headerCard: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    marginBottom: "1.5rem",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.2rem",
  },
  status: {
    color: "#fff",
    padding: "0.35rem 0.9rem",
    borderRadius: "16px",
    fontSize: "0.8rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  orderId: { color: "#94a3b8", fontSize: "0.85rem", fontFamily: "monospace" },
  parties: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  party: { display: "flex", alignItems: "center", gap: "0.8rem" },
  partyAvatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  partyAvatarFallback: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    fontWeight: "700",
  },
  partyRole: {
    fontSize: "0.75rem",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  partyName: { fontSize: "1.05rem", fontWeight: "700", color: "#0f172a" },
  partySub: { fontSize: "0.85rem", color: "#0d9488", fontWeight: "600" },
  divider: { color: "#e2e8f0", fontSize: "2rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.2rem",
    marginBottom: "1.2rem",
  },
  infoCard: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "1.2rem",
  },
  cardTitle: {
    fontSize: "1rem",
    color: "#0f172a",
    marginBottom: "1rem",
    fontWeight: "700",
  },
  subTitle: {
    fontSize: "0.85rem",
    color: "#64748b",
    textTransform: "uppercase",
    marginTop: "0.8rem",
    marginBottom: "0.4rem",
    fontWeight: "700",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.6rem 0",
    borderBottom: "1px solid #f1f5f9",
  },
  rowLabel: { color: "#64748b", fontSize: "0.9rem" },
  rowValue: { color: "#0f172a", fontWeight: "500", fontSize: "0.9rem" },
  rowValueHighlight: {
    color: "#0f766e",
    fontWeight: "700",
    fontSize: "1rem",
  },
  text: { color: "#334155", lineHeight: "1.7", fontSize: "0.95rem" },
  actions: {
    display: "flex",
    gap: "0.8rem",
    flexWrap: "wrap",
    marginTop: "0.5rem",
  },
  videoBtn: {
    padding: "0.85rem 1.5rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  pdfBtn: {
    padding: "0.85rem 1.5rem",
    background: "#fef3c7",
    color: "#92400e",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  primaryBtn: {
    padding: "0.85rem 1.5rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  dangerBtn: {
    padding: "0.85rem 1.5rem",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.95rem",
    border: "1px solid #fecaca",
  },
  reviewForm: {
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginTop: "1.5rem",
  },
  starsRow: { display: "flex", gap: "0.3rem", marginBottom: "1rem" },
  star: {
    background: "transparent",
    fontSize: "2rem",
    padding: 0,
  },
  textarea: {
    width: "100%",
    padding: "0.8rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    resize: "vertical",
    fontFamily: "inherit",
    marginBottom: "1rem",
    outline: "none",
  },
};

export default AppointmentDetail;