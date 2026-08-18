import React from 'react'
import SignUp from '../../components/general_user/SIgnUp'
import Navbar from '../../partials/Navbar'
import '../../css/general_user/SignUpCss.css'
import Footer from '../../partials/Footer'

const SignUpPage = () => {
  return (
    <div>
        <Navbar />
        <SignUp />
        <Footer />
    </div>

  )
}

export default SignUpPage