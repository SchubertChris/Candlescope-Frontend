// src/Pages/Dashboard/Messages/Messages.tsx
// Dashboard Messages - Vollständiges Chat-Interface mit Projekt-Sidebar

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
  HiExclamationTriangle,
  HiRefresh,
  HiFilter,
  HiEye,
  HiEyeOff
} from 'react-icons/hi';
import { useDashboard } from '../Context/DashboardContext';
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
      
      // Textarea-Höhe zurücksetzen
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
    
    // Ungelesene Nachrichten für dieses Projekt als gelesen markieren
    const unreadMessages = messages.filter(m => 
      m.projectId === projectId && !m.isRead
    );
    
    unreadMessages.forEach(message => {
      onMessageRead(message.id);
    });
  };

  // Message formatieren
  const formatTimestamp = (timestamp: string): string => {
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

  // Loading State
  if (isLoading) {
    return (
      <div className="messages-page loading">
        <div className="loading-spinner">
          <HiRefresh />
        </div>
        <p>Lade Nachrichten...</p>
      </div>
    );
  }

  return (
    <div className="messages-page">
      {/* Projects Sidebar */}
      <aside className="projects-sidebar">
        <div className="sidebar-header">
          <h3>Projekte</h3>
          <div className="sidebar-actions">
            <button
              className={`filter-btn ${showUnreadOnly ? 'active' : ''}`}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              title="Nur ungelesene anzeigen"
            >
              {showUnreadOnly ? <HiEye /> : <HiEyeOff />}
            </button>
          </div>
          <p className="project-count">
            {filteredProjects.length} von {projects.length} Projekten
          </p>
        </div>

        {/* Project Search */}
        <div className="search-box">
          <HiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Projekte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Projects List */}
        <div className="projects-list">
          {filteredProjects.map((project) => {
            const unreadCount = getUnreadCount(project.id);
            const isActive = project.id === activeProjectId;
            
            return (
              <div
                key={project.id}
                className={`project-item ${isActive ? 'active' : ''}`}
                onClick={() => handleProjectSelect(project.id)}
              >
                <div className="project-icon">
                  <span className="project-type-emoji">
                    {getProjectTypeIcon(project.type)}
                  </span>
                </div>
                <div className="project-info">
                  <div className="project-name">{project.name}</div>
                  <div className="project-meta">
                    <span className="project-status">{project.status}</span>
                    {unreadCount > 0 && (
                      <span className="unread-badge">{unreadCount}</span>
                    )}
                  </div>
                </div>
                <div className="project-actions">
                  <button className="project-menu-btn">
                    <HiDotsVertical />
                  </button>
                </div>
              </div>
            );
          })}
          
          {filteredProjects.length === 0 && (
            <div className="empty-projects">
              <HiFolderOpen className="empty-icon" />
              <p>Keine Projekte gefunden</p>
            </div>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="chat-area">
        {activeProject ? (
          <>
            {/* Chat Header */}
            <header className="chat-header">
              <div className="chat-project-info">
                <div className="project-avatar">
                  <span>{getProjectTypeIcon(activeProject.type)}</span>
                </div>
                <div className="project-details">
                  <h2>{activeProject.name}</h2>
                  <p>
                    {activeProject.type} • {activeProject.status} • 
                    {activeProjectMessages.length} Nachrichten
                  </p>
                </div>
              </div>
              
              <div className="chat-actions">
                <button className="action-btn" title="Suchfunktion">
                  <HiSearch />
                </button>
                <button className="action-btn" title="Projektdetails">
                  <HiFolderOpen />
                </button>
                <button className="action-btn" title="Weitere Optionen">
                  <HiDotsVertical />
                </button>
              </div>
            </header>

            {/* Messages Container */}
            <div className="messages-container">
              <div className="messages-list">
                {activeProjectMessages.length > 0 ? (
                  <>
                    {activeProjectMessages.map((message) => {
                      const isFromUser = message.senderId === user.id;
                      const isFromAdmin = message.senderRole === 'admin';
                      
                      return (
                        <div
                          key={message.id}
                          className={`message ${isFromUser ? 'own' : 'other'} ${isFromAdmin ? 'admin' : 'kunde'}`}
                        >
                          <div className="message-avatar">
                            <HiUser />
                          </div>
                          
                          <div className="message-content">
                            <div className="message-header">
                              <span className="sender-name">
                                {isFromUser ? 'Du' : message.senderName}
                              </span>
                              <span className="message-role">
                                {isFromAdmin ? 'Admin' : 'Kunde'}
                              </span>
                              <span className="message-time">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            </div>
                            
                            <div className="message-body">
                              <p>{message.content}</p>
                              
                              {message.hasAttachment && message.attachments && (
                                <div className="message-attachments">
                                  {message.attachments.map((attachment) => (
                                    <div key={attachment.id} className="attachment">
                                      <HiPaperClip />
                                      <span>{attachment.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="message-status">
                              {message.isRead ? (
                                <HiCheckCircle className="status-read" />
                              ) : (
                                <HiClock className="status-unread" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="empty-messages">
                    <HiExclamationTriangle className="empty-icon" />
                    <h3>Noch keine Nachrichten</h3>
                    <p>Beginne ein Gespräch über dieses Projekt</p>
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            <footer className="message-input">
              <div className="input-container">
                <button className="attach-btn" title="Datei anhängen">
                  <HiPaperClip />
                </button>
                
                <textarea
                  ref={textAreaRef}
                  className="message-textarea"
                  placeholder="Nachricht schreiben..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSending}
                  rows={1}
                />
                
                <button
                  className={`send-btn ${messageInput.trim() ? 'active' : ''}`}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSending}
                  title="Nachricht senden"
                >
                  {isSending ? <HiRefresh className="spinning" /> : <HiPaperAirplane />}
                </button>
              </div>
              
              <div className="input-meta">
                <small>
                  {messageInput.length}/1000 • Enter zum Senden, Shift+Enter für neue Zeile
                </small>
              </div>
            </footer>
          </>
        ) : (
          <div className="no-project-selected">
            <HiFolderOpen className="no-project-icon" />
            <h3>Kein Projekt ausgewählt</h3>
            <p>Wähle ein Projekt aus der Sidebar, um Nachrichten zu sehen</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;