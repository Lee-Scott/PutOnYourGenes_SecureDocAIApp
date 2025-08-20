import { createApi } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../models/IResponse';
import { isJsonContentType, processError, processResponse, documentsApiBaseUrl } from '../utils/RequestUtils';
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

    fetchDocument: builder.query<IResponse<Document>, string>({
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
        url: `/${documentForm.documentId}`,
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
    
    checkoutDocument: builder.mutation<IResponse<ILock>, string>({
      query: (documentId) => ({
        url: `/${documentId}/checkout`,
        method: Http.POST,
      }),
      transformResponse: processResponse<ILock>,
      transformErrorResponse: processError,
    }),

    getDocumentStatus: builder.query<IResponse<any>, string>({
      query: (documentId) => ({
        url: `/${documentId}/status`,
        method: Http.GET,
      }),
      transformErrorResponse: processError,
    }),

    checkinDocument: builder.mutation<IResponse<void>, { documentId: string; file: File; baseVersion: number; lockId?: string }>({
      query: ({ documentId, file, baseVersion, lockId }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/${documentId}/checkin?baseVersion=${baseVersion}&lockId=${lockId}`,
          method: Http.PUT,
          body: formData,
        };
      },
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
    }),

    getVersions: builder.query<IResponse<any[]>, string>({
      query: (documentId) => ({
        url: `/${documentId}/versions`,
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
