import React from 'react'
import Navbar from '../../partials/Navbar'
import Appointment from '../../components/appointments/Appointment'
import Footer from '../../partials/Footer'
// import '../../css/global_app.css'

const AppointmentPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, padding: '20px' }}>
          <Appointment />
        </div>
        <Footer />
    </div>
  )
}

export default AppointmentPage