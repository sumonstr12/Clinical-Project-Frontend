import React, { useState } from 'react';
import '../../css/general_user/approve-request-caregiver.css';

const ApproveRequest = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvedList, setApprovedList] = useState([]);
  const [toast, setToast] = useState(null);

  const patients = [
    {
      id: 1,
      name: 'Rahim Ahmed',
      email: 'rahim.a@gmail.com',
      username: 'rahim_ahmed',
      phone: '01711223344',
      age: 45,
      condition: 'Diabetes Type 2',
      status: 'Pending',
      avatar: 'R'
    },
    {
      id: 2,
      name: 'Sumon Das',
      email: 'sumonc@gmail.com',
      username: 'sumon_care',
      phone: '01300193463',
      age: 38,
      condition: 'Hypertension',
      status: 'Pending',
      avatar: 'S'
    },
    {
      id: 3,
      name: 'Fatima Begum',
      email: 'fatima.b@gmail.com',
      username: 'fatima_b',
      phone: '01822334455',
      age: 52,
      condition: 'Arthritis',
      status: 'Pending',
      avatar: 'F'
    },
    {
      id: 4,
      name: 'Karim Uddin',
      email: 'karim.u@gmail.com',
      username: 'karim_u',
      phone: '01955667788',
      age: 60,
      condition: 'Heart Disease',
      status: 'Pending',
      avatar: 'K'
    },
    {
      id: 5,
      name: 'Nasrin Akter',
      email: 'nasrin.a@gmail.com',
      username: 'nasrin_akt',
      phone: '01699887766',
      age: 35,
      condition: 'Asthma',
      status: 'Pending',
      avatar: 'N'
    },
    {
      id: 6,
      name: 'Abdul Malek',
      email: 'abdul.m@gmail.com',
      username: 'abdul_mlk',
      phone: '01544332211',
      age: 48,
      condition: 'Kidney Disease',
      status: 'Pending',
      avatar: 'A'
    }
  ];

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    if (searchType === 'email') {
      return patient.email.toLowerCase().includes(query);
    }
    if (searchType === 'username') {
      return patient.username.toLowerCase().includes(query);
    }
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.username.toLowerCase().includes(query)
    );
  });

  const handleApprove = (patient) => {
    setSelectedPatient(patient);
    setShowApproveModal(true);
  };

  const confirmApprove = () => {
    if (!approvedList.find((p) => p.id === selectedPatient.id)) {
      setApprovedList([...approvedList, { ...selectedPatient, approvedAt: new Date() }]);
      setToast({ message: `Request approved for ${selectedPatient.name}`, type: 'success' });
    } else {
      setToast({ message: `${selectedPatient.name} is already approved`, type: 'warning' });
    }
    setShowApproveModal(false);
    setSelectedPatient(null);
    setTimeout(() => setToast(null), 3000);
  };

  const closeModal = () => {
    setShowApproveModal(false);
    setSelectedPatient(null);
  };

  return (
    <div className="pa-container">
      <div className="pa-wrapper">
        <h1 className="pa-heading">Patient Search & Approval</h1>

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
              placeholder="Search by name, email or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="pa-clear-btn" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>

          <div className="pa-filter-group">
            <button
              className={`pa-filter-btn ${searchType === 'all' ? 'pa-filter-btn--active' : ''}`}
              onClick={() => setSearchType('all')}
            >
              All
            </button>
            <button
              className={`pa-filter-btn ${searchType === 'email' ? 'pa-filter-btn--active' : ''}`}
              onClick={() => setSearchType('email')}
            >
              Email
            </button>
            <button
              className={`pa-filter-btn ${searchType === 'username' ? 'pa-filter-btn--active' : ''}`}
              onClick={() => setSearchType('username')}
            >
              Username
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="pa-results-info">
          <span className="pa-results-count">{filteredPatients.length} patient(s) found</span>
          <span className="pa-approved-count">{approvedList.length} approved</span>
        </div>

        {/* Patient List */}
        <div className="pa-list">
          {filteredPatients.length === 0 ? (
            <div className="pa-empty">
              <svg className="pa-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M8 8l6 6M14 8l-6 6" />
              </svg>
              <p className="pa-empty-text">No patients found matching your search</p>
            </div>
          ) : (
            filteredPatients.map((patient) => {
              const isApproved = approvedList.find((p) => p.id === patient.id);
              return (
                <div key={patient.id} className={`pa-card ${isApproved ? 'pa-card--approved' : ''}`}>
                  <div className="pa-card-main">
                    <div className="pa-card-avatar">{patient.avatar}</div>
                    <div className="pa-card-info">
                      <h3 className="pa-card-name">{patient.name}</h3>
                      <div className="pa-card-meta">
                        <span className="pa-meta-item">
                          <svg className="pa-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          {patient.email}
                        </span>
                        <span className="pa-meta-item">
                          <svg className="pa-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          @{patient.username}
                        </span>
                        <span className="pa-meta-item">
                          <svg className="pa-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          {patient.phone}
                        </span>
                      </div>
                      <div className="pa-card-tags">
                        <span className="pa-tag pa-tag--age">Age: {patient.age}</span>
                        <span className="pa-tag pa-tag--condition">{patient.condition}</span>
                        {isApproved && <span className="pa-tag pa-tag--approved">Approved</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`pa-approve-btn ${isApproved ? 'pa-approve-btn--done' : ''}`}
                    onClick={() => handleApprove(patient)}
                    disabled={isApproved}
                  >
                    {isApproved ? (
                      <>
                        <svg className="pa-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Approved
                      </>
                    ) : (
                      <>
                        <svg className="pa-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        Approve Request
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedPatient && (
        <div className="pa-modal-overlay" onClick={closeModal}>
          <div className="pa-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pa-modal-close" onClick={closeModal}>
              ✕
            </button>

            <div className="pa-modal-header">
              <div className="pa-modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="pa-modal-title">Approve Patient Request</h2>
              <p className="pa-modal-subtitle">
                You are about to approve a request for the following patient
              </p>
            </div>

            <div className="pa-modal-body">
              <div className="pa-modal-patient">
                <div className="pa-modal-avatar">{selectedPatient.avatar}</div>
                <div className="pa-modal-patient-info">
                  <h3 className="pa-modal-patient-name">{selectedPatient.name}</h3>
                  <p className="pa-modal-patient-email">{selectedPatient.email}</p>
                  <p className="pa-modal-patient-username">@{selectedPatient.username}</p>
                </div>
              </div>

              <div className="pa-modal-details">
                <div className="pa-modal-detail-row">
                  <span className="pa-modal-detail-label">Phone</span>
                  <span className="pa-modal-detail-value">{selectedPatient.phone}</span>
                </div>
                <div className="pa-modal-detail-row">
                  <span className="pa-modal-detail-label">Age</span>
                  <span className="pa-modal-detail-value">{selectedPatient.age} years</span>
                </div>
                <div className="pa-modal-detail-row">
                  <span className="pa-modal-detail-label">Condition</span>
                  <span className="pa-modal-detail-value">{selectedPatient.condition}</span>
                </div>
              </div>
            </div>

            <div className="pa-modal-actions">
              <button className="pa-modal-btn pa-modal-btn--cancel" onClick={closeModal}>
                Cancel
              </button>
              <button className="pa-modal-btn pa-modal-btn--confirm" onClick={confirmApprove}>
                <svg className="pa-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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