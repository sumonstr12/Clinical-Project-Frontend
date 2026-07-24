import React from 'react'
import { SidebarProvider } from '../../components/SidebarContext'
import AppointmentList from '../../components/Appointment/AppointmentList'
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

const ApppointmentListPage = () => {
  return (
      <div>
          <SidebarProvider>
                <div className="min-h-screen bg-slate-900 text-white">
                  <Sidebar />
          
                  <div className="lg:ml-64 flex flex-col min-h-screen">
                    <Topbar />
          
                    <main className="flex-1 pt-20 sm:pt-24 md:pt-28 lg:pt-32 p-4 sm:p-6 lg:p-8">
          
                      <AppointmentList />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
      </div>
    )
}

export default ApppointmentListPage