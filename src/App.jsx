import { BrowserRouter, Routes, Route } from "react-router";

// Layouts
import UserLayout from "./assets/layouts/UserLayout";
import AdminLayout from "./admin-assets/layouts/AdminLayout";

// General Pages
import Home from "./assets/pages/general_user/Home";
import SignUpPage from "./assets/pages/general_user/SignUpPage";
import FindDoctorPage from "./assets/pages/general_user/FindDoctorPage";
import AppointmentPage from "./assets/pages/general_user/AppointmentPage";
import Service_Page from "./assets/pages/general_user/Service_Page";
import AboutUs_Page from "./assets/pages/general_user/AboutUs_Page";
import Contact_Page from "./assets/pages/general_user/Contact_Page";
import Login_Page from "./assets/pages/general_user/Login_Page";
import OtpVerifyPage from "./assets/pages/general_user/OtpVerifyPage";
import FirstLoginPage from "./assets/pages/general_user/FirstLoginPage";

// Caregiver
import SignUpPageCaregiver from "./assets/pages/caregiver/SignUpPageCaregiver";
import LogInPageCaregiver from "./assets/pages/caregiver/LogInPageCaregiver";

// Admin
import AdminDashboard from "./admin-assets/pages/AdminDashboard";
import AdminProfileViewPage from "./admin-assets/pages/AdminProfileViewPage";
import AdminLogin from "./admin-assets/components/AdminLogin";
// import NonApprovalDoctors from "./admin-assets/components/Doctors/NonApprovalDoctors";
import NonApprovedPage from "./admin-assets/pages/Doctors/NonApprovedPage";
import PatientListPage from "./admin-assets/pages/PatientCaregiver/PatientListPage";
import CaregiverListPage from "./admin-assets/pages/PatientCaregiver/CaregiverListPage";

// Routes
import AdminRoute from "./Route/AdminRoute";
import UserRoute from "./Route/UserRoute";

// Not Found
import NotFound from "./assets/partials/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>

            <Route path="admin-dashboard" element={<AdminDashboard />}/>

            <Route path="profile" element={<AdminProfileViewPage />} />

            <Route path="non-approved-doctors" element={<NonApprovedPage />} />

            <Route path="patients" element={<PatientListPage />} />

            <Route path="caregivers" element={<CaregiverListPage />} />
              
            <Route index element={<NotFound />} />

          </Route>
        </Route>



       

        <Route path="/" element={<UserLayout />}>

          <Route index element={<Home />} />

          <Route path="patient/login" element={<Login_Page />} />
            
          <Route path="patient/signup" element={<SignUpPage />} />
           
          <Route path="otp-verification-registration" element={<OtpVerifyPage />} />
            
          <Route element={<UserRoute />}>

            <Route path="find-doctor" element={<FindDoctorPage />} />
              
            <Route path="appointment" element={<AppointmentPage />} />
            
            <Route path="service" element={<Service_Page />} />

            <Route path="about-us" element={<AboutUs_Page />} />
 
            <Route path="contact" element={<Contact_Page />} />
         

            <Route path="first-login" element={<FirstLoginPage />} />
              

          </Route>


          <Route path="caregiver/signup" element={<SignUpPageCaregiver />} />

          <Route path="caregiver/login" element={<LogInPageCaregiver />} />
            

        </Route>


        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;