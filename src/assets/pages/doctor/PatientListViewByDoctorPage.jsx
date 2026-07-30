import React from 'react'
import Sidebar from '../../partials/Sidebar'
import DoctorAppointmentView from '../../components/doctor/DoctorAppointmentView'
import PatientList from '../../../admin-assets/components/PatientCareiver/PatientList'


const PatientListViewByDoctorPage = () => {
  return (
    <div>
        <div style={{ display: 'flex', height: '100vh', background: '#0a0c11', overflow: 'hidden' }}>
            <Sidebar />
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <PatientList />
            </div>
        </div>
    </div>
  )
}

export default PatientListViewByDoctorPage