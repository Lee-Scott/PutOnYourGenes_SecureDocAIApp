import { Key } from '../enum/catch.key';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    unauthenticatedOnly?: boolean;
}

const ProtectedRoute = ({ unauthenticatedOnly = false }: ProtectedRouteProps) => {
    const location = useLocation();
    const isLoggedIn: boolean = JSON.parse(localStorage.getItem(Key.LOGGEDIN)!) as boolean || false;

    if (unauthenticatedOnly) {
        return !isLoggedIn ? <Outlet /> : <Navigate to="/dashboard" replace />;
    }

    if (isLoggedIn) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
};

export default ProtectedRoute;
