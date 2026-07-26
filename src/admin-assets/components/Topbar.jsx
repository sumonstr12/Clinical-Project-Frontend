import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Search, Menu, ChevronDown, User, Settings, LogOut, X, Calendar, Clock, User as UserIcon } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import myaxios from '../../assets/utilities/myaxios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router';
import { successToast, errorToast } from '../../assets/utilities/toast';

export default function Topbar() {
  const { setSidebarOpen } = useSidebar();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fname, setFname] = useState(localStorage.getItem('f_n') || 'Admin User');
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Detail dialog states
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const observerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await myaxios.get(`admin/notifications/?page=${pageNum}&page_size=${pageSize}`);
      
      if (response.data.status) {
        const { results, pagination } = response.data.data;
        
        if (append) {
          setNotifications(prev => [...prev, ...results]);
        } else {
          setNotifications(results);
        }
        
        setHasMore(pagination.has_next);
        setPage(pageNum);
        
        // Update unread count from results
        const unread = results.filter(n => !n.is_read).length;
        setUnreadCount(prev => append ? prev + unread : unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      errorToast('Failed to load notifications');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [loading, pageSize]);

  // Fetch unread count separately
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await myaxios.get('admin/notifications/unread-count/');
      if (response.data.status) {
        setUnreadCount(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Fetch notification detail
  const fetchNotificationDetail = useCallback(async (notificationId) => {
    setDetailLoading(true);
    try {
      const response = await myaxios.get(`admin/notifications/${notificationId}/`);
      if (response.data.status) {
        setSelectedNotification(response.data.data);
        setIsDialogOpen(true);
        
        // Mark as read if it's unread
        if (!response.data.data.is_read) {
          await markNotificationAsRead(notificationId);
        }
      }
    } catch (error) {
      console.error('Error fetching notification detail:', error);
      errorToast('Failed to load notification details');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      const response = await myaxios.patch(`admin/notifications/${notificationId}/`, {
        is_read: true
      });
      
      if (response.data.status) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await myaxios.post('admin/notifications/mark-read/', {
        notification_ids: []
      });
      
      if (response.data.status) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
        successToast(response.data.message || 'All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      errorToast('Failed to mark all as read');
    }
  }, []);

  // Delete a notification
  const deleteNotification = useCallback(async (notificationId, e) => {
    e.stopPropagation();
    
    try {
      const response = await myaxios.delete(`admin/notifications/${notificationId}/`);
      
      if (response.data.status) {
        const deleted = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (deleted && !deleted.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        successToast(response.data.message || 'Notification deleted');
        
        // Close dialog if the deleted notification is currently open
        if (selectedNotification && selectedNotification.id === notificationId) {
          setIsDialogOpen(false);
          setSelectedNotification(null);
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      errorToast('Failed to delete notification');
    }
  }, [notifications, selectedNotification]);

  // Handle notification click - open detail dialog
  const handleNotificationClick = useCallback(async (notificationId) => {
    await fetchNotificationDetail(notificationId);
  }, [fetchNotificationDetail]);

  // Close dialog
  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedNotification(null);
  }, []);

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

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications(1, false);
    fetchUnreadCount();
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest('.notification-dropdown') && !target.closest('.notification-btn')) {
        setNotificationsOpen(false);
      }
      if (!target.closest('.profile-dropdown') && !target.closest('.profile-btn')) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Escape key to close dialog
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isDialogOpen) {
        closeDialog();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isDialogOpen, closeDialog]);

  const handleMenuClick = () => {
    setSidebarOpen(prev => !prev);
  };

  const gotoAdminProfile = () => {
    navigate("/admin/profile");
  };

  const handleLogout = async () => {
    try {
      const response = await myaxios.post("user-logout");
      if (response?.data?.status) {
        successToast(response.data.message || "Logged out successfully!");
      }
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      localStorage.removeItem("f_n");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      Cookies.remove("refresh_token");
      navigate("/admin/login");
    }
  };

  // Format time for display
  const formatNotificationTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  // Notification Detail Dialog Component
  const NotificationDetailDialog = () => {
    if (!selectedNotification) return null;
    
    const { notification, formatted_created_at, formatted_updated_at, is_read } = selectedNotification;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-700 animate-slideUp">
          {/* Header */}
          <div className="sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${!is_read ? 'bg-blue-500 animate-pulse' : 'bg-slate-500'}`} />
              <h2 className="text-lg font-semibold text-white">Notification Details</h2>
            </div>
            <button
              onClick={closeDialog}
              className="p-1 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-5 space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`text-xs px-3 py-1 rounded-full ${
                !is_read 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-slate-600/30 text-slate-400 border border-slate-600/30'
              }`}>
                {!is_read ? '● Unread' : '● Read'}
              </span>
              <span className="text-xs text-slate-400">
                ID: #{selectedNotification.id}
              </span>
            </div>
            
            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-white">
                {notification.title}
              </h3>
            </div>
            
            {/* Content */}
            <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-700/50">
              <p className="text-slate-200 leading-relaxed">
                {notification.content}
              </p>
            </div>
            
            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-700/20 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created</span>
                </div>
                <p className="text-sm text-white font-medium">
                  {formatted_created_at}
                </p>
                <p className="text-xs text-slate-500">
                  {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                </p>
              </div>
              <div className="bg-slate-700/20 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated</span>
                </div>
                <p className="text-sm text-white font-medium">
                  {formatted_updated_at}
                </p>
                <p className="text-xs text-slate-500">
                  {notification.updated_at ? new Date(notification.updated_at).toLocaleString() : ''}
                </p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="bg-slate-700/20 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                <UserIcon className="w-3 h-3" />
                <span>User Information</span>
              </div>
              <p className="text-sm text-white">
                User ID: {selectedNotification.user}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
              <button
                onClick={() => deleteNotification(selectedNotification.id, { stopPropagation: () => {} })}
                className="px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Delete Notification
              </button>
              <button
                onClick={closeDialog}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 lg:left-64 bg-slate-800 shadow-lg z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center flex-1">
            <button
              onClick={handleMenuClick}
              className="lg:hidden text-slate-400 hover:text-white mr-4"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative max-w-md flex-1 hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients, doctors, appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen && initialLoad) {
                    fetchNotifications(1, false);
                    fetchUnreadCount();
                  }
                }}
                className="notification-btn relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="notification-dropdown absolute right-0 mt-2 w-96 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2 max-h-[500px] overflow-y-auto">
                  <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
                    <h3 className="font-semibold text-white">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                          {unreadCount} unread
                        </span>
                      )}
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 && !loading ? (
                    <div className="px-4 py-8 text-center text-slate-400">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <>
                      {notifications.map((notification, index) => (
                        <div
                          key={notification.id}
                          ref={index === notifications.length - 1 ? lastNotificationRef : null}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors ${
                            !notification.is_read ? 'bg-slate-700/50 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white font-medium truncate">
                                {notification.notification_title}
                              </p>
                              <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                                {notification.notification_content}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {formatNotificationTime(notification.formatted_time)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => deleteNotification(notification.id, e)}
                              className="ml-2 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </div>
                          {!notification.is_read && (
                            <div className="mt-1">
                              <span className="text-xs text-blue-400">● New</span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {loading && (
                        <div className="px-4 py-3 text-center">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                          <p className="text-xs text-slate-400 mt-1">Loading more...</p>
                        </div>
                      )}
                      
                      {!hasMore && notifications.length > 0 && (
                        <div className="px-4 py-3 text-center text-xs text-slate-400 border-t border-slate-700">
                          No more notifications
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="profile-btn flex items-center space-x-3 text-slate-300 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="hidden md:block font-medium">{fname}</span>
                <ChevronDown className="w-4 h-4 hidden md:block" />
              </button>

              {profileOpen && (
                <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2">
                  <button
                    onClick={gotoAdminProfile}
                    className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center space-x-2 text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Detail Dialog */}
      {isDialogOpen && <NotificationDetailDialog />}

      {/* Loading Overlay for Detail */}
      {detailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 p-6 rounded-xl flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-slate-300">Loading notification details...</p>
          </div>
        </div>
      )}
    </>
  );
}