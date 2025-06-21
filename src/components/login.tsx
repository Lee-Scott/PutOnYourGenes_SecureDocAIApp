import React from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom';
import { userAPI } from '../service/UserService';
import type { IUserRequest } from '../models/ICredentials';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { IResponse } from '../models/IResponse';


const schema  = z.object({
    email: z.string().min(3, 'Email is required').email("Invalid email address"),
    password: z.string().min(4, 'Password is required').max(255), //TODO: set min to 8
});
const Login = () => {
    const location = useLocation();
    const isLoggedIn: boolean = JSON.parse(localStorage.getItem('')!) as boolean || false;
    const [loginUser, { data, error, isLoading, isSuccess }] = userAPI.useLoginUserMutation();
    const { register, handleSubmit, formState: loginForm, getFieldState } = useForm<IUserRequest>( { resolver : zodResolver(schema), mode: 'onTouched' });

    const isFieldValid = (fieldName: keyof IUserRequest): boolean => getFieldState(fieldName, loginForm).isTouched && !getFieldState(fieldName, loginForm).invalid;
    const handleLogin = (credentials: IUserRequest) => loginUser(credentials);

    if(isLoggedIn) {
        return location?.state?.from?.pathname ? <Navigate to={location?.state?.from?.pathname} replace /> : <Navigate to="/" />;
    }

    if(isSuccess && (!data?.data.userL.mfa)) {
        localStorage.setItem('login', 'true');
        return location?.state?.from?.pathname ? <Navigate to={location?.state?.from?.pathname} replace /> : <Navigate to="/" />;
    }

    if(isSuccess && (data?.data.userL.mfa)) {
        return (
            <div className="container mtb">
                <div className="row justify-content-center mt-7">
                    <div className="col-lg-5 text-center">
                        <a href="index.html">
                            <img src="assets/img/svg/logo.svg" alt="" />
                        </a>
                        <div className="card mt-5">
                            <div className="card-body">
                                <h4 className="mb-3">2-Step Verification</h4>
                                {/* Error alert placeholder */}
                                <hr />
                                <div className="svg-icon svg-icon-xl text-purple">
                                    <i className="bi bi-lock fs-3 text"></i>
                                </div>
                                <form className="needs-validation" noValidate>
                                    <label className="form-label">Please enter QR code</label>
                                    <div className="row mt-4 pt-2">
                                        <input type="hidden" name='userId' id="userId" disabled={false} required />
                                        <div className="col">
                                            <input type="text" name='qrCode1' className="form-control text-center" id="qrCode1" disabled={false} required maxLength={1} autoFocus />
                                        </div>
                                        <div className="col">
                                            <input type="text" name='qrCode2' className="form-control text-center" id="qrCode2" disabled={false} required maxLength={1} />
                                        </div>
                                        <div className="col">
                                            <input type="text" name='qrCode3' className="form-control text-center" id="qrCode3" disabled={false} required maxLength={1} />
                                        </div>
                                        <div className="col">
                                            <input type="text" name='qrCode4' className="form-control text-center" id="qrCode4" disabled={false} required maxLength={1} />
                                        </div>
                                        <div className="col">
                                            <input type="text" name='qrCode5' className="form-control text-center" id="qrCode5" disabled={false} required maxLength={1} />
                                        </div>
                                        <div className="col">
                                            <input type="text" name='qrCode6' className="form-control text-center" id="qrCode6" disabled={false} required maxLength={1} />
                                        </div>
                                    </div>
                                    <div className="col mt-3">
                                        <button className="btn btn-primary btn-block" type="submit">
                                            <span role="status">Verify</span>
                                        </button>
                                    </div>
                                </form>
                                <hr className="my-3" />
                                <div className="row mb-3">
                                    <div className="col d-flex justify-content-start">
                                        <div className="btn btn-outline-light">
                                            <Link to="/register" style={{ textDecoration: 'none' }}>Create an Account</Link>
                                        </div>
                                    </div>
                                    <div className="col d-flex justify-content-end">
                                        <div className="link-dark">
                                            <Link to="/resetpassword">Forgot password?</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-6 col-sm-12" style={{ marginTop: '150px' }}>
                    <div className="card">
                        <div className="card-body">
                            <h4 className="mb-3">Login</h4>
                            {error && <div className="alert alert-dismissible alert-danger">
                                {'data' in error ? (error.data as IResponse<void>).message : 'An error occurred'}
                            </div>}
                            <hr />
                            <form onSubmit={handleSubmit(handleLogin)} className="needs-validation" noValidate>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <div className="input-group has-validation">
                                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                                            <input type="text" {...register('email')} name='email' autoComplete="on"
                                                className={`form-control ' ${loginForm.errors.email ? 'is-invalid' : ''}
                                                ${isFieldValid('email') ? 'is-valid' : ''}`}
                                                id="email" placeholder="Email address" disabled={false} required />
                                            <div className="invalid-feedback">{loginForm.errors.email?.message}</div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="input-group has-validation">
                                            <span className="input-group-text"><i className="bi bi-key"></i></span>
                                            <input type="password" {...register('password')} name='password' autoComplete="on"
                                                className={`form-control ' ${loginForm.errors.email ? 'is-invalid' : ''}
                                                 ${isFieldValid('password') ? 'is-valid' : ''}`} 
                                                 placeholder="Password" disabled={false} required />
                                            <div className="invalid-feedback">{loginForm.errors.password?.message}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col mt-3">
                                    <button disabled={loginForm.isSubmitting || isLoading} className="btn btn-primary btn-block" type="submit">
                                        {(loginForm.isSubmitting || isLoading) && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                                        <span role="status">{isLoading || loginForm.isSubmitting? 'Loading...' : 'Login'}</span>
                                    </button>
                                </div>
                            </form>
                            <hr className="my-3" />
                            <div className="row mb-3">
                                <div className="col d-flex justify-content-start">
                                    <div className="btn btn-outline-light">
                                        <Link to="/register" style={{ textDecoration: 'none' }}>Create an Account</Link>
                                    </div>
                                </div>
                                <div className="col d-flex justify-content-end">
                                    <div className="link-dark">
                                        <Link to="/resetpassword">Forgot password?</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;