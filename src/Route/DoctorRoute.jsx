import { Navigate, Outlet } from "react-router";
import { getToken, isAdmin } from "../utilies/auth";
import { isDoctor } from "../utilies/auth";

const DoctorRoute = () => {
  const token = getToken();

  // not logged in
  if (!token) {
    return <Navigate to="/doctor/login" />;
  }

  // not doctor
  if (!isDoctor()) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default DoctorRoute;