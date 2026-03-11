import React from "react";

const services = [
  {
    icon: "🩺",
    color: "#00bfa5",
    bg: "rgba(0,191,165,0.1)",
    title: "General Consultation",
    desc: "Comprehensive health assessments, routine check-ups, and personalized treatment plans from experienced general practitioners.",
  },
  {
    icon: "🧸",
    color: "#d69e2e",
    bg: "rgba(214,158,46,0.1)",
    title: "Pediatrics",
    desc: "Specialized medical care for infants, children, and adolescents. Vaccinations, developmental checks, and pediatric treatments.",
  },
  {
    icon: "🫀",
    color: "#e53e3e",
    bg: "rgba(229,62,62,0.1)",
    title: "Cardiology",
    desc: "Expert diagnosis and treatment of heart conditions. ECG, echocardiography, stress tests, and cardiac rehabilitation programs.",
  },
  {
    icon: "🔬",
    color: "#2d9cdb",
    bg: "rgba(45,156,219,0.1)",
    title: "Diagnostics",
    desc: "Advanced laboratory testing, MRI, CT scans, X-rays, and pathology services for accurate and timely medical diagnoses.",
  },
  {
    icon: "🚑",
    color: "#e91e8c",
    bg: "rgba(233,30,140,0.1)",
    title: "Emergency Care",
    desc: "Round-the-clock emergency medical services with rapid response teams, trauma care, and critical care specialists.",
  },
  {
    icon: "🧠",
    color: "#805ad5",
    bg: "rgba(128,90,213,0.1)",
    title: "Neurology",
    desc: "Diagnosis and treatment of neurological disorders including stroke, epilepsy, migraines, and neurodegenerative diseases.",
  },
  {
    icon: "✨",
    color: "#e91e63",
    bg: "rgba(233,30,99,0.1)",
    title: "Dermatology",
    desc: "Comprehensive skin care including acne treatment, skin cancer screening, cosmetic dermatology, and laser therapies.",
  },
  {
    icon: "🦴",
    color: "#38a169",
    bg: "rgba(56,161,105,0.1)",
    title: "Orthopedics",
    desc: "Expert care for bone, joint, and muscle conditions. Sports injuries, joint replacement, physiotherapy, and rehabilitation.",
  },
  {
    icon: "🧘",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
    title: "Mental Health",
    desc: "Compassionate psychiatric care and therapy for anxiety, depression, PTSD, and other mental health conditions.",
  },
  {
    icon: "👁️",
    color: "#0288d1",
    bg: "rgba(2,136,209,0.1)",
    title: "Ophthalmology",
    desc: "Complete eye care services, vision correction, cataract surgery, glaucoma treatment, and retinal care.",
  },
];

const Services = () => {
  return (
    <section className="section" id="services" aria-label="Our Services">
      <div className="section-header">
        <span className="section-eyebrow">What We Offer</span>
        <h2 className="section-title">Our Medical Services</h2>
        <p className="section-desc">
          We provide a comprehensive range of healthcare services delivered by specialists dedicated to your wellbeing.
        </p>
      </div>

      <div className="services-grid" role="list" aria-label="Available medical services">
        {services.map((svc) => (
          <article
            key={svc.title}
            className="service-card"
            role="listitem"
            aria-label={svc.title}
          >
            <div
              className="service-icon"
              style={{ background: svc.bg, border: `1px solid ${svc.color}33` }}
              aria-hidden="true"
            >
              <span style={{ fontSize: "2rem" }}>{svc.icon}</span>
            </div>
            <h3>{svc.title}</h3>
            <p>{svc.desc}</p>
            <button
              className="service-link"
              onClick={() => onBook(svc.title)}
              aria-label={`Learn more about ${svc.title}`}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
            >
              Learn More <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Services;