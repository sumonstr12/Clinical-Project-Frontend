import { SidebarProvider } from '../components/SidebarContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import StatisticsCards from '../components/StatisticsCards';
import ChartsSection from '../components/ChartsSection';
import RecentAppointments from '../components/RecentAppointments';
import DoctorRequests from '../components/DoctorRequests';

export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-900 text-white">
        <Sidebar />
        
        <div className="lg:ml-64 flex flex-col min-h-screen">
          <Topbar />
          
          <main className="flex-1 pt-20 sm:pt-24 md:pt-28 lg:pt-32 p-4 sm:p-6 lg:p-8">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back, Admin</h1>
              <p className="text-slate-400 text-sm sm:text-base">Here's your system overview for today.</p>
            </div>
            
            <StatisticsCards />
            <ChartsSection />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentAppointments />
            <DoctorRequests />
          </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}