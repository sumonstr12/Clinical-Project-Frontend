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
            originalStatus: item.status,
          }));

        setCaregivers(formattedData);
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

  const handleDelete = async (caregiverId) => {
    try {
      console.log("Deleting Caregiver Request with ID:", caregiverId);
      const response = await myaxios.post(`caregiver-reject`, {
        caregiver_id: caregiverId
      });

      successToast(response.data.message || 'Caregiver Request Deleted');

      fetchCaregiverRequests();
    } catch (error) {
      console.log(error);

      errorToast(
        error?.response?.data?.message ||
        'Failed to Delete Caregiver Request'
      );
    }
  }

  const handleUpdateStatus = async (caregiver) => {
    try {
      if (!caregiver.verification_link) {
        errorToast('Verification link is missing');
        return;
      }
      
      let token;
      
      
      if (caregiver.verification_link.includes('/')) {
        token = caregiver.verification_link.split('/').filter(Boolean).pop();
      } else {
        token = caregiver.verification_link;
      }
      
      
      if (!token || token.length === 0) {
        errorToast('Invalid token format');
        return;
      }
      
      const response = await myaxios.post(`verify-request/${token}/`, {
        status: caregiver.status
      });

      successToast(response.data.message || 'Status Updated Successfully');
      
      fetchCaregiverRequests();
      closeModal();
    } catch (error) {
      console.log("Update error:", error);
      errorToast(
        error?.response?.data?.message ||
        'Failed to Update Status'
      );
    }
  };

  // Group caregivers by status
  const pendingCaregivers = caregivers.filter((c) => c.status === 'pending');
  const activeCaregivers = caregivers.filter((c) => c.status === 'active');
  const inactiveCaregivers = caregivers.filter((c) => c.status === 'inactive');
  const rejectedCaregivers = caregivers.filter((c) => c.status === 'rejected');

  // Check if any caregiver exists with specific status
  const hasPending = pendingCaregivers.length > 0;
  const hasActive = activeCaregivers.length > 0;
  const hasInactive = inactiveCaregivers.length > 0;
  const hasRejected = rejectedCaregivers.length > 0;

  // Get all caregivers with statuses for display
  const getAllCaregiversByStatus = () => {
    const allGroups = [];
    
    if (hasPending) {
      allGroups.push({ 
        title: 'Pending Requests', 
        status: 'pending', 
        caregivers: pendingCaregivers,
        className: 'cr-list-panel'
      });
    }
    
    if (hasActive) {
      allGroups.push({ 
        title: 'Active Caregivers', 
        status: 'active', 
        caregivers: activeCaregivers,
        className: 'cr-list-panel cr-list-panel--active'
      });
    }
    
    if (hasInactive) {
      allGroups.push({ 
        title: 'Inactive Caregivers', 
        status: 'inactive', 
        caregivers: inactiveCaregivers,
        className: 'cr-list-panel cr-list-panel--inactive'
      });
    }
    
    if (hasRejected) {
      allGroups.push({ 
        title: 'Rejected Caregivers', 
        status: 'rejected', 
        caregivers: rejectedCaregivers,
        className: 'cr-list-panel cr-list-panel--rejected'
      });
    }
    
    return allGroups;
  };

  const caregiverGroups = getAllCaregiversByStatus();

  return (
    <div className="cr-container">
      <h1 className="cr-heading">Caregiver Request</h1>

      {caregivers.length === 0 ? (
        <div className="cr-empty-state">
          <p className="cr-empty-message">No caregiver requests found</p>
        </div>
      ) : (
        <div className="cr-grid">
          {caregiverGroups.map((group, index) => (
            <div key={index} className={group.className}>
              <h2 className="cr-list-title">{group.title}</h2>

              <div className="cr-list">
                {group.caregivers.map((caregiver) => (
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

                        <span className={`cr-status cr-status--${caregiver.status}`}>
                          <span className={`cr-status-dot cr-status-dot--${caregiver.status}`}></span>
                          {caregiver.status}
                        </span>
                      </div>
                    </div>

                    {caregiver.status === 'pending' && (
                      <>
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
                      </>
                    )}

                    {caregiver.status === 'active' && (
                      <span className="cr-verified-badge">
                        <svg className="cr-verified-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

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
                  {/* Check actual API status - only show dropdown if status is 'active' */}
                  {selectedCaregiver.originalStatus !== "pending" ? (
                    <select
                      value={selectedCaregiver.status}
                      onChange={(e) =>
                          setSelectedCaregiver({
                              ...selectedCaregiver,
                              status: e.target.value
                          })
                      }
                  >
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                      <option value="rejected">Rejected</option>
                  </select>
                  ) : (
                    // Show status as text when not active
                    <span className="cr-status-text">
                      {selectedCaregiver.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="cr-modal-actions">
              {/* Only show Update Status button when actual API status is active */}
              {selectedCaregiver.originalStatus !== "pending" && (
                <button
                  className="cr-update-btn"
                  onClick={() => handleUpdateStatus(selectedCaregiver)}
                >
                  Update Status
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