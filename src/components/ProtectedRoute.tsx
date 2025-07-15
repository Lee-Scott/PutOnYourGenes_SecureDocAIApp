import { Key } from '../enum/catch.key';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const location = useLocation();
    const isLoggedIn: boolean = JSON.parse(localStorage.getItem(Key.LOGGEDIN)!) as boolean || false;

    if (isLoggedIn) {
        return <Outlet />
    } else {
        // Toast notification can be added here to inform the user they need to log in
        return (
            <Navigate to="/login" replace state={{ from: location }} />
        );
    }
};

export default ProtectedRoute;