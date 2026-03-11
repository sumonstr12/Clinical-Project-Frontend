import React from "react";
import { useNavigate } from "react-router";

import '../css/component_css/notfound.css'

const NotFound = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  const goToFindDoctor = () => {
    navigate('/find-doctor');
  };

  return (
    <div className="notfound-container">
      {/* Background Effects */}
      <div className="notfound-bg" aria-hidden="true"></div>
      <div className="notfound-grid" aria-hidden="true"></div>
      
      {/* Floating medical elements */}
      <div className="notfound-floating-elements">
        <div className="floating-element pulse">❤️</div>
        <div className="floating-element heartbeat">🩺</div>
        <div className="floating-element cross">✚</div>
        <div className="floating-element pill">💊</div>
        <div className="floating-element syringe">💉</div>
        <div className="floating-element ambulance">🚑</div>
        <div className="floating-element stethoscope">🩺</div>
        <div className="floating-element thermometer">🌡️</div>
      </div>

      {/* Main Content */}
      <div className="notfound-wrapper">
        {/* Left Side - 404 Illustration */}
        <div className="notfound-illustration-side">
          <div className="notfound-illustration">
            {/* 3D Numbers */}
            <div className="notfound-3d-numbers">
              <div className="number-3d number-4">4</div>
              <div className="number-3d number-0">0</div>
              <div className="number-3d number-4 second">4</div>
            </div>

            {/* Medical Equipment Illustration */}
            <div className="medical-equipment">
              <div className="equipment-item stethoscope-404">
                <i className="fas fa-stethoscope"></i>
              </div>
              <div className="equipment-item heartbeat-404">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="equipment-item syringe-404">
                <i className="fas fa-syringe"></i>
              </div>
              <div className="equipment-item pills-404">
                <i className="fas fa-pills"></i>
              </div>
              <div className="equipment-item hospital-404">
                <i className="fas fa-hospital"></i>
              </div>
              <div className="equipment-item ambulance-404">
                <i className="fas fa-ambulance"></i>
              </div>
            </div>

            {/* Broken Heart Animation */}
            <div className="broken-heart-container">
              <div className="heart heart-beat">
                <i className="fas fa-heart"></i>
              </div>
              <div className="heart heart-broken">
                <i className="fas fa-heart-broken"></i>
              </div>
            </div>

            {/* Pulse Line Animation */}
            <div className="pulse-line">
              <svg width="200" height="60" viewBox="0 0 200 60">
                <path 
                  d="M0 30 L20 30 L25 10 L30 50 L35 20 L40 40 L45 25 L50 35 L55 28 L60 32 L65 30 L80 30 L85 45 L90 15 L95 40 L100 25 L105 35 L110 20 L115 45 L120 30 L140 30 L145 25 L150 35 L155 28 L160 32 L165 30 L180 30 L185 15 L190 45 L195 25 L200 30" 
                  fill="none" 
                  stroke="var(--teal)" 
                  strokeWidth="3"
                  strokeDasharray="400"
                  strokeDashoffset="400"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="400;0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side - Error Message */}
        <div className="notfound-content-side">
          <div className="notfound-content-container">
            {/* Logo */}
            <div className="notfound-logo">
              <div className="logo-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <span className="logo-text">ClinicCare</span>
            </div>

            {/* Error Code */}
            <div className="notfound-code">
              <span className="code-digit">4</span>
              <span className="code-digit zero">0</span>
              <span className="code-digit">4</span>
            </div>

            {/* Error Message */}
            <h1 className="notfound-title">Page Not Found</h1>
            
            <div className="notfound-message">
              <p>
                Oops! It seems the page you're looking for has gone for a check-up 
                or might have been moved to another department.
              </p>
              <div className="medical-analogy">
                <div className="analogy-item">
                  <span className="analogy-icon">🔍</span>
                  <span>Like a misdiagnosis, we couldn't find what you're looking for</span>
                </div>
                <div className="analogy-item">
                  <span className="analogy-icon">🏥</span>
                  <span>The page might be in another waiting room</span>
                </div>
                <div className="analogy-item">
                  <span className="analogy-icon">📋</span>
                  <span>Our medical records don't have this page on file</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="notfound-actions">
              <button className="btn-primary" onClick={goToHome}>
                <i className="fas fa-home"></i>
                Return to Home
              </button>
              <button className="btn-secondary" onClick={goToFindDoctor}>
                <i className="fas fa-user-md"></i>
                Find a Doctor
              </button>
            </div>

            {/* Helpful Links */}
            <div className="notfound-links">
              <h3>You might be looking for:</h3>
              <div className="helpful-links-grid">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/appointment'); }}>
                  <i className="fas fa-calendar-check"></i>
                  Book Appointment
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/services'); }}>
                  <i className="fas fa-stethoscope"></i>
                  Our Services
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>
                  <i className="fas fa-phone-alt"></i>
                  Contact Us
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about-us'); }}>
                  <i className="fas fa-info-circle"></i>
                  About Us
                </a>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="notfound-emergency">
              <i className="fas fa-ambulance"></i>
              <span>Need immediate assistance? Call our 24/7 helpline: </span>
              <strong>+1 (800) 911-CARE</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;