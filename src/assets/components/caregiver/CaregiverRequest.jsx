import React, { useEffect, useState } from 'react';
import '../../css/general_user/caregiverrequest.css';
import myaxios from '../../utilities/myaxios';
import { successToast, errorToast } from '../../utilities/toast';

const CaregiverRequest = () => {
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [caregivers, setCaregivers] = useState([]);

  useEffect(() => {
    fetchCaregiverRequests();
  }, []);

  const fetchCaregiverRequests = async () => {
    try {
      const response = await myaxios.get('caregiver-request-list');

      if (response.data.status) {

        const formattedData = response.data.data
          .filter(item => item.verification_link !== null && item.verification_link !== "")
          .map((item) => ({
            id: item.id,
            name: item.caregiver_name,
            email: item.caregiver_email,
            phone: item.caregiver_phone,
            relationship_type: item.relationship_type,
            status: item.status,
            verification_link: item.verification_link,
          }));

        setCaregivers(formattedData);
        console.log("Caregiver Requests:", formattedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => setSelectedCaregiver(null);

  const handleVerify = async (verificationLink) => {
    try {
      const response = await myaxios.get(verificationLink);

      successToast(response.data.message || 'Verification Successful');

      fetchCaregiverRequests();
    } catch (error) {
      console.log(error);

      errorToast(
        error?.response?.data?.message ||
        'Verification Failed'
      );
    }
  };

  const pendingCaregivers = caregivers.filter((c) => c.status === 'pending');
  const verifiedCaregivers = caregivers.filter((c) => c.status === 'active');

  return (
    <div className="cr-container">
      <h1 className="cr-heading">Caregiver Request</h1>

      <div className="cr-grid">
        {pendingCaregivers.length > 0 && (
          <div className="cr-list-panel">
            <h2 className="cr-list-title">Pending Requests</h2>

            <div className="cr-list">
              {pendingCaregivers.map((caregiver) => (
                <div
                  key={caregiver.id}
                  onClick={() => setSelectedCaregiver(caregiver)}
                  className={`cr-card ${selectedCaregiver?.id === caregiver.id ? 'cr-card--active' : ''}`}
                >
                  <div className="cr-card-info">
                    <div className="cr-avatar">
                      {caregiver.name.charAt(0)}
                    </div>

                    <div className="cr-card-meta">
                      <h3 className="cr-card-name">
                        {caregiver.name}
                      </h3>

                      <span className="cr-status cr-status--pending">
                        <span className="cr-status-dot cr-status-dot--pending"></span>
                        {caregiver.status}
                      </span>
                    </div>
                  </div>

                  <button
                    className="cr-verify-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerify(caregiver.verification_link);
                    }}
                  >
                    Verify
                  </button>
                  <button
                    className="cr-verify-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(caregiver.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Caregivers Section */}
        {verifiedCaregivers.length > 0 && (
          <div className="cr-list-panel cr-list-panel--verified">
            <h2 className="cr-list-title cr-list-title--verified">Verified Caregivers</h2>

            <div className="cr-list">
              {verifiedCaregivers.map((caregiver) => (
                <div
                  key={caregiver.id}
                  onClick={() => setSelectedCaregiver(caregiver)}
                  className={`cr-card cr-card--verified ${selectedCaregiver?.id === caregiver.id ? 'cr-card--active' : ''}`}
                >
                  <div className="cr-card-info">
                    <div className="cr-avatar cr-avatar--verified">
                      {caregiver.name.charAt(0)}
                    </div>

                    <div className="cr-card-meta">
                      <h3 className="cr-card-name">
                        {caregiver.name}
                      </h3>

                      <span className="cr-status cr-status--verified">
                        <span className="cr-status-dot cr-status-dot--verified"></span>
                        {caregiver.status}
                      </span>
                    </div>
                  </div>

                  <span className="cr-verified-badge">
                    <svg className="cr-verified-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Modal Overlay */}
      {selectedCaregiver && (
        <div className="cr-modal-overlay" onClick={closeModal}>
          <div
            className="cr-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="cr-modal-close"
              onClick={closeModal}
            >
              ✕
            </button>

            <div className="cr-modal-header">
              <div className="cr-modal-avatar">
                {selectedCaregiver.name.charAt(0)}
              </div>

              <div className="cr-modal-header-text">
                <h2 className="cr-modal-title">
                  Caregiver Details
                </h2>

                <p className="cr-modal-id">
                  ID: #{selectedCaregiver.id}
                </p>
              </div>
            </div>

            <div className="cr-modal-body">
              <div className="cr-detail-item">
                <label className="cr-detail-label">
                  Full Name
                </label>
                <div className="cr-detail-value">
                  {selectedCaregiver.name}
                </div>
              </div>

              <div className="cr-detail-item">
                <label className="cr-detail-label">
                  Email
                </label>
                <div className="cr-detail-value">
                  {selectedCaregiver.email}
                </div>
              </div>

              <div className="cr-detail-item">
                <label className="cr-detail-label">
                  Phone
                </label>
                <div className="cr-detail-value">
                  {selectedCaregiver.phone}
                </div>
              </div>

              <div className="cr-detail-item">
                <label className="cr-detail-label">
                  Relationship
                </label>
                <div className="cr-detail-value">
                  {selectedCaregiver.relationship_type}
                </div>
              </div>

              <div className="cr-detail-item">
                <label className="cr-detail-label">
                  Status
                </label>
                <div className="cr-detail-value cr-detail-value--status">
                  <span className={`cr-status-dot ${selectedCaregiver.status === 'Verified' ? 'cr-status-dot--verified' : 'cr-status-dot--pending'}`}></span>
                  {selectedCaregiver.status}
                </div>
              </div>
            </div>

            <div className="cr-modal-actions">
              {selectedCaregiver.status === 'Pending' && (
                <button
                  className="cr-confirm-btn"
                  onClick={() =>
                    handleVerify(selectedCaregiver.verification_link)
                  }
                >
                  Confirm Request
                </button>
              )}

              <button
                className="cr-close-btn"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverRequest;