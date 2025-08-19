// src/Pages/Dashboard/Components/DashboardMessages.tsx
// KORRIGIERT: onSendMessage Property hinzugefügt
import React from 'react';
import { HiPlus } from 'react-icons/hi';
import { DashboardMessagesProps } from '../Types/DashboardTypes';
import MessageCard from './MessageCard';

// ERWEITERT: Component Props um onSendMessage erweitert
const DashboardMessages: React.FC<DashboardMessagesProps> = ({
  messages,
  projects,
  onMessageRead,
  onSendMessage // HINZUGEFÜGT: Fehlende Property aus DashboardTypes
}) => {
  const handleNewMessage = () => {
    console.log('Create new message');
    // Hier später Modal für neue Nachricht mit onSendMessage
  };

  const handleMessageAction = (messageId: string, action: string) => {
    if (action === 'read') {
      onMessageRead(messageId);
    }
    console.log(`Message ${messageId} action: ${action}`);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `vor ${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `vor ${Math.floor(diffInMinutes / 60)}h`;
    return `vor ${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <div className="view-content">
      <section className="messages-full">
        <div className="section-header">
          <h2>Nachrichten</h2>
          <button className="btn btn--primary" onClick={handleNewMessage}>
            <HiPlus className="icon icon--btn" />
            Neue Nachricht
          </button>
        </div>
        
        <div className="messages-list">
          {messages.map(message => (
            <MessageCard 
              key={message.id} 
              message={message}
              project={projects.find(p => p.id === message.projectId)}
              onMessageAction={handleMessageAction}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </div>
        
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Noch keine Nachrichten vorhanden.</p>
            <button className="btn btn--primary" onClick={handleNewMessage}>
              <HiPlus className="icon icon--btn" />
              Erste Nachricht senden
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardMessages;