import { ToastContainer, toast } from 'react-toastify';
import AdminDashboard from './admin-assets/pages/AdminDashboard';
// import "./index.css"
import DoctorSignup from './assets/components/doctor/DoctorSignup';
import { BrowserRouter, Routes, Route } from "react-router";


export default function App2() {
  const notify = () => toast('Wow so easy !');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/doctor/signup" element={<DoctorSignup />} />
      </Routes>
    </BrowserRouter>
  );
}