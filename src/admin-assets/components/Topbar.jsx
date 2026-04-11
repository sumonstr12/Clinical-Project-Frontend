import { useState, useEffect } from 'react';
import { Bell, Search, Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import myaxios from '../../assets/utilities/myaxios';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router';

export default function Topbar() {
  const { setSidebarOpen } = useSidebar();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fname, setFname] = useState(localStorage.getItem('f_n') || 'Admin User');
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New appointment request from John Doe', time: '2 min ago', read: false },
    { id: 2, message: 'Dr. Smith updated patient records', time: '15 min ago', read: false },
    { id: 3, message: 'System backup completed successfully', time: '1 hour ago', read: true },
  ]);


  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id) => {
    setNotifications(notifications =>
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

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

  const handleMenuClick = () => {
    setSidebarOpen(prev => !prev);
  };



  // handle goto profile

  const gotoAdminProfile = () => {
    navigate("/admin/profile")
  }


  // Handle logout

  
  const handleLogout = async () => {

    try {

      const response =
        await myaxios.post("user-logout");

      if (response?.data?.status) {
        successToast(response.data.message || "Logged out successfully!");
      }

    } catch (error) {

      console.log("Logout API error:", error);

    } finally {

    
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("role");

      
      Cookies.remove("refresh_token");


      
      navigate("/admin/login",);

    }
  };

  return (
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
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="notification-btn relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-slate-700">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`px-4 py-3 hover:bg-slate-700 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-slate-700/50' : ''
                    }`}
                  >
                    <p className="text-sm text-white">{notification.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="profile-btn flex items-center space-x-3 text-slate-300 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden md:block font-medium">{fname}</span>
              <ChevronDown className="w-4 h-4 hidden md:block" />
            </button>

            {profileOpen && (
              <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-2">
                <button onClick={gotoAdminProfile} className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-slate-700 transition-colors flex items-center space-x-2 text-red-400">
                  <LogOut className="w-4 h-4" />
                  <span  >Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}