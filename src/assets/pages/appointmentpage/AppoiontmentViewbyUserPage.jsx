import React from 'react'
import Navbar from '../../partials/Navbar'
import AppointmentViewbyUser from '../../components/appointments/AppointmentViewbyUser'

const AppoiontmentViewbyUserPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, padding: '30px' }}>
          <AppointmentViewbyUser />
        </div>
    </div>
  )
}

export default AppoiontmentViewbyUserPage