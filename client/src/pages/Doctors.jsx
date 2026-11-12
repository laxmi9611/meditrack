import { useEffect, useState } from "react";
import API from "../services/api";
import DoctorCard from "../components/DoctorCard";
import Loader from "../components/Loader";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: "",
    search: "",
    sort: "",
  });

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const { data } = await API.get("/doctors/specialties");
        setSpecialties(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
          if (v) params.append(k, v);
        });
        const { data } = await API.get(`/doctors?${params.toString()}`);
        setDoctors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Find a Doctor</h1>
        <p style={styles.subtext}>
          Browse {doctors.length} verified doctors across specialties
        </p>
      </div>

      <div style={styles.filters}>
        <input
          style={styles.input}
          placeholder="Search by name or specialty..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          style={styles.select}
          value={filters.specialty}
          onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
        >
          <option value="">All Specialties</option>
          {specialties.map((s) => (
            <option key={s._id} value={s._id}>
              {s.icon} {s.name}
            </option>
          ))}
        </select>
        <select
          style={styles.select}
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Sort By</option>
          <option value="rating">Top Rated</option>
          <option value="experience">Most Experienced</option>
          <option value="fee_asc">Fee: Low to High</option>
          <option value="fee_desc">Fee: High to Low</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : doctors.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🔍</div>
          <p style={styles.emptyText}>No doctors found</p>
          <p style={styles.emptyHint}>
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {doctors.map((d) => (
            <DoctorCard key={d._id} doctor={d} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "1200px", margin: "auto", padding: "2rem" },
  header: { marginBottom: "1.5rem" },
  heading: { fontSize: "1.8rem", color: "#0f172a", marginBottom: "0.3rem" },
  subtext: { color: "#64748b" },
  filters: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: "220px",
    padding: "0.75rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    outline: "none",
  },
  select: {
    padding: "0.75rem 1rem",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "0.95rem",
    background: "#fff",
    outline: "none",
    minWidth: "180px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  empty: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "#fff",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
  },
  emptyIcon: { fontSize: "3.5rem", marginBottom: "0.8rem" },
  emptyText: { fontSize: "1.1rem", color: "#0f172a", marginBottom: "0.4rem" },
  emptyHint: { color: "#64748b", fontSize: "0.9rem" },
};

export default Doctors;