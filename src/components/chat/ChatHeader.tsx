import type { IChatRoom, IChatUser } from '../../models/IChatRoom';

interface ChatHeaderProps {
  chatRoom: IChatRoom;
  currentUserId: string;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const ChatHeader = ({ chatRoom, currentUserId, onBackClick, showBackButton = false }: ChatHeaderProps) => {
  // Helper function to get the other participant
  const getOtherParticipant = (chatRoom: IChatRoom, currentUserId: string): IChatUser => {
    return chatRoom.user1.userId === currentUserId ? chatRoom.user2 : chatRoom.user1;
  };

  const otherParticipant = getOtherParticipant(chatRoom, currentUserId);

  // Calculate time since last activity
  const getLastActivityText = (updatedAt: string): string => {
    const now = new Date();
    const lastActivity = new Date(updatedAt);
    const diffInMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Active now';
    if (diffInMinutes < 60) return `Active ${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `Active ${Math.floor(diffInMinutes / 60)}h ago`;
    return `Active ${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Mock online status (placeholder for future WebSocket implementation)
  const isOnline = Math.random() > 0.5; // Random placeholder

  return (
    <div className="card-header bg-light border-bottom">
      <div className="d-flex justify-content-between align-items-center">
        {/* Left side: Participant info */}
        <div className="d-flex align-items-center">
          {/* Back button for mobile */}
          {showBackButton && onBackClick && (
            <button 
              className="btn btn-sm btn-outline-secondary me-3 d-lg-none"
              onClick={onBackClick}
              title="Back to chat list"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          )}
          
          {/* Participant avatar with online indicator */}
          <div className="position-relative me-3">
            <img
              src={otherParticipant.imageUrl || 'https://via.placeholder.com/40'}
              alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
              className="rounded-circle"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
            {/* Online status indicator */}
            <span 
              className={`position-absolute bottom-0 end-0 badge rounded-pill ${isOnline ? 'bg-success' : 'bg-secondary'}`}
              style={{ 
                width: '12px', 
                height: '12px', 
                border: '2px solid white',
                fontSize: '0'
              }}
              title={isOnline ? 'Online' : 'Offline'}
            >
              &nbsp;
            </span>
          </div>
          
          {/* Participant details */}
          <div>
            <h6 className="mb-0">
              {otherParticipant.firstName} {otherParticipant.lastName}
              <span className="badge bg-light text-dark ms-2 small">
                {otherParticipant.role.name}
              </span>
            </h6>
            <div className="d-flex align-items-center">
              <small className="text-muted me-2">{otherParticipant.email}</small>
              <small className={`text-${isOnline ? 'success' : 'muted'}`}>
                {isOnline ? 'Online' : getLastActivityText(chatRoom.updatedAt)}
              </small>
            </div>
          </div>
        </div>
        
        {/* Right side: Chat management buttons */}
        <div className="d-flex align-items-center gap-2">
          {/* Search in chat */}
          <button 
            className="btn btn-sm btn-outline-secondary" 
            title="Search in chat"
            disabled
          >
            <i className="bi bi-search"></i>
          </button>
          
          {/* Video call */}
          <button 
            className="btn btn-sm btn-outline-primary" 
            title="Video call"
            disabled
          >
            <i className="bi bi-camera-video"></i>
          </button>
          
          {/* Voice call */}
          <button 
            className="btn btn-sm btn-outline-primary" 
            title="Voice call"
            disabled
          >
            <i className="bi bi-telephone"></i>
          </button>
          
          {/* Chat info */}
          <button 
            className="btn btn-sm btn-outline-secondary" 
            title="Chat information"
            disabled
          >
            <i className="bi bi-info-circle"></i>
          </button>
          
          {/* More options dropdown */}
          <div className="dropdown">
            <button 
              className="btn btn-sm btn-outline-secondary dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              title="More options"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <h6 className="dropdown-header">Chat Options</h6>
              </li>
              <li>
                <button className="dropdown-item" disabled>
                  <i className="bi bi-pin-angle me-2"></i>
                  Pin Chat
                </button>
              </li>
              <li>
                <button className="dropdown-item" disabled>
                  <i className="bi bi-bell-slash me-2"></i>
                  Mute Notifications
                </button>
              </li>
              <li>
                <button className="dropdown-item" disabled>
                  <i className="bi bi-archive me-2"></i>
                  Archive Chat
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" disabled>
                  <i className="bi bi-trash me-2"></i>
                  Delete Chat
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Chat room status bar */}
      <div className="mt-2 pt-2 border-top">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className={`badge me-2 ${chatRoom.isActive ? 'bg-success' : 'bg-secondary'}`}>
              {chatRoom.isActive ? 'Active Chat' : 'Inactive Chat'}
            </span>
            <small className="text-muted">
              Created {new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }).format(new Date(chatRoom.createdAt))}
            </small>
          </div>
          
          {/* Future features placeholder */}
          <div className="d-flex align-items-center">
            <small className="text-muted me-2">
              <i className="bi bi-shield-check me-1"></i>
              End-to-end encrypted
            </small>
            {!chatRoom.isActive && (
              <small className="text-warning">
                <i className="bi bi-exclamation-triangle me-1"></i>
                Chat archived
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
