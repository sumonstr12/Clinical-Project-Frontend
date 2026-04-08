import React from 'react'
import Navbar from '../../partials/Navbar'
import Appointment from '../../components/Appointment'
import Footer from '../../partials/Footer'
// import '../../css/global_app.css'

const AppointmentPage = () => {
  return (
    <div>
        <Navbar />
        <Appointment />
        <Footer />
    </div>
  )
}

export default AppointmentPage