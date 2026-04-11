import { Navigate, Outlet } from "react-router";
import { getToken, isAdmin } from "../utilies/auth";

const AdminRoute = () => {
  const token = getToken();

  // not logged in
  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  // not admin
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;