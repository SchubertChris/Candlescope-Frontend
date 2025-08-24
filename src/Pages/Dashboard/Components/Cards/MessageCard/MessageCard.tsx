// src/Pages/Dashboard/Components/MessageCard.tsx
// KORRIGIERT: sender → senderId, Role-System angepasst
import React from 'react';
import { HiUserCircle, HiDocument, HiFolder } from 'react-icons/hi';
import { Message, Project } from '../Types/DashboardTypes';

interface MessageCardProps {
  message: Message;
  project?: Project;
  onMessageAction: (messageId: string, action: string) => void;
  formatTimeAgo: (timestamp: string) => string;
}

const MessageCard: React.FC<MessageCardProps> = ({ 
  message, 
  project, 
  onMessageAction, 
  formatTimeAgo 
}) => {
  const handleCardClick = () => {
    if (!message.isRead) {
      onMessageAction(message.id, 'read');
    }
    onMessageAction(message.id, 'open');
  };

  return (
    <div 
      className={`message-card ${!message.isRead ? 'unread' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="message-avatar">
        <HiUserCircle className="icon icon--avatar" />
      </div>
      <div className="message-content">
        <div className="message-header">
          <div className="message-sender">
            {/* KORRIGIERT: message.sender → message.senderName (entspricht DashboardTypes) */}
            <span className="sender-name">{message.senderName}</span>
            <span className="sender-role">
              {/* KORRIGIERT: 'mitarbeiter' → 'admin' */}
              {message.senderRole === 'admin' ? 'Administrator' : 'Kunde'}
            </span>
          </div>
          <div className="message-meta">
            {message.hasAttachment && (
              <HiDocument className="icon icon--attachment" />
            )}
            <span className="message-time">
              {formatTimeAgo(message.timestamp)}
            </span>
          </div>
        </div>
        <p className="message-text">{message.content}</p>
        {project && (
          <div className="message-project">
            <HiFolder className="icon icon--project" />
            <span>{project.name}</span>
          </div>
        )}
      </div>
      {!message.isRead && <div className="unread-indicator"></div>}
    </div>
  );
};

export default MessageCard;