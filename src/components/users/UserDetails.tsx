import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toastSuccess, toastError } from '../../utils/ToastUtils';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userAPI } from '../../service/UserService';
import { IRegisterRequest } from '../../models/ICredentials';
import Loader from '../profile/Loader';

const schema = z.object({
  email: z.string().min(3, 'Email is required').email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().min(5, 'Bio is required').optional(),
  phone: z.string()
    .optional()
    .refine(val => !val || val.length >= 7, { message: 'Phone must be at least 7 characters or empty' })
});

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: form, getFieldState, reset } = useForm<IRegisterRequest>({ 
    resolver: zodResolver(schema), 
    mode: 'onTouched'
  });
  
  const { data: currentUser } = userAPI.useFetchUserQuery();
  
  // For now, we'll use the current user data since there's no fetchUserById endpoint yet
  // You can add this endpoint to your UserService later
  const { data: userData, isLoading, error, isSuccess } = userAPI.useFetchUserQuery();
  
  const [updateUser, { isLoading: updateLoading }] = userAPI.useUpdateUserMutation();
  const [updateRole, { isLoading: roleLoading }] = userAPI.useUpdateRoleMutation();
  const [toggleAccountEnabled, { isLoading: enableLoading }] = userAPI.useToggleAccountEnabledMutation();
  const [toggleAccountLocked, { isLoading: lockLoading }] = userAPI.useToggleAccountLockedMutation();
  const [toggleAccountExpired, { isLoading: expiredLoading }] = userAPI.useToggleAccountExpiredMutation();
  const [toggleCredentialsExpired, { isLoading: credentialsLoading }] = userAPI.useToggleCredentialsExpiredMutation();

  const isFieldValid = (fieldName: keyof IRegisterRequest): boolean => 
    getFieldState(fieldName, form).isTouched && !getFieldState(fieldName, form).invalid;

  // Reset form when user data loads
  useEffect(() => {
    if (userData?.data?.user) {
      reset({
        firstName: userData.data.user.firstName,
        lastName: userData.data.user.lastName,
        email: userData.data.user.email,
        phone: userData.data.user.phone || '',
        bio: userData.data.user.bio || ''
      });
    }
  }, [userData, reset]);

  const onUpdateUser: SubmitHandler<IRegisterRequest> = async (formData) => {
    try {
      await updateUser(formData);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const onUpdateRole = async (newRole: string) => {
    try {
      await updateRole({ role: newRole });
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const onToggleEnabled = async () => {
    try {
      await toggleAccountEnabled();
    } catch (error) {
      console.error('Failed to toggle account enabled:', error);
    }
  };

  const onToggleLocked = async () => {
    try {
      await toggleAccountLocked();
    } catch (error) {
      console.error('Failed to toggle account locked:', error);
    }
  };

  const onToggleExpired = async () => {
    try {
      await toggleAccountExpired();
    } catch (error) {
      console.error('Failed to toggle account expired:', error);
    }
  };

  const onToggleCredentialsExpired = async () => {
    try {
      await toggleCredentialsExpired();
    } catch (error) {
      console.error('Failed to toggle credentials expired:', error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="container mtb">
        <div className="alert alert-danger" role="alert">
          Error loading user details. Please try again.
        </div>
      </div>
    );
  }

  if (!userData?.data?.user) {
    return (
      <div className="container mtb">
        <div className="alert alert-warning" role="alert">
          User not found.
        </div>
      </div>
    );
  }

  const user = userData.data.user;
  const canManageUsers = currentUser?.data?.user?.authorities?.includes('user:update');
  const canManageRoles = currentUser?.data?.user?.authorities?.includes('user:role');

  return (
    <div className="container mtb">
      <div className="row">
        <div className="col-xl-8">
          {/* User Profile Card */}
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div className="text-center border-end">
                    <img 
                      src={user.imageUrl || 'https://via.placeholder.com/150'} 
                      className="avatar-xxl rounded-circle" 
                      alt={`${user.firstName} ${user.lastName}`} 
                    />
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="ms-3 text-lg-start text-sm-center text-xs-center">
                    <h4 className="card-title mb-2 mt-sm-3">{user.firstName} {user.lastName}</h4>
                    <p className="text-muted mb-2">{user.email}</p>
                    <p className="text-muted mb-2">Role: <span className="badge bg-primary">{user.role}</span></p>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <div className="d-flex gap-2 flex-wrap">
                          <span className={`badge ${user.enabled ? 'bg-success' : 'bg-danger'}`}>
                            {user.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                          <span className={`badge ${user.accountNonLocked ? 'bg-success' : 'bg-warning'}`}>
                            {user.accountNonLocked ? 'Unlocked' : 'Locked'}
                          </span>
                          <span className={`badge ${user.accountNonExpired ? 'bg-success' : 'bg-warning'}`}>
                            {user.accountNonExpired ? 'Active' : 'Expired'}
                          </span>
                          <span className={`badge ${user.credentialsNonExpired ? 'bg-success' : 'bg-warning'}`}>
                            {user.credentialsNonExpired ? 'Valid Credentials' : 'Credentials Expired'}
                          </span>
                          {user.mfa && <span className="badge bg-info">2FA Enabled</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Details Form */}
          <div className="card mt-4">
            <div className="card-body">
              <form onSubmit={handleSubmit(onUpdateUser)} className="needs-validation" noValidate>
                <h4 className="mb-3">User Details</h4>
                <hr />
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">First name</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                      <input 
                        type="text" 
                        {...register('firstName')} 
                        className={`form-control ${form.errors.firstName ? 'is-invalid' : ''} ${isFieldValid('firstName') ? 'is-valid' : ''}`} 
                        placeholder="First name" 
                        defaultValue={user.firstName} 
                        disabled={!canManageUsers}
                        required 
                      />
                      <div className="invalid-feedback">{form.errors.firstName?.message}</div>
                    </div>
                  </div>
                  
                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">Last name</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                      <input 
                        type="text" 
                        {...register('lastName')} 
                        className={`form-control ${form.errors.lastName ? 'is-invalid' : ''} ${isFieldValid('lastName') ? 'is-valid' : ''}`} 
                        placeholder="Last name" 
                        defaultValue={user.lastName} 
                        disabled={!canManageUsers}
                        required 
                      />
                      <div className="invalid-feedback">{form.errors.lastName?.message}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                      <input 
                        type="text" 
                        {...register('email')} 
                        className={`form-control ${form.errors.email ? 'is-invalid' : ''} ${isFieldValid('email') ? 'is-valid' : ''}`} 
                        placeholder="Email" 
                        defaultValue={user.email} 
                        disabled={!canManageUsers}
                        required 
                      />
                      <div className="invalid-feedback">{form.errors.email?.message}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">Phone number</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                      <input 
                        type="text" 
                        {...register('phone')} 
                        className={`form-control ${form.errors.phone ? 'is-invalid' : ''} ${isFieldValid('phone') ? 'is-valid' : ''}`} 
                        placeholder="123-456-7890" 
                        defaultValue={user.phone} 
                        disabled={!canManageUsers}
                      />
                      <div className="invalid-feedback">{form.errors.phone?.message}</div>
                    </div>
                  </div>

                  <div className="col-12">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea 
                      className={`form-control ${form.errors.bio ? 'is-invalid' : ''} ${isFieldValid('bio') ? 'is-valid' : ''}`} 
                      {...register('bio')} 
                      placeholder="Something about yourself here" 
                      defaultValue={user.bio} 
                      disabled={!canManageUsers}
                      rows={3}
                    />
                    <div className="invalid-feedback">{form.errors.bio?.message}</div>
                  </div>
                </div>
                
                <hr className="my-4" />
                <div className="col">
                  <button 
                    disabled={!form.isValid || form.isSubmitting || updateLoading || !canManageUsers} 
                    className="btn btn-primary btn-block" 
                    type="submit"
                  >
                    {(form.isSubmitting || updateLoading) && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                    <span role="status">{(form.isSubmitting || updateLoading) ? 'Loading...' : 'Update'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Account Management */}
          {canManageUsers && (
            <div className="card mt-4">
              <div className="card-body">
                <h4 className="mb-3">Account Management</h4>
                <hr />
                <div className="row g-3">
                  <div className="col-md-6">
                    <button 
                      className={`btn ${user.enabled ? 'btn-warning' : 'btn-success'} w-100`}
                      onClick={onToggleEnabled}
                      disabled={enableLoading}
                    >
                      {enableLoading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>}
                      {user.enabled ? 'Disable Account' : 'Enable Account'}
                    </button>
                  </div>
                  
                  <div className="col-md-6">
                    <button 
                      className={`btn ${user.accountNonLocked ? 'btn-warning' : 'btn-success'} w-100`}
                      onClick={onToggleLocked}
                      disabled={lockLoading}
                    >
                      {lockLoading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>}
                      {user.accountNonLocked ? 'Lock Account' : 'Unlock Account'}
                    </button>
                  </div>
                  
                  <div className="col-md-6">
                    <button 
                      className={`btn ${user.accountNonExpired ? 'btn-warning' : 'btn-success'} w-100`}
                      onClick={onToggleExpired}
                      disabled={expiredLoading}
                    >
                      {expiredLoading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>}
                      {user.accountNonExpired ? 'Expire Account' : 'Renew Account'}
                    </button>
                  </div>
                  
                  <div className="col-md-6">
                    <button 
                      className={`btn ${user.credentialsNonExpired ? 'btn-warning' : 'btn-success'} w-100`}
                      onClick={onToggleCredentialsExpired}
                      disabled={credentialsLoading}
                    >
                      {credentialsLoading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>}
                      {user.credentialsNonExpired ? 'Expire Credentials' : 'Refresh Credentials'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role Management */}
          {canManageRoles && (
            <div className="card mt-4">
              <div className="card-body">
                <h4 className="mb-3">Role Management</h4>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Current Role: <span className="badge bg-primary">{user.role}</span></label>
                    <select 
                      className="form-select"
                      defaultValue={user.role}
                      onChange={(e) => onUpdateRole(e.target.value)}
                      disabled={roleLoading}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel with User Info */}
        <div className="col-xl-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">User Information</h5>
              <hr />
              <div className="table-responsive">
                <table className="table table-bordered mb-0">
                  <tbody>
                    <tr>
                      <th scope="row">User ID</th>
                      <td>{user.userId}</td>
                    </tr>
                    <tr>
                      <th scope="row">Created</th>
                      <td>{new Intl.DateTimeFormat('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                      }).format(new Date(user.createdAt))}</td>
                    </tr>
                    <tr>
                      <th scope="row">Last Login</th>
                      <td>{user.lastLogin ? new Intl.DateTimeFormat('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit' 
                      }).format(new Date(user.lastLogin)) : 'Never'}</td>
                    </tr>
                    <tr>
                      <th scope="row">Phone</th>
                      <td>{user.phone || 'Not provided'}</td>
                    </tr>
                    <tr>
                      <th scope="row">2FA</th>
                      <td>{user.mfa ? 'Enabled' : 'Disabled'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Bio</h5>
              <hr />
              <p>{user.bio || 'No bio provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;