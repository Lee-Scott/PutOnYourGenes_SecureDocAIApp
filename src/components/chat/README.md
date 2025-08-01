# Chat System Documentation

## Overview

The chat system provides a complete real-time messaging interface built with React, TypeScript, and RTK Query. It features a responsive design that works seamlessly across desktop and mobile devices.

## Architecture

### Components Structure

```
src/components/chat/
├── ChatRooms.tsx          # Main container component
├── ChatRoomList.tsx       # Sidebar with chat room list
├── ChatRoomItem.tsx       # Individual chat room item
├── ChatHeader.tsx         # Chat header with user info
├── MessageArea.tsx        # Message display area
├── MessageInput.tsx       # Message composition input
├── CreateChatModal.tsx    # New chat creation modal
└── index.ts              # Component exports
```

### Services Structure

```
src/service/
├── ChatRoomService.ts     # RTK Query API for chat rooms
└── UserService.ts         # RTK Query API for users
```

### Models Structure

```
src/models/
├── IChatRoom.ts           # Chat room interface
├── IChatUser.ts           # Chat user interface
└── IChatRoomRequest.ts    # Chat room creation request
```

## Features

### Current Features

1. **Responsive Design**
   - Two-panel layout on desktop (sidebar + chat)
   - Single-panel view on mobile with navigation
   - Bootstrap-based responsive components

2. **Chat Room Management**
   - View all user's chat rooms
   - Create new chat rooms with user search
   - Real-time user filtering and selection
   - Automatic navigation to new chats

3. **User Interface**
   - Clean, modern design with Bootstrap components
   - Loading states and error handling
   - Empty states with helpful actions
   - Mobile-optimized touch targets

4. **State Management**
   - RTK Query for efficient data fetching
   - Automatic caching and re-fetching
   - Optimistic updates for better UX

### Planned Features (Future Implementation)

1. **Real-time Messaging**
   - WebSocket integration for live messages
   - Message delivery and read receipts
   - Typing indicators
   - Online/offline presence status

2. **Enhanced Chat Features**
   - File upload and sharing
   - Image and media support
   - Message reactions and replies
   - Message search and filtering

3. **Group Chat Features**
   - Multiple participant support
   - Chat room administration
   - Member permissions and roles
   - Chat room settings and customization

## Integration Points

### WebSocket Integration

The current implementation includes placeholders for WebSocket integration:

#### Message Sending (ChatRooms.tsx)
```typescript
const handleSendMessage = (message: string) => {
  // TODO: Implement WebSocket message sending
  // websocketService.sendMessage({
  //   chatRoomId: selectedChatRoomId,
  //   content: message,
  //   senderId: currentUser.data.user.userId,
  //   timestamp: new Date().toISOString()
  // });
};
```

#### Recommended WebSocket Service Structure
```typescript
// src/service/WebSocketService.ts
class WebSocketService {
  private socket: WebSocket | null = null;
  
  connect(token: string) {
    // Initialize WebSocket connection
  }
  
  sendMessage(message: MessageData) {
    // Send message through WebSocket
  }
  
  onMessage(callback: (message: MessageData) => void) {
    // Handle incoming messages
  }
  
  onTyping(callback: (data: TypingData) => void) {
    // Handle typing indicators
  }
  
  disconnect() {
    // Clean up WebSocket connection
  }
}
```

### Backend API Integration

The chat system is designed to work with the following API endpoints:

#### Chat Room Endpoints
- `GET /api/chatrooms` - Get all chat rooms
- `GET /api/chatrooms/user/{userId}` - Get user's chat rooms
- `GET /api/chatrooms/{chatRoomId}` - Get specific chat room
- `POST /api/chatrooms` - Create new chat room

#### Future Message Endpoints
- `GET /api/chatrooms/{chatRoomId}/messages` - Get chat messages
- `POST /api/chatrooms/{chatRoomId}/messages` - Send message
- `PUT /api/messages/{messageId}` - Edit message
- `DELETE /api/messages/{messageId}` - Delete message

### State Management Integration

The chat system integrates with the Redux store through RTK Query:

#### Store Configuration (Store.ts)
```typescript
export const setupStore = () => {
  return configureStore({
    reducer: {
      // ... other reducers
      [chatRoomAPI.reducerPath]: chatRoomAPI.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        // ... other middleware
        chatRoomAPI.middleware,
      ),
  });
};
```

## Development Guidelines

### Adding New Features

1. **Create interfaces** in `src/models/` for new data structures
2. **Add API endpoints** in appropriate service files
3. **Create components** following the existing pattern
4. **Update exports** in `index.ts` files
5. **Add comprehensive documentation** and TypeScript types

### Testing Strategy

The chat system should be tested with:

1. **Unit Tests**
   - Component rendering and interactions
   - Service function behavior
   - Hook functionality

2. **Integration Tests**
   - Component communication
   - API integration
   - State management flows

3. **E2E Tests**
   - Complete user workflows
   - Mobile responsiveness
   - Cross-browser compatibility

### Performance Considerations

1. **Lazy Loading**
   - Components can be lazy-loaded for better initial load times
   - Message history pagination for large conversations

2. **Caching Strategy**
   - RTK Query provides automatic caching
   - Consider cache invalidation strategies for real-time updates

3. **Mobile Optimization**
   - Touch-friendly interface elements
   - Optimized for various screen sizes
   - Reduced bundle size for mobile networks

## Deployment Notes

### Environment Configuration

The chat system requires:

1. **API Base URLs** configured in RequestUtils.ts
2. **Authentication tokens** properly handled
3. **WebSocket URLs** for real-time features (future)

### Security Considerations

1. **Authentication** - All API calls require valid tokens
2. **Authorization** - Users can only access their own chat rooms
3. **Input Validation** - All user inputs are validated
4. **XSS Prevention** - All content is properly escaped

## Troubleshooting

### Common Issues

1. **Chat rooms not loading**
   - Check authentication status
   - Verify API endpoints are accessible
   - Review network requests in browser dev tools

2. **Modal not opening**
   - Ensure Bootstrap CSS is loaded
   - Check for JavaScript errors in console
   - Verify user permissions

3. **Mobile layout issues**
   - Test responsive breakpoints
   - Check Bootstrap grid classes
   - Verify touch event handling

### Debug Mode

Enable debug logging by adding to your environment:
```typescript
// Development mode debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Chat component state:', { selectedChatRoomId, isCreateModalOpen });
}
```
