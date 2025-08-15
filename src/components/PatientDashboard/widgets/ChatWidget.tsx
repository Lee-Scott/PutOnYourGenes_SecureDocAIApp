import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChatRoomList } from '../../chat';

const ChatWidget: React.FC = () => {
  const navigate = useNavigate();

  const handleChatRoomSelect = (chatRoomId: string) => {
    navigate(`/chat/${chatRoomId}`);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Recent Chats</h5>
        <ChatRoomList onChatRoomSelect={handleChatRoomSelect} onCreateChatClick={() => navigate('/chat')} />
        <Link to="/chat" className="btn btn-primary mt-3">View all chats</Link>
      </div>
    </div>
  );
};

export default ChatWidget;
