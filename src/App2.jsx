import { ToastContainer, toast } from 'react-toastify';
import AdminDashboard from './admin-assets/pages/AdminDashboard';
// import "./index.css"
// import DoctorSignup from './assets/components/doctor/DoctorSignup';
import { BrowserRouter, Routes, Route } from "react-router";
import AdminLogin from './admin-assets/components/AdminLogin';
import AdminLayout from './admin-assets/layouts/AdminLayout';
import AdminProfileViewPage from './admin-assets/pages/AdminProfileViewPage';
import NonApprovedPage from './admin-assets/pages/Doctors/NonApprovedPage';
import PatientListPage from './admin-assets/pages/PatientCaregiver/PatientListPage';
import CaregiverListPage from './admin-assets/pages/PatientCaregiver/CaregiverListPage';
import NotFound from './assets/partials/NotFound';
import AdminRoute from './Route/AdminRoute';



export default function App2() {
  const notify = () => toast('Wow so easy !');

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
      </Routes>
    </BrowserRouter>
  );
}