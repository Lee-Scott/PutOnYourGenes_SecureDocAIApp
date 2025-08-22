
import React from 'react';
import { IRegisterRequest } from '../../models/ICredentials';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userAPI } from '../../service/UserService';
import { useOutletContext } from 'react-router-dom';
import { IUser } from '../../models/IUser';

const schema = z.object({
  email: z.string().min(3, 'Email is required').email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().min(5, 'Bio is required').optional(),
 phone: z.string()
  .optional()
  .refine(val => !val || val.length >= 7, { message: 'Phone must be at least 7 characters or empty' })
});

const Profile = () => {
  type UserContext = { user: { data: { user: IUser } } };
  const { user } = useOutletContext<UserContext>();
  const { register, handleSubmit, formState: form, getFieldState, reset } = useForm<IRegisterRequest>({ resolver: zodResolver(schema), mode: 'onTouched' });
  const [update, { isLoading: updateLoading }] = userAPI.useUpdateUserMutation();

  const updateUser = async (formData: IRegisterRequest) => {
    try {
      await update(formData);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  // Reset form when user data loads
  React.useEffect(() => {
    if (user?.data?.user) {
      reset({
        email: user.data.user.email,
        firstName: user.data.user.firstName,
        lastName: user.data.user.lastName,
        phone: user.data.user.phone || '',
        bio: user.data.user.bio || ''
      });
    }
  }, [user, reset]);

  const isFieldValid = (fieldName: keyof IRegisterRequest): boolean => getFieldState(fieldName, form).isTouched && !getFieldState(fieldName, form).invalid;

  return (
    <>
      <h4 className="mb-3">Profile</h4>
      <hr />
      <form onSubmit={handleSubmit(updateUser)} className="needs-validation" noValidate>
          <div className="row g-3">
            <div className="col-sm-6">
              <label htmlFor="firstName" className="form-label">First name</label><div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                <input type="text" {...register('firstName')} className={`form-control ' ${form.errors.firstName? 'is-invalid' : ''} ${isFieldValid('firstName') ? 'is-valid' : '' }`} placeholder="First name" disabled={user?.data.user.role === 'USER'} required />
                <div className="invalid-feedback">{form.errors.firstName?.message}</div>
                </div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="lastName" className="form-label">Last name</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-person-vcard"></i></span>
                <input type="text" {...register('lastName')} className={`form-control ' ${form.errors.lastName? 'is-invalid' : ''} ${isFieldValid('lastName') ? 'is-valid' : '' }`} placeholder="Last name" disabled={user?.data.user.role === 'USER'} required />
                <div className="invalid-feedback">{form.errors.lastName?.message}</div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="email" className="form-label">Email address</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input type="text" {...register('email')} className={`form-control ' ${form.errors.email? 'is-invalid' : ''} ${isFieldValid('email') ? 'is-valid' : '' }`} placeholder="Email" disabled={user?.data.user.role === 'USER'} required />
                <div className="invalid-feedback">{form.errors.email?.message}</div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="phone" className="form-label">Phone number</label>
              <div className="input-group has-validation">
                <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                <input type="text" {...register('phone')} className={`form-control ' ${form.errors.phone? 'is-invalid' : ''} ${isFieldValid('phone') ? 'is-valid' : '' }`} placeholder="123-456-7890" disabled={user?.data.user.role === 'USER'} required />
                <div className="invalid-feedback">{form.errors.phone?.message}</div>
              </div>
            </div>
            <div className="col-12">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea className={`form-control ' ${form.errors.bio? 'is-invalid' : ''} ${isFieldValid('bio') ? 'is-valid' : '' }`} {...register('bio')} placeholder="Something about yourself here" disabled={user?.data.user.role === 'USER'} rows={3} required></textarea>
              <div className="invalid-feedback">{form.errors.bio?.message}</div>
            </div>
          </div>
          <hr className="my-4"/>
          <div className="col">
            <button disabled={!form.isValid || form.isSubmitting || updateLoading || user?.data.user.role === 'USER'} className="btn btn-primary btn-block" type="submit" >
                  {(form.isSubmitting || updateLoading) && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                    <span role="status">{(form.isSubmitting || updateLoading) ? 'Loading...' : 'Update'}</span>
                  </button>
          </div>
        </form>
    </>
  )
}

export default Profile;
