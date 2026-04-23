import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useSelector((state) => state.auth);

    const location = useLocation();

    if (!user) {
        // Not logged in, check if trying to access admin
        if (location.pathname.startsWith("/admin")) {
            return <Navigate to="/admin/login" replace />;
        }
        // Check if trying to access recruiter paths
        if (location.pathname.startsWith("/my-jobs") || 
            location.pathname.startsWith("/post-job") ||
            (location.pathname.startsWith("/jobs/") && location.pathname.includes("/applicants"))) {
            return <Navigate to="/recruiter/login" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role not authorized, redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
