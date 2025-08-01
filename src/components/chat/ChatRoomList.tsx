import { useNavigate } from 'react-router-dom';
import { chatRoomAPI } from '../../service/ChatRoomService';
import { userAPI } from '../../service/UserService';
import Loader from '../profile/Loader';
import ChatRoomItem from './ChatRoomItem';

interface ChatRoomListProps {
  onChatRoomSelect?: (chatRoomId: string) => void;
  onCreateChatClick?: () => void;
}

const ChatRoomList = ({ onChatRoomSelect, onCreateChatClick }: ChatRoomListProps) => {
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

  // Handle chat room selection
  const handleChatRoomClick = (chatRoomId: string) => {
    if (onChatRoomSelect) {
      onChatRoomSelect(chatRoomId);
    } else {
      navigate(`/chat/${chatRoomId}`);
    }
  };

  const chatRooms = chatRoomsData?.data?.chatRooms || [];
  const currentUserId = currentUser?.data?.user?.userId || '';

  return (
    <>
      {/* Loading state */}
      {isLoading && <Loader />}

      {/* Error state */}
      {error && (
        <div className="alert alert-danger m-3" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Error loading chat rooms. Please try again.
        </div>
      )}

      {/* No current user */}
      {!currentUser?.data?.user && !isLoading && (
        <div className="alert alert-warning m-3" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Please log in to view your chat rooms.
        </div>
      )}

      {/* Chat rooms content */}
      {currentUser?.data?.user && !isLoading && !error && (
        <>
          {chatRooms.length > 0 ? (
            <div className="list-group list-group-flush">
              {chatRooms.map((chatRoom) => (
                <ChatRoomItem
                  key={chatRoom.chatRoomId}
                  chatRoom={chatRoom}
                  currentUserId={currentUserId}
                  onClick={handleChatRoomClick}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-5 px-3">
              <div className="mb-3">
                <i className="bi bi-chat-dots" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              </div>
              <h6 className="text-muted mb-2">No chat rooms yet</h6>
              <p className="text-muted mb-3">
                Start a conversation by creating a new chat room.
              </p>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onCreateChatClick?.()}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Create New Chat
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ChatRoomList;
