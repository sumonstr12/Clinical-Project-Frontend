import React, { useState, useEffect } from "react";
import myaxios from "../../utilities/myaxios";
import '../../css/component_css/appointment.css';
import { earlierUpdateAlt, earlierUpdateDetailed } from "../../utilities/updateToast";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const TIME_SLOTS = [
  { time: "09:00 AM" },
  { time: "10:00 AM" },
  { time: "11:00 AM" },
  { time: "12:00 PM" },
  { time: "02:00 PM" },
  { time: "03:00 PM" },
  { time: "04:00 PM" },
  { time: "05:00 PM" },
];

const steps = [
  { num: 1, icon: "fas fa-user-md", title: "Choose Your Doctor", desc: "Browse our specialists by specialty, rating, or availability. Read patient reviews to find your perfect match." },
  { num: 2, icon: "fas fa-calendar-alt", title: "Select Date & Time", desc: "Pick a convenient date from the calendar and choose an available time slot that fits your schedule." },
  { num: 3, icon: "fas fa-file-medical", title: "Provide Details", desc: "Share a brief description of your symptoms or reason for visit so the doctor can be prepared." },
  { num: 4, icon: "fas fa-check-circle", title: "Confirm & Attend", desc: "Review your appointment details and confirm booking." },
];

const Appointment = () => {
  const today = new Date();
  const now = new Date();

  const [currentStep, setCurrentStep] = useState(1);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [appointmentDetails, setAppointmentDetails] = useState({
    symptoms: "",
    notes: "",
    patientName: "",
    patientAge: "",
    patientContact: ""
  });
  
  // Doctor API states
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [specialties, setSpecialties] = useState(["All Specialties"]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      let query = `/available-doctors/?page=${page}&limit=10`;
      
      if (searchTerm) {
        query += `&search=${searchTerm}`;
      }
      
      if (selectedSpecialty !== "All Specialties") {
        query += `&specialization=${selectedSpecialty}`;
      }
      
      const res = await myaxios.get(query);
      setDoctors(res.data.data);
      setTotalPages(res.data.total_pages);
      
      console.log("Fetched doctors:", res.data.data);
      if (res.data.data && res.data.data.length > 0) {
        const uniqueSpecialties = [...new Set(res.data.data.map(doc => doc.specialization))];
        setSpecialties(["All Specialties", ...uniqueSpecialties]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, searchTerm, selectedSpecialty]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDate(-1);
    setSelectedSlot(null);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDate(-1);
    setSelectedSlot(null);
  };

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isDateSelectable = (day) => {
    const date = new Date(year, month, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    
    todayStart.setHours(0, 0, 0, 0);
    
    if (date < todayStart) return false;
    
    const maxFutureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20);
    maxFutureDate.setHours(23, 59, 59, 999);
    
    if (date > maxFutureDate) return false;
    
    return true;
  };

  const isPastTime = (timeStr) => {
    const isSelectedToday =
      selectedDate === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    if (!isSelectedToday) return false;

    const [time, meridiem] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    const slotTime = new Date(year, month, selectedDate, hours, minutes);
    const currentTime = new Date();
    
    return slotTime < currentTime;
  };

  const calDates = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedDoctor) {
      earlierUpdateAlt("Please select a doctor to continue");
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedSlot)) {
      earlierUpdateAlt("Please select date and time slot to continue");
      return;
    }
    if (currentStep === 3 && (!appointmentDetails.symptoms || !appointmentDetails.patientName)) {
      earlierUpdateAlt("Please provide all required details");
      return;
    }
    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDetailsChange = (e) => {
    setAppointmentDetails({
      ...appointmentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        doctor_id: selectedDoctor.id,
        appointment_date: `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`,
        appointment_time: selectedSlot,
        patient_name: appointmentDetails.patientName,
        patient_age: appointmentDetails.patientAge,
        patient_contact: appointmentDetails.patientContact,
        symptoms: appointmentDetails.symptoms,
        notes: appointmentDetails.notes
      };
      
      const response = await myaxios.post("/book-appointment", bookingData);
      
      if (response.data.status) {
        earlierUpdateDetailed("Appointment booked successfully!");
        // Reset form or navigate to confirmation page
        setCurrentStep(1);
        setSelectedDoctor(null);
        setSelectedDate(today.getDate());
        setSelectedSlot(null);
        setAppointmentDetails({
          symptoms: "",
          notes: "",
          patientName: "",
          patientAge: "",
          patientContact: ""
        });
      } else {
        earlierUpdateAlt(response.data.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      earlierUpdateAlt("Failed to book appointment. Please try again.");
    }
  };

  return (
    <section className="ap-section-full" id="appointment" aria-label="Book Appointment">
      <div className="ap-section-inner">
        <div className="ap-section-header">
          <span className="ap-section-eyebrow">Easy Scheduling</span>
          <h2 className="ap-section-title">Get an Appointment</h2>
          <p className="ap-section-desc">
            Book your appointment in just a few simple steps. Fast, easy, and stress-free.
          </p>
        </div>

        <div className="ap-appointment-container">
          <div>
            <div className="ap-steps-list" role="list" aria-label="Appointment steps">
              {steps.map((step) => (
                <div 
                  key={step.num} 
                  className={`ap-step-item ${currentStep === step.num ? 'ap-active' : ''} ${currentStep > step.num ? 'ap-completed' : ''}`}
                  role="listitem"
                >
                  <div className={`ap-step-num ${currentStep === step.num ? 'ap-active' : ''}`} aria-label={`Step ${step.num}`}>
                    {currentStep > step.num ? <i className="fas fa-check"></i> : step.num}
                  </div>
                  <div className="ap-step-content">
                    <h4 style={{ fontWeight: currentStep === step.num ? 'bold' : 'normal' }}>
                      <i className={step.icon} aria-hidden="true" style={{ marginRight: "0.5rem", color: "var(--ap-teal)" }} />
                      {step.title}
                    </h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ap-calendar-widget" role="region" aria-label="Appointment Calendar">
            {currentStep === 1 && (
              <div className="ap-doctors-selection">
                <div className="ap-search-filter-section">
                  <div className="ap-search-box">
                    <i className="fas fa-search"></i>
                    <input
                      type="text"
                      placeholder="Search by doctor name or specialty..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                  <div className="ap-specialty-filter">
                    {specialties.map(specialty => (
                      <button
                        key={specialty}
                        className={`ap-specialty-btn ${selectedSpecialty === specialty ? 'ap-active' : ''}`}
                        onClick={() => {
                          setSelectedSpecialty(specialty);
                          setPage(1);
                        }}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>

                {loadingDoctors ? (
                  <div className="ap-loading-doctors">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading doctors...</p>
                  </div>
                ) : (
                  <>
                    <div className="ap-doctors-grid">
                      {doctors.map(doctor => (
                        <div
                          key={doctor.id}
                          className={`ap-doctor-card ${selectedDoctor?.id === doctor.id ? 'ap-selected' : ''}`}
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          <div className="ap-doctor-image">
                            <img src={doctor.user?.img_url || "https://robohash.org/sumon.png"} alt={doctor.user?.full_name} />
                          </div>
                          <div className="ap-doctor-info">
                            <div className="ap-doctor-header">
                              <h4>{doctor.user?.full_name}</h4>
                              <p className="ap-specialty">{doctor.specialization}</p>
                            </div>
                            <div className="ap-doctor-details-row">
                              <div className="ap-rating">
                                <i className="fas fa-star"></i>
                                <span>{doctor.rating || "4.5"}</span>
                              </div>
                              <span className="ap-experience">{doctor.experience || "10 years"} experience</span>
                              <p className="ap-fee">{doctor.fee || "$150"} per visit</p>
                            </div>
                          </div>
                          {selectedDoctor?.id === doctor.id && (
                            <div className="ap-selected-badge">
                              <i className="fas fa-check-circle"></i>
                            </div>
                          )}
                        </div>
                      ))}
                      {doctors.length === 0 && (
                        <div className="ap-no-doctors">
                          <p>No doctors found matching your criteria.</p>
                        </div>
                      )}
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="ap-pagination">
                        <button 
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="ap-page-btn"
                        >
                          Previous
                        </button>
                        <span className="ap-page-info">Page {page} of {totalPages}</span>
                        <button 
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="ap-page-btn"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <>
                <div className="ap-cal-header">
                  <h4>
                    <i className="fas fa-calendar-alt" aria-hidden="true" style={{ color: "var(--ap-teal)", marginRight: "0.5rem" }} />
                    {MONTHS[month]} {year}
                  </h4>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="ap-cal-nav" onClick={prevMonth} aria-label="Previous month">‹</button>
                    <button className="ap-cal-nav" onClick={nextMonth} aria-label="Next month">›</button>
                  </div>
                </div>
                <div className="ap-cal-info">
                  <small><i className="fas fa-info-circle"></i> You can book appointments only for the next 20 days</small>
                </div>

                <div className="ap-cal-days" role="row">
                  {DAYS.map(d => <div key={d} className="ap-cal-day-name" role="columnheader">{d}</div>)}
                </div>

                <div className="ap-cal-dates" role="grid">
                  {calDates.map((d, i) => {
                    if (!d) return <div key={`empty-${i}`} className="ap-cal-date ap-empty" role="gridcell" />;
                    const selectable = isDateSelectable(d);
                    
                    return (
                      <div
                        key={d}
                        className={`ap-cal-date${selectedDate === d ? " ap-selected" : ""}${isToday(d) && selectedDate !== d ? " ap-today" : ""}${!selectable ? " ap-inactive" : ""}`}
                        onClick={() => { if (selectable) { setSelectedDate(d); setSelectedSlot(null); } }}
                        role="gridcell"
                        aria-label={`${MONTHS[month]} ${d}, ${year}${!selectable ? " (unavailable)" : ""}`}
                        aria-selected={selectedDate === d}
                        tabIndex={!selectable ? -1 : 0}
                        onKeyDown={(e) => e.key === "Enter" && selectable && setSelectedDate(d)}
                        style={{ cursor: !selectable ? "not-allowed" : "pointer" }}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>

                <div className="ap-time-slots">
                  <h5>
                    <i className="fas fa-clock" aria-hidden="true" style={{ color: "var(--ap-teal)", marginRight: "0.4rem" }} />
                    Available Time Slots
                  </h5>
                  <div className="ap-slots-grid" role="group" aria-label="Available time slots">
                    {TIME_SLOTS.map((s) => {
                      const pastTime = isPastTime(s.time);
                      return (
                        <button
                          key={s.time}
                          className={`ap-slot${pastTime ? " ap-booked" : ""}${selectedSlot === s.time ? " ap-active" : ""}`}
                          disabled={pastTime}
                          onClick={() => !pastTime && setSelectedSlot(s.time)}
                          aria-label={`${s.time}${pastTime ? " - Time passed" : ""}`}
                          aria-pressed={selectedSlot === s.time}
                        >
                          {s.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="ap-details-form">
                <div className="ap-form-group">
                  <label>Patient Full Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={appointmentDetails.patientName}
                    onChange={handleDetailsChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="ap-form-row">
                  <div className="ap-form-group">
                    <label>Age *</label>
                    <input
                      type="number"
                      name="patientAge"
                      value={appointmentDetails.patientAge}
                      onChange={handleDetailsChange}
                      placeholder="Age"
                      required
                    />
                  </div>
                  <div className="ap-form-group">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      name="patientContact"
                      value={appointmentDetails.patientContact}
                      onChange={handleDetailsChange}
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
                <div className="ap-form-group">
                  <label>Symptoms / Reason for Visit *</label>
                  <textarea
                    name="symptoms"
                    value={appointmentDetails.symptoms}
                    onChange={handleDetailsChange}
                    placeholder="Please describe your symptoms or reason for consultation..."
                    rows="4"
                    required
                  />
                </div>
                <div className="ap-form-group">
                  <label>Additional Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={appointmentDetails.notes}
                    onChange={handleDetailsChange}
                    placeholder="Any additional information for the doctor..."
                    rows="3"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="ap-confirmation-card">
                <div className="ap-confirmation-header">
                  <i className="fas fa-check-circle"></i>
                  <h3>Review Your Appointment</h3>
                  <p>Please verify your appointment details before confirming</p>
                </div>
                
                <div className="ap-appointment-summary">
                  <div className="ap-summary-section">
                    <h4><i className="fas fa-user-md"></i> Doctor Information</h4>
                    <div className="ap-summary-details">
                      <p><strong>Name:</strong> {selectedDoctor?.user?.full_name || selectedDoctor?.name}</p>
                      <p><strong>Specialty:</strong> {selectedDoctor?.specialization}</p>
                      <p><strong>Experience:</strong> {selectedDoctor?.experience || "N/A"}</p>
                      <p><strong>Consultation Fee:</strong> {selectedDoctor?.fee || "$150"}</p>
                    </div>
                  </div>

                  <div className="ap-summary-section">
                    <h4><i className="fas fa-calendar-alt"></i> Appointment Schedule</h4>
                    <div className="ap-summary-details">
                      <p><strong>Date:</strong> {MONTHS[month]} {selectedDate}, {year}</p>
                      <p><strong>Time:</strong> {selectedSlot}</p>
                    </div>
                  </div>

                  <div className="ap-summary-section">
                    <h4><i className="fas fa-user"></i> Patient Information</h4>
                    <div className="ap-summary-details">
                      <p><strong>Name:</strong> {appointmentDetails.patientName}</p>
                      <p><strong>Age:</strong> {appointmentDetails.patientAge}</p>
                      <p><strong>Contact:</strong> {appointmentDetails.patientContact}</p>
                      <p><strong>Symptoms:</strong> {appointmentDetails.symptoms}</p>
                      {appointmentDetails.notes && <p><strong>Notes:</strong> {appointmentDetails.notes}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="ap-step-navigation">
              {currentStep > 1 && (
                <button className="ap-btn-prev" onClick={handlePrevStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button className="ap-btn-next" onClick={handleNextStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button className="ap-btn-confirm" onClick={handleConfirmBooking}>
                  <i className="fas fa-check-circle"></i> Confirm Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Appointment;