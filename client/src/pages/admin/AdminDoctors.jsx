import { useEffect, useState } from "react";
import API from "../../services/api";
import Loader from "../../components/Loader";
import RatingStars from "../../components/RatingStars";
import { formatPrice, formatDate } from "../../utils/formatDate";
import { toast } from "react-toastify";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const fetchData = async () => {
    try {
      const { data } = await API.get("/admin/doctors");
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approve = async (id) => {
    try {
      await API.put(`/admin/doctors/${id}/approve`);
      toast.success("Doctor approved ✅");
      fetchData();
    } catch (err) {
      toast.error("Failed");
    }
  };

  const reject = async (id) => {
    if (!window.confirm("Reject this doctor?")) return;
    try {
      await API.put(`/admin/doctors/${id}/reject`);
      toast.success("Doctor rejected");
      fetchData();
    } catch (err) {
      toast.error("Failed");
    }
  };

  const filtered = doctors.filter((d) => {
    if (filter === "pending") return !d.isApproved;
    if (filter === "approved") return d.isApproved;
    return true;
  });

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>👨‍⚕️ Manage Doctors</h1>
      <p style={styles.subtext}>
        Verify doctor registrations and manage the platform
      </p>

      <div style={styles.filters}>
        {[
          { key: "pending", label: `⏳ Pending (${doctors.filter((d) => !d.isApproved).length})` },
          { key: "approved", label: `✅ Approved (${doctors.filter((d) => d.isApproved).length})` },
          { key: "all", label: "All" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={filter === f.key ? styles.filterActive : styles.filterBtn}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🎉</div>
          <p>No doctors in this category</p>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map((doc) => (
            <div key={doc._id} style={styles.card}>
              <div style={styles.cardHeader}>
                {doc.user?.avatar ? (
                  <img
                    src={doc.user.avatar}
                    alt=""
                    style={styles.avatar}
                  />
                ) : (
                  <div style={styles.avatarFallback}>
                    {doc.user?.name?.[0]?.toUpperCase() || "D"}
                  </div>
                )}
                <div style={styles.info}>
                  <div style={styles.name}>Dr. {doc.user?.name}</div>
                  <div style={styles.email}>{doc.user?.email}</div>
                  <div style={styles.specialty}>
                    {doc.specialty?.icon} {doc.specialty?.name}
                  </div>
                </div>
                <span
                  style={
                    doc.isApproved
                      ? styles.approvedBadge
                      : styles.pendingBadge
                  }
                >
                  {doc.isApproved ? "✅ Approved" : "⏳ Pending"}
                </span>
              </div>

              <div style={styles.details}>
                <div>
                  <strong>Experience:</strong> {doc.experience} years
                </div>
                <div>
                  <strong>Qualification:</strong> {doc.qualification}
                </div>
                <div>
                  <strong>Fee:</strong> {formatPrice(doc.consultationFee)}
                </div>
                <div>
                  <strong>Joined:</strong> {formatDate(doc.createdAt)}
                </div>
                <div>
                  <strong>Rating:</strong>{" "}
                  <RatingStars rating={doc.rating || 0} size={12} showNumber />
                </div>
              </div>

              {doc.about && (
                <p style={styles.about}>{doc.about}</p>
              )}

              <div style={styles.actions}>
                {!doc.isApproved ? (
                  <>
                    <button
                      onClick={() => approve(doc._id)}
                      style={styles.approveBtn}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => reject(doc._id)}
                      style={styles.rejectBtn}
                    >
                      ❌ Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => reject(doc._id)}
                    style={styles.rejectBtn}
                  >
                    🚫 Revoke Approval
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "1000px", margin: "auto", padding: "2rem" },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b", marginBottom: "1.5rem" },
  filters: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "2rem",
    overflowX: "auto",
    paddingBottom: "0.3rem",
  },
  filterBtn: {
    padding: "0.6rem 1.2rem",
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "20px",
    color: "#64748b",
    fontSize: "0.85rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  filterActive: {
    padding: "0.6rem 1.2rem",
    background: "#0d9488",
    border: "1.5px solid #0d9488",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  list: { display: "flex", flexDirection: "column", gap: "1rem" },
  card: {
    background: "#fff",
    padding: "1.3rem",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.9rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarFallback: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: "700",
  },
  info: { flex: 1 },
  name: { fontSize: "1rem", fontWeight: "700", color: "#0f172a" },
  email: { fontSize: "0.8rem", color: "#64748b" },
  specialty: {
    fontSize: "0.85rem",
    color: "#0d9488",
    fontWeight: "600",
    marginTop: "0.2rem",
  },
  approvedBadge: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "0.3rem 0.8rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  pendingBadge: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "0.3rem 0.8rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0.5rem",
    padding: "0.8rem 0",
    borderTop: "1px solid #f1f5f9",
    fontSize: "0.85rem",
    color: "#475569",
  },
  about: {
    fontSize: "0.85rem",
    color: "#64748b",
    lineHeight: 1.6,
    marginTop: "0.8rem",
    padding: "0.8rem",
    background: "#f8fafc",
    borderRadius: "8px",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
    flexWrap: "wrap",
  },
  approveBtn: {
    padding: "0.6rem 1.3rem",
    background: "#10b981",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  rejectBtn: {
    padding: "0.6rem 1.3rem",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.85rem",
    border: "1px solid #fecaca",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
    color: "#64748b",
  },
  emptyIcon: { fontSize: "3rem", marginBottom: "0.8rem" },
};

export default AdminDoctors;