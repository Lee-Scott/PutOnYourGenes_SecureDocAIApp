import { fetchBaseQuery, BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query/react';

export const createBaseQuery = (baseUrl: string, isJsonContentType: (headers: Headers) => boolean) =>
  fetchBaseQuery({
    baseUrl,
    isJsonContentType,
  });

// You can pass baseUrl and isJsonContentType as arguments for flexibility
export const createBaseQueryWithAuth = (baseUrl: string, isJsonContentType: (headers: Headers) => boolean) =>
  async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl,
      credentials: 'include',
      isJsonContentType
    });
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      localStorage.removeItem('[KEY] LOGGEDIN');
      window.location.href = '/login';
    }
    return result;
  };
