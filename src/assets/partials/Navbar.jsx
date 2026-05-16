import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Cookies from 'js-cookie';
import myaxios from "../utilities/myaxios";
import { successToast } from "../utilities/toast";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  const userRole = userData?.role?.toUpperCase();


  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('userData');
    const role = user ? JSON.parse(user).role : null;
    console.log("Navbar - User role from localStorage:", role);
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

  const goToUserAppointments = () => {
    navigate('/users/appointments');
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
    navigate('/user-profile');
    setShowProfileMenu(false);
    setMobileOpen(false);
  };

  const handleLogout = async () => {

    try {

      const response =
        await myaxios.post("user-logout");

      if (response?.data?.status) {
        successToast(
          response.data.message ||
          "Logged out successfully!"
        );
      }

    } catch (error) {

      console.log("Logout API error:", error);

    } finally {

    
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("role");

      
      Cookies.remove("refresh_token");

      
      setIsLoggedIn(false);
      setUserData(null);
      setShowProfileMenu(false);
      setMobileOpen(false);

      
      navigate("/", { replace: true });

    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    // console.log("User full name:", userData.full_name);
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
                  <button onClick={goToUserAppointments}>
                    <i className="fas fa-calendar-check"></i>
                    My Appointments
                  </button>
                  {userRole === "PATIENT" ? (
                    <button onClick={() => navigate('/patient/caregiver-requests')}>
                      <i className="fas fa-user-nurse"></i>
                      Caregiver Requests
                    </button>
                  ) : (
                    <button onClick={() => navigate('/settings')}>
                      <i className="fas fa-cog"></i>
                      Settings
                    </button>
                  )}
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
              {userRole === "PATIENT" ? (
                <button
                  className="mobile-profile-btn"
                  onClick={() => navigate('/patient/caregiver-requests')}
                >
                  <i className="fas fa-user-nurse"></i> Caregiver Requests
                </button>
              ) : (
                <button
                  className="mobile-profile-btn"
                  onClick={() => navigate('/settings')}
                >
                  <i className="fas fa-cog"></i> Settings
                </button>
              )}
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