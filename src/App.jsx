import "./App.css";
import { BrowserRouter, Routes, Route ,Link } from 'react-router'
import Home from "./assets/pages/general_user/Home";
import SignUpPage from "./assets/pages/general_user/SignUpPage";
import FindDoctorPage from "./assets/pages/general_user/FindDoctorPage";
import AppointmentPage from "./assets/pages/general_user/AppointmentPage";
import Service_Page from "./assets/pages/general_user/Service_Page";
import AboutUs_Page from "./assets/pages/general_user/AboutUs_Page";
import Contact_Page from "./assets/pages/general_user/Contact_Page";
import Login_Page from "./assets/pages/general_user/Login_Page";
import OtpVerifyPage from "./assets/pages/general_user/OtpVerifyPage";
import NotFound from "./assets/partials/NotFound";
import FirstLoginPage from "./assets/pages/general_user/FirstLoginPage";


// Caregiver-related
import SignUpPageCaregiver from "./assets/pages/caregiver/SignUpPageCaregiver";
import LogInPageCaregiver from "./assets/pages/caregiver/LogInPageCaregiver";




const App = () => {
  return (
    <div >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/patient/login' element={<Login_Page />} />
            <Route path='/patient/signup' element={<SignUpPage />} />
            <Route path='/otp-verification-registration' element={<OtpVerifyPage />} />
            <Route path='/find-doctor' element={<FindDoctorPage />} />
            <Route path='/appointment' element={ <AppointmentPage />} />
            <Route path='/service' element={ <Service_Page /> } />
            <Route path='/about-us' element={ <AboutUs_Page /> } />
            <Route path='/contact' element={ <Contact_Page /> } />
            <Route path='/first-login' element={ <FirstLoginPage /> } />

            {/* Caregiver */}
            <Route path="/caregiver/signup" element={<SignUpPageCaregiver />} />
            <Route path="/caregiver/login" element={<LogInPageCaregiver />} />

            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
};

export default App;