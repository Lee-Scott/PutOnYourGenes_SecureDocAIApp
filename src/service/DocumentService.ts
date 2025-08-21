import { createApi } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../models/IResponse';
import { isJsonContentType, processError, processResponse, documentsApiBaseUrl } from '../utils/requestutils';
import type { IRegisterRequest } from '../models/ICredentials';
import { Http } from '../enum/http.method';
import { Document, DocumentForm, Documents, Query } from '../models/IDocument';
import { Page } from '../models/IPage';
import { createBaseQueryWithAuth } from './BaseQueryWithAuth';
import { ILock } from '../models/ILock';

export const documentAPI = createApi({
  reducerPath: 'documentAPI',
  baseQuery: createBaseQueryWithAuth(documentsApiBaseUrl, isJsonContentType),
  tagTypes: ['Documents'],
  endpoints: (builder) => ({
    fetchDocuments: builder.query<Page, Query>({
      query: (query) => ({
        url: `search?page=${query.page}&size=${query.size}${query.name ? `&name=${query.name}` : ''}`,
        method: Http.GET
      }),
      keepUnusedDataFor: 120,
      transformResponse: processResponse<Page>,
      transformErrorResponse: processError,
      providesTags: () => ['Documents']
    }),
    uploadDocuments: builder.mutation<Documents, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: Http.POST,
        body: formData,
      }),
      transformResponse: processResponse<Documents>,
      transformErrorResponse: processError,
      invalidatesTags: (result, error) => error ? [] : ['Documents']
    }),

    fetchDocument: builder.query<Document, string>({
      query: (documentId) => ({
        url: `/${encodeURIComponent(documentId)}`,
        method: Http.GET
      }),
      transformResponse: processResponse<Document>,
      transformErrorResponse: processError,
      providesTags: () => ['Documents']
    }),

    updateDocument: builder.mutation<Document, DocumentForm>({
      query: (documentForm: DocumentForm): { url: string; method: Http; body: DocumentForm } => ({
        url: `/${documentForm.documentId}`,
        method: Http.PATCH,
        body: documentForm
      }),
      transformResponse: processResponse<Document>,
      transformErrorResponse: processError,
      invalidatesTags: (result: Document | undefined, error: any) => error ? [] : ['Documents']
    }),

    downloadDocument: builder.mutation<Blob, string>({
      query: (documentId: string): { url: string; method: Http; responseHandler: (response: Response) => Promise<Blob> } => ({
        url: `/${encodeURIComponent(documentId)}/download`,
        method: Http.GET,
        responseHandler: (response: Response): Promise<Blob> => response.blob()
      }),
      //transformResponse: (response: Blob) => response,
      transformErrorResponse: processError,
      //invalidatesTags: (result, error) => error ? [] : ['User']
    }),
  
    deleteDocument: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `/delete/${encodeURIComponent(documentId)}`,
        method: Http.DELETE,
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (result, error) => error ? [] : ['Documents']
    }),
    
    checkoutDocument: builder.mutation<ILock, string>({
      query: (documentId) => ({
        url: `/${encodeURIComponent(documentId)}/checkout`,
        method: Http.POST,
      }),
      transformResponse: processResponse<ILock>,
      transformErrorResponse: processError,
    }),

    getDocumentStatus: builder.query<IResponse<any>, string>({
      query: (documentId) => ({
        url: `/${encodeURIComponent(documentId)}/status`,
        method: Http.GET,
      }),
      transformErrorResponse: processError,
    }),

    checkinDocument: builder.mutation<void, { documentId: string; file: File; baseVersion: number; lockId?: string }>({
      query: ({ documentId, file, baseVersion, lockId }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/${encodeURIComponent(documentId)}/checkin?baseVersion=${baseVersion}&lockId=${lockId}`,
          method: Http.PUT,
          body: formData,
        };
      },
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
    }),

    getVersions: builder.query<IResponse<any[]>, string>({
      query: (documentId) => ({
        url: `/${encodeURIComponent(documentId)}/versions`,
        method: Http.GET,
      }),
      transformErrorResponse: processError,
    }),
    
  })
});

export const {
  useFetchDocumentsQuery,
  useUploadDocumentsMutation,
  useFetchDocumentQuery,
  useUpdateDocumentMutation,
  useDownloadDocumentMutation,
  useDeleteDocumentMutation,
  useCheckoutDocumentMutation,
  useGetDocumentStatusQuery,
  useCheckinDocumentMutation,
  useGetVersionsQuery,
} = documentAPI;
