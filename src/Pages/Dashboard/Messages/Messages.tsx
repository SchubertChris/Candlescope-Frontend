// src/Pages/Dashboard/Messages/Messages.tsx
// KORRIGIERT: Verwendet MessageCard-Komponente statt inline HTML

import React, { useState, useEffect, useRef } from 'react';
import {
  HiFolderOpen,
  HiPaperAirplane,
  HiPaperClip,
  HiSearch,
  HiDotsVertical,
  HiUser,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
  HiRefresh,
  HiFilter,
  HiEye,
  HiEyeOff
} from 'react-icons/hi';
import { HiExclamationTriangle } from 'react-icons/hi2';

import { useDashboard } from '../Context/DashboardContext';
import MessageCard from '../Components/Cards/MessageCard/MessageCard';
import { Project, Message, MessageSenderRole } from '../Types/DashboardTypes';
import './Messages.scss';

interface MessageWithProject extends Message {
  project?: Project;
}

const Messages: React.FC = () => {
  const { user, projects, messages, onMessageRead, onSendMessage } = useDashboard();
  
  // States
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  // Refs für Auto-Scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Gefilterte Projekte basierend auf Suchquery
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Messages für aktives Projekt
  const activeProjectMessages = messages
    .filter(message => !activeProjectId || message.projectId === activeProjectId)
    .filter(message => !showUnreadOnly || !message.isRead)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Aktives Projekt finden
  const activeProject = projects.find(p => p.id === activeProjectId);

  // Auto-Scroll zu neuen Nachrichten
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeProjectMessages]);

  // Erstes Projekt automatisch auswählen beim Laden
  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      const projectWithMessages = projects.find(p => 
        messages.some(m => m.projectId === p.id)
      ) || projects[0];
      setActiveProjectId(projectWithMessages.id);
    }
  }, [projects, messages, activeProjectId]);

  // Auto-Resize für Textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = Math.min(textAreaRef.current.scrollHeight, 120) + 'px';
    }
  }, [messageInput]);

  // Message senden
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeProjectId || isSending) return;
    
    setIsSending(true);
    
    try {
      await onSendMessage(activeProjectId, messageInput.trim());
      setMessageInput('');
      
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Enter-Key Handler
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Projekt auswählen
  const handleProjectSelect = (projectId: string) => {
    setActiveProjectId(projectId);
    
    const unreadMessages = messages.filter(m => 
      m.projectId === projectId && !m.isRead
    );
    
    unreadMessages.forEach(message => {
      onMessageRead(message.id);
    });
  };

  // Message Action Handler für MessageCard
  const handleMessageAction = (messageId: string, action: string) => {
    switch (action) {
      case 'read':
        onMessageRead(messageId);
        break;
      case 'open':
        // Navigate to message detail or expand
        console.log('Open message:', messageId);
        break;
      default:
        console.log('Unknown message action:', action);
    }
  };

  // Time formatting für MessageCard
  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Gerade eben';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 2592000000) return `${Math.floor(diff / 86400000)}d`;
    
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  // Ungelesene Nachrichten pro Projekt zählen
  const getUnreadCount = (projectId: string): number => {
    return messages.filter(m => m.projectId === projectId && !m.isRead).length;
  };

  // Project Type Icon
  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return '🌐';
      case 'newsletter': return '📧';
      case 'bewerbung': return '📄';
      case 'ecommerce': return '🛒';
      default: return '📁';
    }
  };

  if (isLoading) {
    return (
      <div className="messages-page-loading">
        <div className="messages-loading-spinner">
          <HiRefresh />
        </div>
        <p>Lade Nachrichten...</p>
      </div>
    );
  }

  return (
    <div className="messages-page">
      {/* Projects Sidebar */}
      <aside className="messages-projects-sidebar">
        <div className="messages-sidebar-header">
          <h3>Projekte</h3>
          <div className="messages-sidebar-actions">
            <button
              className={`messages-filter-btn ${showUnreadOnly ? 'messages-filter-btn--active' : ''}`}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              title="Nur ungelesene anzeigen"
            >
              {showUnreadOnly ? <HiEye /> : <HiEyeOff />}
            </button>
          </div>
          <p className="messages-project-count">
            {filteredProjects.length} von {projects.length} Projekten
          </p>
        </div>

        {/* Project Search */}
        <div className="messages-search-box">
          <HiSearch className="messages-search-icon" />
          <input
            type="text"
            placeholder="Projekte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Projects List */}
        <div className="messages-projects-list">
          {filteredProjects.map((project) => {
            const unreadCount = getUnreadCount(project.id);
            const isActive = project.id === activeProjectId;
            
            return (
              <div
                key={project.id}
                className={`messages-project-item ${isActive ? 'messages-project-item--active' : ''}`}
                onClick={() => handleProjectSelect(project.id)}
              >
                <div className="messages-project-icon">
                  <span className="messages-project-type-emoji">
                    {getProjectTypeIcon(project.type)}
                  </span>
                </div>
                <div className="messages-project-info">
                  <div className="messages-project-name">{project.name}</div>
                  <div className="messages-project-meta">
                    <span className="messages-project-status">{project.status}</span>
                    {unreadCount > 0 && (
                      <span className="messages-unread-badge">{unreadCount}</span>
                    )}
                  </div>
                </div>
                <div className="messages-project-actions">
                  <button className="messages-project-menu-btn">
                    <HiDotsVertical />
                  </button>
                </div>
              </div>
            );
          })}
          
          {filteredProjects.length === 0 && (
            <div className="messages-empty-projects">
              <HiFolderOpen className="messages-empty-icon" />
              <p>Keine Projekte gefunden</p>
            </div>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="messages-chat-area">
        {activeProject ? (
          <>
            {/* Chat Header */}
            <header className="messages-chat-header">
              <div className="messages-chat-project-info">
                <div className="messages-project-avatar">
                  <span>{getProjectTypeIcon(activeProject.type)}</span>
                </div>
                <div className="messages-project-details">
                  <h2>{activeProject.name}</h2>
                  <p>
                    {activeProject.type} • {activeProject.status} • 
                    {activeProjectMessages.length} Nachrichten
                  </p>
                </div>
              </div>
              
              <div className="messages-chat-actions">
                <button className="messages-action-btn" title="Suchfunktion">
                  <HiSearch />
                </button>
                <button className="messages-action-btn" title="Projektdetails">
                  <HiFolderOpen />
                </button>
                <button className="messages-action-btn" title="Weitere Optionen">
                  <HiDotsVertical />
                </button>
              </div>
            </header>

            {/* Messages Container - KORRIGIERT: Verwendet MessageCard */}
            <div className="messages-container">
              <div className="messages-list">
                {activeProjectMessages.length > 0 ? (
                  <>
                    <div className="messages-grid">
                      {activeProjectMessages.map((message) => {
                        const messageProject = projects.find(p => p.id === message.projectId);
                        
                        return (
                          <MessageCard
                            key={message.id}
                            message={message}
                            project={messageProject}
                            onMessageAction={handleMessageAction}
                            formatTimeAgo={formatTimeAgo}
                          />
                        );
                      })}
                    </div>
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="messages-empty-messages">
                    <HiExclamationTriangle className="messages-empty-icon" />
                    <h3>Noch keine Nachrichten</h3>
                    <p>Beginne ein Gespräch über dieses Projekt</p>
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            <footer className="messages-input-container">
              <div className="messages-input-wrapper">
                <button className="messages-attach-btn" title="Datei anhängen">
                  <HiPaperClip />
                </button>
                
                <textarea
                  ref={textAreaRef}
                  className="messages-textarea"
                  placeholder="Nachricht schreiben..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSending}
                  rows={1}
                />
                
                <button
                  className={`messages-send-btn ${messageInput.trim() ? 'messages-send-btn--active' : ''}`}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSending}
                  title="Nachricht senden"
                >
                  {isSending ? <HiRefresh className="messages-spinning" /> : <HiPaperAirplane />}
                </button>
              </div>
              
              <div className="messages-input-meta">
                <small>
                  {messageInput.length}/1000 • Enter zum Senden, Shift+Enter für neue Zeile
                </small>
              </div>
            </footer>
          </>
        ) : (
          <div className="messages-no-project-selected">
            <HiFolderOpen className="messages-no-project-icon" />
            <h3>Kein Projekt ausgewählt</h3>
            <p>Wähle ein Projekt aus der Sidebar, um Nachrichten zu sehen</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;