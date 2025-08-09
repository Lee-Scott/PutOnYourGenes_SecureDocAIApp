import { createApi } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../models/IResponse';
import { userApiBaseUrl, isJsonContentType, processError, processResponse } from '../utils/RequestUtils';
import type { QrCodeRequest, Role, User } from '../models/IUser';
import type { EmailAddress, IRegisterRequest, IUserRequest, UpdateNewPassword, UpdatePassword } from '../models/ICredentials';
import { Http } from '../enum/http.method';
import { createBaseQueryWithAuth } from './BaseQueryWithAuth';

/**
 * Redux Toolkit Query API for user-related operations.
 * This service handles fetching user data from the backend API.
 */
export const userAPI = createApi({
  // Unique identifier for this API slice in the Redux store
  reducerPath: 'userAPI',

  // Base query configuration with common settings for all endpoints
  baseQuery: createBaseQueryWithAuth(userApiBaseUrl, isJsonContentType),

  // Cache tag types for invalidation strategies
  tagTypes: ['User'],

  // Define the API endpoints
  endpoints: (builder) => ({
    /**
     * Fetches the current user's profile information
     * This query is very important because it is called every time we
     * invalidatesTags: (result, error) => error ? [] : ['User']
     * and refetch the data. Not very efficent if working with large 
     * amounts of data. You may want to catch it.
     * @returns {IResponse<User>} Response containing user data
     */
    fetchUser: builder.query<IResponse<User>, void>({
      // Request configuration
      query: () => ({
        url: '/profile',
        method: Http.GET
      }),

      // Cache configuration: keep data for 2 minutes when not in use
      keepUnusedDataFor: 120,

      // Response handling
      transformResponse: processResponse<User>,
      transformErrorResponse: processError,

      // Cache tag association for automatic invalidation
      providesTags: () => ['User']
    }),

    fetchUserById: builder.query<IResponse<User>, string>({
      query: (userId) => ({
        url: `/profile/${userId}`,
        method: Http.GET
      }),
      keepUnusedDataFor: 120,
      transformResponse: processResponse<User>,
      transformErrorResponse: processError,
      providesTags: () => ['User']
    }),

    /**
     * Authenticates a user with credentials
     * @param {IUserRequest} credentials - User login credentials
     * @returns {IResponse<User>} Response containing authenticated user data
     */
    loginUser: builder.mutation<IResponse<User>, IUserRequest>({
      // Request configuration with credentials parameter
      query: (credentials) => ({
        url: '/login',
        method: Http.POST,
        // The credentials object will be automatically serialized as the request body
        body: credentials,
        //headers: you can pass headers here
      }),

      // Response handling
      transformResponse: processResponse<User>,
      transformErrorResponse: processError,

      // No providesTags needed for login - authentication shouldn't be cached
      // Login is a stateful operation that should always be performed fresh
    }),

    registerUser: builder.mutation<IResponse<void>, IRegisterRequest>({
      query: (registerRequest) => ({
        url: '/register',
        method: Http.POST,

        body: registerRequest
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,

    }),

    verifyAccount: builder.mutation<IResponse<void>, string>({
      query: (key) => ({
        url: `/verify?key=${key}`,
        method: Http.GET,
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
    }),
    verifyPassword: builder.mutation<IResponse<User>, string>({
      query: (key) => ({
        url: `/verify/password?key=${key}`,
        method: Http.GET,
      }),
      transformResponse: processResponse<User>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),

    verifyQrCode: builder.mutation<IResponse<User>, QrCodeRequest>({
      query: (qrCodeRequest) => ({
        url: '/verify/qrcode',
        method: Http.POST,

        body: qrCodeRequest
      }),
      transformResponse: processResponse<User>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User'] // tag is a reference to the cache in the store

    }),

    resetPassword: builder.mutation<IResponse<void>, EmailAddress>({
      query: (email) => ({
        url: '/resetpassword',
        method: Http.POST,
        body: email
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    doResetPassword: builder.mutation<IResponse<void>, UpdateNewPassword>({
      query: (passwordrequest) => ({
        url: `/resetpassword/reset}`,
        method: Http.GET,
        body: passwordrequest
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    updatePhoto: builder.mutation<IResponse<string>, FormData>({
      query: (form) => ({
        url: `/photo`,
        method: Http.PATCH,
        body: form
      }),
      transformResponse: processResponse<string>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    updateUser: builder.mutation<IResponse<User>, IUserRequest>({
      query: (user) => ({
        url: `/update`,
        method: Http.PATCH,
        body: user
      }),
      transformResponse: processResponse<User>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),

    /**
     * Updates a specific user by ID (admin function)
     * @param {object} params - Object containing userId and user data
     * @returns {IResponse<User>} Response containing updated user data
     */
    updateUserByAdmin: builder.mutation<IResponse<User>, { userId: string; userData: IUserRequest }>({
      query: ({ userId, userData }) => ({
        url: `/update/${userId}`,
        method: Http.PATCH,
        body: userData
      }),
      transformResponse: processResponse<User>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    updateRoleByAdmin: builder.mutation<IResponse<void>, { userId: string; role: string }>({
      query: ({ userId, role }) => ({
        url: `/updateRole/${userId}`,
        method: Http.PATCH,
        body: { role }
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    updatePassword: builder.mutation<IResponse<void>, UpdatePassword>({
      query: (request) => ({
        url: `/updatePassword`,
        method: Http.PATCH,
        body: {
          oldPassword: request.password,
          newPassword: request.newPassword,
          confirmNewPassword: request.confirmNewPassword
        }
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    toggleAccountExpired: builder.mutation<IResponse<void>, void>({
      query: () => ({
        url: `/toggleAccountExpired`,
        method: Http.PATCH
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    toggleAccountLocked: builder.mutation<IResponse<void>, void>({
      query: () => ({
        url: `/toggleAccountLocked`,
        method: Http.PATCH
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    toggleAccountEnabled: builder.mutation<IResponse<void>, void>({
      query: () => ({
        url: `/toggleAccountEnabled`,
        method: Http.PATCH
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    toggleCredentialsExpired: builder.mutation<IResponse<void>, void>({
      query: () => ({
        url: `/toggleCredentialsExpired`,
        method: Http.PATCH
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    enableMfa: builder.mutation<IResponse<User>, void>({
      query: () => ({
        url: `/mfa/setup`,
        method: Http.PATCH
      }),
      transformResponse: processResponse<User>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    disableMfa: builder.mutation<IResponse<User>, void>({
      query: () => ({
        url: `/mfa/cancel`,
        method: Http.PATCH
      }),
      transformResponse: processResponse<User>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    getUsers: builder.query<IResponse<{ users: User[] }>, void>({
      query: () => ({
        url: '/list',
        method: Http.PATCH
      }),
      transformResponse: processResponse<{ users: User[] }>,
      transformErrorResponse: processError,
      providesTags: () => ['User']
    }),
    logout: builder.mutation<IResponse<void>, void>({
      query: () => ({
        url: '/logout',
        method: Http.POST
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),
    deleteUser: builder.mutation<IResponse<void>, string>({
      query: (userId) => ({
        url: `/delete/${userId}`,
        method: Http.DELETE
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, error) => error ? [] : ['User']
    }),

    getHealthcareProviders: builder.query<IResponse<User[]>, void>({
      query: () => ({
        url: '/healthcare-providers',
        method: Http.GET
      }),
      transformResponse: processResponse<User[]>,
      transformErrorResponse: processError,
      providesTags: () => ['User']
    }),

  }),
});

// Export the auto-generated React hook for use in components 
export const {
  useFetchUserQuery,
  useFetchUserByIdQuery,
  useUpdateUserByAdminMutation,
  useGetHealthcareProvidersQuery,
  useGetUsersQuery,
  useUpdateRoleByAdminMutation
} = userAPI;
