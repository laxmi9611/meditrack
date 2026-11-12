import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { formatDate } from "../utils/formatDate";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const PrescriptionView = () => {
  const { id } = useParams();
  const testId = "6ae5f50af7e712e0d24625f2";
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/prescriptions/${id}`);
        setPrescription(data);
      } catch (err) {
        console.error(err);
        toast.error("Prescription not found");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await API.get(`/prescriptions/${id}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `prescription-${prescription._id.slice(-8)}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Downloaded!");
    } catch (err) {
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader />;
  if (!prescription)
    return <p style={{ padding: "2rem" }}>Prescription not found</p>;

  const doctor = prescription.doctor || {};
  const patient = prescription.patient || {};

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        ← Back
      </button>

      <div style={styles.prescription}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.logo}>🏥 MediTrack</h1>
            <p style={styles.tagline}>Prescription</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={styles.downloadBtn}
          >
            {downloading ? "Downloading..." : "⬇ Download PDF"}
          </button>
        </div>

        <div style={styles.partiesRow}>
          <div style={styles.partyBox}>
            <div style={styles.partyLabel}>DOCTOR</div>
            <div style={styles.partyName}>Dr. {doctor.name}</div>
            <div style={styles.partySub}>{doctor.email}</div>
          </div>
          <div style={styles.partyBox}>
            <div style={styles.partyLabel}>PATIENT</div>
            <div style={styles.partyName}>{patient.name}</div>
            <div style={styles.partySub}>{patient.email}</div>
          </div>
        </div>

        <div style={styles.dateRow}>
          <span style={styles.dateLabel}>Date:</span>
          <span style={styles.dateValue}>
            {formatDate(prescription.createdAt)}
          </span>
        </div>

        <Section title="Diagnosis">
          <p style={styles.text}>{prescription.diagnosis}</p>
        </Section>

        <Section title="Medicines">
          <div style={styles.medicines}>
            {prescription.medicines?.map((med, i) => (
              <div key={i} style={styles.medicine}>
                <div style={styles.medNumber}>{i + 1}</div>
                <div style={styles.medContent}>
                  <div style={styles.medName}>{med.name}</div>
                  <div style={styles.medMeta}>
                    <span>💊 {med.dosage}</span>
                    <span>⏱ {med.duration}</span>
                  </div>
                  {med.notes && (
                    <div style={styles.medNotes}>📝 {med.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {prescription.advice && (
          <Section title="Advice">
            <p style={styles.text}>{prescription.advice}</p>
          </Section>
        )}

        {prescription.followUpDate && (
          <Section title="Follow-up">
            <p style={styles.followUp}>
              📅 {formatDate(prescription.followUpDate)}
            </p>
          </Section>
        )}

        <div style={styles.footer}>
          <p style={styles.footerText}>
            This is a computer-generated prescription from MediTrack.
          </p>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>{title}</h3>
    {children}
  </div>
);

const styles = {
  container: { maxWidth: "800px", margin: "auto", padding: "2rem" },
  backBtn: {
    background: "transparent",
    color: "#0d9488",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  prescription: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(13, 148, 136, 0.06)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "1.5rem",
    borderBottom: "2px solid #0d9488",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  logo: { fontSize: "1.5rem", color: "#0d9488", fontWeight: "800" },
  tagline: {
    fontSize: "0.85rem",
    color: "#64748b",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },
  downloadBtn: {
    padding: "0.7rem 1.3rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  partiesRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  partyBox: {
    padding: "1rem",
    background: "#f0fdfa",
    borderRadius: "10px",
  },
  partyLabel: {
    fontSize: "0.7rem",
    color: "#0f766e",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "0.3rem",
  },
  partyName: { fontSize: "1rem", fontWeight: "700", color: "#0f172a" },
  partySub: { fontSize: "0.8rem", color: "#64748b" },
  dateRow: {
    display: "flex",
    gap: "0.5rem",
    paddingBottom: "1.5rem",
    marginBottom: "1.5rem",
    borderBottom: "1px solid #e2e8f0",
  },
  dateLabel: { color: "#64748b", fontSize: "0.9rem" },
  dateValue: { color: "#0f172a", fontWeight: "600", fontSize: "0.9rem" },
  section: { marginBottom: "1.8rem" },
  sectionTitle: {
    fontSize: "0.85rem",
    color: "#0f766e",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "700",
    marginBottom: "0.7rem",
  },
  text: { color: "#334155", lineHeight: "1.7", fontSize: "0.95rem" },
  medicines: { display: "flex", flexDirection: "column", gap: "0.7rem" },
  medicine: {
    display: "flex",
    gap: "0.8rem",
    padding: "0.9rem",
    background: "#f8fafc",
    borderRadius: "10px",
  },
  medNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#0d9488",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "0.8rem",
    flexShrink: 0,
  },
  medContent: { flex: 1 },
  medName: { fontWeight: "700", color: "#0f172a", marginBottom: "0.4rem" },
  medMeta: {
    display: "flex",
    gap: "1rem",
    fontSize: "0.85rem",
    color: "#475569",
    flexWrap: "wrap",
  },
  medNotes: {
    fontSize: "0.8rem",
    color: "#64748b",
    marginTop: "0.4rem",
    fontStyle: "italic",
  },
  followUp: {
    color: "#0f766e",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  footer: {
    paddingTop: "1.5rem",
    borderTop: "1px solid #e2e8f0",
    marginTop: "2rem",
  },
  footerText: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    textAlign: "center",
    fontStyle: "italic",
  },
};

export default PrescriptionView;