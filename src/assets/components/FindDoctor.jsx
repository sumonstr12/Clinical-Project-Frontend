import React, { useState } from "react";

const doctors = [
  { id: 1, name: "Dr. Sarah Mitchell", specialty: "Cardiologist", rating: 4.9, reviews: 312, experience: "15 yrs", patients: "4.2K", available: true, icon: "🫀", color: "#e53e3e" },
  { id: 2, name: "Dr. James Nguyen", specialty: "Neurologist", rating: 4.8, reviews: 274, experience: "12 yrs", patients: "3.8K", available: true, icon: "🧠", color: "#805ad5" },
  { id: 3, name: "Dr. Amina Hassan", specialty: "Pediatrician", rating: 4.9, reviews: 398, experience: "10 yrs", patients: "5.1K", available: false, icon: "🧸", color: "#d69e2e" },
  { id: 4, name: "Dr. Robert Chen", specialty: "Orthopedist", rating: 4.7, reviews: 189, experience: "18 yrs", patients: "6.0K", available: true, icon: "🦴", color: "#2d9cdb" },
  { id: 5, name: "Dr. Priya Sharma", specialty: "Dermatologist", rating: 4.8, reviews: 231, experience: "9 yrs", patients: "3.2K", available: true, icon: "✨", color: "#e91e8c" },
  { id: 6, name: "Dr. Marcus Lee", specialty: "Ophthalmologist", rating: 4.6, reviews: 156, experience: "14 yrs", patients: "2.9K", available: true, icon: "👁️", color: "#00bfa5" },
  { id: 7, name: "Dr. Elena Voss", specialty: "Psychiatrist", rating: 4.9, reviews: 287, experience: "11 yrs", patients: "2.1K", available: false, icon: "🧩", color: "#6366f1" },
  { id: 8, name: "Dr. Omar Khalid", specialty: "Endocrinologist", rating: 4.7, reviews: 203, experience: "16 yrs", patients: "3.5K", available: true, icon: "⚗️", color: "#38a169" },
];

const specialties = ["All Specialties", "Cardiologist", "Neurologist", "Pediatrician", "Orthopedist", "Dermatologist", "Ophthalmologist", "Psychiatrist", "Endocrinologist"];

const FindDoctor = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Specialties");

  const filtered = doctors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All Specialties" || d.specialty === filter;
    return matchSearch && matchFilter;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={i < Math.floor(rating) ? "fas fa-star" : i < rating ? "fas fa-star-half-alt" : "far fa-star"}
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
      <div className="search-bar" role="search" aria-label="Search Doctors">
        <i className="fas fa-search" aria-hidden="true" style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}></i>
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search doctors"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter by specialty"
        >
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button className="search-btn" aria-label="Search">
          <i className="fas fa-search" aria-hidden="true"></i>
          Search
        </button>
      </div>

      {/* Doctor Cards */}
      <div className="doctors-grid" role="list" aria-label="Doctor listings">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
            <i className="fas fa-user-md" style={{ fontSize: "3rem", marginBottom: "1rem", display: "block", color: "var(--text-muted)" }}></i>
            No doctors found matching your search.
          </div>
        ) : (
          filtered.map((doctor) => (
            <article key={doctor.id} className="doctor-card" role="listitem" aria-label={`${doctor.name}, ${doctor.specialty}`}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <div
                  className="doctor-avatar-icon"
                  style={{ background: `linear-gradient(135deg, ${doctor.color}22, ${doctor.color}44)`, border: `2px solid ${doctor.color}55` }}
                  aria-hidden="true"
                >
                  <span style={{ fontSize: "2.2rem" }}>{doctor.icon}</span>
                </div>
                {doctor.available && (
                  <div className="doctor-available" title="Available Now" aria-label="Available now"></div>
                )}
              </div>

              <div className="doctor-name">{doctor.name}</div>
              <div className="doctor-specialty" style={{ color: doctor.color }}>{doctor.specialty}</div>

              <div className="stars" aria-label={`Rating: ${doctor.rating} out of 5`}>
                {renderStars(doctor.rating)}
              </div>
              <div className="rating-text">{doctor.rating} ({doctor.reviews} reviews)</div>

              <div className="doctor-info">
                <span><i className="fas fa-briefcase" aria-hidden="true"></i> {doctor.experience}</span>
                <span><i className="fas fa-users" aria-hidden="true"></i> {doctor.patients}</span>
                <span style={{ color: doctor.available ? "#4caf50" : "var(--text-muted)" }}>
                  <i className={`fas fa-circle`} style={{ fontSize: "0.5rem" }} aria-hidden="true"></i>
                  {doctor.available ? " Available" : " Busy"}
                </span>
              </div>

              <button
                className="btn-book"
                disabled={!doctor.available}
                style={{ opacity: doctor.available ? 1 : 0.6, cursor: doctor.available ? "pointer" : "not-allowed" }}
                aria-label={`Book appointment with ${doctor.name}`}
              >
                {doctor.available ? "Book Now" : "Currently Unavailable"}
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default FindDoctor;