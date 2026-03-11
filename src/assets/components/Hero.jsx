import React from "react";

const Hero = ({ onNav }) => {
  return (
    <section className="hero" id="home" aria-label="Hero Section">
      <div className="hero-bg" aria-hidden="true"></div>
      <div className="hero-grid" aria-hidden="true"></div>
      <div className="hero-orb hero-orb-1" aria-hidden="true"></div>
      <div className="hero-orb hero-orb-2" aria-hidden="true"></div>

      <div className="hero-content">
        <div className="hero-badge" role="status">
          <span className="dot" aria-hidden="true"></span>
          Now Accepting New Patients — 24/7 Available
        </div>

        <h1 className="hero-title">
          Your Health,{" "}
          <span className="highlight">Our Priority</span>
        </h1>

        <p className="hero-subtitle">
          Connect with trusted, board-certified doctors and book appointments
          instantly. Quality healthcare made simple, fast, and accessible.
        </p>

        <div className="hero-buttons">
          <button
            className="btn-primary"
            onClick={() => onNav("find-doctor")}
            aria-label="Find a Doctor"
          >
            <i className="fas fa-user-md" aria-hidden="true"></i>
            Find a Doctor
          </button>
          <button
            className="btn-secondary"
            onClick={() => onNav("appointment")}
            aria-label="Book Appointment"
          >
            <i className="fas fa-calendar-check" aria-hidden="true"></i>
            Book Appointment
          </button>
        </div>

        <div className="hero-stats" role="list" aria-label="Key Statistics">
          <div className="stat-item" role="listitem">
            <span className="stat-number">500+</span>
            <span className="stat-label">Specialist Doctors</span>
          </div>
          <div className="hero-divider" aria-hidden="true"></div>
          <div className="stat-item" role="listitem">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Happy Patients</span>
          </div>
          <div className="hero-divider" aria-hidden="true"></div>
          <div className="stat-item" role="listitem">
            <span className="stat-number">98%</span>
            <span className="stat-label">Satisfaction Rate</span>
          </div>
          <div className="hero-divider" aria-hidden="true"></div>
          <div className="stat-item" role="listitem">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Emergency Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;