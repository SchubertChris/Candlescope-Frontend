// src/Pages/Dashboard/Components/Cards/MessageCard/MessageCard.tsx
// KORRIGIERT: Angepasst für neue Messages.tsx Integration

import React from 'react';
import { HiUserCircle, HiDocument, HiFolder, HiPaperClip } from 'react-icons/hi';
import { Message, Project } from '@/Pages/Dashboard/Types/DashboardTypes';
import './MessageCard.scss';

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

  const isFromAdmin = message.senderRole === 'admin';
  
  return (
    <div
      className={`message-card ${!message.isRead ? 'message-card--unread' : ''} ${
        isFromAdmin ? 'message-card--admin' : 'message-card--customer'
      }`}
      onClick={handleCardClick}
    >
      <div className="message-card__avatar">
        <HiUserCircle className="message-card__avatar-icon" />
      </div>
      
      <div className="message-card__content">
        <div className="message-card__header">
          <div className="message-card__sender">
            <span className="message-card__sender-name">{message.senderName}</span>
            <span className={`message-card__sender-role ${
              isFromAdmin ? 'message-card__sender-role--admin' : 'message-card__sender-role--kunde'
            }`}>
              {isFromAdmin ? 'Administrator' : 'Kunde'}
            </span>
          </div>
          <div className="message-card__meta">
            {message.hasAttachment && (
              <HiDocument className="message-card__attachment-icon" />
            )}
            <span className="message-card__time">
              {formatTimeAgo(message.timestamp)}
            </span>
          </div>
        </div>
        
        <p className="message-card__text">{message.content}</p>
        
        {message.hasAttachment && message.attachments && message.attachments.length > 0 && (
          <div className="message-card__attachments">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="message-card__attachment">
                <HiPaperClip className="message-card__attachment-clip" />
                <span className="message-card__attachment-name">{attachment.name}</span>
              </div>
            ))}
          </div>
        )}
        
        {project && (
          <div className="message-card__project">
            <HiFolder className="message-card__project-icon" />
            <span className="message-card__project-name">{project.name}</span>
          </div>
        )}
      </div>
      
      {!message.isRead && (
        <div className="message-card__unread-indicator"></div>
      )}
    </div>
  );
};

export default MessageCard;