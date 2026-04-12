import React, { useState } from "react";
import { earlierUpdate } from "../utilities/updateToast";

const socialLinks = [
  { icon: "fab fa-facebook-f", label: "Facebook" },
  { icon: "fab fa-twitter", label: "Twitter" },
  { icon: "fab fa-instagram", label: "Instagram" },
  { icon: "fab fa-linkedin-in", label: "LinkedIn" },
  { icon: "fab fa-youtube", label: "YouTube" },
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
  "General Consultation",
  "Pediatrics",
  "Cardiology",
  "Neurology",
  "Diagnostics",
  "Emergency Care",
];

const legal = [
  { label: "Privacy Policy" },
  { label: "Terms of Service" },
  { label: "Cookie Policy" },
  { label: "HIPAA Notice" },
  { label: "Accessibility" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      earlierUpdate("🔑 Newsletter coming soon!");
      setEmail("");
    }
  };

  return (
    <footer className="footer" role="contentinfo" aria-label="Site Footer">
      <div className="footer-inner">
        <div className="footer-top">

          <div className="footer-brand">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "0.75rem",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, var(--teal), #0288d1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  color: "#fff",
                }}
                aria-hidden="true"
              >
                <i className="fas fa-heartbeat" />
              </div>
              <span className="logo-text-footer">
                ClinicCare
              </span>
            </div>

            <p>
              Connecting patients with trusted healthcare professionals.
              Quality care made accessible, anywhere, anytime.
            </p>

            <form
              className="newsletter-form"
              onSubmit={handleSubscribe}
              aria-label="Newsletter subscription"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                aria-label="Email address for newsletter"
                required
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
              >
                Subscribe
              </button>
            </form>

            {/* Social Icons FIXED */}
            <div
              className="social-icons"
              role="list"
              aria-label="Social media links"
            >
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="social-icon"
                  role="listitem"
                  aria-label={s.label}
                  onClick={(e) => {
                    e.preventDefault();
                    earlierUpdate(
                      ` ${s.label} coming soon!`
                    );
                  }}
                >
                  <i
                    className={s.icon}
                    aria-hidden="true"
                  />
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
                  <button
                    onClick={() =>
                      earlierUpdate(
                        ` ${l.label} coming soon!`
                      )
                    }
                    aria-label={`Navigate to ${l.label}`}
                  >
                    <i
                      className="fas fa-chevron-right"
                      aria-hidden="true"
                      style={{
                        fontSize: "0.65rem",
                        marginRight: "0.4rem",
                        color: "var(--teal)",
                      }}
                    />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services FIXED */}
          <div className="footer-col">
            <h4>Our Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      earlierUpdate(
                        ` ${s} coming soon!`
                      );
                    }}
                    aria-label={s}
                  >
                    <i
                      className="fas fa-chevron-right"
                      aria-hidden="true"
                      style={{
                        fontSize: "0.65rem",
                        marginRight: "0.4rem",
                        color: "var(--teal)",
                      }}
                    />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal FIXED */}
          <div className="footer-col">
            <h4>Legal & Info</h4>
            <ul>
              {legal.map((l) => (
                <li key={l.label}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      earlierUpdate(
                        ` ${l.label} coming soon!`
                      );
                    }}
                    aria-label={l.label}
                  >
                    <i
                      className="fas fa-chevron-right"
                      aria-hidden="true"
                      style={{
                        fontSize: "0.65rem",
                        marginRight: "0.4rem",
                        color: "var(--teal)",
                      }}
                    />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                }}
              >
                <i
                  className="fas fa-phone-alt"
                  aria-hidden="true"
                  style={{ color: "var(--teal)" }}
                />
                +1 (800) 555-CARE
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                }}
              >
                <i
                  className="fas fa-envelope"
                  aria-hidden="true"
                  style={{ color: "var(--teal)" }}
                />
                support@cliniccare.com
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom FIXED */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} ClinicCare
            Healthcare System. All rights reserved.
          </p>

          <div className="footer-links">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Cookie Policy",
            ].map((label) => (
              <a
                key={label}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  earlierUpdate(
                    ` ${label} coming soon!`
                  );
                }}
                aria-label={label}
              >
                {label}
              </a>
            ))}
          </div>

          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            Made with{" "}
            <span style={{ color: "#e53e3e" }}>
              ❤️
            </span>{" "}
            for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}