import React, { useState, useEffect } from 'react';
import myaxios from '../../utilities/myaxios';
import '../../css/appointment/appointmentviewbyuser.css';

const AppointmentViewbyUser = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await myaxios.get('/appointment/view/users/');
        if (response.data && response.data.status === true) {
          const processedData = response.data.data.map(appointment => ({
            ...appointment,
            computedStatus: computeAppointmentStatus(appointment)
          }));
          
          console.log('Processed appointments:', processedData.map(apt => ({
            id: apt.id,
            date: apt.appointment_date,
            backendStatus: apt.status,
            computedStatus: apt.computedStatus
          })));
          
          setAppointments(processedData);
        } else {
          setError('Failed to load appointments');
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Unable to fetch appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Single consistent function to check if appointment is missed
  const isAppointmentMissed = (appointment) => {
    if (!appointment.appointment_date || !appointment.slot) return false;

    const appointmentDateTime = new Date(appointment.appointment_date);
    const [hours, minutes] = appointment.slot.split(':');
    appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    
    const now = new Date();
    const timeDiff = appointmentDateTime - now;
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Consider missed if appointment time has passed by more than 30 minutes
    return minutesDiff < -30;
  };

  const computeAppointmentStatus = (appointment) => {
    if (!appointment.status) return 'pending';

    const status = appointment.status.toUpperCase();

    if (status === 'COMPLETED') return 'completed';
    if (status === 'CANCELLED') return 'cancelled';

    if (status === 'APPROVED') {
      if (isAppointmentMissed(appointment)) {
        return 'missed';
      }
      return 'upcoming';
    }

    if (status === 'PENDING') {
      if (isAppointmentMissed(appointment)) {
        return 'missed';
      }
      return 'pending';
    }

    return 'pending';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return { text: 'Approved', class: 'vsu-status-confirmed' };
      case 'completed':
        return { text: 'Completed', class: 'vsu-status-completed' };
      case 'cancelled':
        return { text: 'Cancelled', class: 'vsu-status-canceled' };
      case 'missed':
        return { text: 'Missed', class: 'vsu-status-missed' };
      case 'pending':
        return { text: 'Pending', class: 'vsu-status-pending' };
      default:
        return { text: 'Pending', class: 'vsu-status-pending' };
    }
  };

  const getAppointmentType = (appointment) => {
    if (appointment.meeting_link || appointment.is_video_call) {
      return { type: 'Telehealth', icon: '🎥', label: 'Video Consultation' };
    }
    return { type: 'In-Person', icon: '🏥', label: 'Chamber Visit' };
  };

  const isUpcoming = (appointment) => {
    return appointment.computedStatus === 'upcoming';
  };

  const isCompleted = (appointment) => {
    return appointment.computedStatus === 'completed';
  };

  const isCancelled = (appointment) => {
    return appointment.computedStatus === 'cancelled';
  };

  const isPending = (appointment) => {
    return appointment.computedStatus === 'pending';
  };

  const isMissed = (appointment) => {
    return appointment.computedStatus === 'missed';
  };

  const getFilteredAppointments = () => {
    switch (activeTab) {
      case 'upcoming':
        return appointments.filter(apt => isUpcoming(apt) || isPending(apt));
      case 'completed':
        return appointments.filter(apt => isCompleted(apt));
      case 'canceled':
        return appointments.filter(apt => isCancelled(apt));
      case 'missed':
        return appointments.filter(apt => isMissed(apt));
      default:
        return appointments.filter(apt => isUpcoming(apt) || isPending(apt));
    }
  };

  const isJoinButtonActive = (appointment) => {
    if (!appointment.appointment_date || !appointment.slot) return false;
    
    const appointmentDateTime = new Date(appointment.appointment_date);
    const [hours, minutes] = appointment.slot.split(':');
    appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
    
    const now = new Date();
    const timeDiff = appointmentDateTime - now;
    const minutesDiff = timeDiff / (1000 * 60);
    
    // Active if within 10 minutes before appointment or during appointment time (up to 30 minutes after)
    return minutesDiff <= 10 && minutesDiff > -30;
  };

  const handleJoinCall = (appointment) => {
    const meetingLink = appointment.meeting_link || 'https://meet.google.com/example';
    window.open(meetingLink, '_blank');
  };

  const handleCancelAppointment = async (appointment) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await myaxios.put(`/appointment/cancel/${appointment.id}/`);
        setAppointments(prev => prev.map(apt => 
          apt.id === appointment.id 
            ? { ...apt, computedStatus: 'cancelled', status: 'CANCELLED' }
            : apt
        ));
        alert('Appointment canceled successfully');
      } catch (err) {
        console.error('Error canceling appointment:', err);
        alert('Failed to cancel appointment. Please try again.');
      }
    }
  };

  const handleDownloadPrescription = (appointment) => {
    if (appointment.prescription_url) {
      window.open(appointment.prescription_url, '_blank');
    } else {
      alert('No prescription available yet');
    }
  };

  const handleGiveReview = (appointment) => {
    alert(`Give review for Dr. ${appointment.provider?.user?.full_name}`);
  };

  const handleBookAgain = (appointment) => {
    alert(`Book again with Dr. ${appointment.provider?.user?.full_name}`);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="vsu-schedule-container vsu-dark-professional">
        <div className="vsu-loading-spinner">
          <div className="vsu-spinner"></div>
          <p>Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vsu-schedule-container vsu-dark-professional">
        <div className="vsu-error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="vsu-retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredAppointments = getFilteredAppointments();
  const tabCounts = {
    upcoming: appointments.filter(apt => isUpcoming(apt) || isPending(apt)).length,
    completed: appointments.filter(apt => isCompleted(apt)).length,
    canceled: appointments.filter(apt => isCancelled(apt)).length,
    missed: appointments.filter(apt => isMissed(apt)).length,
  };

  return (
    <div className="vsu-schedule-container vsu-dark-professional">
      <div className="vsu-static-header">
        <h1>My Appointments</h1>
        <div className="vsu-data-protection-notice">
          This data cannot be changed manually. You can cancel the appointment. For any changes, please contact support team.
        </div>
      </div>

      <div className="vsu-tabs-container">
        <button 
          className={`vsu-tab ${activeTab === 'upcoming' ? 'vsu-tab-active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming <span className="vsu-tab-count">{tabCounts.upcoming}</span>
        </button>
        <button 
          className={`vsu-tab ${activeTab === 'completed' ? 'vsu-tab-active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed <span className="vsu-tab-count">{tabCounts.completed}</span>
        </button>
        <button 
          className={`vsu-tab ${activeTab === 'canceled' ? 'vsu-tab-active' : ''}`}
          onClick={() => setActiveTab('canceled')}
        >
          Canceled <span className="vsu-tab-count">{tabCounts.canceled}</span>
        </button>
        <button 
          className={`vsu-tab ${activeTab === 'missed' ? 'vsu-tab-active' : ''}`}
          onClick={() => setActiveTab('missed')}
        >
          Missed <span className="vsu-tab-count">{tabCounts.missed}</span>
        </button>
      </div>

      <div className="vsu-appointments-list">
        {filteredAppointments.length === 0 ? (
          <div className="vsu-no-appointments">
            <p>No {activeTab} appointments found.</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => {
            const statusBadge = getStatusBadge(appointment.computedStatus);
            const appointmentType = getAppointmentType(appointment);
            const isJoinActive = isJoinButtonActive(appointment);
            const isPendingStatus = isPending(appointment);
            const isUpcomingStatus = isUpcoming(appointment);
            const isMissedStatus = isMissed(appointment);
            
            return (
              <div key={appointment.id} className="vsu-appointment-card">
                <div className="vsu-card-header">
                  <div className="vsu-doctor-avatar">
                    {appointment.provider?.img_url ? (
                      <img 
                        src={appointment.provider.img_url} 
                        alt="Doctor" 
                        className="vsu-avatar-img"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    ) : (
                      <div className="vsu-avatar-placeholder">👨‍⚕️</div>
                    )}
                  </div>
                  <div className="vsu-doctor-info">
                    <h3>{appointment.provider?.user?.full_name || 'N/A'}</h3>
                    <span className="vsu-specialization">{appointment.provider?.specialization || 'General'}</span>
                  </div>
                  <div className="vsu-card-actions">
                    <span className={`vsu-status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                    <span className="vsu-appointment-type" title={appointmentType.label}>
                      {appointmentType.icon} {appointmentType.type}
                    </span>
                  </div>
                </div>

                <div className="vsu-card-body">
                  <div className="vsu-info-row">
                    <span className="vsu-info-label">Date & Time:</span>
                    <span className="vsu-info-value">
                      {formatDate(appointment.appointment_date)} | {formatTime(appointment.slot)}
                    </span>
                  </div>
                  <div className="vsu-info-row">
                    <span className="vsu-info-label">Issue:</span>
                    <span className="vsu-info-value">{appointment.issue_description || 'N/A'}</span>
                  </div>
                  <div className="vsu-info-row">
                    <span className="vsu-info-label">Contact:</span>
                    <span className="vsu-info-value">{appointment.provider?.user?.email || 'N/A'}</span>
                  </div>
                  {isPendingStatus && !isMissedStatus && (
                    <div className="vsu-info-row">
                      <span className="vsu-info-label">Status:</span>
                      <span className="vsu-info-value vsu-pending-text">Waiting for doctor's approval</span>
                    </div>
                  )}
                  {isMissedStatus && (
                    <div className="vsu-info-row">
                      <span className="vsu-info-label">Status:</span>
                      <span className="vsu-info-value vsu-missed-text">Appointment was missed</span>
                    </div>
                  )}
                </div>

                {(activeTab === 'upcoming') && !isMissedStatus && (
                  <div className="vsu-card-footer" onClick={(e) => e.stopPropagation()}>
                    {isUpcomingStatus && appointmentType.type === 'Telehealth' && isJoinActive && (
                      <button 
                        className="vsu-join-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinCall(appointment);
                        }}
                      >
                        Join Video Call
                      </button>
                    )}
                    {isPendingStatus && (
                      <span className="vsu-pending-badge">Awaiting Approval</span>
                    )}
                    <button 
                      className="vsu-cancel-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelAppointment(appointment);
                      }}
                    >
                      Cancel Appointment
                    </button>
                    <button 
                      className="vsu-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(appointment);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                )}

                {activeTab === 'completed' && (
                  <div className="vsu-card-footer" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="vsu-prescription-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadPrescription(appointment);
                      }}
                    >
                      Download Prescription
                    </button>
                    <button 
                      className="vsu-review-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGiveReview(appointment);
                      }}
                    >
                      Give Review
                    </button>
                    <button 
                      className="vsu-bookagain-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookAgain(appointment);
                      }}
                    >
                      Book Again
                    </button>
                  </div>
                )}

                {(activeTab === 'canceled' || activeTab === 'missed') && (
                  <div className="vsu-card-footer" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="vsu-bookagain-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookAgain(appointment);
                      }}
                    >
                      Book Again
                    </button>
                    <button 
                      className="vsu-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(appointment);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && selectedAppointment && (
        <div className="vsu-modal-overlay" onClick={handleCloseModal}>
          <div className="vsu-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="vsu-modal-header">
              <h2>Appointment Details</h2>
              <button className="vsu-close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="vsu-modal-body">
              <div className="vsu-detail-section">
                <h3>Basic Information</h3>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Appointment ID:</span>
                  <span>{selectedAppointment.id}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Appointment Date:</span>
                  <span>{formatDate(selectedAppointment.appointment_date)}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Time Slot:</span>
                  <span>{formatTime(selectedAppointment.slot)}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Status:</span>
                  <span className={`vsu-status-badge ${getStatusBadge(selectedAppointment.computedStatus).class}`}>
                    {getStatusBadge(selectedAppointment.computedStatus).text}
                  </span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Backend Status:</span>
                  <span>{selectedAppointment.status || 'N/A'}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Created:</span>
                  <span>{formatDateTime(selectedAppointment.created_at)}</span>
                </div>
              </div>

              <div className="vsu-detail-section">
                <h3>🩺 Medical Information</h3>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Issue Description:</span>
                  <span>{selectedAppointment.issue_description || 'Not provided'}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Additional Notes:</span>
                  <span>{selectedAppointment.additional_notes || 'No additional notes'}</span>
                </div>
              </div>

              <div className="vsu-detail-section">
                <h3>Doctor Information</h3>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Full Name:</span>
                  <span>{selectedAppointment.provider?.user?.full_name || 'N/A'}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Username:</span>
                  <span>{selectedAppointment.provider?.user?.username || 'N/A'}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Email:</span>
                  <span>{selectedAppointment.provider?.user?.email || 'N/A'}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Phone:</span>
                  <span>{selectedAppointment.provider?.user?.phone || 'N/A'}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Specialization:</span>
                  <span>{selectedAppointment.provider?.specialization || 'N/A'}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Qualification:</span>
                  <span>{selectedAppointment.provider?.qualification || 'N/A'}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">Gender:</span>
                  <span>{selectedAppointment.provider?.gender || 'N/A'}</span>
                </div>
                <div className="vsu-detail-row">
                  <span className="vsu-detail-label">License Count:</span>
                  <span>{selectedAppointment.provider?.license_count || 'N/A'}</span>
                </div>
              </div>

              {selectedAppointment.provider?.img_url && (
                <div className="vsu-detail-section">
                  <h3>Doctor Photo</h3>
                  <img 
                    src={selectedAppointment.provider.img_url} 
                    alt="Doctor" 
                    className="vsu-doctor-img-preview"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}

              {getAppointmentType(selectedAppointment).type === 'In-Person' && (
                <div className="vsu-detail-section">
                  <h3>Chamber Location</h3>
                  <div className="vsu-detail-row">
                    <span className="vsu-detail-label">Address:</span>
                    <span>123 Healthcare Avenue, Medical District, Dhaka</span>
                  </div>
                  <div className="vsu-detail-row">
                    <a href="https://maps.google.com/?q=Dhaka+Medical+District" target="_blank" rel="noopener noreferrer" className="vsu-map-link">
                      Get Directions on Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="vsu-modal-footer">
              {(activeTab === 'upcoming' && selectedAppointment.computedStatus !== 'cancelled' && !isMissed(selectedAppointment)) && (
                <>
                  {isUpcoming(selectedAppointment) && getAppointmentType(selectedAppointment).type === 'Telehealth' && isJoinButtonActive(selectedAppointment) && (
                    <button onClick={() => handleJoinCall(selectedAppointment)} className="vsu-join-modal-btn">
                      Join Video Call
                    </button>
                  )}
                  {isPending(selectedAppointment) && (
                    <span className="vsu-pending-modal-text">Awaiting Doctor's Approval</span>
                  )}
                  <button onClick={() => handleCancelAppointment(selectedAppointment)} className="vsu-cancel-modal-btn">
                    Cancel Appointment
                  </button>
                </>
              )}
              {activeTab === 'completed' && (
                <>
                  <button onClick={() => handleDownloadPrescription(selectedAppointment)} className="vsu-prescription-modal-btn">
                    Download Prescription
                  </button>
                  <button onClick={() => handleGiveReview(selectedAppointment)} className="vsu-review-modal-btn">
                    Write a Review
                  </button>
                  <button onClick={() => handleBookAgain(selectedAppointment)} className="vsu-bookagain-modal-btn">
                    Book Again
                  </button>
                </>
              )}
              {(activeTab === 'canceled' || activeTab === 'missed' || isMissed(selectedAppointment)) && (
                <button onClick={() => handleBookAgain(selectedAppointment)} className="vsu-bookagain-modal-btn">
                  Book Again
                </button>
              )}
              <button onClick={handleCloseModal} className="vsu-close-modal-btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentViewbyUser;