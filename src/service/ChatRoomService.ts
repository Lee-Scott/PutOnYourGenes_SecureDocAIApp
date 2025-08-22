import { createApi } from '@reduxjs/toolkit/query/react';
import type { IResponse } from '../models/IResponse';
import { isJsonContentType, processError, processResponse } from '../utils/RequestUtils';
import type { IChatRoom } from '../models/IChatRoom';
import type { IChatRoomRequest } from '../models/IChatRoomRequest';
import { Http } from '../enum/http.method';
import { createBaseQueryWithAuth } from './baseQueryWithAuth';

// Message interface based on your backend response
export interface IMessage {
  id: number;
  messageId: string;
  chatRoomId: string;
  sender: {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio: string;
    imageUrl: string;
    role: string;
    authorities: string;
  };
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

// Chat room API base URL
const chatRoomApiBaseUrl = 'http://localhost:8085/api/chatrooms';

/**
 * ChatRoom API Service
 * 
 * RTK Query service for managing chat room operations including:
 * - Fetching user's chat rooms
 * - Creating new chat rooms
 * - Retrieving specific chat room details
 * 
 * Features:
 * - Automatic caching and re-fetching
 * - Optimistic updates for better UX
 * - Error handling and retry logic
 * - Authentication integration
 * 
 * Future Enhancements:
 * - Real-time updates via WebSocket subscriptions
 * - Chat room member management (add/remove participants)
 * - Chat room settings (name, description, privacy)
 * - Message history endpoints
 * - File sharing capabilities
 * - Typing indicators and presence status
 */
export const chatRoomAPI = createApi({
  // Unique identifier for this API slice in the Redux store
  reducerPath: 'chatRoomAPI',

  // Base query configuration with common settings for all endpoints
  baseQuery: createBaseQueryWithAuth(chatRoomApiBaseUrl, isJsonContentType),

  // Cache tag types for invalidation strategies
  tagTypes: ['ChatRoom', 'ChatRoomList', 'Messages'],

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

      // Response handling - backend now returns proper wrapped response
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

      // Response handling - backend now returns proper wrapped response
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
    }),

    /**
     * Fetches messages for a specific chat room
     * @param {string} chatRoomId - The ID of the chat room to fetch messages for
     * @returns {IMessage[]} Array of chat messages
     */
    getChatMessages: builder.query<IMessage[], string>({
      // Request configuration
      query: (chatRoomId) => ({
        url: `/${chatRoomId}/messages`,
        method: Http.GET
      }),

      // Cache configuration: keep data for 2 minutes when not in use
      keepUnusedDataFor: 120,

      // Response handling - backend now returns wrapped response with data.messages
      transformResponse: (response: IResponse<{ messages: IMessage[] }>) => {
        return response.data.messages;
      },
      transformErrorResponse: processError,

      // Cache tag association for automatic invalidation
      providesTags: (_, __, chatRoomId) => [
        { type: 'Messages', id: chatRoomId },
        'Messages'
      ]
    }),

    /**
     * Sends a message to a specific chat room
     * @param {object} params - Object containing chatRoomId and message data
     * @returns {IResponse<{ message: IMessage }>} Response containing the sent message
     */
    sendMessage: builder.mutation<IResponse<{ message: IMessage }>, { 
      chatRoomId: string; 
      content: string; 
      messageType?: string; 
    }>({
      // Request configuration
      query: ({ chatRoomId, content, messageType = 'TEXT' }) => ({
        url: `/${chatRoomId}/messages`,
        method: Http.POST,
        body: { content, messageType }
      }),

      // Response handling
      transformResponse: processResponse<{ message: IMessage }>,
      transformErrorResponse: processError,

      // Invalidate messages cache to refresh the message list after sending
      invalidatesTags: (_, error, { chatRoomId }) => 
        error ? [] : [
          { type: 'Messages', id: chatRoomId },
          'Messages'
        ]
    })
  })
});

// Export individual hooks for use in components
export const {
  useGetChatRoomsQuery,
  useGetChatRoomsByUserIdQuery,
  useGetChatRoomByIdQuery,
  useCreateChatRoomMutation,
  useGetChatMessagesQuery,
  useSendMessageMutation
} = chatRoomAPI;

// Export the API for store configuration
export default chatRoomAPI;
