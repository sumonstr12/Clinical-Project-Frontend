import React, { useState } from 'react';
import '../../css/general_user/caregiverrequest.css';

const CaregiverRequest = () => {
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);

  const caregivers = [
    {
      id: 1,
      name: 'Sumon Caregiver',
      email: 'sumonc@gmail.com',
      phone: '01300193463',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Rahim Hossain',
      email: 'rahim.h@gmail.com',
      phone: '01700111222',
      status: 'Available'
    },
    {
      id: 3,
      name: 'Fatima Begum',
      email: 'fatima.b@gmail.com',
      phone: '01822334455',
      status: 'Available'
    },
    {
      id: 4,
      name: 'Karim Uddin',
      email: 'karim.u@gmail.com',
      phone: '01955667788',
      status: 'Available'
    }
  ];

  const closeModal = () => setSelectedCaregiver(null);

  return (
    <div className="cr-container">
      <h1 className="cr-heading">Caregiver Request</h1>

      <div className="cr-grid">
        {/* Caregiver List */}
        <div className="cr-list-panel">
          <h2 className="cr-list-title">Available Caregivers</h2>

          <div className="cr-list">
            {caregivers.map((caregiver) => (
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
                    <h3 className="cr-card-name">{caregiver.name}</h3>
                    <span className="cr-status">
                      <span className="cr-status-dot"></span>
                      {caregiver.status}
                    </span>
                  </div>
                </div>

                <button
                  className="cr-verify-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Verifying ${caregiver.name}...`);
                  }}
                >
                  Verify
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Modal Overlay */}
      {selectedCaregiver && (
        <div className="cr-modal-overlay" onClick={closeModal}>
          <div className="cr-modal" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className="cr-modal-close" onClick={closeModal}>
              ✕
            </button>

            <div className="cr-modal-header">
              <div className="cr-modal-avatar">
                {selectedCaregiver.name.charAt(0)}
              </div>
              <div className="cr-modal-header-text">
                <h2 className="cr-modal-title">Caregiver Details</h2>
                <p className="cr-modal-id">ID: #{selectedCaregiver.id}</p>
              </div>
            </div>

            <div className="cr-modal-body">
              <div className="cr-detail-item">
                <label className="cr-detail-label">Full Name</label>
                <div className="cr-detail-value">{selectedCaregiver.name}</div>
              </div>

              <div className="cr-detail-item">
                <label className="cr-detail-label">Email</label>
                <div className="cr-detail-value">{selectedCaregiver.email}</div>
              </div>

              <div className="cr-detail-item">
                <label className="cr-detail-label">Phone</label>
                <div className="cr-detail-value">{selectedCaregiver.phone}</div>
              </div>

              <div className="cr-detail-item">
                <label className="cr-detail-label">Status</label>
                <div className="cr-detail-value cr-detail-value--status">
                  <span className="cr-status-dot"></span>
                  {selectedCaregiver.status}
                </div>
              </div>
            </div>

            <div className="cr-modal-actions">
              <button className="cr-confirm-btn">Confirm Request</button>
              <button className="cr-close-btn" onClick={closeModal}>
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