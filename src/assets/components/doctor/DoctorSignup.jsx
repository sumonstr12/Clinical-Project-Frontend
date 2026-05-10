import { useState } from "react";
import { useNavigate } from "react-router";
import "../../css/doctor/doctor-signup.css";
import { errorToast, successToast } from "../../utilities/toast";
import myaxios from "../../utilities/myaxios";

const EyeIcon = ({ open }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);


const STEPS = [
  { id: 1, label: "Account" },
  { id: 2, label: "Personal" },
  { id: 3, label: "Professional" },
  { id: 4, label: "Documents" },
];

const SPECIALIZATIONS = [
  "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology",
  "General Practice", "Neurology", "Oncology", "Ophthalmology",
  "Orthopedics", "Pediatrics", "Psychiatry", "Pulmonology",
  "Radiology", "Surgery", "Urology",
];

const QUALIFICATIONS = [
  "MBBS", "MD", "MS", "FCPS", "BDS", "MDS", "DDS",
  "PhD (Medicine)", "MRCP", "FRCS", "MRCS", "DNB",
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

const Label = ({ children, required }) => (
  <label className="ds-label">
    {children}
    {required && <span className="ds-label-required">*</span>}
  </label>
);

const Input = ({ className = "", error, ...props }) => (
  <input
    className={`ds-input ${error ? "ds-input-error" : ""} ${className}`}
    {...props}
  />
);

const Select = ({ children, className = "", error, ...props }) => (
  <div className="ds-select-wrapper">
    <select
      className={`ds-select ${error ? "ds-select-error" : ""} ${className}`}
      {...props}
    >
      {children}
    </select>
    <div className="ds-select-arrow">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  </div>
);

const FieldError = ({ msg }) => msg ? (
  <p className="ds-field-error">
    <AlertIcon /> {msg}
  </p>
) : null;

const PasswordField = ({ label, name, value, onChange, required, error }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="ds-password-wrapper">
        <Input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••••"
          className="ds-password-input"
          error={error}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="ds-password-toggle"
          tabIndex={-1}
        >
          <EyeIcon open={show} />
        </button>
      </div>
      <FieldError msg={error} />
    </div>
  );
};

const FileUpload = ({ label, accept, hint, value, onChange, name, error }) => (
  <div>
    <Label required>{label}</Label>
    <label
      htmlFor={name}
      className={`ds-file-upload ${error ? "ds-file-upload-error" : "ds-file-upload-default"}`}
    >
      <span className={`ds-file-upload-icon ${error ? "ds-file-upload-icon-error" : "ds-file-upload-icon-default"}`}>
        <UploadIcon />
      </span>
      <span className="ds-file-upload-text">
        {value ? (
          <span className="ds-file-upload-filename">{value.name}</span>
        ) : (
          <>
            <span className="ds-file-upload-title">Click to upload</span>
            <span className="ds-file-upload-hint">{hint}</span>
          </>
        )}
      </span>
      <input 
        id={name} 
        type="file" 
        accept={accept} 
        className="ds-file-upload-input" 
        onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} 
      />
    </label>
    <FieldError msg={error} />
  </div>
);

const StepIndicator = ({ current }) => (
  <div className="ds-step-indicator">
    {STEPS.map((step, i) => (
      <div key={step.id} className="ds-step-item">
        <div className="ds-step-track">
          <div
            className={`ds-step-circle ${
              current > step.id ? "ds-step-circle-completed" : current === step.id ? "ds-step-circle-current" : "ds-step-circle-pending"
            }`}
          >
            {current > step.id ? <CheckIcon /> : step.id}
          </div>
          <span className={`ds-step-label ${current >= step.id ? "ds-step-label-active" : "ds-step-label-inactive"}`}>
            {step.label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className="ds-step-connector">
            <div className={`ds-step-connector-line ${current > step.id ? "ds-step-connector-line-filled" : ""}`} />
          </div>
        )}
      </div>
    ))}
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="ds-summary-row">
    <p className="ds-summary-label">{label}</p>
    <p className="ds-summary-value">{value || <span className="ds-summary-empty">—</span>}</p>
  </div>
);


export default function DoctorSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    gender: "",
    date_of_birth: "",
    specialization: "",
    qualification: "",
    license_count: "",
    img_url: null,
    cv: null,
    role: "HEALTHCARE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFile = (field) => (file) => {
    setForm((prev) => ({ ...prev, [field]: file }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

   const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validate = async () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!form.username.trim()) newErrors.username = "Username is required";
      else if (form.username.length < 3) newErrors.username = "Username must be at least 3 characters";
      
      if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
      
      if (!form.phone.trim()) newErrors.phone = "Phone number is required";
      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
      
      if (form.password !== form.confirm_password) newErrors.confirm_password = "Passwords do not match";

      if (Object.keys(newErrors).length === 0) {
        try {
          const res = await myaxios.post("doctor-email-username-verification", { 
            username: form.username, 
            email: form.email 
          });

          console.log("Validation response:", res.data);
          
          
          if (!res.data.status) {
            
            if (res.data.message && res.data.message.toLowerCase().includes("username")) {
              newErrors.username = res.data.message;
            } 
            if (res.data.message && res.data.message.toLowerCase().includes("email")) {
              newErrors.email = res.data.message;
            }
            
            
            if (!newErrors.username && !newErrors.email) {
              errorToast(res.data.message || "Validation failed");
              newErrors.server = res.data.message || "Validation failed";
            }
          }

          console.log("Validation errors after server check:", newErrors);
        } catch (error) {
          console.error("Validation error:", error);
          errorToast("Server validation failed. Please try again.");
          newErrors.server = "Server validation failed";
          return newErrors; 
        }
      }
    }
    
    if (step === 2) {
      if (!form.gender) newErrors.gender = "Gender is required";
      if (!form.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
      if (!form.specialization) newErrors.specialization = "Specialization is required";
      if (!form.qualification) newErrors.qualification = "Qualification is required";
    }
    
    if (step === 3) {
      if (!form.license_count) newErrors.license_count = "License number is required";
      else if (isNaN(form.license_count)) newErrors.license_count = "License number must be a number";
    }
    
    if (step === 4) {
      if (!form.img_url) newErrors.img_url = "Profile photo is required";
      if (!form.cv) newErrors.cv = "CV is required";
    }
    
    return newErrors;
  };

  const nextStep = async () => {
    setErrors({});
    
    const validationErrors = await validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrors({});
    
    const validationErrors = await validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; 
    }
    
    setLoading(true);
    
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    });
    
    try {
      const response = await myaxios.post("doctor-registration", formData);
      if (response.data.status === true) {
        successToast("Registration successful! Please wait for admin approval.");
        navigate("/doctor/login");
      } else {
        errorToast(response.data.message || "User Registration Failed.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      errorToast("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const BackgroundDecorations = () => (
    <div className="ds-bg-decorations">
      <div className="ds-bg-blob-1" />
      <div className="ds-bg-blob-2" />
      <div className="ds-bg-blob-3" />
      <div className="ds-bg-grid" />
    </div>
  );

  if (success) {
    return (
      <div className="ds-success-container">
        <BackgroundDecorations />
        <div className="ds-success-card">
          <div className="ds-success-content">
            <div className="ds-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="ds-success-title">Application Submitted!</h2>
            <p className="ds-success-message">
              Your account is under review. You'll receive an email once approved by our admin team.
            </p>
            <button
              onClick={() => navigate("/doctor/login")}
              className="ds-success-button"
            >
              <ChevronLeft /> Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-page">
      <BackgroundDecorations />
      
      <div className="ds-card">
        {/* Header Badge */}
        <div className="ds-header-badge">
          <span className="ds-header-badge-text">
            <span className="ds-header-badge-dot" />
            MediConnect — Healthcare Portal
          </span>
        </div>
        
        {/* Title */}
        <div className="ds-title-section">
          <div className="ds-title-icon">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h1 className="ds-title">Healthcare Provider Registration</h1>
          <p className="ds-subtitle">Complete all steps to create your professional account</p>
        </div>
        
        {/* Step Indicator */}
        <StepIndicator current={step} />
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="ds-form">
          {/* Step 1: Account Information */}
          {step === 1 && (
            <div className="ds-step-content">
              <div className="ds-grid-2">
                <div>
                  <Label required>Username</Label>
                  <Input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="dr.username"
                    error={errors.username}
                  />
                  <FieldError msg={errors.username} />
                </div>
                <div>
                  <Label required>Full Name</Label>
                  <Input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Dr. John Doe"
                    error={errors.full_name}
                  />
                  <FieldError msg={errors.full_name} />
                </div>
              </div>
              
              <div>
                <Label required>Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="doctor@hospital.com"
                  error={errors.email}
                />
                <FieldError msg={errors.email} />
              </div>
              
              <div>
                <Label required>Phone Number</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXX XXXXXX"
                  error={errors.phone}
                />
                <FieldError msg={errors.phone} />
              </div>
              
              <div className="ds-grid-2">
                <PasswordField
                  label="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  error={errors.password}
                />
                
                <PasswordField
                  label="Confirm Password"
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                  error={errors.confirm_password}
                />
              </div>
            </div>
          )}
          
          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="ds-step-content">
              <div className="ds-grid-2">
                <div>
                  <Label required>Gender</Label>
                  <Select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    error={errors.gender}
                  >
                    <option value="">Select gender</option>
                    {GENDERS.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </Select>
                  <FieldError msg={errors.gender} />
                </div>
                
                <div>
                  <Label required>Date of Birth</Label>
                  <Input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    error={errors.date_of_birth}
                    max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                  <FieldError msg={errors.date_of_birth} />
                </div>
              </div>
              
              <div>
                <Label required>Specialization</Label>
                <Select
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  error={errors.specialization}
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </Select>
                <FieldError msg={errors.specialization} />
              </div>
              
              <div>
                <Label required>Qualification</Label>
                <Select
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  error={errors.qualification}
                >
                  <option value="">Select qualification</option>
                  {QUALIFICATIONS.map(qual => (
                    <option key={qual} value={qual}>{qual}</option>
                  ))}
                </Select>
                <FieldError msg={errors.qualification} />
              </div>
            </div>
          )}
          
          {/* Step 3: Professional Information */}
          {step === 3 && (
            <div className="ds-step-content">
              <div className="ds-info-box">
                <svg className="ds-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p className="ds-info-text">
                  <span className="ds-info-highlight">Admin review required.</span>{' '}
                  Your account will be reviewed by our admin team before you can start accepting patients. 
                  Please provide accurate information to expedite the approval process.
                </p>
              </div>
              
              <div>
                <Label required>Medical License Number</Label>
                <Input
                  type="number"
                  name="license_count"
                  value={form.license_count}
                  onChange={handleChange}
                  placeholder="e.g., 12345"
                  error={errors.license_count}
                />
                <FieldError msg={errors.license_count} />
              </div>
              
              <div>
                <Label>Account Role</Label>
                <div className="ds-role-badge">
                  <span className="ds-role-dot" />
                  HEALTHCAREPROVIDER
                </div>
                <p className="ds-role-hint">Automatically assigned role — cannot be changed</p>
              </div>
            </div>
          )}
          
          {/* Step 4: Documents */}
          {step === 4 && (
            <div className="ds-step-content">
              <FileUpload
                label="Profile Photo"
                name="img_url"
                accept="image/*"
                hint="JPG, PNG — max 5MB"
                value={form.img_url}
                onChange={handleFile("img_url")}
                error={errors.img_url}
              />
              
              <FileUpload
                label="CV / Resume"
                name="cv"
                accept=".pdf,.doc,.docx"
                hint="PDF or DOC — max 10MB"
                value={form.cv}
                onChange={handleFile("cv")}
                error={errors.cv}
              />
              
              {/* Summary */}
              <div className="ds-summary-card">
                <div className="ds-summary-header">
                  <p className="ds-summary-header-text">Application Summary</p>
                </div>
                <div className="ds-summary-grid">
                  <SummaryRow label="Full Name" value={form.full_name} />
                  <SummaryRow label="Username" value={form.username} />
                  <SummaryRow label="Email" value={form.email} />
                  <SummaryRow label="Phone" value={form.phone} />
                  <SummaryRow label="Specialization" value={form.specialization} />
                  <SummaryRow label="Qualification" value={form.qualification} />
                  <SummaryRow label="License Number" value={form.license_count} />
                  <SummaryRow label="Gender" value={form.gender} />
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className={`ds-nav-buttons ${step > 1 ? "ds-nav-with-back" : "ds-nav-next-only"}`}>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="ds-button-back"
              >
                <ChevronLeft /> Back
              </button>
            )}
            
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ds-button-next"
              >
                Next Step <ChevronRight />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ds-button-submit"
              >
                {loading ? (
                  <>
                    <svg className="ds-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" stroke="currentColor" strokeDasharray="32" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="2" stroke="currentColor" />
                    </svg>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </form>
        
        {/* Login Link */}
        <div className="ds-login-link">
          <p className="ds-login-text">
            Already have an account?{' '}
            <button
              onClick={() => navigate("/login")}
              className="ds-login-button"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}