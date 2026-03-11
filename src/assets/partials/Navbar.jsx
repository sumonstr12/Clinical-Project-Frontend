import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();


  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('userData');
    const full_name = localStorage.getItem('f_n')
    
    if (token || user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    }
  }, []);

  const gotToHome = () => {
    navigate('/');
    setMobileOpen(false);
  };

  const goToFindDoctor = () => {
    navigate('/find-doctor');
    setMobileOpen(false);
  };

  const goToSignUp = () => {
    navigate("/patient/signup");
    setMobileOpen(false);
  };

  const goToLogin = () => {
    navigate("/patient/login");
    setMobileOpen(false);
  };

  const goToAppointment = () => {
    navigate('/appointment');
    setMobileOpen(false);
  };

  const goToContact = () => {
    navigate('/contact');
    setMobileOpen(false);
  };

  const goToService = () => {
    navigate('/service');
    setMobileOpen(false);
  };

  const goToAboutUs = () => {
    navigate('/about-us');
    setMobileOpen(false);
  };

  const goToProfile = () => {
    navigate('/patient/profile');
    setShowProfileMenu(false);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('rememberMe');
    
    // Update state
    setIsLoggedIn(false);
    setUserData(null);
    setShowProfileMenu(false);
    setMobileOpen(false);
    
    // Navigate to home
    navigate('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userData?.full_name) {
      const names = userData.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main Navigation">
        
        {/* Logo */}
        <div className="nav-logo" onClick={gotToHome} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <i className="fas fa-heartbeat"></i>
          </div>
          <div>
            <span className="logo-text">ClinicCare</span>
            <span className="logo-sub">Healthcare System</span>
          </div>
        </div>

        {/* Nav Links */}
        <ul className="nav-links" role="menubar">
          <li><button onClick={gotToHome}>Home</button></li>
          <li><button onClick={goToFindDoctor}>Find Doctor</button></li>
          <li><button onClick={goToAppointment}>Get Appointment</button></li>
          <li><button onClick={goToService}>Services</button></li>
          <li><button onClick={goToAboutUs}>About Us</button></li>
          <li><button onClick={goToContact}>Contact</button></li>
        </ul>

        {/* Auth Buttons - Desktop */}
        <div className="nav-auth">
          {!isLoggedIn ? (
            <>
              <button className="btn-signin" onClick={goToSignUp}>Sign Up</button>
              <button className="btn-login" onClick={goToLogin}>Login</button>
            </>
          ) : (
            <div className="profile-menu-container">
              <button 
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  {userData?.profile_image ? (
                    <img src={userData.profile_image} alt="Profile" />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <span className="profile-name">
                  {userData?.full_name?.split(' ')[0] || 'User'}
                </span>
                <i className={`fas fa-chevron-${showProfileMenu ? 'up' : 'down'}`}></i>
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <button onClick={goToProfile}>
                    <i className="fas fa-user"></i>
                    My Profile
                  </button>
                  <button onClick={goToAppointment}>
                    <i className="fas fa-calendar-check"></i>
                    My Appointments
                  </button>
                  <button onClick={() => navigate('/patient/settings')}>
                    <i className="fas fa-cog"></i>
                    Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`nav-mobile ${mobileOpen ? "open" : ""}`}>
        <button onClick={gotToHome}>Home</button>
        <button onClick={goToFindDoctor}>Find Doctor</button>
        <button onClick={goToAppointment}>Get Appointment</button>
        <button onClick={goToService}>Services</button>
        <button onClick={goToAboutUs}>About Us</button>
        <button onClick={goToContact}>Contact</button>

        <div className="mobile-auth">
          {!isLoggedIn ? (
            <>
              <button className="btn-signin" style={{ flex: 1 }} onClick={goToSignUp}>Sign Up</button>
              <button className="btn-login" style={{ flex: 1 }} onClick={goToLogin}>Login</button>
            </>
          ) : (
            <div className="mobile-profile-section">
              <div className="mobile-profile-header">
                <div className="mobile-profile-avatar">
                  {userData?.profile_image ? (
                    <img src={userData.profile_image} alt="Profile" />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <div className="mobile-profile-info">
                  <span className="mobile-profile-name">{userData?.full_name || 'User'}</span>
                  <span className="mobile-profile-email">{userData?.email || ''}</span>
                </div>
              </div>
              <button className="mobile-profile-btn" onClick={goToProfile}>
                <i className="fas fa-user"></i> Profile
              </button>
              <button className="mobile-profile-btn" onClick={goToAppointment}>
                <i className="fas fa-calendar-check"></i> My Appointments
              </button>
              <button className="mobile-profile-btn" onClick={() => navigate('/patient/settings')}>
                <i className="fas fa-cog"></i> Settings
              </button>
              <button className="mobile-logout-btn" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;