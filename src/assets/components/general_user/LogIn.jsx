import React, { useState, useEffect, useRef } from "react";
import '../../css/general_user/login.css'

import { useNavigate } from 'react-router';

import myaxios from '../../utilities/myaxios'
import { successToast, errorToast } from '../../utilities/toast';
import { earlierUpdate } from '../../utilities/updateToast';

import alreadyLoggedIn from "../../utilities/alreadyLoggedIn";


const Login = () => {
  const navigate = useNavigate();

  alreadyLoggedIn("You are already Logged in!")
  
  const [formData, setFormData] = useState({
    username: "", // Changed from email to username to match API
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.password) {
      errorToast("⚠️ Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API (rememberMe is not sent to API)
      const loginData = {
        username: formData.username,
        password: formData.password
      };

      const response = await myaxios.post("user-login", loginData);
      
      if (response.data.status === true) {
        successToast(response.data.message || "Login successful!");
        
        // Handle remember me functionality (store token, etc.)
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }

        if (response.data.full_name){
          localStorage.setItem('f_n', response.data.full_name)
        }
        

        if (response.data.is_first_login){
            setTimeout(() => {
              navigate('/first-login'); 
            }, 1500);
        }else{
          setTimeout(() => {
            navigate('/'); 
          }, 1500);
        }
        
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

  const handleSocialLogin = (provider) => {
    earlierUpdate(`🔑 Login with ${provider} coming soon!`);
  };

  const goToSignUp = (e) => {
    e.preventDefault();
    navigate('/patient/signup');
  };

  const goToForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  return (
    <div className="login-container">
      {/* Background Effects */}
      <div className="login-bg" aria-hidden="true"></div>
      <div className="login-grid" aria-hidden="true"></div>
      
      {/* Main Content */}
      <div className="login-wrapper">
        {/* Left Side - Login Form */}
        <div className="login-form-side">
          <div className="login-form-container">
            {/* Header */}
            <div className="login-header">
              <div className="login-logo">
                <div className="logo-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <span className="logo-text">ClinicCare</span>
              </div>
              <h1>Welcome Back</h1>
              <p>Sign in to continue your healthcare journey</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">
                  <i className="fas fa-user"></i>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group password-field">
                <div className="password-header">
                  <label htmlFor="password">
                    <i className="fas fa-lock"></i>
                    Password
                  </label>
                  <a href="#" className="forgot-password" onClick={goToForgotPassword}>Forgot Password?</a>
                </div>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fas fa-${showPassword ? "eye-slash" : "eye"}`}></i>
                  </button>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="checkbox-text">Remember me for 30 days</span>
                </label>
              </div>

              <button type="submit" className="btn-login-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Sign In
                  </>
                )}
              </button>

              <div className="login-divider">
                <span>or continue with</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn google" onClick={() => handleSocialLogin('Google')}>
                  <i className="fab fa-google"></i>
                  Google
                </button>
                <button type="button" className="social-btn facebook" onClick={() => handleSocialLogin('Facebook')}>
                  <i className="fab fa-facebook-f"></i>
                  Facebook
                </button>
                <button type="button" className="social-btn apple" onClick={() => handleSocialLogin('Apple')}>
                  <i className="fab fa-apple"></i>
                  Apple
                </button>
              </div>

              <div className="signup-link">
                Don't have an account? <a href="#" onClick={goToSignUp}>Create Account</a>
              </div>
            </form>

            {/* Emergency Contact */}
            <div className="emergency-contact">
              <i className="fas fa-ambulance"></i>
              <span>Emergency? Call 24/7: </span>
              <strong>+1 (800) 911-CARE</strong>
            </div>
          </div>
        </div>

        {/* Right Side - 3D Model/Illustration */}
        <div className="login-model-side">
          <div className="model-container">
            {/* Animated floating elements */}
            <div className="floating-elements">
              <div className="floating-element heartbeat">❤️</div>
              <div className="floating-element stethoscope">🩺</div>
              <div className="floating-element pill">💊</div>
              <div className="floating-element syringe">💉</div>
              <div className="floating-element medical-cross">✚</div>
              <div className="floating-element ambulance">🚑</div>
            </div>

            {/* Main 3D Model Container */}
            <div className="model-3d-container">
              {/* Central rotating medical symbol */}
              <div className="model-3d">
                <div className="model-3d-inner">
                  <div className="model-3d-front">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                  <div className="model-3d-back">
                    <i className="fas fa-stethoscope"></i>
                  </div>
                  <div className="model-3d-right">
                    <i className="fas fa-hospital"></i>
                  </div>
                  <div className="model-3d-left">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="model-3d-top">
                    <i className="fas fa-ambulance"></i>
                  </div>
                  <div className="model-3d-bottom">
                    <i className="fas fa-clinic-medical"></i>
                  </div>
                </div>
              </div>

              {/* Orbiting medical symbols */}
              <div className="orbit-symbol symbol-1">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="orbit-symbol symbol-2">
                <i className="fas fa-clock"></i>
              </div>
              <div className="orbit-symbol symbol-3">
                <i className="fas fa-star"></i>
              </div>
              <div className="orbit-symbol symbol-4">
                <i className="fas fa-globe"></i>
              </div>
              <div className="orbit-symbol symbol-5">
                <i className="fas fa-lock"></i>
              </div>
              <div className="orbit-symbol symbol-6">
                <i className="fas fa-check-circle"></i>
              </div>
            </div>

            {/* Floating Cards with Stats */}
            <div className="floating-cards">
              <div className="floating-card card-1">
                <div className="card-icon">👥</div>
                <div className="card-content">
                  <span className="card-value">50K+</span>
                  <span className="card-label">Happy Patients</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">⭐</div>
                <div className="card-content">
                  <span className="card-value">4.9</span>
                  <span className="card-label">Patient Rating</span>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">👨‍⚕️</div>
                <div className="card-content">
                  <span className="card-value">500+</span>
                  <span className="card-label">Specialists</span>
                </div>
              </div>
              <div className="floating-card card-4">
                <div className="card-icon">🏥</div>
                <div className="card-content">
                  <span className="card-value">24/7</span>
                  <span className="card-label">Emergency</span>
                </div>
              </div>
            </div>

            {/* Welcome Back Message */}
            <div className="model-welcome">
              <h2>Your Health Companion</h2>
              <p>Access your medical records, book appointments, and consult with specialists</p>
              
              {/* Feature List */}
              <div className="feature-list">
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Secure Patient Portal</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Video Consultations</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Prescription Refills</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Lab Results Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;