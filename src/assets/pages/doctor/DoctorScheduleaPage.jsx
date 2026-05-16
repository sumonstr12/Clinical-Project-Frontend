import React from 'react'
import Sidebar from '../../partials/Sidebar'
import DoctorSchedule from '../../components/doctor/DoctorSchedule'

const DoctorScheduleaPage = () => {
  return (
    <div>
        <div style={{ display: 'flex', height: '100vh', background: '#0a0c11', overflow: 'hidden' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <DoctorSchedule />
            </div>
        </div>
    </div>
  )
}

export default DoctorScheduleaPage