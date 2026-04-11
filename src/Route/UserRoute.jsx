import { Navigate, Outlet } from "react-router";
import { getToken, isUser, isAdmin } from "../utilies/auth";
const UserRoute = () => {
  const token = getToken();

  // not logged in
  if (!token) {
    return <Navigate to="/patient/login" />;
  }

  // admin cannot enter user pages
  if (isAdmin()) {
    return <Navigate to="/admin/admin-dashboard" />;
  }

  // not normal user
  if (!isUser()) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default UserRoute;