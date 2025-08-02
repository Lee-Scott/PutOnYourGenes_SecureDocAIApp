import { useEffect, useRef } from 'react';
import { IChatRoom } from '../../models/IChatRoom';

// Message interface based on backend response
interface IMessage {
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

interface MessageAreaProps {
  chatRoom: IChatRoom;
  currentUserId: string;
  isLoading?: boolean;
  messages?: IMessage[];
}

const MessageArea = ({ chatRoom, currentUserId, isLoading = false, messages = [] }: MessageAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Get other participant for display purposes
  const getOtherParticipant = () => {
    return chatRoom.user1.userId === currentUserId ? chatRoom.user2 : chatRoom.user1;
  };

  const otherParticipant = getOtherParticipant();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading messages...</span>
          </div>
          <p className="text-muted">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Empty state - no messages yet
  if (messages.length === 0) {
    return (
      <div 
        ref={scrollContainerRef}
        className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-4"
        style={{ overflowY: 'auto', minHeight: '400px' }}
      >
        <div className="text-center">
          {/* Welcome illustration */}
          <div className="mb-4">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="position-relative">
                <img
                  src={otherParticipant.imageUrl || 'https://via.placeholder.com/80'}
                  alt={`${otherParticipant.firstName} ${otherParticipant.lastName}`}
                  className="rounded-circle border border-3 border-light shadow"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div 
                  className="position-absolute bottom-0 end-0 bg-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '24px', height: '24px' }}
                >
                  <i className="bi bi-chat-dots text-white" style={{ fontSize: '12px' }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome message */}
          <h5 className="text-primary mb-2">
            Start a conversation with {otherParticipant.firstName}
          </h5>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '300px' }}>
            Say hello to {otherParticipant.firstName} {otherParticipant.lastName}. 
            This is the beginning of your conversation.
          </p>

          {/* Chat info */}
          <div className="card border-0 bg-light d-inline-block">
            <div className="card-body p-3">
              <div className="d-flex align-items-center text-muted small">
                <i className="bi bi-calendar3 me-2"></i>
                <span>Chat created on {new Intl.DateTimeFormat('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).format(new Date(chatRoom.createdAt))}</span>
              </div>
              <div className="d-flex align-items-center text-muted small mt-1">
                <i className="bi bi-shield-check me-2"></i>
                <span>Messages are end-to-end encrypted</span>
              </div>
            </div>
          </div>

          {/* Suggested actions */}
          <div className="mt-4">
            <p className="small text-muted mb-2">Start with:</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <button className="btn btn-outline-primary btn-sm" disabled>
                👋 Say Hello
              </button>
              <button className="btn btn-outline-primary btn-sm" disabled>
                📝 Share a document
              </button>
              <button className="btn btn-outline-primary btn-sm" disabled>
                📞 Schedule a call
              </button>
            </div>
            <small className="text-muted d-block mt-2">
              Message features coming soon
            </small>
          </div>
        </div>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    );
  }

  // Message list rendering
  return (
    <div 
      ref={scrollContainerRef}
      className="flex-grow-1 p-3"
      style={{ 
        overflowY: 'auto', 
        minHeight: '400px',
        maxHeight: '500px'
      }}
    >
      <div className="d-flex flex-column gap-3">
        {messages.map((message) => {
          const isOwnMessage = message.sender.userId === currentUserId;
          const messageDate = new Date(message.createdAt);
          
          return (
            <div
              key={message.id}
              className={`d-flex ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div className="d-flex align-items-end gap-2" style={{ maxWidth: '70%' }}>
                {/* Avatar for other user's messages */}
                {!isOwnMessage && (
                  <img
                    src={message.sender.imageUrl || 'https://via.placeholder.com/32'}
                    alt={`${message.sender.firstName} ${message.sender.lastName}`}
                    className="rounded-circle"
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                  />
                )}
                
                {/* Message bubble */}
                <div
                  className={`p-3 rounded-3 position-relative ${
                    isOwnMessage
                      ? 'bg-primary text-white'
                      : 'bg-light text-dark border'
                  }`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {/* Sender name for other user's messages */}
                  {!isOwnMessage && (
                    <div className="fw-bold mb-1 text-primary small">
                      {message.sender.firstName} {message.sender.lastName}
                    </div>
                  )}
                  
                  {/* Message content */}
                  <div className="mb-1">
                    {message.content}
                  </div>
                  
                  {/* Timestamp and read status */}
                  <div
                    className={`small d-flex align-items-center justify-content-end gap-1 ${
                      isOwnMessage ? 'text-white-50' : 'text-muted'
                    }`}
                    style={{ fontSize: '0.75rem' }}
                  >
                    <span>
                      {messageDate.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {isOwnMessage && (
                      <span>
                        {message.isRead ? (
                          <i className="bi bi-check2-all" title="Read"></i>
                        ) : (
                          <i className="bi bi-check2" title="Sent"></i>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageArea;
