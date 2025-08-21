import { IChatRoom, IChatUser } from '../../models/IChatRoom';

interface ChatRoomItemProps {
  chatRoom: IChatRoom;
  currentUserId: string;
  onClick: (chatRoomId: string) => void;
}

const ChatRoomItem = ({ chatRoom, currentUserId, onClick }: ChatRoomItemProps) => {
  // Helper function to get the other participant in the chat room
  const getOtherParticipant = (chatRoom: IChatRoom, currentUserId: string): IChatUser => {
    return chatRoom.user1.userId === currentUserId ? chatRoom.user2 : chatRoom.user1;
  };

  const otherParticipant = getOtherParticipant(chatRoom, currentUserId);

  const handleClick = () => {
    onClick(chatRoom.chatRoomId);
  };

  return (
    <button
      className="list-group-item list-group-item-action d-flex align-items-center p-3"
      onClick={handleClick}
      style={{ cursor: 'pointer', border: 'none', background: 'none', textAlign: 'left' }}
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
    </button>
  );
};

export default ChatRoomItem;
