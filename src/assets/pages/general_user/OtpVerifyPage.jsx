import React from 'react'
import Navbar from '../../partials/Navbar'
// import VerifyOtp from '../../components/general_user/VerifyOtp'
import OtpVerify from '../../components/general_user/OtpVerify'
import Footer from '../../partials/Footer'

const OtpVerifyPage = () => {
  return (
    <div>
        <Navbar />
        <OtpVerify />
        <Footer />
    </div>
  )
}

export default OtpVerifyPage