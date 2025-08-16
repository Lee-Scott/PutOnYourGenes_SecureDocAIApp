import { createApi } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../models/IResponse';
import { isJsonContentType, processError, processResponse, documentsApiBaseUrl } from '../utils/RequestUtils';
import type { IRegisterRequest } from '../models/ICredentials';
import { Http } from '../enum/http.method';
import { Document, DocumentForm, Documents, Query } from '../models/IDocument';
import { Page } from '../models/IPage';
import { createBaseQueryWithAuth } from './BaseQueryWithAuth';

export const documentAPI = createApi({
  reducerPath: 'documentAPI',
  baseQuery: createBaseQueryWithAuth(documentsApiBaseUrl, isJsonContentType),
  tagTypes: ['Documents'],
  endpoints: (builder) => ({
    fetchDocuments: builder.query<IResponse<Page>, Query>({
      query: (query) => ({
        url: `search?page=${query.page}&size=${query.size}${query.name ? `&name=${query.name}` : ''}`,
        method: Http.GET
      }),
      keepUnusedDataFor: 120,
      //transformResponse: processResponse<Page>,
      transformErrorResponse: processError,
      providesTags: () => ['Documents']
    }),
    uploadDocuments: builder.mutation<IResponse<Documents>, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: Http.POST,
        body: formData,
      }),
      transformResponse: processResponse<Documents>,
      transformErrorResponse: processError,
      invalidatesTags: (result, error) => error ? [] : ['Documents']
    }),

    fetchDocument: builder.query<IResponse<Document>, IRegisterRequest>({
      query: (documentId) => ({
        url: `/${documentId}`,
        method: Http.GET
      }),
      //transformResponse: processResponse<Page>,
      transformErrorResponse: processError,
      providesTags: () => ['Documents']
    }),

    updateDocument: builder.mutation<IResponse<Document>, DocumentForm>({
      query: (documentForm: DocumentForm): { url: string; method: Http; body: DocumentForm } => ({
        url: ``,
        method: Http.PATCH,
        body: documentForm
      }),
      transformResponse: processResponse<Document>,
      transformErrorResponse: processError,
      invalidatesTags: (result: IResponse<Document> | undefined, error: any) => error ? [] : ['Documents']
    }),

    downloadDocument: builder.mutation<Blob, string>({
      query: (documentId: string): { url: string; method: Http; responseHandler: (response: Response) => Promise<Blob> } => ({
        url: `/${documentId}/download`,
        method: Http.GET,
        responseHandler: (response: Response): Promise<Blob> => response.blob()
      }),
      //transformResponse: (response: Blob) => response,
      transformErrorResponse: processError,
      //invalidatesTags: (result, error) => error ? [] : ['User']
    }),
  
    deleteDocument: builder.mutation<IResponse<void>, string>({
      query: (documentId) => ({
        url: `/delete/${documentId}`,
        method: Http.DELETE,
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (result, error) => error ? [] : ['Documents']
    }),
    
  })
});
