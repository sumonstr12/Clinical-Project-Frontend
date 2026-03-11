
import React from 'react'
import Navbar from '../../partials/Navbar'
import FindDoctor from '../../components/FindDoctor'
import '../../css/general_user/common.css'
import Footer from '../../partials/Footer'


const FindDoctorPage = () => {
  return (
    // <div class="container">
    //     <div class="section"><Navbar /></div>
    //     <div class="section"><FindDoctor /></div>
    // </div>
    <div>
        <Navbar />
        <FindDoctor />
        <Footer />
    </div>

  )
}

export default FindDoctorPage