import { createApi } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../models/IResponse';
import { isJsonContentType, processError, processResponse } from '../utils/RequestUtils';
import type { IChatRoom } from '../models/IChatRoom';
import type { IChatRoomRequest } from '../models/IChatRoomRequest';
import { Http } from '../enum/http.method';
import { createBaseQueryWithAuth } from './BaseQueryWithAuth';

// Chat room API base URL
const chatRoomApiBaseUrl = 'http://localhost:8085/api/chatrooms';

/**
 * Redux Toolkit Query API for chat room-related operations.
 * This service handles chat room management and messaging operations.
 */
export const chatRoomAPI = createApi({
  // Unique identifier for this API slice in the Redux store
  reducerPath: 'chatRoomAPI',

  // Base query configuration with common settings for all endpoints
  baseQuery: createBaseQueryWithAuth(chatRoomApiBaseUrl, isJsonContentType),

  // Cache tag types for invalidation strategies
  tagTypes: ['ChatRoom', 'ChatRoomList'],

  // Define the API endpoints
  endpoints: (builder) => ({
    /**
     * Fetches all chat rooms
     * @returns {IResponse<{ chatRooms: IChatRoom[] }>} Response containing list of all chat rooms
     */
    getChatRooms: builder.query<IResponse<{ chatRooms: IChatRoom[] }>, void>({
      // Request configuration
      query: () => ({
        url: '',
        method: Http.GET
      }),

      // Cache configuration: keep data for 1 minute when not in use
      keepUnusedDataFor: 60,

      // Response handling
      transformResponse: processResponse<{ chatRooms: IChatRoom[] }>,
      transformErrorResponse: processError,

      // Cache tag association for automatic invalidation
      providesTags: () => ['ChatRoomList']
    }),

    /**
     * Fetches chat rooms for a specific user
     * @param {string} userId - The ID of the user to fetch chat rooms for
     * @returns {IResponse<{ chatRooms: IChatRoom[] }>} Response containing user's chat rooms
     */
    getChatRoomsByUserId: builder.query<IResponse<{ chatRooms: IChatRoom[] }>, string>({
      // Request configuration
      query: (userId) => ({
        url: `/user/${userId}`,
        method: Http.GET
      }),

      // Cache configuration: keep data for 1 minute when not in use
      keepUnusedDataFor: 60,

      // Response handling
      transformResponse: processResponse<{ chatRooms: IChatRoom[] }>,
      transformErrorResponse: processError,

      // Cache tag association for automatic invalidation
      providesTags: (_, __, userId) => [
        { type: 'ChatRoomList', id: userId },
        'ChatRoomList'
      ]
    }),

    /**
     * Fetches a specific chat room by ID
     * @param {string} chatRoomId - The ID of the chat room to fetch
     * @returns {IResponse<{ chatRoom: IChatRoom }>} Response containing the chat room data
     */
    getChatRoomById: builder.query<IResponse<{ chatRoom: IChatRoom }>, string>({
      // Request configuration
      query: (chatRoomId) => ({
        url: `/${chatRoomId}`,
        method: Http.GET
      }),

      // Cache configuration: keep data for 5 minutes when not in use
      keepUnusedDataFor: 300,

      // Response handling
      transformResponse: processResponse<{ chatRoom: IChatRoom }>,
      transformErrorResponse: processError,

      // Cache tag association for automatic invalidation
      providesTags: (_, __, chatRoomId) => [
        { type: 'ChatRoom', id: chatRoomId }
      ]
    }),

    /**
     * Creates a new chat room between two users
     * @param {IChatRoomRequest} chatRoomData - The chat room creation data
     * @returns {IResponse<{ chatRoom: IChatRoom }>} Response containing the created chat room
     */
    createChatRoom: builder.mutation<IResponse<{ chatRoom: IChatRoom }>, IChatRoomRequest>({
      // Request configuration
      query: (chatRoomData) => ({
        url: '',
        method: Http.POST,
        body: chatRoomData
      }),

      // Response handling
      transformResponse: processResponse<{ chatRoom: IChatRoom }>,
      transformErrorResponse: processError,

      // Invalidate cache to refresh data after creation
      invalidatesTags: (_, error) => 
        error ? [] : ['ChatRoomList', { type: 'ChatRoomList', id: 'LIST' }]
    })
  })
});

// Export individual hooks for use in components
export const {
  useGetChatRoomsQuery,
  useGetChatRoomsByUserIdQuery,
  useGetChatRoomByIdQuery,
  useCreateChatRoomMutation
} = chatRoomAPI;

// Export the API for store configuration
export default chatRoomAPI;
