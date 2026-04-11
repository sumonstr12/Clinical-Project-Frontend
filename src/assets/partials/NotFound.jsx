import React from "react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  const goToFindDoctor = () => {
    navigate('/find-doctor');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0A0C10] via-[#0F1117] to-[#050608] relative overflow-hidden flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      
      <div className="absolute inset-0 bg-[radial-gradient(#1A1D27_1px,transparent_1px)] bg-size-[40px_40px] opacity-20 pointer-events-none"></div>

      
  
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

     
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] text-3xl animate-pulse-slow opacity-30">❤️</div>
        <div className="absolute top-[20%] right-[8%] text-2xl animate-bounce-slow opacity-25">🩺</div>
        <div className="absolute bottom-[30%] left-[10%] text-4xl animate-pulse-slow opacity-20">✚</div>
        <div className="absolute top-[60%] right-[15%] text-3xl animate-float opacity-25">💊</div>
        <div className="absolute bottom-[15%] right-[20%] text-2xl animate-spin-slow opacity-20">💉</div>
        <div className="absolute top-[40%] left-[15%] text-3xl animate-float-delayed opacity-20">🚑</div>
        <div className="absolute bottom-[50%] right-[25%] text-2xl animate-pulse-slow opacity-15">🌡️</div>
        <div className="absolute top-[75%] left-[20%] text-2xl animate-bounce-slow opacity-20">🩺</div>
      </div>

      
      <div className="relative z-10 max-w-7xl w-full bg-[#12141C]/80 backdrop-blur-sm rounded-3xl border border-[#1E212B] shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          
          {/* LEFT SIDE - 404 Illustration */}
          <div className="lg:w-1/2 bg-linear-to-br from-[#0F1117] to-[#0A0C10] p-8 md:p-12 flex items-center justify-center relative overflow-hidden">
            {/* Animated Pulse Line Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 400 200" className="absolute">
                <path d="M0 100 L50 100 L60 60 L70 140 L80 80 L90 120 L100 90 L110 110 L120 95 L130 105 L140 100 L200 100" fill="none" stroke="#3B82F6" strokeWidth="2">
                  <animate attributeName="stroke-dashoffset" values="400;0" dur="3s" repeatCount="indefinite"/>
                </path>
              </svg>
            </div>

            <div className="relative text-center">
              {/* 3D Numbers */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-linear-to-b from-blue-400 to-blue-600 drop-shadow-2xl animate-float" style={{ textShadow: '0 0 40px rgba(59,130,246,0.3)' }}>4</span>
                <span className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-linear-to-b from-cyan-400 to-blue-600 drop-shadow-2xl animate-float-delayed relative">
                  0
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
                  </div>
                </span>
                <span className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-linear-to-b from-blue-400 to-indigo-600 drop-shadow-2xl animate-float">4</span>
              </div>

              {/* Medical Equipment Icons Grid */}
              <div className="grid grid-cols-3 gap-4 max-w-62.5 mx-auto mb-8">
                <div className="bg-[#1A1D27] p-3 rounded-xl border border-[#2A2D3A] animate-pulse-slow">
                  <i className="fas fa-stethoscope text-2xl text-teal-400"></i>
                </div>
                <div className="bg-[#1A1D27] p-3 rounded-xl border border-[#2A2D3A] animate-bounce-slow">
                  <i className="fas fa-heartbeat text-2xl text-red-400"></i>
                </div>
                <div className="bg-[#1A1D27] p-3 rounded-xl border border-[#2A2D3A] animate-float">
                  <i className="fas fa-syringe text-2xl text-green-400"></i>
                </div>
                <div className="bg-[#1A1D27] p-3 rounded-xl border border-[#2A2D3A] animate-float-delayed">
                  <i className="fas fa-pills text-2xl text-purple-400"></i>
                </div>
                <div className="bg-[#1A1D27] p-3 rounded-xl border border-[#2A2D3A] animate-pulse-slow">
                  <i className="fas fa-hospital text-2xl text-slate-400"></i>
                </div>
                <div className="bg-[#1A1D27] p-3 rounded-xl border border-[#2A2D3A] animate-bounce-slow">
                  <i className="fas fa-ambulance text-2xl text-orange-400"></i>
                </div>
              </div>

              {/* Heart Animation */}
              <div className="relative inline-block">
                <i className="fas fa-heart text-5xl text-red-500/20 absolute inset-0 flex items-center justify-center animate-ping"></i>
                <i className="fas fa-heartbeat text-5xl text-red-500 relative z-10 animate-pulse"></i>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Content */}
          <div className="lg:w-1/2 p-8 md:p-12">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <i className="fas fa-heartbeat text-white text-lg"></i>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">ClinicCare</span>
            </div>

            {/* Error Code */}
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-5xl md:text-6xl font-black text-blue-500">4</span>
              <span className="text-5xl md:text-6xl font-black text-cyan-500 relative">
                0
                <div className="absolute -top-1 -right-2 w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              </span>
              <span className="text-5xl md:text-6xl font-black text-blue-500">4</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h1>
            
            {/* Message */}
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
              Oops! It seems the page you're looking for has gone for a check-up 
              or might have been moved to another department.
            </p>

            {/* Medical Analogies */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-[#9CA3AF] text-sm">
                <span className="text-yellow-500">🔍</span>
                <span>Like a misdiagnosis, we couldn't find what you're looking for</span>
              </div>
              <div className="flex items-center gap-3 text-[#9CA3AF] text-sm">
                <span className="text-blue-500">🏥</span>
                <span>The page might be in another waiting room</span>
              </div>
              <div className="flex items-center gap-3 text-[#9CA3AF] text-sm">
                <span className="text-purple-500">📋</span>
                <span>Our medical records don't have this page on file</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={goToHome}
                className="flex-1 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <i className="fas fa-home"></i>
                Return to Home
              </button>
              <button 
                onClick={goToFindDoctor}
                className="flex-1 bg-[#1A1D27] border border-[#2A2D3A] hover:bg-[#222530] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <i className="fas fa-user-md"></i>
                Find a Doctor
              </button>
            </div>

            {/* Helpful Links */}
            <div className="mb-6">
              <h3 className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-3">You might be looking for:</h3>
              <div className="grid grid-cols-2 gap-3">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/appointment'); }} className="text-[#9CA3AF] text-sm hover:text-blue-500 transition flex items-center gap-2">
                  <i className="fas fa-calendar-check text-xs"></i>
                  Book Appointment
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/services'); }} className="text-[#9CA3AF] text-sm hover:text-blue-500 transition flex items-center gap-2">
                  <i className="fas fa-stethoscope text-xs"></i>
                  Our Services
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }} className="text-[#9CA3AF] text-sm hover:text-blue-500 transition flex items-center gap-2">
                  <i className="fas fa-phone-alt text-xs"></i>
                  Contact Us
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about-us'); }} className="text-[#9CA3AF] text-sm hover:text-blue-500 transition flex items-center gap-2">
                  <i className="fas fa-info-circle text-xs"></i>
                  About Us
                </a>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-[#1A1D27]/50 border border-[#2A2D3A] rounded-xl p-4 flex items-center gap-3 flex-wrap">
              <i className="fas fa-ambulance text-red-500 text-xl"></i>
              <span className="text-[#9CA3AF] text-xs">Need immediate assistance? Call our 24/7 helpline:</span>
              <strong className="text-white text-sm">+1 (800) 911-CARE</strong>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 0.5s;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;