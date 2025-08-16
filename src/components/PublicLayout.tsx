import { Outlet } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import { Key } from '../enum/catch.key';

const PublicLayout = () => {
    const isLoggedIn: boolean = JSON.parse(localStorage.getItem(Key.LOGGEDIN)!) as boolean || false;

    return (
        <>
            {isLoggedIn && <NavBar />}
            <Outlet />
        </>
    );
};

export default PublicLayout;