import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';


// You can pass baseUrl and isJsonContentType as arguments for flexibility
export const createBaseQueryWithAuth = (baseUrl: string, isJsonContentType: any) =>
  async (args: any, api: any, extraOptions: any) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl,
      credentials: 'include',
      isJsonContentType
    });
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      localStorage.removeItem('[KEY] LOGGEDIN');
      //api.dispatch(logout());
      window.location.href = '/login';
    }
    return result;
  };