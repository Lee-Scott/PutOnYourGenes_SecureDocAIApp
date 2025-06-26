import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../models/IResponse';
import { baseURL, isJsonContentType, processError, processResponse } from '../utils/requestutils';
import type { QrCodeRequest, User } from '../models/IUser';
import type { IRegisterRequest, IUserRequest } from '../models/ICredentials';
import { Http } from '../enum/http.method';

/**
 * Redux Toolkit Query API for user-related operations.
 * This service handles fetching user data from the backend API.
 */
export const userAPI = createApi({
  // Unique identifier for this API slice in the Redux store
  reducerPath: 'userAPI',
  
  // Base query configuration with common settings for all endpoints
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    // Include credentials (cookies) with all requests, important for authentication
    credentials: 'include',
    // Custom handler for JSON content type headers
    isJsonContentType
  }),
  
  // Cache tag types for invalidation strategies
  tagTypes: ['User'],
  
  // Define the API endpoints
  endpoints: (builder) => ({
    /**
     * Fetches the current user's profile information
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
      transformErrorResponse: processError, 
      
    }),

    verifyQrCode: builder.mutation<IResponse<User>, QrCodeRequest>({ 
      query: (qrCodeRequest) => ({ 
        url: '/verify/qrcode',
        method: Http.POST,
      
        body: qrCodeRequest
      }),
      transformResponse: processResponse<User>, 
      transformErrorResponse: processError, 
      invalidatesTags: (result, error) => error ? [] : ['User'] // tag is a reference to the cache in the store
      
    }),
  }),
  
});

// Export the auto-generated React hook for use in components
export const { useFetchUserQuery } = userAPI;
