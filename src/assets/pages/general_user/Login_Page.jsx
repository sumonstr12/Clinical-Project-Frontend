import React from 'react'
import Navbar from '../../partials/Navbar'
import Login from '../../components/general_user/LogIn'
import Footer from '../../partials/Footer'
import '../../css/general_user/common.css'

const Login_Page = () => {
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

export default Login_Page