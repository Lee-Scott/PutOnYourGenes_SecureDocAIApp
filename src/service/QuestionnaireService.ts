import { createApi } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../models/IResponse';
import { isJsonContentType, processError, processResponse } from '../utils/RequestUtils';
import { Http } from '../enum/http.method';
import { createBaseQueryWithAuth } from './BaseQueryWithAuth';
import type { 
  IQuestionnaire, 
  IQuestionnaireRequest, 
  IQuestionnaireList 
} from '../models/IQuestionnaire';
import type { 
  IQuestionnaireResponse, 
  IQuestionnaireResponseRequest,
  IQuestionnaireAnalytics 
} from '../models/IQuestionnaireResponse';

// Transform functions to handle backend response structure
const transformQuestionnaireListResponse = (response: any): IResponse<IQuestionnaireList> => {
  return {
    status: response.status,
    data: response.data, // Backend already returns the correct structure
    message: response.message,
    timestamp: response.time
  };
};

const transformQuestionnaireResponse = (response: any): IResponse<IQuestionnaire> => {
  const questionnaire = response.data.questionnaire;
  
  // Transform validation rules from strings to numbers
  const transformedQuestionnaire = {
    ...questionnaire,
    pages: questionnaire.pages.map((page: any) => ({
      ...page,
      questions: page.questions.map((question: any) => ({
        ...question,
        validationRules: question.validationRules ? {
          ...question.validationRules,
          minValue: question.validationRules.minValue ? Number(question.validationRules.minValue) : undefined,
          maxValue: question.validationRules.maxValue ? Number(question.validationRules.maxValue) : undefined,
          minLength: question.validationRules.minLength ? Number(question.validationRules.minLength) : undefined,
          maxLength: question.validationRules.maxLength ? Number(question.validationRules.maxLength) : undefined
        } : undefined
      }))
    }))
  };

  return {
    status: response.status,
    data: transformedQuestionnaire,
    message: response.message,
    timestamp: response.time
  };
};

const transformQuestionnaireResponseData = (response: any): IResponse<IQuestionnaireResponse> => {
  return {
    status: response.status,
    data: response.data.response,
    message: response.message,
    timestamp: response.time
  };
};

const transformQuestionnaireResponseListData = (response: any): IResponse<IQuestionnaireResponse[]> => {
  return {
    status: response.status,
    data: response.data.responses,
    message: response.message,
    timestamp: response.time
  };
};

const transformAnalyticsResponse = (response: any): IResponse<IQuestionnaireAnalytics> => {
  return {
    status: response.status,
    data: response.data.analytics,
    message: response.message,
    timestamp: response.time
  };
};

// Questionnaire API base URL
const questionnaireApiBaseUrl = 'http://localhost:8085/api/questionnaires';

/**
 * Questionnaire API Service
 * 
 * RTK Query service for managing medical questionnaire operations including:
 * - Fetching available questionnaires
 * - Creating and updating questionnaires (admin)
 * - Submitting questionnaire responses
 * - Retrieving user responses and analytics
 * 
 * Features:
 * - Secure authentication integration
 * - Automatic caching and re-fetching
 * - Error handling and validation
 * - Progress tracking for multi-page questionnaires
 * 
 * Security Considerations:
 * - All endpoints require authentication
 * - Responses are encrypted in transit
 * - User data access is restricted by user ID
 * - Admin functions require elevated permissions
 */
export const questionnaireAPI = createApi({
  // Unique identifier for this API slice in the Redux store
  reducerPath: 'questionnaireAPI',

  // Base query configuration with authentication
  baseQuery: createBaseQueryWithAuth(questionnaireApiBaseUrl, isJsonContentType),

  // Cache tag types for invalidation strategies
  tagTypes: ['Questionnaire', 'QuestionnaireResponse', 'QuestionnaireList'],

  // Define the API endpoints
  endpoints: (builder) => ({
    /**
     * Fetches all available questionnaires for users
     * @returns {IResponse<IQuestionnaireList>} Response containing list of questionnaires
     */
    getQuestionnaires: builder.query<IResponse<IQuestionnaireList>, { page?: number; size?: number; category?: string }>({
      query: ({ page = 0, size = 10, category }) => ({
        url: `?page=${page}&size=${size}${category ? `&category=${category}` : ''}`,
        method: Http.GET
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
      transformResponse: transformQuestionnaireListResponse,
      transformErrorResponse: processError,
      providesTags: ['QuestionnaireList']
    }),

    /**
     * Fetches a specific questionnaire by ID
     * @param {string} questionnaireId - The ID of the questionnaire
     * @returns {IResponse<IQuestionnaire>} Response containing questionnaire details
     */
    getQuestionnaireById: builder.query<IResponse<IQuestionnaire>, string>({
      query: (questionnaireId) => ({
        url: `/${questionnaireId}`,
        method: Http.GET
      }),
      keepUnusedDataFor: 600, // Cache for 10 minutes
      transformResponse: transformQuestionnaireResponse,
      transformErrorResponse: processError,
      providesTags: (_result, _error, questionnaireId) => [
        { type: 'Questionnaire', id: questionnaireId }
      ]
    }),

    /**
     * Creates a new questionnaire (admin only)
     * @param {IQuestionnaireRequest} questionnaireData - The questionnaire data
     * @returns {IResponse<IQuestionnaire>} Response containing created questionnaire
     */
    createQuestionnaire: builder.mutation<IResponse<IQuestionnaire>, IQuestionnaireRequest>({
      query: (questionnaireData) => ({
        url: '',
        method: Http.POST,
        body: questionnaireData
      }),
      transformResponse: transformQuestionnaireResponse,
      transformErrorResponse: processError,
      invalidatesTags: ['QuestionnaireList']
    }),

    /**
     * Updates an existing questionnaire (admin only)
     * @param {object} params - Object containing questionnaireId and updated data
     * @returns {IResponse<IQuestionnaire>} Response containing updated questionnaire
     */
    updateQuestionnaire: builder.mutation<IResponse<IQuestionnaire>, { id: string; data: Partial<IQuestionnaireRequest> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: Http.PATCH,
        body: data
      }),
      transformResponse: transformQuestionnaireResponse,
      transformErrorResponse: processError,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Questionnaire', id },
        'QuestionnaireList'
      ]
    }),

    /**
     * Submits a questionnaire response
     * @param {IQuestionnaireResponseRequest} responseData - The response data
     * @returns {IResponse<IQuestionnaireResponse>} Response containing saved response
     */
    submitQuestionnaireResponse: builder.mutation<IResponse<IQuestionnaireResponse>, IQuestionnaireResponseRequest>({
      query: (responseData) => ({
        url: '/responses',
        method: Http.POST,
        body: responseData
      }),
      transformResponse: transformQuestionnaireResponseData,
      transformErrorResponse: processError,
      invalidatesTags: ['QuestionnaireResponse']
    }),

    /**
     * Updates an existing questionnaire response (partial submission)
     * @param {object} params - Object containing responseId and updated data
     * @returns {IResponse<IQuestionnaireResponse>} Response containing updated response
     */
    updateQuestionnaireResponse: builder.mutation<IResponse<IQuestionnaireResponse>, { id: string; data: Partial<IQuestionnaireResponseRequest> }>({
      query: ({ id, data }) => ({
        url: `/responses/${id}`,
        method: Http.PATCH,
        body: data
      }),
      transformResponse: transformQuestionnaireResponseData,
      transformErrorResponse: processError,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'QuestionnaireResponse', id }
      ]
    }),

    /**
     * Fetches user's questionnaire responses
     * @param {string} userId - The user ID (optional, defaults to current user)
     * @returns {IResponse<IQuestionnaireResponse[]>} Response containing user responses
     */
    getUserResponses: builder.query<IResponse<IQuestionnaireResponse[]>, string | void>({
      query: (userId) => ({
        url: userId ? `/responses/user/${userId}` : '/responses/my',
        method: Http.GET
      }),
      keepUnusedDataFor: 120, // Cache for 2 minutes
      transformResponse: transformQuestionnaireResponseListData,
      transformErrorResponse: processError,
      providesTags: ['QuestionnaireResponse']
    }),

    /**
     * Fetches a specific questionnaire response
     * @param {string} responseId - The response ID
     * @returns {IResponse<IQuestionnaireResponse>} Response containing the questionnaire response
     */
    getQuestionnaireResponse: builder.query<IResponse<IQuestionnaireResponse>, string>({
      query: (responseId) => ({
        url: `/responses/${responseId}`,
        method: Http.GET
      }),
      keepUnusedDataFor: 300, // Cache for 5 minutes
      transformResponse: transformQuestionnaireResponseData,
      transformErrorResponse: processError,
      providesTags: (_result, _error, responseId) => [
        { type: 'QuestionnaireResponse', id: responseId }
      ]
    }),

    /**
     * Fetches questionnaire analytics (admin only)
     * @param {string} questionnaireId - The questionnaire ID
     * @returns {IResponse<IQuestionnaireAnalytics>} Response containing analytics data
     */
    getQuestionnaireAnalytics: builder.query<IResponse<IQuestionnaireAnalytics>, string>({
      query: (questionnaireId) => ({
        url: `/${questionnaireId}/analytics`,
        method: Http.GET
      }),
      keepUnusedDataFor: 600, // Cache for 10 minutes
      transformResponse: transformAnalyticsResponse,
      transformErrorResponse: processError,
      providesTags: (_result, _error, questionnaireId) => [
        { type: 'Questionnaire', id: `analytics-${questionnaireId}` }
      ]
    }),

    /**
     * Deletes a questionnaire (admin only)
     * @param {string} questionnaireId - The questionnaire ID
     * @returns {IResponse<void>} Response confirming deletion
     */
    deleteQuestionnaire: builder.mutation<IResponse<void>, string>({
      query: (questionnaireId) => ({
        url: `/${questionnaireId}`,
        method: Http.DELETE
      }),
      transformResponse: processResponse<void>,
      transformErrorResponse: processError,
      invalidatesTags: (_result, _error, questionnaireId) => [
        { type: 'Questionnaire', id: questionnaireId },
        'QuestionnaireList'
      ]
    })
  })
});

// Export individual hooks for use in components
export const {
  useGetQuestionnairesQuery,
  useGetQuestionnaireByIdQuery,
  useCreateQuestionnaireMutation,
  useUpdateQuestionnaireMutation,
  useSubmitQuestionnaireResponseMutation,
  useUpdateQuestionnaireResponseMutation,
  useGetUserResponsesQuery,
  useGetQuestionnaireResponseQuery,
  useGetQuestionnaireAnalyticsQuery,
  useDeleteQuestionnaireMutation
} = questionnaireAPI;

// Export the API for store configuration
export default questionnaireAPI;
