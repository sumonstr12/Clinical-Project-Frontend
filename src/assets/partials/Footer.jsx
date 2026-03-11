import React, { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe();
      setEmail("");
    }
  };

  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#", label: "Facebook" },
    { icon: "fab fa-twitter", href: "#", label: "Twitter" },
    { icon: "fab fa-instagram", href: "#", label: "Instagram" },
    { icon: "fab fa-linkedin-in", href: "#", label: "LinkedIn" },
    { icon: "fab fa-youtube", href: "#", label: "YouTube" },
  ];

  const quickLinks = [
    { label: "Home", id: "home" },
    { label: "Find Doctor", id: "find-doctor" },
    { label: "Get Appointment", id: "appointment" },
    { label: "Services", id: "services" },
    { label: "About Us", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  const services = [
    "General Consultation", "Pediatrics", "Cardiology",
    "Neurology", "Diagnostics", "Emergency Care",
  ];

  const legal = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "HIPAA Notice", href: "#" },
    { label: "Accessibility", href: "#" },
  ];

  return (
    <footer className="footer" role="contentinfo" aria-label="Site Footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: "linear-gradient(135deg, var(--teal), #0288d1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", color: "#fff"
              }} aria-hidden="true">
                <i className="fas fa-heartbeat"></i>
              </div>
              <span className="logo-text-footer">ClinicCare</span>
            </div>
            <p>
              Connecting patients with trusted healthcare professionals.
              Quality care made accessible, anywhere, anytime.
            </p>

            {/* Newsletter */}
            <form className="newsletter-form" onSubmit={handleSubscribe} aria-label="Newsletter subscription">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address for newsletter"
                required
              />
              <button type="submit" aria-label="Subscribe to newsletter">Subscribe</button>
            </form>

            {/* Social Icons */}
            <div className="social-icons" role="list" aria-label="Social media links">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="social-icon"
                  role="listitem"
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={s.icon} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((l) => (
                <li key={l.id}>
                  <button onClick={() => onNav(l.id)} aria-label={`Navigate to ${l.label}`}>
                    <i className="fas fa-chevron-right" aria-hidden="true" style={{ fontSize: "0.65rem", marginRight: "0.4rem", color: "var(--teal)" }}></i>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Our Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s}>
                  <a href="#" onClick={(e) => e.preventDefault()} aria-label={s}>
                    <i className="fas fa-chevron-right" aria-hidden="true" style={{ fontSize: "0.65rem", marginRight: "0.4rem", color: "var(--teal)" }}></i>
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Contact */}
          <div className="footer-col">
            <h4>Legal & Info</h4>
            <ul>
              {legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} aria-label={l.label}>
                    <i className="fas fa-chevron-right" aria-hidden="true" style={{ fontSize: "0.65rem", marginRight: "0.4rem", color: "var(--teal)" }}></i>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                <i className="fas fa-phone-alt" aria-hidden="true" style={{ color: "var(--teal)" }}></i>
                +1 (800) 555-CARE
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                <i className="fas fa-envelope" aria-hidden="true" style={{ color: "var(--teal)" }}></i>
                support@cliniccare.com
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ClinicCare Healthcare System. All rights reserved.</p>
          <div className="footer-links">
            <a href="#" aria-label="Privacy Policy">Privacy Policy</a>
            <a href="#" aria-label="Terms of Service">Terms of Service</a>
            <a href="#" aria-label="Cookie Policy">Cookie Policy</a>
          </div>
          <p style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            Made with <span style={{ color: "#e53e3e" }}>❤️</span> for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;