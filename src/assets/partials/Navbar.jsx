import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import Cookies from 'js-cookie';
import myaxios from "../utilities/myaxios";
import { successToast, errorToast } from "../utilities/toast";
import "../css/navbar.css";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Notification states
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const observerRef = useRef(null);
  const navigate = useNavigate();

  const userRole = userData?.role?.toUpperCase();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await myaxios.get(
        `/admin/notifications/?page=${pageNum}&page_size=${pageSize}`
      );

      if (response.data.status) {
        const { results, pagination } = response.data.data;

        setNotifications(prev =>
          append ? [...prev, ...results] : results
        );

        setHasMore(pagination.has_next);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [loading, pageSize]);

  // Fetch unread count separately
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await myaxios.get('/admin/notifications/unread-count/');
      if (response.data.status) {
        setUnreadCount(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      const response = await myaxios.patch(
        `/admin/notifications/${notificationId}/`,
        {
          is_read: true,
        }
      );

      if (response.data.status) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );

        await fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [fetchUnreadCount]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await myaxios.post(
        '/admin/notifications/mark-read/',
        {
          notification_ids: [],
        }
      );

      if (response.data.status) {
        setNotifications(prev =>
          prev.map(notification => ({
            ...notification,
            is_read: true,
          }))
        );

        await fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [fetchUnreadCount]);

  // Delete a notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await myaxios.delete(
        `/admin/notifications/${notificationId}/`
      );

      if (response.data.status) {
        const deleted = notifications.find(
          notification => notification.id === notificationId
        );

        setNotifications(prev =>
          prev.filter(notification => notification.id !== notificationId)
        );

        if (deleted && !deleted.is_read) {
          await fetchUnreadCount();
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications, fetchUnreadCount]);

  // Infinite scroll observer
  const lastNotificationRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchNotifications(page + 1, true);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, page, fetchNotifications]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('userData');
    
    if (token || user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    }
  }, []);

  // Load notifications on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications(1, false);
      fetchUnreadCount();
    }
  }, [isLoggedIn]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      // Close notification dropdown if clicked outside
      if (!target.closest('.noti-dropdown') && !target.closest('.noti-trigger') && !target.closest('.noti-mobile-dropdown')) {
        setNotificationsOpen(false);
      }
      // Close profile menu if clicked outside
      if (!target.closest('.noti-profile-dropdown') && !target.closest('.noti-profile-btn')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const goToUserNotifications = () => {
    navigate('/users/notifications');
    setMobileOpen(false);
    setNotificationsOpen(false);
    setShowProfileMenu(false);
  }

  const goToUserAppointments = () => {
    navigate('/users/appointments');
    setMobileOpen(false);
    setShowProfileMenu(false);
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
      const response = await myaxios.post("user-logout");

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
      localStorage.removeItem("full_name");
      
      Cookies.remove("refresh_token");
      Cookies.remove("email");
      
      setIsLoggedIn(false);
      setUserData(null);
      setShowProfileMenu(false);
      setMobileOpen(false);
      
      navigate("/", { replace: true });
    }
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

  // Format time for display
  const formatNotificationTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  return (
    <>
      <nav className="noti-navbar">
        {/* Logo */}
        <div className="noti-nav-logo" onClick={gotToHome}>
          <div className="noti-logo-icon">
            <i className="fas fa-heartbeat"></i>
          </div>
          <div>
            <span className="noti-logo-text">ClinicCare</span>
            <span className="noti-logo-sub">Healthcare System</span>
          </div>
        </div>

        {/* Nav Links - Desktop */}
        <ul className="noti-nav-links">
          <li><button onClick={gotToHome}>Home</button></li>
          <li><button onClick={goToFindDoctor}>Find Doctor</button></li>
          <li><button onClick={goToAppointment}>Get Appointment</button></li>
          <li><button onClick={goToService}>Services</button></li>
          <li><button onClick={goToAboutUs}>About Us</button></li>
          <li><button onClick={goToContact}>Contact</button></li>
        </ul>

        {/* Auth Buttons - Desktop only */}
        <div className="noti-nav-auth">
          {!isLoggedIn ? (
            <>
              {/* <button className="noti-btn-signin" onClick={goToSignUp}>Sign Up</button> */}
              <button className="noti-btn-login" onClick={goToLogin}>Login</button>
            </>
          ) : (
            <div className="noti-profile-container">
              <button 
                className="noti-profile-btn"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  if (notificationsOpen) setNotificationsOpen(false);
                }}
              >
                <div className="noti-profile-avatar">
                  {userData?.profile_image ? (
                    <img src={userData.profile_image} alt="Profile" />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <span className="noti-profile-name">
                  {userData?.full_name?.split(' ')[0] || 'User'}
                </span>
                <i className={`fas fa-chevron-${showProfileMenu ? 'up' : 'down'}`}></i>
              </button>
              
              {showProfileMenu && (
                <div className="noti-profile-dropdown">
                  <button onClick={goToProfile} className="noti-dropdown-item">
                    <i className="fas fa-user"></i>
                    My Profile
                  </button>
                  <button onClick={goToUserAppointments} className="noti-dropdown-item">
                    <i className="fas fa-calendar-check"></i>
                    My Appointments
                  </button>
                  
                  <div className="noti-trigger">
                    <button 
                      onClick={() => {
                        setNotificationsOpen(!notificationsOpen);
                        if (!notificationsOpen && initialLoad) {
                          fetchNotifications(1, false);
                          fetchUnreadCount();
                        }
                      }}
                      className="noti-dropdown-item noti-notification-item"
                    >
                      <i className="fas fa-bell"></i>
                      Notifications
                      {unreadCount > 0 && (
                        <span className="noti-badge-count">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>

                    {notificationsOpen && (
                      <div className="noti-dropdown">
                        <div className="noti-dropdown-header">
                          <h4 className="noti-dropdown-title">
                            <i className="fas fa-bell"></i>
                            Notifications
                            {unreadCount > 0 && (
                              <span className="noti-dropdown-unread-badge">
                                {unreadCount} unread
                              </span>
                            )}
                          </h4>
                          <div className="noti-dropdown-actions">
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="noti-mark-all-read"
                              >
                                Mark all read
                              </button>
                            )}
                            <button
                              onClick={() => setNotificationsOpen(false)}
                              className="noti-dropdown-close"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                        
                        {notifications.length === 0 && !loading ? (
                          <div className="noti-empty-state">
                            <i className="fas fa-bell"></i>
                            <p>No notifications</p>
                          </div>
                        ) : (
                          <>
                            {notifications.map((notification, index) => (
                              <div
                                key={notification.id}
                                ref={index === notifications.length - 1 ? lastNotificationRef : null}
                                onClick={() => {
                                  if (!notification.is_read) {
                                    markNotificationAsRead(notification.id);
                                  }
                                }}
                                className={`noti-notification-item-list ${!notification.is_read ? 'noti-unread-item' : ''}`}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="noti-notification-content">
                                  <div className="noti-notification-text">
                                    <p className="noti-notification-title">
                                      {notification.notification_title}
                                    </p>
                                    <p className="noti-notification-message">
                                      {notification.notification_content}
                                    </p>
                                    <p className="noti-notification-time">
                                      {formatNotificationTime(notification.formatted_time)}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className="noti-notification-delete"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                                {!notification.is_read && (
                                  <div className="noti-notification-new">
                                    <span>● New</span>
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            {loading && (
                              <div className="noti-loading">
                                <div className="noti-spinner"></div>
                                <p>{notifications.length === 0 ? 'Loading notifications...' : 'Loading more...'}</p>
                              </div>
                            )}
                            
                            {!hasMore && notifications.length > 0 && (
                              <div className="noti-no-more">
                                <p>No more notifications</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {userRole === "PATIENT" ? (
                    <button onClick={() => navigate('/patient/caregiver-requests')} className="noti-dropdown-item">
                      <i className="fas fa-user-nurse"></i>
                      Caregiver Requests
                    </button>
                  ) : (
                    <button onClick={() => navigate('/patient-approval')} className="noti-dropdown-item">
                      <i className="fas fa-cog"></i>
                      Sent Requests(Approval)
                    </button>
                  )}
                  <div className="noti-dropdown-divider"></div>
                  <button onClick={handleLogout} className="noti-dropdown-item noti-logout-item">
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger - Always visible on mobile */}
        <button
          className="noti-nav-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`noti-nav-mobile ${mobileOpen ? "noti-open" : ""}`}>
        <button onClick={gotToHome}>Home</button>
        <button onClick={goToFindDoctor}>Find Doctor</button>
        <button onClick={goToAppointment}>Get Appointment</button>
        <button onClick={goToService}>Services</button>
        <button onClick={goToAboutUs}>About Us</button>
        <button onClick={goToContact}>Contact</button>

        <div className="noti-mobile-auth">
          {!isLoggedIn ? (
            <>
              <button className="noti-btn-signin noti-mobile-btn" onClick={goToSignUp}>Sign Up</button>
              <button className="noti-btn-signin noti-mobile-btn" onClick={goToLogin}>Login</button>
            </>
          ) : (
            <div className="noti-mobile-profile">
              <div className="noti-mobile-profile-header">
                <div className="noti-mobile-profile-avatar">
                  {userData?.profile_image ? (
                    <img src={userData.profile_image} alt="Profile" />
                  ) : (
                    <span>{getUserInitials()}</span>
                  )}
                </div>
                <div className="noti-mobile-profile-info">
                  <span className="noti-mobile-profile-name">{userData?.full_name || 'User'}</span>
                  <span className="noti-mobile-profile-email">{userData?.email || ''}</span>
                </div>
              </div>
              
              <button className="noti-mobile-profile-btn" onClick={goToProfile}>
                <i className="fas fa-user"></i> Profile
              </button>
              
              <button className="noti-mobile-profile-btn" onClick={goToUserAppointments}>
                <i className="fas fa-calendar-check"></i> My Appointments
              </button>
              
              {/* Mobile Notification Button */}
              <div className="noti-mobile-notification-wrapper">
                <button 
                  className="noti-mobile-profile-btn noti-mobile-notification-btn" 
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (!notificationsOpen && initialLoad) {
                      fetchNotifications(1, false);
                      fetchUnreadCount();
                    }
                  }}
                >
                  <i className="fas fa-bell"></i>
                  Notifications
                  {unreadCount > 0 && (
                    <span className="noti-mobile-badge">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Mobile Notification Dropdown */}
                {notificationsOpen && (
                  <div className="noti-mobile-dropdown">
                    <div className="noti-mobile-dropdown-header">
                      <h4 className="noti-mobile-dropdown-title">
                        <i className="fas fa-bell"></i>
                        Notifications
                        {unreadCount > 0 && (
                          <span className="noti-mobile-dropdown-badge">
                            {unreadCount} unread
                          </span>
                        )}
                      </h4>
                      <div className="noti-mobile-dropdown-actions">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="noti-mobile-mark-read"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="noti-mobile-dropdown-close"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                    
                    {notifications.length === 0 && !loading ? (
                      <div className="noti-mobile-empty">
                        <i className="fas fa-bell"></i>
                        <p>No notifications</p>
                      </div>
                    ) : (
                      <>
                        {notifications.map((notification, index) => (
                          <div
                            key={notification.id}
                            ref={index === notifications.length - 1 ? lastNotificationRef : null}
                            onClick={() => {
                              if (!notification.is_read) {
                                markNotificationAsRead(notification.id);
                              }
                            }}
                            className={`noti-mobile-notification-item ${!notification.is_read ? 'noti-mobile-unread' : ''}`}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="noti-mobile-notification-content">
                              <div className="noti-mobile-notification-text">
                                <p className="noti-mobile-notification-title">
                                  {notification.notification_title}
                                </p>
                                <p className="noti-mobile-notification-message">
                                  {notification.notification_content}
                                </p>
                                <p className="noti-mobile-notification-time">
                                  {formatNotificationTime(notification.formatted_time)}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="noti-mobile-notification-delete"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                            {!notification.is_read && (
                              <div className="noti-mobile-notification-new">
                                <span>● New</span>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {loading && (
                          <div className="noti-mobile-loading">
                            <div className="noti-spinner"></div>
                            <p>{notifications.length === 0 ? 'Loading notifications...' : 'Loading more...'}</p>
                          </div>
                        )}
                        
                        {!hasMore && notifications.length > 0 && (
                          <div className="noti-mobile-no-more">
                            <p>No more notifications</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {userRole === "PATIENT" ? (
                <button
                  className="noti-mobile-profile-btn"
                  onClick={() => navigate('/patient/caregiver-requests')}
                >
                  <i className="fas fa-user-nurse"></i> Caregiver Requests
                </button>
              ) : (
                <button
                  className="noti-mobile-profile-btn"
                  onClick={() => navigate('/patient-approval')}
                >
                  <i className="fas fa-cog"></i> Sent Requests(Approval)
                </button>
              )}
              
              <button className="noti-mobile-logout-btn" onClick={handleLogout}>
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