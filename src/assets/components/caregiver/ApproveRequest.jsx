import React, { useState } from 'react';
import myaxios from '../../utilities/myaxios';
import '../../css/general_user/approve-request-caregiver.css';

const ApproveRequest = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const relationships = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'wife', label: 'Wife' },
  { value: 'husband', label: 'Husband' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' }
];

  // Search patient by email
  const searchPatient = async (email) => {
    if (!email.trim()) {
      setToast({
        type: 'warning',
        message: 'Please enter an email address'
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await myaxios.post('/add-new-patient', {
        action: 'check_patient',
        patient_email: email.trim()
      });

      if (response.data.status) {
        setSearchResults([{
          email: email.trim(),
          name: email.trim().split('@')[0], 
          avatar: email.trim().split('@')[0][0].toUpperCase(),
          username: email.trim().split('@')[0]
        }]);
        setHasSearched(true);
      }
      else {
        setToast({
          type: 'warning',
          message: response.data.message || 'Patient not found'
        });
        setTimeout(() => setToast(null), 3000);
        setSearchResults([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setToast({
        type: 'warning',
        message: error.response?.data?.message || 'Patient not found with this email'
      });
      setTimeout(() => setToast(null), 3000);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

 
  const handleSearch = () => {
    searchPatient(searchQuery);
  };

  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser({
      ...user,
    });
    setShowUserDetails(true);
    setRelationship('');
  };

  const handleSendRequest = async () => {
    if (!relationship) {
      setToast({
        type: 'warning',
        message: 'Please select a relationship type'
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await myaxios.post('/add-new-patient', {
        action: 'create_patient_relation',
        patient_email: selectedUser.email,
        relationship_type: relationship,
        is_primary: false,
        can_book_appointment: true,
        can_view_medical_records: false
      });

      if (response.data.status) {
        setToast({
          type: 'success',
          message: `Request sent to ${selectedUser.email} as ${relationship}`
        });
        setTimeout(() => setToast(null), 3000);

        setShowUserDetails(false);
        setSelectedUser(null);
        setRelationship('');
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
      }
    } catch (error) {
      console.error('Send request error:', error);
      setToast({
        type: 'warning',
        message: error.response?.data?.message || 'Failed to send request'
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setShowUserDetails(false);
    setSelectedUser(null);
    setRelationship('');
  };

  return (
    <div className="pa-container">
      <div className="pa-wrapper">
        <h1 className="pa-heading">Find & Connect with Patients</h1>

        {/* Search Section */}
        <div className="pa-search-section">
          <div className="pa-search-bar">
            <svg className="pa-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              className="pa-search-input"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button 
              className="pa-search-btn" 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <span className="pa-spinner"></span>
              ) : (
                <svg className="pa-search-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              )}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {hasSearched && (
          <div className="pa-results">
            <div className="pa-results-header">
              <span className="pa-results-count">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </span>
            </div>

            <div className="pa-list">
              {searchResults.length === 0 ? (
                <div className="pa-empty">
                  <svg className="pa-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                    <path d="M8 8l6 6M14 8l-6 6" />
                  </svg>
                  <p className="pa-empty-text">No users found matching "{searchQuery}"</p>
                </div>
              ) : (
                searchResults.map((user, index) => (
                  <div 
                    key={index} 
                    className="pa-card"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="pa-card-main">
                      <div className="pa-card-avatar">{user.avatar}</div>
                      <div className="pa-card-info">
                        <h3 className="pa-card-name">{user.name}</h3>
                        <div className="pa-card-meta">
                          <span className="pa-meta-item">
                            <svg className="pa-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect width="20" height="16" x="2" y="4" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pa-card-action">
                      <span className="pa-click-hint">Click to connect →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}


        {!hasSearched && !searchQuery && (
          <div className="pa-search-tip">
            <svg className="pa-search-tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <p>Search for a patient by their email address to get started</p>
          </div>
        )}
      </div>

      {showUserDetails && selectedUser && (
        <div className="pa-modal-overlay" onClick={handleCloseDetails}>
          <div className="pa-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pa-modal-close" onClick={handleCloseDetails}>
              ✕
            </button>

            <div className="pa-modal-header">
              <div className="pa-modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className="pa-modal-title">Patient Details</h2>
              <p className="pa-modal-subtitle">
                Review patient information and establish connection
              </p>
            </div>

            <div className="pa-modal-body">
              <div className="pa-modal-patient">
                <div className="pa-modal-avatar">{selectedUser.avatar}</div>
                <div className="pa-modal-patient-info">
                  <h3 className="pa-modal-patient-name">{selectedUser.name}</h3>
                  <p className="pa-modal-patient-email">{selectedUser.email}</p>
                  {selectedUser.username && (
                    <p className="pa-modal-patient-username">@{selectedUser.username}</p>
                  )}
                </div>
              </div>

              <div className="pa-modal-relationship">
                <label className="pa-relationship-label">
                  <svg className="pa-relationship-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Select your relationship with the patient
                </label>
                <select 
                  className="pa-relationship-select"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Choose relationship type...</option>
                  {relationships.map((rel) => (
                    <option key={rel.value} value={rel.value}>
                      {rel.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pa-modal-actions">
              <button 
                className="pa-modal-btn pa-modal-btn--cancel" 
                onClick={handleCloseDetails}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="pa-modal-btn pa-modal-btn--confirm" 
                onClick={handleSendRequest}
                disabled={!relationship || loading}
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`pa-toast pa-toast--${toast.type}`}>
          <svg className="pa-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {toast.type === 'success' ? (
              <polyline points="20 6 9 17 4 12" />
            ) : (
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
          <span className="pa-toast-message">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ApproveRequest;