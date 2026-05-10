import { Navigate, Outlet } from "react-router";
import { getToken, isUser, isAdmin } from "../utilies/auth";
const UserRoute = () => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/patient/login" />;
  }

  
  if (isAdmin()) {
    return <Navigate to="/admin/admin-dashboard" />;
  }


  if (!isUser()) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default UserRoute;