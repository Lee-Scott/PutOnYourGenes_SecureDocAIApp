import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { userAPI } from '../service/UserService';
import type { IUserRequest } from '../models/ICredentials';

const login = () => {
    const location = useLocation();
    const isLoggedIn: boolean = JSON.parse(localStorage.getItem('')!) as boolean || false;
    const [loginUser, { data, error, isLoading, isSuccess }] = userAPI.useLoginUserMutation();

    const handleLogin = (credentials: IUserRequest) => loginUser(credentials);

    if(isLoggedIn) {
        return location?.state?.from?.pathname ? <Navigate to={location?.state?.from?.pathname} replace /> : <Navigate to="/" />;
    }

    if(isSuccess && (!data?.data.userL.mfa)) {
        localStorage.setItem('login', 'true');
        return location?.state?.from?.pathname ? <Navigate to={location?.state?.from?.pathname} replace /> : <Navigate to="/" />;
    }

    if(isSuccess && (data?.data.userL.mfa)) {
        // Todo: jsx form for mfa
    }

  return (
    <div>login</div>
  )
}

export default login