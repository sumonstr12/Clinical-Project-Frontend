import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import myaxios from '../utilities/myaxios';
import { successToast } from '../utilities/toast';
import Cookies from 'js-cookie';

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'appointments',
    label: 'Appointments',
    path: '/appointments',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 'patients',
    label: 'Patients',
    path: '/patients',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'prescriptions',
    label: 'Prescriptions',
    path: '/prescriptions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);
  const [userData, setUserData] = useState(null);

  const getActiveTab = () => {
    const activeItem = menuItems.find((item) => item.path === location.pathname);
    return activeItem ? activeItem.id : 'dashboard';
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleProfile = () => {
    alert('Profile clicked');
    navigate('/profile');
    setShowProfileMenu(false);
  };

  const activeTab = getActiveTab();

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

      
      setUserData(null);
      setShowProfileMenu(false);
      setMobileOpen(false);

      
      navigate("/doctor/login", { replace: true });

    }
  };


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');

        .sidebar-root * { font-family: 'DM Sans', sans-serif; }
        .sidebar-logo-text { font-family: 'Syne', sans-serif; }

        .sidebar-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 248px;
          height: 100vh;
          background: #0d0f14;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          z-index: 999;
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
          overflow: visible;
        }

        .sidebar-mobile-hidden {
          transform: translateX(-100%);
        }

        @media (min-width: 1024px) {
          .sidebar-root {
            position: relative;
            transform: none !important;
          }
        }

        .sidebar-logo {
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #3b7cf4 0%, #1d53c9 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(59,124,244,0.35);
        }

        .sidebar-logo-title {
          font-size: 15px;
          font-weight: 700;
          color: #f0f2f8;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .sidebar-logo-sub {
          font-size: 11px;
          color: #4b5270;
          font-weight: 400;
          margin-top: 1px;
          letter-spacing: 0.02em;
        }

        .sidebar-nav {
          flex: 1;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
          overflow-x: visible;
        }
        .sidebar-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #353a52;
          padding: 8px 8px 4px;
          margin-top: 6px;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 12px;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.18s ease;
          color: #5a6182;
          font-size: 13.5px;
          font-weight: 500;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          position: relative;
        }

        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: #9ba3c4;
        }

        .sidebar-nav-item.active {
          background: rgba(59,124,244,0.12);
          color: #6b9fff;
        }

        .sidebar-nav-item.active .nav-icon {
          color: #4d8aff;
        }

        .sidebar-nav-item .active-bar {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: #3b7cf4;
          border-radius: 3px 0 0 3px;
        }

        .nav-icon {
          flex-shrink: 0;
          transition: color 0.18s;
        }

        .sidebar-footer {
          padding: 12px;
          border-top: 1px solid rgba(255,255,255,0.05);
          position: relative;
          margin-top: auto;
          overflow: visible;
        }

        .profile-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          transition: all 0.18s ease;
          position: relative;
        }

        .profile-btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }

        .profile-avatar {
          width: 34px;
          height: 34px;
          background: linear-gradient(135deg, #1e9e6e 0%, #0d7a52 100%);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #d2f5e8;
          flex-shrink: 0;
          letter-spacing: 0.04em;
        }

        .profile-name {
          font-size: 13px;
          font-weight: 600;
          color: #dde1f0;
          line-height: 1.2;
        }

        .profile-role {
          font-size: 11px;
          color: #454c69;
          margin-top: 1px;
        }

        .profile-chevron {
          margin-left: auto;
          color: #3a4160;
          transition: transform 0.2s cubic-bezier(.4,0,.2,1);
          display: block;
        }

        .profile-chevron.rotated {
          transform: rotate(180deg);
        }

        .profile-dropdown {
          position: absolute;
          bottom: 100%; /* Changed from bottom: calc(100% + 8px) */
          left: 12px;
          right: 12px;
          margin-bottom: 8px; /* Add this for spacing */
          background: #13161f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 -8px 32px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3);
          z-index: 1000; /* Increase z-index */
          animation: slideUp 0.2s cubic-bezier(.4,0,.2,1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          color: #8a93b8;
        }

        .dropdown-item:hover {
          background: rgba(255,255,255,0.05);
          color: #c0c8e8;
        }

        .dropdown-item svg {
          flex-shrink: 0;
        }

        .dropdown-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 4px 0;
        }

        .logout-item {
          color: #e05c5c;
        }

        .logout-item:hover {
          background: rgba(220,60,60,0.08);
          color: #ff7a7a;
        }

        .mobile-toggle {
          display: none;
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 50;
          background: #13161f;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 8px;
          cursor: pointer;
          color: #8a93b8;
        }

        .mobile-overlay {
          display: none;
        }

        @media (max-width: 1023px) {
          .mobile-toggle { display: flex; align-items: center; justify-content: center; }
          .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 39;
          }
        }
      `}</style>

      
      <button className="mobile-toggle" onClick={() => setMobileOpen(true)}>
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

     
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

      <div className={`sidebar-root ${!mobileOpen ? 'sidebar-mobile-hidden' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div>
            <div className="sidebar-logo-title sidebar-logo-text">MediCore</div>
            <div className="sidebar-logo-sub">Medical Management</div>
          </div>
        </div>

        
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {activeTab === item.id && <span className="active-bar" />}
            </button>
          ))}
        </nav>

        
        <div className="sidebar-footer" ref={profileRef}>
  
          <div style={{ position: "relative" }}>
            
           
            <button
              type="button"
              className="profile-btn"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <div className="profile-avatar">DR</div>

              <div style={{ flex: 1, textAlign: 'left' }}>
                <div className="profile-name">Dr. Sumon Roy</div>
                <div className="profile-role">Cardiologist</div>
              </div>

              <svg
                className={`profile-chevron${showProfileMenu ? ' rotated' : ''}`}
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>

            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  bottom: "60px",
                  left: 0,
                  right: 0,
                  background: "#13161f",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  zIndex: 99999,
                  boxShadow: "0 -8px 32px rgba(0,0,0,0.5)",
                }}
              >
                <button
                  className="dropdown-item"
                  onClick={handleProfile}
                >
                  My Profile
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;