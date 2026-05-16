import React, { useState, useEffect } from 'react';
import '../../css/doctor/doctor-schedule.css';
import myaxios from '../../utilities/myaxios';

const DoctorSchedule = () => {
  const dayMapping = {
    1: 'Saturday',
    2: 'Sunday',
    3: 'Monday',
    4: 'Tuesday',
    5: 'Wednesday',
    6: 'Thursday',
    7: 'Friday'
  };

  
  const allTimeSlots = [
    { slot_id: 1, time: '09:00:00', display: '9:00 AM - 10:00 AM' },
    { slot_id: 2, time: '10:00:00', display: '10:00 AM - 11:00 AM' },
    { slot_id: 3, time: '11:00:00', display: '11:00 AM - 12:00 PM' },
    { slot_id: 4, time: '12:00:00', display: '12:00 PM - 1:00 PM' },
    { slot_id: 5, time: '13:00:00', display: '1:00 PM - 2:00 PM' },
    { slot_id: 6, time: '14:00:00', display: '2:00 PM - 3:00 PM' },
    { slot_id: 7, time: '15:00:00', display: '3:00 PM - 4:00 PM' },
    { slot_id: 8, time: '16:00:00', display: '4:00 PM - 5:00 PM' },
    { slot_id: 9, time: '17:00:00', display: '5:00 PM - 6:00 PM' }
  ];

  const [storedSlots, setStoredSlots] = useState({});
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  
  useEffect(() => {
    fetchAllStoredSlots();
  }, []);

  
  useEffect(() => {
    setSelectedSlots([]);
  }, [selectedDay]);

  
  const fetchAllStoredSlots = async () => {
    setFetchLoading(true);
    const allStoredSlots = {};
    const days = [1, 2, 3, 4, 5, 6, 7];
    
    try {
      const promises = days.map(async (day) => {
        try {
          const response = await myaxios.get('/doctor/doctor-slot-view/?day=' + day.toString());
          if (response.data.status === true) {
            allStoredSlots[day] = response.data.data || [];
          } else {
            allStoredSlots[day] = [];
          }
        } catch (error) {
          console.error(`Error fetching slots for day ${day}:`, error);
          allStoredSlots[day] = [];
        }
      });
      
      await Promise.all(promises);
      setStoredSlots(allStoredSlots);
    } catch (error) {
      console.error('Error fetching all stored slots:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getEndTime = (startTime) => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':');
    let hour = parseInt(hours);
    const nextHour = hour + 1;
    const nextHourStr = nextHour.toString().padStart(2, '0');
    return `${nextHourStr}:${minutes}`;
  };

  const getDisplayTimeRange = (timeSlot) => {
    const startTimeFormatted = formatTime(timeSlot);
    const endTime = getEndTime(timeSlot);
    const endTimeFormatted = formatTime(endTime);
    return `${startTimeFormatted} - ${endTimeFormatted}`;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const getCurrentStoredSlots = () => {
    return storedSlots[selectedDay] || [];
  };

  const getStoredTimeStrings = () => {
    return getCurrentStoredSlots().map(slot => slot.time_slot);
  };

  const isSlotStored = (timeSlot) => {
    return getStoredTimeStrings().includes(timeSlot);
  };

  const getAvailableSlots = () => {
    const storedTimes = getStoredTimeStrings();
    return allTimeSlots.filter(slot => !storedTimes.includes(slot.time));
  };

  
  const toggleSlotSelection = (slot) => {
    if (isSlotStored(slot.time)) {
      showNotification('This time slot is already in your schedule', 'error');
      return;
    }

    setSelectedSlots(prev => {
      const isSelected = prev.some(s => s.slot_id === slot.slot_id);
      if (isSelected) {
        return prev.filter(s => s.slot_id !== slot.slot_id);
      } else {
        return [...prev, slot];
      }
    });
  };

  const selectAllSlots = () => {
    const available = getAvailableSlots();
    setSelectedSlots(available);
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  
  const handleAddSelectedSlots = async () => {
    if (selectedSlots.length === 0) {
      showNotification('Please select at least one time slot', 'error');
      return;
    }

    setLoading(true);
    try {
      const slotIds = selectedSlots.map(slot => slot.slot_id);
      
      const response = await myaxios.post('/doctor/availability/create/', {
        day: selectedDay,
        time_slot: slotIds
      });

      if (response.data.status === true || response.status === 200) {
        // Refetch stored slots for this day
        await fetchStoredSlotsForDay(selectedDay);
        setSelectedSlots([]);
        showNotification(`Added ${selectedSlots.length} slot(s) to ${dayMapping[selectedDay]}`, 'success');
      } else {
        showNotification(response.data.message || 'Failed to add slots', 'error');
      }
    } catch (error) {
      console.error('Add slots error:', error);
      showNotification(error.response?.data?.message || 'Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStoredSlotsForDay = async (day) => {
    try {
      const response = await myaxios.get('/doctor/doctor-slot-view/?day=' + day.toString());
      if (response.data.status === true) {
        setStoredSlots(prev => ({
          ...prev,
          [day]: response.data.data || []
        }));
      }
    } catch (error) {
      console.error(`Error fetching slots for day ${day}:`, error);
    }
  };

  const getTimeSlotId = (timeString) => {
    const matchedSlot = allTimeSlots.find(
        slot => slot.time === timeString
    );

    return matchedSlot ? matchedSlot.slot_id : null;
  };

  const handleDeleteSlot = async (timeSlot, displayTime) => {
    const timeSlotId = getTimeSlotId(timeSlot);
    if (!timeSlotId) {
        showNotification('Invalid time slot', 'error');
        return;
    }
    setLoading(true);
    try {

        console.log('Deleting slot:', { day: selectedDay, time_slot: timeSlotId, slot_id: displayTime });
      const response = await myaxios.delete('/doctor/availability/delete/', {
        data: {
          day: selectedDay,
          time_slot: timeSlotId
        }
      });

      if (response.data.status === true || response.status === 200) {
        await fetchStoredSlotsForDay(selectedDay);
        showNotification(`Removed ${getDisplayTimeRange(timeSlot)} from ${dayMapping[selectedDay]}`, 'success');
      } else {
        showNotification(response.data.message || 'Failed to delete slot', 'error');
      }
    } catch (error) {
      console.error('Delete slot error:', error);
      showNotification(error.response?.data?.message || 'Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getDayClass = (dayId) => {
    return selectedDay === dayId ? 'sc-day-tab-active' : 'sc-day-tab';
  };

  const availableSlots = getAvailableSlots();
  const isAllSelected = availableSlots.length > 0 && selectedSlots.length === availableSlots.length;

  return (
    <div className="sc-schedule-container">
      {/* Loading Overlay */}
      {loading && (
        <div className="sc-loading-overlay">
          <div className="sc-spinner"></div>
          <span>Processing...</span>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`sc-notification sc-notification-${notification.type}`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="sc-header">
        <div className="sc-header-icon">
          <i className="fas fa-calendar-alt"></i>
        </div>
        <div className="sc-header-title">
          <h1>Schedule Manager</h1>
          <p>Manage your weekly consultation hours (9 AM - 6 PM)</p>
        </div>
      </div>

      {/* Day Selection Tabs */}
      <div className="sc-day-tabs">
        {[1, 2, 3, 4, 5, 6, 7].map(dayId => (
          <button
            key={dayId}
            className={getDayClass(dayId)}
            onClick={() => setSelectedDay(dayId)}
            disabled={loading}
          >
            <i className={`fas ${dayId === 1 ? 'fa-calendar-week' : dayId === 2 ? 'fa-sun' : 'fa-cloud-sun'}`}></i>
            <span>{dayMapping[dayId]}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="sc-main-content">
        {/* Stored Schedule Display - Left Column */}
        <div className="sc-existing-schedule">
          <div className="sc-section-header">
            <i className="fas fa-clock"></i>
            <h3>My Schedule - {dayMapping[selectedDay]}</h3>
            <span className="sc-slot-count">{getCurrentStoredSlots().length} slots</span>
            {fetchLoading && <i className="fas fa-spinner fa-pulse"></i>}
          </div>
          
          {fetchLoading ? (
            <div className="sc-empty-state">
              <i className="fas fa-spinner fa-pulse"></i>
              <p>Loading schedule...</p>
            </div>
          ) : getCurrentStoredSlots().length === 0 ? (
            <div className="sc-empty-state">
              <i className="fas fa-calendar-times"></i>
              <p>No slots scheduled for {dayMapping[selectedDay]}</p>
              <span>Select time slots from the right panel and click "Add Selected"</span>
            </div>
          ) : (
            <div className="sc-slots-grid">
              {getCurrentStoredSlots().map((slot) => (
                <div key={slot.id} className="sc-slot-card-wrapper">
                  <div className="sc-slot-card sc-slot-card-booked">
                    <div className="sc-slot-time">
                      <i className="fas fa-hourglass-half"></i>
                      <div className="sc-slot-time-details">
                        <span className="sc-slot-time-display">
                          {getDisplayTimeRange(slot.time_slot)}
                        </span>
                      </div>
                    </div>
                    <div className="sc-slot-actions">
                      <button 
                        className="sc-btn-icon sc-btn-delete"
                        onClick={() => handleDeleteSlot(slot.time_slot, slot.time_slot)}
                        title="Remove from schedule"
                        disabled={loading}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Slots - Right Column with Multi-Select */}
        <div className="sc-form-section">
          <div className="sc-section-header">
            <i className="fas fa-plus-circle"></i>
            <h3>Available Time Slots</h3>
            <span className="sc-slot-count">{availableSlots.length} available</span>
          </div>

          {/* Selection Action Bar */}
          {availableSlots.length > 0 && (
            <div className="sc-selection-bar">
              <div className="sc-selection-info">
                <i className="fas fa-check-square"></i>
                <span>{selectedSlots.length} slot(s) selected</span>
              </div>
              <div className="sc-selection-actions">
                <button 
                  className="sc-btn-selection sc-btn-select-all"
                  onClick={selectAllSlots}
                  disabled={loading}
                >
                  <i className="fas fa-check-double"></i>
                  {isAllSelected ? 'All Selected' : 'Select All'}
                </button>
                {selectedSlots.length > 0 && (
                  <button 
                    className="sc-btn-selection sc-btn-clear"
                    onClick={clearSelection}
                    disabled={loading}
                  >
                    <i className="fas fa-times"></i>
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {fetchLoading ? (
            <div className="sc-empty-state">
              <i className="fas fa-spinner fa-pulse"></i>
              <p>Loading available slots...</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="sc-empty-state">
              <i className="fas fa-check-circle"></i>
              <p>All slots added to schedule</p>
              <span>No more slots available for {dayMapping[selectedDay]}</span>
            </div>
          ) : (
            <>
              <div className="sc-available-slots-grid">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlots.some(s => s.slot_id === slot.slot_id);
                  return (
                    <div 
                      key={slot.slot_id} 
                      className={`sc-available-slot-card ${isSelected ? 'sc-slot-selected' : ''}`}
                      onClick={() => toggleSlotSelection(slot)}
                    >
                      <div className="sc-slot-checkbox">
                        <div className={`sc-checkbox ${isSelected ? 'sc-checked' : ''}`}>
                          {isSelected && <i className="fas fa-check"></i>}
                        </div>
                      </div>
                      <div className="sc-slot-time">
                        <i className="fas fa-clock"></i>
                        <div className="sc-slot-time-details">
                          <span className="sc-slot-time-display">
                            {slot.display}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Selected Button */}
              {selectedSlots.length > 0 && (
                <div className="sc-add-selected-container">
                  <button 
                    className="sc-btn sc-btn-add-bulk"
                    onClick={handleAddSelectedSlots}
                    disabled={loading}
                  >
                    <i className="fas fa-plus-circle"></i>
                    Add Selected Slots ({selectedSlots.length})
                  </button>
                </div>
              )}
            </>
          )}

          {/* Quick Info */}
          <div className="sc-info-panel">
            <div className="sc-info-item">
              <i className="fas fa-info-circle"></i>
              <span>Click on any slot to select/deselect. Select multiple slots and click "Add Selected"</span>
            </div>
            <div className="sc-info-item">
              <i className="fas fa-trash-alt"></i>
              <span>Click delete icon on the left to remove a slot from your schedule</span>
            </div>
            <div className="sc-info-item">
              <i className="fas fa-calendar-day"></i>
              <span>Working hours: 9:00 AM - 6:00 PM (1 hour per slot)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;