import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// The base URL will be handled by the Vite proxy
const PAPERLESS_API_URL = '/api';

export const paperlessApi = createApi({
  reducerPath: 'paperlessApi',
  baseQuery: fetchBaseQuery({
    baseUrl: PAPERLESS_API_URL,
    prepareHeaders: (headers) => {
      const token = import.meta.env.VITE_PAPERLESS_TOKEN;
      if (token) {
        headers.set('authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDocuments: builder.query<any, void>({
      query: () => 'documents/',
    }),
    getDocument: builder.query<any, number>({
      query: (id) => `documents/${id}/`,
    }),
    uploadDocument: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: 'documents/post_document/',
        method: 'POST',
        body: formData,
      }),
    }),
    updateDocument: builder.mutation<any, { id: number; title: string; content: string }>({
      query: ({ id, ...patch }) => ({
        url: `documents/${id}/`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    getDocumentFile: builder.query<Blob, number>({
      query: (id) => ({
        url: `documents/${id}/download/`,
        responseHandler: (response) => response.blob(),
      }),
    }),
    // We can add more endpoints here as needed (e.g., for searching)
  }),
});

export const { useGetDocumentsQuery, useGetDocumentQuery, useUploadDocumentMutation, useUpdateDocumentMutation, useGetDocumentFileQuery } = paperlessApi;
