import React, { useState } from 'react';
import myaxios from '../../assets/utilities/myaxios';
import { useNavigate } from 'react-router';
import { successToast, errorToast } from '../../assets/utilities/toast';
import alreadyLoggedIn from '../../assets/utilities/alreadyLoggedIn';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  alreadyLoggedIn("You are already logged in as an admin. Please log out first to switch accounts.");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      errorToast('Please enter both username     and password');
      return;
    }

    try {
      const loginData = {
        username: username,
        password: password,
      };

      const response = await myaxios.post("admin/admin-login/", loginData);
      
      if (response.data.status === true) {
        successToast(response.data.message || "Login successful!");
        
        localStorage.setItem('role', response.data.role || 'ADMIN');
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }

        if (response.data.full_name){
          localStorage.setItem('f_n', response.data.full_name)
        }
        setTimeout(() => {
            navigate('/admin/admin-dashboard'); 
          }, 1500);

        
      } else {
        errorToast(response.data.message || "Login Failed");
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "Login failed. Please try again.");
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="bg-[#0A0C10] min-h-screen flex items-center justify-center font-sans antialiased relative">
      <div className="absolute inset-0 bg-linear-to-br from-[#0F1117] via-[#0A0C10] to-[#050608] pointer-events-none"></div>
     
      <div className="relative w-full max-w-md bg-[#12141C] border border-[#1E212B] rounded-2xl shadow-2xl p-8 md:p-10 transition-all duration-300 backdrop-blur-sm">
        
       
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Clinical Service Admin</span>
        </div>

        
        <h1 className="text-white text-2xl font-bold leading-tight mb-2">Admin access</h1>
        <p className="text-[#6B7280] text-sm mb-8">Secure authentication required</p>

        
        <form onSubmit={handleSubmit}>
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-2">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin123"
            className="w-full bg-[#0A0C10] border border-[#1E212B] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#3F4254] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 mb-5"
          />

          
          <label className="block text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-[#0A0C10] border border-[#1E212B] rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#3F4254] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 mb-5"
          />

          <button 
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all duration-200 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            Authenticate session
          </button>
        </form>

        <div className="flex items-center gap-3 my-7">
          <hr className="flex-1 border-t border-[#1E212B]" />
          <span className="text-[11px] text-[#4B4F63] font-medium tracking-wide">SECURE ACCESS</span>
          <hr className="flex-1 border-t border-[#1E212B]" />
        </div>

        <div className="mt-6 pt-4 text-center border-t border-[#1A1C24]">
          <p className="text-[#4B4F63] text-[11px] tracking-wide">🔒 Encrypted connection • Version 2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;