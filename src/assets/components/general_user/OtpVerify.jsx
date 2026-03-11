import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router';
import '../../css/general_user/verifyotp.css';
import myaxios from '../../utilities/myaxios'
import { successToast, errorToast } from '../../utilities/toast';

import { useLocation } from "react-router";

const OtpVerify = ({ 
    onVerify,
    onClose 
    }) => {

  const location = useLocation();
  const email = location.state?.email || "No email";


  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    const digit = value.slice(-1); // always take last char

    // allow only numbers
    if (digit && !/^\d$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // move focus
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // auto verify
    // if (newOtp.every(d => d !== "")) {
    //   setTimeout(() => handleVerify(), 100);
    // }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.current[index - 1].focus();
      }
    }
    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const pastedArray = pastedData.split("");
    const newOtp = [...otp];
    
    pastedArray.forEach((value, index) => {
      if (index < 6) newOtp[index] = value;
    });
    
    setOtp(newOtp);
    
    // Focus the next empty input or last input
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex].focus();
    } else {
      inputRefs.current[5].focus();
      // Auto-verify if all digits are filled
      // setTimeout(() => handleVerify(), 100);
    }
  };

  const handleVerify = async () => {
    const otpValue = inputRefs.current
    .map((input) => input?.value || "")
    .join("");
    console.log(otpValue)
    if (otpValue.length !== 6) {
      errorToast("⚠️ Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);

    try {
      const response = await myaxios.post("verify-otp-registration", {
        otp: otpValue
      });
      console.log(response)

      if (response.data.status === true) {
        successToast("OTP verified successfully!");
        successToast("Registration successfully!")
        
        if (onVerify) onVerify(otpValue);
        
        // Navigate to login after successful verification
        setTimeout(() => {
          navigate('/patient/login');
        }, 1500);
      } else {
        errorToast(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      // You might want to pass email as prop or get from context
      const response = await myaxios.post("otp-resend", {
        email: email.replace(/\*+/g, '') // This might need adjustment based on your email format
      });
      
      if (response.data.status === true) {
        successToast("📨 New OTP sent to your registered email!");
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      } else {
        errorToast(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const goToSignUp = () => {
    navigate('/patient/signup');
  };

  return (
    <div className="otp-container">
      {/* Background Effects */}
      <div className="otp-bg" aria-hidden="true"></div>
      <div className="otp-grid" aria-hidden="true"></div>
      
      {/* Main Content */}
      <div className="otp-wrapper">
        {/* Left Side - OTP Form */}
        <div className="otp-form-side">
          <div className="otp-form-container">
            {/* Header */}
            <div className="otp-header">
              <div className="otp-logo">
                <div className="logo-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <span className="logo-text">ClinicCare</span>
              </div>
              
              <div className="otp-header-content">
                <h1>Verify Your Identity</h1>
                <p>We've sent a 6-digit verification code to</p>
                <div className="user-email">
                  <i className="fas fa-envelope"></i>
                  <span>{email}</span>
                  <button 
                    className="change-email-btn" 
                    onClick={goToSignUp}
                    aria-label="Change email"
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={(e) => e.preventDefault()} className="otp-form">
              <div className="otp-input-group">
                <label htmlFor="otp-0" className="otp-label">
                  Enter Verification Code
                </label>
                <div className="otp-inputs">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`otp-digit ${digit ? "filled" : ""}`}
                      aria-label={`OTP digit ${index + 1}`}
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              {/* Timer & Resend */}
              <div className="otp-timer">
                {timer > 0 ? (
                  <div className="timer-display">
                    <i className="fas fa-clock"></i>
                    <span>Code expires in {formatTime(timer)}</span>
                  </div>
                ) : (
                  <div className="resend-message">
                    <i className="fas fa-hourglass-end"></i>
                    <span>Code expired</span>
                  </div>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="button"
                className="btn-verify"
                onClick={handleVerify}
                disabled={otp.join("").length !== 6 || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle"></i>
                    Verify & Continue
                  </>
                )}
              </button>

              {/* Resend Option */}
              <div className="resend-section">
                <span className="resend-text">Didn't receive the code?</span>
                <button
                  type="button"
                  className={`resend-btn ${canResend ? "active" : ""}`}
                  onClick={handleResend}
                  disabled={!canResend}
                >
                  {canResend ? "Resend Code" : `Resend in ${formatTime(timer)}`}
                </button>
              </div>

              {/* Alternative Options */}
              <div className="otp-alternatives">
                <button type="button" className="alt-btn" onClick={() => errorToast("📞 Contact support at +1 (800) 555-CARE")}>
                  <i className="fas fa-phone-alt"></i>
                  Get via Call
                </button>
                <button type="button" className="alt-btn" onClick={() => errorToast("📱 WhatsApp support coming soon!")}>
                  <i className="fab fa-whatsapp"></i>
                  Get via WhatsApp
                </button>
              </div>

              {/* Back to Sign Up */}
              <div className="back-to-login">
                <button onClick={goToSignUp} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                  <i className="fas fa-arrow-left"></i>
                  Back to Sign Up
                </button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="security-notice">
              <i className="fas fa-shield-alt"></i>
              <span>This code is confidential. Never share it with anyone.</span>
            </div>

            {/* Step Indicator */}
            <div className="otp-steps" style={{ marginTop: '20px', textAlign: 'center' }}>
              <div className="step-indicator" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                <span className="step completed" style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#0ef0d0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                <span className="step-line" style={{ width: '40px', height: '2px', background: '#0ef0d0' }} />
                <span className="step active" style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#0ef0d0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                <span className="step-line" style={{ width: '40px', height: '2px', background: 'var(--border)' }} />
                <span className="step" style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--border)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
              </div>
              <div className="step-labels" style={{ display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span className="step-label completed">Register</span>
                <span className="step-label active">Verify</span>
                <span className="step-label">Success</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - 3D Model/Illustration */}
        <div className="otp-model-side">
          <div className="model-container">
            {/* Animated floating elements */}
            <div className="floating-elements">
              <div className="floating-element shield">🛡️</div>
              <div className="floating-element lock">🔒</div>
              <div className="floating-element key">🔑</div>
              <div className="floating-element check">✅</div>
              <div className="floating-element fingerprint">👆</div>
              <div className="floating-element security">🔐</div>
            </div>

            {/* Main 3D Model Container - Security Focused */}
            <div className="model-3d-container">
              {/* Central rotating security symbol */}
              <div className="model-3d security-model">
                <div className="model-3d-inner">
                  <div className="model-3d-front">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="model-3d-back">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="model-3d-right">
                    <i className="fas fa-fingerprint"></i>
                  </div>
                  <div className="model-3d-left">
                    <i className="fas fa-key"></i>
                  </div>
                  <div className="model-3d-top">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="model-3d-bottom">
                    <i className="fas fa-shield-virus"></i>
                  </div>
                </div>
              </div>

              {/* Orbiting security symbols */}
              <div className="orbit-symbol symbol-1">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="orbit-symbol symbol-2">
                <i className="fas fa-clock"></i>
              </div>
              <div className="orbit-symbol symbol-3">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div className="orbit-symbol symbol-4">
                <i className="fas fa-lock-open"></i>
              </div>
              <div className="orbit-symbol symbol-5">
                <i className="fas fa-user-lock"></i>
              </div>
              <div className="orbit-symbol symbol-6">
                <i className="fas fa-id-card"></i>
              </div>
            </div>

            {/* Floating Security Cards */}
            <div className="floating-cards">
              <div className="floating-card card-1">
                <div className="card-icon">🔒</div>
                <div className="card-content">
                  <span className="card-value">256-bit</span>
                  <span className="card-label">Encryption</span>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">🛡️</div>
                <div className="card-content">
                  <span className="card-value">2FA</span>
                  <span className="card-label">Protection</span>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">🔐</div>
                <div className="card-content">
                  <span className="card-value">100%</span>
                  <span className="card-label">Secure</span>
                </div>
              </div>
              <div className="floating-card card-4">
                <div className="card-icon">✓</div>
                <div className="card-content">
                  <span className="card-value">Verified</span>
                  <span className="card-label">by SSL</span>
                </div>
              </div>
            </div>

            {/* Security Message */}
            <div className="model-welcome">
              <h2>Two-Factor Authentication</h2>
              <p>Adding an extra layer of security to protect your health information</p>
              
              {/* Security Features */}
              <div className="security-features">
                <div className="security-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>HIPAA Compliant</span>
                </div>
                <div className="security-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>End-to-End Encrypted</span>
                </div>
                <div className="security-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>Secure Authentication</span>
                </div>
                <div className="security-feature">
                  <i className="fas fa-check-circle"></i>
                  <span>Privacy Protected</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="trust-badge">
                  <i className="fas fa-star"></i>
                  <span>Trusted by 50K+ patients</span>
                </div>
                <div className="trust-badge">
                  <i className="fas fa-shield"></i>
                  <span>Secure & Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;