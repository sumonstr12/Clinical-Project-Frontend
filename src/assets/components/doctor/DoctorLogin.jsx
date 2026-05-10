import React, { useState } from 'react';
import { Eye, EyeOff, User, LogIn, Activity } from 'lucide-react';
import "../../css/doctor/doctor-login.css";
import myaxios from '../../utilities/myaxios';
import { errorToast, successToast } from '../../utilities/toast';
import { useNavigate } from 'react-router';


const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      errorToast("⚠️ Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const loginData = {
        username: formData.username,
        password: formData.password
      };

      const response = await myaxios.post("user-login", loginData);
      
      if (response.data.status === true) {
        successToast(response.data.message || "Login successful!");
        
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        localStorage.setItem('userData', JSON.stringify({
          full_name: response.data.full_name,
          role: response.data.role
        }));
        
        
        if (response.data.role=="ADMIN"){

          setTimeout(() => {
            navigate('/admin/admin-dashboard'); 
          }, 1500);
        } else if (response.data.role=="HEALTHCARE"){ {
          setTimeout(() => {
            navigate('/doctor/doctor-dashboard'); 
          }, 1500);
        }

        }
        
      } else {
        errorToast(response.data.message || "Login Failed");
      }

    } catch (error) {
      errorToast(error.response?.data?.message || "Login failed. Please try again.");
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dl-page">
      <div className="dl-container">
        {/* Logo/Brand */}
        <div className="dl-brand">
          <div className="dl-brand-icon">
            <Activity className="dl-brand-icon-svg" />
          </div>
          <h1 className="dl-brand-title">MediCare Hub</h1>
          <p className="dl-brand-subtitle">Healthcare Provider Portal</p>
        </div>

        {/* Login Card */}
        <div className="dl-card">
          <h2 className="dl-card-title">Welcome Back</h2>
          
          {error && (
            <div className="dl-error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="dl-form">
            {/* Username Field */}
            <div>
              <label className="dl-label">Username</label>
              <div className="dl-input-wrapper">
                <User className="dl-input-icon" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="dl-input"
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="dl-label">Password</label>
              <div className="dl-input-wrapper">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="dl-password-toggle"
                >
                  {showPassword ? <EyeOff className="dl-icon" /> : <Eye className="dl-icon" />}
                </button>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="dl-input dl-input-password"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="dl-forgot-link">
              <button type="button" className="dl-link">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="dl-button"
            >
              {loading ? (
                <>
                  <div className="dl-spinner"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="dl-button-icon" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;