import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatDate";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split("T")[0]
      : "",
    gender: user?.gender || "",
    address: user?.address || "",
  });
  const [avatar, setAvatar] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Upload avatar first if selected
      if (avatar) {
        const avatarData = new FormData();
        avatarData.append("avatar", avatar);
        const { data: avatarData2 } = await API.post(
          "/users/avatar",
          avatarData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        updateUser(avatarData2);
      }

      // Update profile
      const { data } = await API.put("/users", form);
      updateUser(data);
      toast.success("Profile updated!");
      setAvatar(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Profile</h1>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatarWrap}>
            {user.avatar ? (
              <img src={user.avatar} alt="" style={styles.avatar} />
            ) : (
              <div style={styles.avatarFallback}>
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 style={styles.name}>{user.name}</h2>
            <p style={styles.email}>{user.email}</p>
            <span style={styles.roleBadge}>{user.role?.toUpperCase()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label style={styles.label}>Phone</label>
          <input
            style={styles.input}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 XXXXX XXXXX"
          />

          <label style={styles.label}>Date of Birth</label>
          <input
            type="date"
            style={styles.input}
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          />

          <label style={styles.label}>Gender</label>
          <select
            style={styles.input}
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <label style={styles.label}>Address</label>
          <textarea
            style={styles.textarea}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows={3}
            placeholder="Your full address"
          />

          <label style={styles.label}>Update Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            style={styles.file}
          />
          {avatar && (
            <p style={styles.fileHint}>Selected: {avatar.name}</p>
          )}

          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div style={styles.metaSection}>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Member since</span>
            <span style={styles.metaValue}>
              {formatDate(user.createdAt)}
            </span>
          </div>
          <div style={styles.metaRow}>
            <span style={styles.metaLabel}>Account ID</span>
            <span style={styles.metaValue} title={user._id}>
              {user._id?.slice(-8)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "640px", margin: "auto", padding: "2rem" },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "1.5rem" },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
  },
  header: {
    display: "flex",
    gap: "1.2rem",
    alignItems: "center",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #f1f5f9",
    marginBottom: "1.5rem",
  },
  avatarWrap: {},
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #ccfbf1",
  },
  avatarFallback: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.2rem",
    fontWeight: "700",
  },
  name: { fontSize: "1.3rem", color: "#0f172a", marginBottom: "0.2rem" },
  email: { fontSize: "0.9rem", color: "#64748b", marginBottom: "0.5rem" },
  roleBadge: {
    display: "inline-block",
    background: "#f0fdfa",
    color: "#0f766e",
    padding: "0.25rem 0.7rem",
    borderRadius: "12px",
    fontSize: "0.7rem",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  form: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#334155",
    marginTop: "0.5rem",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
    background: "#fff",
  },
  textarea: {
    padding: "0.75rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    resize: "vertical",
    fontFamily: "inherit",
    outline: "none",
  },
  file: {
    fontSize: "0.85rem",
    marginTop: "0.3rem",
  },
  fileHint: {
    fontSize: "0.8rem",
    color: "#0f766e",
    marginTop: "0.3rem",
  },
  saveBtn: {
    marginTop: "1.5rem",
    padding: "0.9rem",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#fff",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1rem",
  },
  metaSection: {
    marginTop: "2rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
  },
  metaLabel: { color: "#64748b" },
  metaValue: { color: "#0f172a", fontWeight: "600" },
};

export default Profile;