import React, { useState } from "react";
import { useNavigate } from 'react-router';

import myaxios from '../../utilities/myaxios'

import { successToast, errorToast } from '../../utilities/toast';
import { earlierUpdate } from '../../utilities/updateToast';
import '../../css/general_user/SignUpCss.css'

import alreadyLoggedIn from "../../utilities/alreadyLoggedIn";


const SignUp = () => {

  alreadyLoggedIn("First logged out!")
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState('PATIENT');
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "", // For UI validation only
    phone: "",
    role: 'PATIENT',
    relationship: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleRoleChange = (role) => {
    setUserRole(role);
    setFormData(prev => ({
      ...prev,
      role: role,
      relationship: '' // Clear relationship when switching roles
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: type === "checkbox" ? checked : value };
      
      if (name === 'password') {
        let strength = 0;
        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;
        setPasswordStrength(strength);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.full_name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      errorToast("⚠️ Please fill in all required fields");
      return;
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      errorToast("⚠️ Passwords do not match");
      return;
    }

    if (userRole === 'CAREGIVER' && !formData.relationship) {
      errorToast("⚠️ Please specify your relationship");
      return;
    }

    if (!formData.agreeTerms) {
      errorToast("⚠️ Please agree to the Terms and Privacy Policy");
      return;
    }

    // Prepare data for API based on role (confirmPassword is NOT included)
    let submitData;
    
    if (userRole === 'PATIENT') {
      submitData = {
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "PATIENT"
      };
    } else if (userRole === 'CAREGIVER') {
      submitData = {
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "CAREGIVER",
        relationship: formData.relationship
      };
    }

    try {
      const response = await myaxios.post("user-registration", submitData);
      const email = formData.email
      if (response.data.status === true) {
        successToast("Please verify OTP.");
        navigate('/otp-verification-registration', { state: { email } });
      } else {
        errorToast(response.data.message || "User Registration Failed.");
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const getStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength];
  };

  const getStrengthColor = () => {
    const colors = ['#ef4444', '#f97316', '#fbbf24', '#10b981', '#0ef0d0'];
    return colors[passwordStrength];
  };

  const switchToLogin = () => navigate('/patient/login');

  return (
    <div className="signup-container">
      {/* Background Effects */}
      <div className="signup-bg" aria-hidden="true"></div>
      <div className="signup-grid" aria-hidden="true"></div>
      
      {/* Main Content */}
      <div className="signup-wrapper">
        {/* Left Side - 3D Model/Illustration */}
        <div className="signup-model-side">
          <div className="model-container">
            {/* Animated floating elements */}
            <div className="floating-elements">
              <div className="floating-element medical-cross">✚</div>
              <div className="floating-element heartbeat">❤️</div>
              <div className="floating-element pulse">📊</div>
              <div className="floating-element stethoscope">🩺</div>
              <div className="floating-element pill">💊</div>
              <div className="floating-element syringe">💉</div>
            </div>

            {/* Main 3D Model Container */}
            <div className="model-3d-container">
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

              {/* Orbiting rings */}
              <div className="orbit-ring ring-1"></div>
              <div className="orbit-ring ring-2"></div>
              <div className="orbit-ring ring-3"></div>

              {/* Floating cards */}
              <div className="floating-card card-1">
                <i className="fas fa-shield-alt"></i>
                <span>Secure</span>
              </div>
              <div className="floating-card card-2">
                <i className="fas fa-clock"></i>
                <span>24/7</span>
              </div>
              <div className="floating-card card-3">
                <i className="fas fa-star"></i>
                <span>4.9</span>
              </div>
              <div className="floating-card card-4">
                <i className="fas fa-globe"></i>
                <span>Global</span>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="model-welcome">
              <h2>Join ClinicCare</h2>
              <p>Your journey to better health starts here</p>
              <div className="feature-badges">
                <span className="feature-badge">
                  <i className="fas fa-check-circle"></i> 500+ Specialists
                </span>
                <span className="feature-badge">
                  <i className="fas fa-check-circle"></i> 50K+ Patients
                </span>
                <span className="feature-badge">
                  <i className="fas fa-check-circle"></i> 24/7 Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - SignUp Form */}
        <div className="signup-form-side">
          <div className="signup-form-container">
            {/* Header */}
            <div className="signup-header">
              <div className="signup-logo">
                <div className="logo-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <span className="logo-text">ClinicCare</span>
              </div>
              <h1>Create Account</h1>
              <p>Join our healthcare community and start your wellness journey</p>
            </div>

            {/* Role Selection */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {['PATIENT', 'CAREGIVER'].map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: `2px solid ${userRole === role ? '#0ef0d0' : 'var(--border)'}`,
                    background: userRole === role ? 'rgba(14,240,208,0.1)' : 'transparent',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: userRole === role ? '#0ef0d0' : 'var(--text-secondary)',
                    transition: 'var(--transition)'
                  }}
                >
                  {role === 'PATIENT' ? '👤 Patient' : '🤝 Caregiver'}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="signup-form">
              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username">
                  <i className="fas fa-at"></i>
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Full Name Field */}
              <div className="form-group">
                <label htmlFor="full_name">
                  <i className="fas fa-user"></i>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label htmlFor="phone">
                  <i className="fas fa-phone"></i>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="01700000000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Caregiver Relationship Field */}
              {userRole === 'CAREGIVER' && (
                <div className="form-group">
                  <label htmlFor="relationship">
                    <i className="fas fa-handshake"></i>
                    Relationship *
                  </label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select relationship</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {/* Password Field */}
              <div className="form-group password-field">
                <label htmlFor="password">
                  <i className="fas fa-lock"></i>
                  Password *
                </label>
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
                {formData.password && (
                  <div className="password-strength" style={{ marginTop: '5px' }}>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '2px' }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ 
                          height: '4px', 
                          width: '25%', 
                          background: i <= passwordStrength ? getStrengthColor() : 'var(--border)',
                          borderRadius: '2px',
                          transition: 'var(--transition)'
                        }} />
                      ))}
                    </div>
                    <span style={{ color: getStrengthColor(), fontSize: '0.75rem' }}>{getStrengthText()}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field - UI Only, Not Sent to API */}
              <div className="form-group password-field">
                <label htmlFor="confirmPassword">
                  <i className="fas fa-lock"></i>
                  Confirm Password *
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fas fa-${showConfirmPassword ? "eye-slash" : "eye"}`}></i>
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '2px' }}>
                    <i className="fas fa-exclamation-circle"></i> Passwords don't match
                  </span>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                  <span style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '2px' }}>
                    <i className="fas fa-check-circle"></i> Passwords match
                  </span>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <span className="checkbox-text">
                    I agree to the <a href="#" onClick={(e) => { e.preventDefault(); earlierUpdate("📄 Terms of Service"); }}>Terms of Service</a> and <a href="#" onClick={(e) => { e.preventDefault(); earlierUpdate("📄 Privacy Policy"); }}>Privacy Policy</a>
                  </span>
                </label>
              </div>

              {/* Submit Button - Disabled if passwords don't match */}
              <button 
                type="submit" 
                className="btn-signup"
                disabled={formData.password !== formData.confirmPassword}
                style={{ 
                  opacity: formData.password !== formData.confirmPassword ? 0.6 : 1,
                  cursor: formData.password !== formData.confirmPassword ? 'not-allowed' : 'pointer'
                }}
              >
                <i className="fas fa-user-plus"></i>
                Create Account
              </button>

              {/* Social Signup */}
              <div className="signup-divider">
                <span>or sign up with</span>
              </div>

              <div className="social-signup">
                <button type="button" className="social-btn google" onClick={() => earlierUpdate("🔑 Google signup coming soon!")}>
                  <i className="fab fa-google"></i>
                  Google
                </button>
                <button type="button" className="social-btn facebook" onClick={() => earlierUpdate("🔑 Facebook signup coming soon!")}>
                  <i className="fab fa-facebook-f"></i>
                  Facebook
                </button>
                <button type="button" className="social-btn apple" onClick={() => earlierUpdate("🔑 Apple signup coming soon!")}>
                  <i className="fab fa-apple"></i>
                  Apple
                </button>
              </div>

              {/* Login Link */}
              <div className="signin-link">
                Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }}>Sign In</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;