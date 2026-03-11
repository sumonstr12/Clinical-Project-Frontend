import React from 'react'
import SignUp from '../../components/general_user/SIgnUp'
import Navbar from '../../partials/Navbar'
import '../../css/general_user/SignUpCss.css'
import Footer from '../../partials/Footer'

const SignUpPage = () => {
  return (
    <div className='sign-up-page-container'>
        <div className="sign-up-page-section"><Navbar /></div>
        <div className="sign-up-page-section"><SignUp /></div>
        <div className="sign-up-page-section"><Footer /></div>
    </div>

  )
}

export default SignUpPage