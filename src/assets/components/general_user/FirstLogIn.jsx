import React, { useState } from "react";
import { useNavigate } from "react-router";
import '../../css/general_user/firstlogin.css';
import myaxios from "../../utilities/myaxios";
import { successToast, errorToast } from "../../utilities/toast";
import { all } from "axios";
import alreadyLoggedIn from "../../utilities/alreadyLoggedIn";

const FirstLogIn = () => {

    if (!alreadyLoggedIn){
        errorToast("Logged In First!")
        return
    }
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cancer_type: "",
    cancer_treatment_type: "",
    medicine_and_dose: "",
    chemo_history_count: "",
    height: "",
    gender: "",
    weight: "",
    date_of_birth: "",
    region: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = [
      'cancer_type', 'cancer_treatment_type', 'medicine_and_dose', 
      'chemo_history_count', 'height', 'gender', 'weight', 
      'date_of_birth', 'region'
    ];
    
    for (let field of requiredFields) {
      if (!formData[field]) {
        errorToast(`⚠️ Please fill in ${field.replace(/_/g, ' ')}`);
        return;
      }
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        chemo_history_count: parseInt(formData.chemo_history_count),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight)
      };

      const response = await myaxios.post("user-login/update-profile", submitData);
      
      if (response.data.status === true) {
        successToast(response.data.message || "Information saved successfully!");
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        errorToast(response.data.message || "Failed to save information");
      }
    } catch (error) {
      errorToast(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const cancerTypes = [
    "Lung Cancer", "Breast Cancer", "Prostate Cancer", "Colorectal Cancer", 
    "Skin Cancer", "Leukemia", "Lymphoma", "Brain Cancer", 
    "Pancreatic Cancer", "Ovarian Cancer", "Other"
  ];

  
  const treatmentTypes = [
    "Chemotherapy", "Radiation Therapy", "Immunotherapy", 
    "Targeted Therapy", "Hormone Therapy", "Stem Cell Transplant", 
    "Surgery", "Clinical Trial", "Other"
  ];

  
  const regions = [
    "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", 
    "Sylhet", "Rangpur", "Mymensingh"
  ];

  return (
    <div className="firstlogin-container">
      {/* Background Effects */}
      <div className="firstlogin-bg" aria-hidden="true"></div>
      <div className="firstlogin-grid" aria-hidden="true"></div>
      
      {/* Floating medical elements */}
      <div className="firstlogin-floating-elements">
        <div className="floating-element heartbeat">❤️</div>
        <div className="floating-element stethoscope">🩺</div>
        <div className="floating-element cross">✚</div>
        <div className="floating-element pill">💊</div>
        <div className="floating-element syringe">💉</div>
        <div className="floating-element dna">🧬</div>
      </div>

      {/* Main Content */}
      <div className="firstlogin-wrapper">
        {/* Left Side - Illustration & Info */}
        <div className="firstlogin-illustration-side">
          <div className="illustration-container">
            {/* 3D Medical Icons */}
            <div className="medical-3d-icons">
              <div className="icon-3d dna-3d">
                <i className="fas fa-dna"></i>
              </div>
              <div className="icon-3d heart-3d">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="icon-3d lung-3d">
                <i className="fas fa-lungs"></i>
              </div>
              <div className="icon-3d brain-3d">
                <i className="fas fa-brain"></i>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="welcome-message">
              <h2>Welcome to ClinicCare</h2>
              <p>Please complete your medical profile to help us provide better care</p>
            </div>

            {/* Info Cards */}
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">🔬</div>
                <div className="info-content">
                  <h4>Personalized Care</h4>
                  <p>We tailor treatments based on your specific cancer type and history</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">📊</div>
                <div className="info-content">
                  <h4>Treatment Tracking</h4>
                  <p>Monitor your chemotherapy sessions and medication schedule</p>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon">🤝</div>
                <div className="info-content">
                  <h4>Expert Matching</h4>
                  <p>Connect with specialists in your specific cancer type</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-value">500+</span>
                <span className="stat-label">Oncologists</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">50K+</span>
                <span className="stat-label">Cancer Patients</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-value">98%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
            </div>

            {/* Testimonial */}
            <div className="testimonial-card">
              <i className="fas fa-quote-left"></i>
              <p>The detailed medical profile helped my oncologist understand my history perfectly. Highly recommended!</p>
              <div className="testimonial-author">
                <span className="author-name">- Sarah Ahmed</span>
                <span className="author-detail">Breast Cancer Survivor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="firstlogin-form-side">
          <div className="firstlogin-form-container">
            {/* Header */}
            <div className="form-header">
              <div className="header-logo">
                <div className="logo-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <span className="logo-text">ClinicCare</span>
              </div>
              <h1>Medical Information</h1>
              <p>Please provide your details for personalized treatment</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="firstlogin-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cancer_type">
                    <i className="fas fa-disease"></i>
                    Cancer Type <span className="required">*</span>
                  </label>
                  <select
                    id="cancer_type"
                    name="cancer_type"
                    value={formData.cancer_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select cancer type</option>
                    {cancerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="cancer_treatment_type">
                    <i className="fas fa-syringe"></i>
                    Treatment Type <span className="required">*</span>
                  </label>
                  <select
                    id="cancer_treatment_type"
                    name="cancer_treatment_type"
                    value={formData.cancer_treatment_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select treatment type</option>
                    {treatmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="medicine_and_dose">
                  <i className="fas fa-pills"></i>
                  Medicine & Dose <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="medicine_and_dose"
                  name="medicine_and_dose"
                  placeholder="e.g., Cisplatin 50mg, Paclitaxel 200mg"
                  value={formData.medicine_and_dose}
                  onChange={handleChange}
                  required
                />
                <small className="input-hint">Current medication and dosage</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="chemo_history_count">
                    <i className="fas fa-history"></i>
                    Chemo History Count <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="chemo_history_count"
                    name="chemo_history_count"
                    placeholder="Number of sessions"
                    min="0"
                    value={formData.chemo_history_count}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">
                    <i className="fas fa-venus-mars"></i>
                    Gender <span className="required">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="height">
                    <i className="fas fa-ruler-vertical"></i>
                    Height (cm) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    placeholder="175.50"
                    step="0.01"
                    min="0"
                    value={formData.height}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">
                    <i className="fas fa-weight-scale"></i>
                    Weight (kg) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    placeholder="70.25"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date_of_birth">
                    <i className="fas fa-calendar"></i>
                    Date of Birth <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="region">
                    <i className="fas fa-map-marker-alt"></i>
                    Region <span className="required">*</span>
                  </label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select region</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="privacy-notice">
                <i className="fas fa-shield-alt"></i>
                <span>Your medical information is encrypted and secure. We follow HIPAA guidelines.</span>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Saving Information...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    Save & Continue
                  </>
                )}
              </button>

              {/* Skip Option */}
              <div className="skip-option">
                <button 
                  type="button" 
                  className="skip-btn"
                  onClick={() => navigate('/dashboard')}
                >
                  Skip for now
                </button>
                <small>You can complete this later in your profile</small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstLogIn;