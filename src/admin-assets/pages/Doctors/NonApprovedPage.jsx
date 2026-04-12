import React, { useState } from 'react'
import { SidebarProvider } from '../../components/SidebarContext';
import Sidebar from '../../components/Sidebar';
import Topbar from "../../components/Topbar";
import NonApprovalDoctors from '../../components/Doctors/NonApprovalDoctors';
import ApprovedDoctors from '../../components/Doctors/ApprovedDoctors';

const tabs = ['Non-Approved', 'Approved'];

export default function NonApprovedPage() {
  const [activeTab, setActiveTab] = useState('Non-Approved');

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-900 text-white">
        <Sidebar />

        <div className="lg:ml-64 flex flex-col min-h-screen">
          <Topbar />

          <main className="flex-1 pt-20 sm:pt-24 md:pt-28 lg:pt-32 p-4 sm:p-6 lg:p-8">

            <div className="flex gap-2 mb-6 bg-black/20 border border-white/6 rounded-2xl p-1.5 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Non-Approved' && <NonApprovalDoctors />}
            {activeTab === 'Approved' && <ApprovedDoctors />}

          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}