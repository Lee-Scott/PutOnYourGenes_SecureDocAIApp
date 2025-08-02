import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chatRoomAPI } from '../../service/ChatRoomService';
import { userAPI } from '../../service/UserService';
import { ChatRoomList, ChatHeader, MessageArea, MessageInput, CreateChatModal } from './index';
import Loader from '../profile/Loader';

/**
 * ChatRooms Component
 * 
 * Main container component for the chat interface. Provides a responsive two-panel layout:
 * - Left panel: Chat room list with search and creation capabilities
 * - Right panel: Active chat conversation with messages and input
 * 
 * Features:
 * - Mobile-responsive design that collapses to single-panel view on smaller screens
 * - Real-time chat room management via RTK Query
 * - Modal-based chat creation with user search
 * - Automatic routing sync with selected chat room
 * 
 * Future Integration Points:
 * - WebSocket integration for real-time messaging (handleSendMessage placeholder ready)
 * - Message persistence and loading from backend
 * - Typing indicators and presence status
 * - File upload and media sharing capabilities
 * - Push notifications for new messages
 */

const ChatRooms = () => {
  const { chatRoomId } = useParams<{ chatRoomId?: string }>();
  const navigate = useNavigate();
  
  // State management for chat interface
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(chatRoomId || null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // RTK Query hooks for data fetching
  const { data: currentUser, isLoading: userLoading } = userAPI.useFetchUserQuery();
  
  // Send message mutation
  const [sendMessage, { isLoading: sendingMessage }] = chatRoomAPI.useSendMessageMutation();
  
  // Debug logging to help troubleshoot
  console.log('ChatRooms Debug:', {
    chatRoomId,
    selectedChatRoomId,
    currentUserId: currentUser?.data?.user?.userId
  });
  
  // Fetch selected chat room data (conditionally based on selection)
  const { 
    data: selectedChatRoom, 
    isLoading: chatRoomLoading,
    error: chatRoomError 
  } = chatRoomAPI.useGetChatRoomByIdQuery(
    selectedChatRoomId || '', 
    {
      skip: !selectedChatRoomId // Optimize API calls - only fetch when needed
    }
  );

  // Debug logging for chat room fetch
  console.log('Chat Room API Debug:', {
    selectedChatRoom,
    chatRoomLoading,
    chatRoomError,
    selectedChatRoomId
  });

  // Fetch messages for the selected chat room
  const { 
    data: messages, 
    isLoading: messagesLoading,
    error: messagesError 
  } = chatRoomAPI.useGetChatMessagesQuery(
    selectedChatRoomId || '', 
    {
      skip: !selectedChatRoomId // Only fetch when a chat room is selected
    }
  );

  // Debug logging for messages fetch
  console.log('Messages API Debug:', {
    messages,
    messagesLoading,
    messagesError
  });

  /**
   * Handle chat room selection from sidebar
   * Updates local state and browser URL for proper navigation
   */
  const handleChatRoomSelect = (chatRoomId: string) => {
    setSelectedChatRoomId(chatRoomId);
    navigate(`/chat/${chatRoomId}`);
  };

  /**
   * Handle navigation back to chat list (mobile optimization)
   * Clears selected chat and updates URL to show chat list
   */
  const handleBackToList = () => {
    setSelectedChatRoomId(null);
    navigate('/chat');
  };

  /**
   * Handle sending a message
   * 
   * Sends the message to the backend and automatically refreshes the message list
   * 
   * @param message - The message content to send
   */
  const handleSendMessage = async (message: string) => {
    if (!selectedChatRoomId || !message.trim()) {
      return;
    }

    try {
      console.log('Sending message:', { chatRoomId: selectedChatRoomId, content: message });
      
      await sendMessage({
        chatRoomId: selectedChatRoomId,
        content: message.trim(),
        messageType: 'TEXT'
      }).unwrap();
      
      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      // TODO: Show error toast to user
    }
  };

  // Loading state for user
  if (userLoading) {
    return <Loader />;
  }

  // No user logged in
  if (!currentUser?.data?.user) {
    return (
      <div className="container mtb">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Authentication Required</h5>
                <p className="card-text">Please log in to access chat rooms.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mtb">
      <div className="row">
        {/* Chat Room List Sidebar */}
        <div className={`col-lg-4 col-md-5 ${selectedChatRoomId ? 'd-none d-md-none d-lg-block' : 'col-12'}`}>
          <div className="card h-100">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  Chat Rooms
                </h6>
                <button 
                  className="btn btn-light btn-sm"
                  onClick={() => setIsCreateModalOpen(true)}
                  title="Start New Chat"
                >
                  <i className="bi bi-plus-circle"></i>
                </button>
              </div>
            </div>
            <div className="card-body p-0" style={{ height: '600px', overflowY: 'auto' }}>
              <ChatRoomList 
                onChatRoomSelect={handleChatRoomSelect} 
                onCreateChatClick={() => setIsCreateModalOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Chat Interface Area */}
        <div className={`col-lg-8 col-md-7 ${!selectedChatRoomId ? 'd-none d-md-none d-lg-block' : 'col-12'}`}>
          <div className="card h-100">
            {selectedChatRoomId ? (
              <>
                {/* Chat Header */}
                {chatRoomLoading ? (
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span>Loading chat...</span>
                    </div>
                  </div>
                ) : selectedChatRoom?.data?.chatRoom ? (
                  <ChatHeader
                    chatRoom={selectedChatRoom.data.chatRoom}
                    currentUserId={currentUser.data.user.userId}
                    onBackClick={handleBackToList}
                    showBackButton={true}
                  />
                ) : (
                  <div className="card-header bg-light">
                    <span className="text-danger">Error loading chat room</span>
                  </div>
                )}

                {/* Chat Messages Area */}
                <div className="card-body d-flex flex-column" style={{ height: '500px' }}>
                  {messagesError ? (
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                      <div className="text-center text-muted">
                        <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-2">Error loading chat room</p>
                        <small className="text-muted">
                          {chatRoomError && 'data' in chatRoomError 
                            ? `Error: ${(chatRoomError as any).data?.message || 'Unknown error'}`
                            : 'Failed to load chat room data'
                          }
                        </small>
                      </div>
                    </div>
                  ) : selectedChatRoom?.data?.chatRoom ? (
                    <MessageArea
                      chatRoom={selectedChatRoom.data.chatRoom}
                      currentUserId={currentUser.data.user.userId}
                      isLoading={messagesLoading}
                      messages={messages || []}
                    />
                  ) : (
                    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                      <div className="text-center text-muted">
                        <i className="bi bi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <p className="mt-2">Failed to load chat room</p>
                      </div>
                    </div>
                  )}

                  {/* Message Input Area */}
                  <MessageInput 
                    onSendMessage={handleSendMessage}
                    disabled={!selectedChatRoom?.data?.chatRoom?.isActive || messagesLoading || sendingMessage}
                    placeholder={sendingMessage ? "Sending..." : "Type your message..."}
                  />
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="card-body d-flex justify-content-center align-items-center" style={{ height: '600px' }}>
                <div className="text-center">
                  <div className="mb-4">
                    <i className="bi bi-chat-square-dots" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                  </div>
                  <h5 className="text-muted mb-3">Select a Chat Room</h5>
                  <p className="text-muted mb-4">
                    Choose a conversation from the sidebar to start chatting
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Start New Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Chat Modal */}
      <CreateChatModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default ChatRooms;
