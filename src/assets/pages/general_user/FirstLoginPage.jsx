import React from 'react'
import Navbar from '../../partials/Navbar'
import FirstLogIn from '../../components/general_user/FirstLogIn'
import Footer from '../../partials/Footer'
import '../../css/general_user/common.css'

const FirstLoginPage = () => {
  return (
    <div>
        <div className='login-container'>
          <div ></div><Navbar />
          <FirstLogIn />
          
      </div>
      <Footer />
    </div>
  )
}

export default FirstLoginPage