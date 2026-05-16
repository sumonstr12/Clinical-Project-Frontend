import React, { useState } from 'react';
import { Routes, Route } from 'react-router';
import Sidebar from '../../partials/Sidebar';


const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');

  .dash * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
  .dash-title-font { font-family: 'Syne', sans-serif; }

  .dash {
    flex: 1;
    overflow-y: auto;
    background: #0a0c11;
    scrollbar-width: thin;
    scrollbar-color: #1e2235 transparent;
  }

  .dash::-webkit-scrollbar { width: 4px; }
  .dash::-webkit-scrollbar-thumb { background: #1e2235; border-radius: 4px; }

  .dash-inner {
    padding: 28px 28px 40px;
    max-width: 1280px;
  }

  /* ── Header ── */
  .dash-header {
    margin-bottom: 24px;
  }
  .dash-header h1 {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #eaecf5;
    letter-spacing: -0.02em;
    margin: 0 0 3px;
  }
  .dash-header p {
    font-size: 13px;
    color: #404669;
    margin: 0;
  }

  /* ── Stats Grid ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 22px;
  }

  @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 600px)  { .stats-grid { grid-template-columns: 1fr; } }

  .stat-card {
    background: #0f1219;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .stat-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #eaecf5;
    line-height: 1;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ── Section ── */
  .section {
    margin-bottom: 22px;
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #c8cce6;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .section-title-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Search Input ── */
  .search-box {
    position: relative;
    flex-shrink: 0;
  }

  .search-box svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #3a4160;
    pointer-events: none;
  }

  .search-box input {
    background: #0f1219;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    color: #c0c8e8;
    font-size: 12.5px;
    padding: 8px 12px 8px 32px;
    outline: none;
    transition: border-color 0.18s;
    width: 190px;
  }

  .search-box input::placeholder { color: #3a4160; }
  .search-box input:focus { border-color: rgba(59,124,244,0.4); }

  /* ── Appointment Request Card ── */
  .req-card {
    background: #0f1219;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    transition: border-color 0.18s;
    margin-bottom: 8px;
  }

  .req-card:last-child { margin-bottom: 0; }
  .req-card:hover { border-color: rgba(59,124,244,0.25); }

  .req-patient-name {
    font-size: 13.5px;
    font-weight: 600;
    color: #dde1f0;
    margin-bottom: 5px;
  }

  .req-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .req-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    color: #4b5270;
  }

  .req-type {
    background: rgba(59,124,244,0.1);
    color: #5a8cff;
    border-radius: 5px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 500;
  }

  .req-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }

  .btn-accept {
    background: rgba(30,158,110,0.12);
    color: #2ecf8e;
    border: 1px solid rgba(30,158,110,0.2);
    border-radius: 7px;
    padding: 7px 14px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }

  .btn-accept:hover {
    background: rgba(30,158,110,0.2);
    border-color: rgba(30,158,110,0.4);
  }

  .btn-reject {
    background: rgba(220,70,70,0.1);
    color: #e07070;
    border: 1px solid rgba(220,70,70,0.18);
    border-radius: 7px;
    padding: 7px 14px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }

  .btn-reject:hover {
    background: rgba(220,70,70,0.18);
    border-color: rgba(220,70,70,0.35);
  }

  /* ── Table ── */
  .data-table-wrap {
    background: #0f1219;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    overflow: hidden;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th {
    background: rgba(255,255,255,0.02);
    color: #363d5c;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    padding: 11px 16px;
    text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .data-table td {
    padding: 11px 16px;
    font-size: 13px;
    color: #8090b8;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    transition: background 0.15s;
  }

  .data-table tr:last-child td { border-bottom: none; }
  .data-table tbody tr:hover td { background: rgba(255,255,255,0.018); }

  .td-primary {
    color: #c8cce6 !important;
    font-weight: 500;
  }

  /* ── Two Col Grid ── */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }

  /* ── Patient Mini Card ── */
  .mini-card {
    background: #0f1219;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 11px;
    padding: 13px 15px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
    transition: border-color 0.18s;
  }

  .mini-card:last-child { margin-bottom: 0; }

  .mini-card-name {
    font-size: 13px;
    font-weight: 600;
    color: #d0d4ec;
    margin-bottom: 5px;
  }

  .mini-card-detail {
    font-size: 11.5px;
    color: #434969;
    line-height: 1.7;
  }

  .status-chip {
    font-size: 10.5px;
    font-weight: 600;
    border-radius: 20px;
    padding: 3px 9px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .status-recovered  { background: rgba(30,158,110,0.12); color: #2ecf8e; }
  .status-recovering { background: rgba(234,179,8,0.1);   color: #d4aa30; }
  .status-treatment  { background: rgba(59,124,244,0.12); color: #6b9fff; }

  .next-appt-label { font-size: 10.5px; color: #3a4160; text-align: right; margin-bottom: 2px; }
  .next-appt-date  { font-size: 12px; font-weight: 600; color: #6b9fff; text-align: right; }

  .empty-state {
    background: #0f1219;
    border: 1px solid rgba(255,255,255,0.04);
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    color: #2e3450;
    font-size: 13px;
  }

  /* scrollable table wrapper */
  .table-scroll { overflow-x: auto; }
`;


const SearchBox = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="search-box">
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

const SectionTitle = ({ color = '#3b7cf4', children }) => (
  <h2 className="section-title">
    <span className="section-title-dot" style={{ background: color }} />
    {children}
  </h2>
);


const DashboardHome = () => {
  const [searchAppointment, setSearchAppointment]   = useState('');
  const [searchUpcoming, setSearchUpcoming]         = useState('');
  const [searchTreatment, setSearchTreatment]       = useState('');
  const [searchPatientList, setSearchPatientList]   = useState('');

  const [appointments] = useState([
    { id: 1, patientName: 'John Doe',       age: 45, time: '10:00 AM', date: '2024-01-20', type: 'Checkup',      status: 'pending' },
    { id: 2, patientName: 'Jane Smith',     age: 32, time: '11:30 AM', date: '2024-01-20', type: 'Follow-up',    status: 'pending' },
    { id: 3, patientName: 'Mike Johnson',   age: 58, time: '02:00 PM', date: '2024-01-20', type: 'Emergency',    status: 'pending' },
    { id: 4, patientName: 'Sarah Williams', age: 29, time: '03:30 PM', date: '2024-01-20', type: 'Consultation', status: 'pending' },
  ]);

  const [upcomingAppointments] = useState([
    { id: 1, patientName: 'Robert Brown', age: 52, time: '09:00 AM', date: '2024-01-21', type: 'Surgery Follow-up' },
    { id: 2, patientName: 'Emily Davis',  age: 41, time: '10:30 AM', date: '2024-01-21', type: 'Regular Checkup'  },
    { id: 3, patientName: 'David Wilson', age: 37, time: '01:00 PM', date: '2024-01-22', type: 'Consultation'      },
  ]);

  const [treatedPatients] = useState([
    { id: 1, name: 'Alice Johnson', age: 34, treatment: 'Hypertension',   date: '2024-01-15', status: 'Recovering'      },
    { id: 2, name: 'Bob Martin',    age: 28, treatment: 'Migraine',        date: '2024-01-14', status: 'Recovered'        },
    { id: 3, name: 'Carol White',   age: 45, treatment: 'Diabetes Type 2', date: '2024-01-13', status: 'Under Treatment'  },
  ]);

  const [patientList] = useState([
    { id: 1, name: 'Emma Watson',   age: 29, lastVisit: '2024-01-10', condition: 'Fever',     nextAppointment: '2024-01-25' },
    { id: 2, name: 'Oliver Chen',   age: 41, lastVisit: '2024-01-09', condition: 'Back Pain', nextAppointment: '2024-01-22' },
    { id: 3, name: 'Sophia Kumar',  age: 35, lastVisit: '2024-01-08', condition: 'Allergy',   nextAppointment: '2024-01-28' },
  ]);

  const filter = (arr, key, q) => arr.filter((i) => i[key].toLowerCase().includes(q.toLowerCase()));

  const filteredAppointments  = filter(appointments,         'patientName', searchAppointment);
  const filteredUpcoming      = filter(upcomingAppointments, 'patientName', searchUpcoming);
  const filteredTreated       = filter(treatedPatients,      'name',        searchTreatment);
  const filteredPatientList   = filter(patientList,          'name',        searchPatientList);

  const statusClass = (s) =>
    s === 'Recovered'       ? 'status-chip status-recovered'  :
    s === 'Recovering'      ? 'status-chip status-recovering' :
                              'status-chip status-treatment';

  const stats = [
    { label: 'Total Patients',       value: '1,234', color: '#3b7cf4', bg: 'rgba(59,124,244,0.1)',  icon: <svg width="19" height="19" fill="none" stroke="#4d8aff" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Appointments Today',   value: '8',     color: '#1e9e6e', bg: 'rgba(30,158,110,0.1)', icon: <svg width="19" height="19" fill="none" stroke="#2ecf8e" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: 'Pending Requests',     value: String(appointments.length), color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: <svg width="19" height="19" fill="none" stroke="#a87bff" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: 'Recovered Patients',   value: '342',   color: '#e8802a', bg: 'rgba(232,128,42,0.1)',  icon: <svg width="19" height="19" fill="none" stroke="#f0a050" strokeWidth="1.7" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> },
  ];

  return (
    <div className="dash">
      <style>{globalStyle}</style>

      <div className="dash-inner">
        <div className="dash-header">
          <h1>Welcome back, Dr. Sumon</h1>
          <p>Here's your medical practice overview for today</p>
        </div>

        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat-card" key={s.label}>
              <div>
                <div className="stat-label" style={{ color: s.color }}>{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="section-head">
            <SectionTitle color="#3b7cf4">Appointment Requests</SectionTitle>
            <SearchBox value={searchAppointment} onChange={setSearchAppointment} placeholder="Search patient…" />
          </div>

          {filteredAppointments.length === 0
            ? <div className="empty-state">No appointment requests found</div>
            : filteredAppointments.map((apt) => (
              <div className="req-card" key={apt.id}>
                <div style={{ flex: 1 }}>
                  <div className="req-patient-name">{apt.patientName}</div>
                  <div className="req-meta">
                    <span className="req-badge">
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {apt.time}
                    </span>
                    <span className="req-badge">
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {apt.date}
                    </span>
                    <span className="req-badge">Age {apt.age}</span>
                    <span className="req-type">{apt.type}</span>
                  </div>
                </div>
                <div className="req-actions">
                  <button className="btn-accept" onClick={() => alert(`Appointment ${apt.id} accepted!`)}>Accept</button>
                  <button className="btn-reject" onClick={() => alert(`Appointment ${apt.id} rejected!`)}>Reject</button>
                </div>
              </div>
            ))
          }
        </div>

        <div className="section">
          <div className="section-head">
            <SectionTitle color="#1e9e6e">Upcoming Appointments</SectionTitle>
            <SearchBox value={searchUpcoming} onChange={setSearchUpcoming} placeholder="Search patient…" />
          </div>

          {filteredUpcoming.length === 0
            ? <div className="empty-state">No upcoming appointments found</div>
            : (
              <div className="table-scroll">
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Age</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUpcoming.map((apt) => (
                        <tr key={apt.id}>
                          <td className="td-primary">{apt.patientName}</td>
                          <td>{apt.age}</td>
                          <td>{apt.date}</td>
                          <td>{apt.time}</td>
                          <td><span className="req-type">{apt.type}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
        </div>

       
        <div className="two-col">
          <div className="section" style={{ margin: 0 }}>
            <div className="section-head">
              <SectionTitle color="#8b5cf6">Recently Treated</SectionTitle>
              <SearchBox value={searchTreatment} onChange={setSearchTreatment} placeholder="Search…" />
            </div>
            {filteredTreated.length === 0
              ? <div className="empty-state">No patients found</div>
              : filteredTreated.map((p) => (
                <div className="mini-card" key={p.id} style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                  <div>
                    <div className="mini-card-name">{p.name}</div>
                    <div className="mini-card-detail">
                      Age {p.age}<br />
                      {p.treatment}<br />
                      {p.date}
                    </div>
                  </div>
                  <span className={statusClass(p.status)}>{p.status}</span>
                </div>
              ))
            }
          </div>

          <div className="section" style={{ margin: 0 }}>
            <div className="section-head">
              <SectionTitle color="#e8802a">Upcoming Patients</SectionTitle>
              <SearchBox value={searchPatientList} onChange={setSearchPatientList} placeholder="Search…" />
            </div>
            {filteredPatientList.length === 0
              ? <div className="empty-state">No patients found</div>
              : filteredPatientList.map((p) => (
                <div className="mini-card" key={p.id} style={{ borderColor: 'rgba(232,128,42,0.08)' }}>
                  <div>
                    <div className="mini-card-name">{p.name}</div>
                    <div className="mini-card-detail">
                      Age {p.age}<br />
                      {p.condition}<br />
                      Last visit: {p.lastVisit}
                    </div>
                  </div>
                  <div>
                    <div className="next-appt-label">Next Visit</div>
                    <div className="next-appt-date">{p.nextAppointment}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title }) => (
  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0c11' }}>
    <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#2e3450', fontSize: 15 }}>{title}</p>
  </div>
);


const DoctorDashboard = () => (
  <div style={{ display: 'flex', height: '100vh', background: '#0a0c11', overflow: 'hidden' }}>
    <Sidebar />
    <Routes>
      <Route path="/"              element={<DashboardHome />} />
      <Route path="/appointments"  element={<PlaceholderPage title="Appointments Page" />} />
      <Route path="/patients"      element={<PlaceholderPage title="Patients Page" />} />
      <Route path="/schedule-update" element={<PlaceholderPage title="Schedule Update Page" />} />
      <Route path="/reports"       element={<PlaceholderPage title="Reports Page" />} />
      <Route path="/profile"       element={<PlaceholderPage title="Profile Page" />} />
    </Routes>
  </div>
);

export default DoctorDashboard;