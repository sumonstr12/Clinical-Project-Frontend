import { Navigate, Outlet } from "react-router";
import { getToken, isUser, isAdmin } from "../utilies/auth";
const DoctorRoute = () => {
    const token = getToken();

    if (!token) {
        return <Navigate to="/doctor/login" />;
    }

    
    if (isDoctor()) {
        return <Navigate to="/doctor/doctor-dashboard" />;
    }

    if (!isDoctor()) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default DoctorRoute;
