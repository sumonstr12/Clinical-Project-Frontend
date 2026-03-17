import React from 'react'
import Navbar from '../../partials/Navbar'
import Login from '../../components/caregiver/LogIn'
import Footer from '../../partials/Footer'
import '../../css/general_user/common.css'

const LogInPageCaregiver = () => {
  return (
    <>
      <div className='login-container'>
          <div ></div><Navbar />
          <Login />
          
      </div>
      <Footer />
    </>
  )
}

export default LogInPageCaregiver