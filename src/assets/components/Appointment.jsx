import React, { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const TIME_SLOTS = [
  { time: "08:00 AM", booked: false },
  { time: "09:00 AM", booked: true },
  { time: "10:00 AM", booked: false },
  { time: "11:00 AM", booked: false },
  { time: "12:00 PM", booked: true },
  { time: "02:00 PM", booked: false },
  { time: "03:00 PM", booked: false },
  { time: "04:00 PM", booked: false },
  { time: "05:00 PM", booked: true },
];

const steps = [
  { num: 1, icon: "fas fa-user-md", title: "Choose Your Doctor", desc: "Browse our specialists by specialty, rating, or availability. Read patient reviews to find your perfect match." },
  { num: 2, icon: "fas fa-calendar-alt", title: "Select Date & Time", desc: "Pick a convenient date from the calendar and choose an available time slot that fits your schedule." },
  { num: 3, icon: "fas fa-file-medical", title: "Provide Details", desc: "Share a brief description of your symptoms or reason for visit so the doctor can be prepared." },
  { num: 4, icon: "fas fa-check-circle", title: "Confirm & Attend", desc: "Receive instant confirmation via email or SMS. Attend in-person or via video consultation." },
];

const Appointment = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDate(-1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDate(-1);
  };

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isPast = (d) => {
    const date = new Date(year, month, d);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const calDates = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <section className="section-full" id="appointment" aria-label="Book Appointment">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-eyebrow">Easy Scheduling</span>
          <h2 className="section-title">Get an Appointment</h2>
          <p className="section-desc">
            Book your appointment in just a few simple steps. Fast, easy, and stress-free.
          </p>
        </div>

        <div className="appointment-container">
          {/* Steps */}
          <div>
            <div className="steps-list" role="list" aria-label="Appointment steps">
              {steps.map((step) => (
                <div key={step.num} className="step-item" role="listitem">
                  <div className="step-num" aria-label={`Step ${step.num}`}>{step.num}</div>
                  <div className="step-content">
                    <h4><i className={step.icon} aria-hidden="true" style={{ marginRight: "0.5rem", color: "var(--teal)" }}></i>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="calendar-widget" role="region" aria-label="Appointment Calendar">
            <div className="cal-header">
              <h4><i className="fas fa-calendar-alt" aria-hidden="true" style={{ color: "var(--teal)", marginRight: "0.5rem" }}></i>{MONTHS[month]} {year}</h4>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="cal-nav" onClick={prevMonth} aria-label="Previous month">‹</button>
                <button className="cal-nav" onClick={nextMonth} aria-label="Next month">›</button>
              </div>
            </div>

            {/* Day headers */}
            <div className="cal-days" role="row">
              {DAYS.map(d => <div key={d} className="cal-day-name" role="columnheader">{d}</div>)}
            </div>

            {/* Date cells */}
            <div className="cal-days" role="grid">
              {calDates.map((d, i) => {
                if (!d) return <div key={`empty-${i}`} className="cal-date empty" role="gridcell"></div>;
                const past = isPast(d);
                return (
                  <div
                    key={d}
                    className={`cal-date${selectedDate === d ? " selected" : ""}${isToday(d) && selectedDate !== d ? " today" : ""}${past ? " inactive" : ""}`}
                    onClick={() => !past && setSelectedDate(d)}
                    role="gridcell"
                    aria-label={`${MONTHS[month]} ${d}, ${year}${past ? " (unavailable)" : ""}`}
                    aria-selected={selectedDate === d}
                    tabIndex={past ? -1 : 0}
                    onKeyDown={(e) => e.key === "Enter" && !past && setSelectedDate(d)}
                    style={{ cursor: past ? "not-allowed" : "pointer" }}
                  >
                    {d}
                  </div>
                );
              })}
            </div>

            {/* Time Slots */}
            <div className="time-slots">
              <h5><i className="fas fa-clock" aria-hidden="true" style={{ color: "var(--teal)", marginRight: "0.4rem" }}></i>Available Time Slots</h5>
              <div className="slots-grid" role="group" aria-label="Available time slots">
                {TIME_SLOTS.map((s) => (
                  <button
                    key={s.time}
                    className={`slot${s.booked ? " booked" : ""}${selectedSlot === s.time ? " active" : ""}`}
                    disabled={s.booked}
                    onClick={() => !s.booked && setSelectedSlot(s.time)}
                    aria-label={`${s.time}${s.booked ? " - Already booked" : ""}`}
                    aria-pressed={selectedSlot === s.time}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-confirm"
              disabled={!selectedSlot || selectedDate < 0}
              aria-label="Confirm appointment"
              style={{ opacity: selectedSlot ? 1 : 0.6, cursor: selectedSlot ? "pointer" : "not-allowed" }}
            >
              <i className="fas fa-check-circle" aria-hidden="true" style={{ marginRight: "0.5rem" }}></i>
              {selectedSlot
                ? `Confirm — ${MONTHS[month].slice(0, 3)} ${selectedDate}, ${selectedSlot}`
                : "Select a Date & Time Slot"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Appointment;