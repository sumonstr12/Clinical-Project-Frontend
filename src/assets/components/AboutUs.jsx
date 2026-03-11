import React from "react";

const trust = [
  { icon: "fas fa-shield-alt", text: "HIPAA Compliant & Secure" },
  { icon: "fas fa-award", text: "Accredited Healthcare System" },
  { icon: "fas fa-star", text: "4.9★ Patient Rating" },
  { icon: "fas fa-clock", text: "24/7 Patient Support" },
  { icon: "fas fa-user-md", text: "Board-Certified Doctors" },
  { icon: "fas fa-globe", text: "Telehealth Nationwide" },
];

const values = [
  { label: "Patient Satisfaction", pct: 98 },
  { label: "Treatment Success Rate", pct: 94 },
  { label: "On-time Appointments", pct: 97 },
  { label: "Doctor Availability", pct: 92 },
];

const AboutUs = () => {
  return (
    <section className="section-full" id="about" aria-label="About Us">
      <div className="section-inner">
        <div className="about-container">
          {/* Visual Side */}
          <div className="about-visual" aria-hidden="true">
            <div className="about-image-box">
              <span style={{ fontSize: "8rem", zIndex: 1, position: "relative" }}>🏥</span>
              <div className="about-badge-float b1">
                <span className="badge-icon">⭐</span>
                <div>
                  <strong style={{ fontSize: "0.9rem" }}>4.9 / 5</strong>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Overall Rating</div>
                </div>
              </div>
              <div className="about-badge-float b2">
                <span className="badge-icon">👥</span>
                <div>
                  <strong style={{ fontSize: "0.9rem" }}>50,000+</strong>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>Patients Served</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="about-text">
            <span className="section-eyebrow">Our Story</span>
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Committed to Your <span style={{ color: "var(--teal)" }}>Wellbeing</span>
            </h2>

            <p className="mission">
              Founded in 2010, ClinicCare has been at the forefront of transforming healthcare delivery.
              Our mission is to make high-quality, compassionate healthcare accessible to everyone —
              regardless of where they are. We believe that exceptional care begins with exceptional people,
              which is why we partner only with board-certified, highly-rated specialists who share our
              commitment to patient-centered care.
            </p>

            <p className="mission" style={{ marginTop: "-1rem" }}>
              From routine check-ups to complex specialist consultations, we connect patients with the
              right doctors at the right time. Our platform combines cutting-edge technology with a human
              touch, ensuring every patient feels heard, supported, and cared for.
            </p>

            {/* Trust items */}
            <div className="trust-items" role="list" aria-label="Trust highlights">
              {trust.map((t) => (
                <div key={t.text} className="trust-item" role="listitem">
                  <i className={t.icon} aria-hidden="true"></i>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>

            {/* Value bars */}
            <div className="values-list" aria-label="Performance metrics">
              {values.map((v) => (
                <div key={v.label} className="value-bar">
                  <div className="bar-label">
                    <span>{v.label}</span>
                    <span style={{ color: "var(--teal)", fontWeight: 600 }}>{v.pct}%</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${v.pct}%` }} aria-valuenow={v.pct} aria-valuemin={0} aria-valuemax={100} role="progressbar" aria-label={v.label}></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button className="btn-primary" aria-label="Learn more about our mission" style={{ fontSize: "0.88rem", padding: "0.75rem 1.5rem" }}>
                <i className="fas fa-info-circle" aria-hidden="true"></i> Our Mission
              </button>
              <button className="btn-secondary" aria-label="Meet our team" style={{ fontSize: "0.88rem", padding: "0.75rem 1.5rem" }}>
                <i className="fas fa-users" aria-hidden="true"></i> Meet the Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;