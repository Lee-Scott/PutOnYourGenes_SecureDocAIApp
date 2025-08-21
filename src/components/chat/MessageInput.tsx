import { useState, FormEvent } from 'react';

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Type your message..." 
}: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    if (onSendMessage) {
      onSendMessage(message);
    } else {
      console.log('Send message functionality not yet implemented:', message);
    }
    
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-top pt-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          aria-label="Type a message"
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!message.trim() || disabled}
          title="Send message"
        >
          <i className="bi bi-send"></i>
        </button>
      </div>
      {disabled && (
        <small className="text-muted mt-2 d-block">
          <i className="bi bi-info-circle me-1"></i>
          Messaging functionality will be available in the next phase
        </small>
      )}
    </form>
  );
};

export default MessageInput;
