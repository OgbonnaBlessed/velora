// StateRequiredRoutes.js
import { Navigate, Outlet, useLocation } from "react-router-dom";

const StateRequiredRoutes = () => {
    const location = useLocation();

    // Check if location.state exists
    if (!location.state) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default StateRequiredRoutes;