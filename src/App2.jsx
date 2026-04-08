import { ToastContainer, toast } from 'react-toastify';
import AdminDashboard from './admin-assets/pages/AdminDashboard';
import "./index.css"

export default function App2() {
  const notify = () => toast('Wow so easy !');

  return (
    <>
      <AdminDashboard />
    </>
  );
}