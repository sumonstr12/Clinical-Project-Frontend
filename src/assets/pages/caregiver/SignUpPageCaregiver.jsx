import React from 'react'
import SignUp from '../../components/caregiver/SignUp'
import Navbar from '../../partials/Navbar'
import Footer from '../../partials/Footer'
import '../../css/general_user/SignUpCss.css'

const SignUpPageCaregiver = () => {
  return (
    <div className='sign-up-page-container'>
        <div className="sign-up-page-section"><Navbar /></div>
        <div className="sign-up-page-section"><SignUp /></div>
        <div className="sign-up-page-section"><Footer /></div>
    </div>
  )
}

export default SignUpPageCaregiver