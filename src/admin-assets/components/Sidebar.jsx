import { X, Stethoscope, LayoutDashboard, Users, HeartHandshake,  Calendar, UserCog, FileText, Settings } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { useState } from 'react'; 
import { useNavigate, useLocation } from 'react-router';

const menuItems = [
  { name: 'Dashboard',    icon: LayoutDashboard, path: '/admin/admin-dashboard' },
  { name: 'Users',        icon: Users,           path: '/admin/users' },
  { name: 'Doctors',      icon: HeartHandshake,  path: '/admin/doctors' },
  { name: 'Appointments', icon: Calendar,        path: '/admin/appointments' },
  { name: 'Caregivers',   icon: UserCog,         path: '/admin/caregivers' },
  { name: 'Reports',      icon: FileText,        path: '/admin/reports' },
  { name: 'Settings',     icon: Settings,        path: '/admin/settings' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">MedAdmin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setActiveMenu(item.name);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}