import React from 'react';
import { useNavigate } from 'react-router-dom';
import { chatRoomAPI } from '../../service/ChatRoomService';
import { userAPI } from '../../service/UserService';
import { IChatRoom, IChatUser } from '../../models/IChatRoom';
import Loader from '../profile/Loader';

const ChatRoomList = () => {
  const navigate = useNavigate();
  
  // Get current user to determine which chat rooms to fetch
  const { data: currentUser } = userAPI.useFetchUserQuery();
  
  // Fetch chat rooms for the current user
  const { 
    data: chatRoomsData, 
    isLoading, 
    error 
  } = chatRoomAPI.useGetChatRoomsByUserIdQuery(
    currentUser?.data?.user?.userId ?? '', 
    {
      skip: !currentUser?.data?.user?.userId // Skip query if no user ID
    }
  );

  // Helper function to get the other participant in the chat room
  const getOtherParticipant = (chatRoom: IChatRoom, currentUserId: string): IChatUser => {
    return chatRoom.user1.userId === currentUserId ? chatRoom.user2 : chatRoom.user1;
  };

  // Handle chat room selection
  const handleChatRoomClick = (chatRoomId: string) => {
    navigate(`/chat/${chatRoomId}`);
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error) {
    return (
      <div className="container mtb">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="header-title pb-3 mt-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  Chat Rooms
                </h5>
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Error loading chat rooms. Please try again.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No current user
  if (!currentUser?.data?.user) {
    return (
      <div className="container mtb">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="header-title pb-3 mt-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  Chat Rooms
                </h5>
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  Please log in to view your chat rooms.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const chatRooms = chatRoomsData?.data?.chatRooms || [];
  const currentUserId = currentUser.data.user.userId;

  return (
    <div className="container mtb">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="header-title mt-0 mb-0">
                  <i className="bi bi-chat-dots me-2"></i>
                  Chat Rooms
                </h5>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/chat/new')}
                >
                  <i className="bi bi-plus-circle me-1"></i>
                  New Chat
                </button>
              </div>
              
              {/* Chat Rooms List */}
              {chatRooms.length > 0 ? (
                <div className="list-group">
                  {chatRooms.map((chatRoom) => {
                    const otherParticipant = getOtherParticipant(chatRoom, currentUserId);
                    return (
                      <div
                        key={chatRoom.chatRoomId}
                        className="list-group-item list-group-item-action d-flex align-items-center p-3"
                        onClick={() => handleChatRoomClick(chatRoom.chatRoomId)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Participant Avatar */}
                        <div className="flex-shrink-0 me-3">
                          <img
                            src={otherParticipant.imageUrl || 'https://via.placeholder.com/50'}
                            alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                            className="rounded-circle"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        </div>
                        
                        {/* Chat Room Info */}
                        <div className="flex-grow-1">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">
                              {otherParticipant.firstName} {otherParticipant.lastName}
                            </h6>
                            <small className="text-muted">
                              {new Intl.DateTimeFormat('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }).format(new Date(chatRoom.updatedAt))}
                            </small>
                          </div>
                          <p className="mb-1 text-muted">{otherParticipant.email}</p>
                          <div className="d-flex align-items-center">
                            <span className={`badge me-2 ${chatRoom.isActive ? 'bg-success' : 'bg-secondary'}`}>
                              {chatRoom.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="badge bg-light text-dark">
                              {otherParticipant.role.name}
                            </span>
                          </div>
                        </div>
                        
                        {/* Arrow Icon */}
                        <div className="flex-shrink-0">
                          <i className="bi bi-chevron-right text-muted"></i>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i className="bi bi-chat-dots" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  </div>
                  <h6 className="text-muted mb-2">No chat rooms yet</h6>
                  <p className="text-muted mb-3">
                    Start a conversation by creating a new chat room.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/chat/new')}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Create New Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomList;
