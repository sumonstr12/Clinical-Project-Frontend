import React, { useState, useEffect } from "react";
import myaxios from "../../assets/utilities/myaxios"; // তোমার axios instance

const specialties = [
  "All Specialties",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedist",
  "Dermatologist",
  "Ophthalmologist",
  "Psychiatrist",
  "Endocrinologist",
];

const FindDoctor = () => {

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Specialties");

  const [doctors, setDoctors] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --------------------------
  // Fetch Doctors from Backend
  // --------------------------

  const fetchDoctors = async () => {

    try {

      let query = `/available-doctors/?page=${page}&limit=10`;

      if (search) {
        query += `&search=${search}`;
      }

      if (filter !== "All Specialties") {
        query += `&specialization=${filter}`;
      }

      const res = await myaxios.get(query);

      setDoctors(res.data.data);
      setTotalPages(res.data.total_pages);

    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // --------------------------
  // Debounce + Fetch
  // --------------------------

  useEffect(() => {

    const delay = setTimeout(() => {
      fetchDoctors();
    }, 500);

    return () => clearTimeout(delay);

  }, [search, page, filter]);

  // --------------------------
  // UI SAME AS BEFORE
  // --------------------------

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={
          i < Math.floor(rating)
            ? "fas fa-star"
            : i < rating
            ? "fas fa-star-half-alt"
            : "far fa-star"
        }
        aria-hidden="true"
      ></i>
    ));
  };

  return (
    <section className="section" id="find-doctor" aria-label="Find a Doctor">

      <div className="section-header">
        <span className="section-eyebrow">Our Specialists</span>
        <h2 className="section-title">Find Your Doctor</h2>
        <p className="section-desc">
          Browse our network of board-certified specialists and find the perfect match for your health needs.
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar" role="search">

        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

      </div>

      {/* Doctor Cards */}
      <div className="doctors-grid">

        {doctors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            No doctors found
          </div>
        ) : (

          doctors.map((doctor) => (

            <article key={doctor.id} className="doctor-card">

              <div className="doctor-name">
                {doctor.user?.full_name}
              </div>

              <div className="doctor-specialty">
                {doctor.specialization}
              </div>

              <div className="stars">
                {renderStars(doctor.rating || 4.5)}
              </div>

              <button className="btn-book">
                Book Now
              </button>

            </article>

          ))

        )}

      </div>

      {/* Pagination UI (simple) */}

      <div style={{ textAlign: "center", marginTop: "20px" }}>

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>

      </div>

    </section>
  );
};

export default FindDoctor;