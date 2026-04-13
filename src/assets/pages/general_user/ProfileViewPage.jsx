import React from 'react'
import Navbar from '../../partials/Navbar';
import UserProfile from '../../components/general_user/UserProfile';



const ProfileViewPage = () => {
  return (
    <div>
        <div className='login-container'>
          <div ></div><Navbar />
          <UserProfile />
          
      </div>
        
    </div>
  )
}

export default ProfileViewPage