import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../../App.css";
import Navbar from "../../partials/Navbar";
import Hero from "../../components/Hero";
import FindDoctor from "../../components/FindDoctor";
import Appointment from "../../components/Appointment";
import Services from "../../components/Services";
import AboutUs from "../../components/AboutUs";
import Contact from "../../components/Contact";
import Footer from "../../partials/Footer";

import { useNavigate } from "react-router";

import { successToast, errorToast } from "../../utilities/toast";
// import Toast from "../../utilities/Toast";

const Home = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [toasts, setToasts] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const toastCounter = useRef(0);

  // Scroll detection for active section & scroll-to-top
  useEffect(() => {
    const sectionIds = ["home", "find-doctor", "appointment", "services", "about", "contact"];

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      const scrollPos = window.scrollY + 120;
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = useCallback((message, icon = "fas fa-check-circle") => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const navigateTo = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 75;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setActiveSection(sectionId);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="app" role="main">
      {/* Navigation */}
      <Navbar activeSection={activeSection} onNav={navigateTo} />

      {/* Hero */}
      <Hero onNav={navigateTo} />

      <FindDoctor />

      <Appointment />

      {/* Services */}
      <Services />

      {/* About Us */}
      <AboutUs />

      {/* Contact */}
      <Contact
        onSubmit={() => showToast("Message sent! We'll get back to you within 24 hours.", "fas fa-paper-plane")}
      />

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <div role="alert" aria-live="polite" aria-atomic="true" style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <i className={toast.icon} aria-hidden="true"></i>
            {toast.message}
          </div>
        ))}
      </div>

      {/* Scroll to Top */}
      <button
        className={`scroll-top${showScrollTop ? " visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <i className="fas fa-chevron-up" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default Home