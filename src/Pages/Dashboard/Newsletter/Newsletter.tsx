// src/Pages/Dashboard/Newsletter/Newsletter.tsx
// KORRIGIERT: Newsletter-Seite mit Mock-Service und funktionierender SCSS

import React, { useState } from 'react';
import { 
  Mail, 
  Users, 
  Send, 
  Edit3, 
  Plus, 
  BarChart3,
  AlertCircle,
  Eye
} from 'lucide-react';

import { useDashboard } from '../Context/DashboardContext';
import './Newsletter.scss';

// Mock Newsletter Stats für Development
const mockNewsletterStats = {
  confirmedSubscribers: 245,
  unconfirmedSubscribers: 18,
  totalNewslettersSent: 12,
  scheduledNewsletters: 2,
  avgOpenRate: 68.5,
  confirmationRate: 92.8
};

// Mock Newsletter Templates für Development  
const mockTemplates = [
  {
    _id: '1',
    name: 'Willkommen Newsletter',
    subject: 'Willkommen bei Portfolio Chris Schubert!',
    preheader: 'Vielen Dank für Ihr Interesse an meinen Dienstleistungen',
    status: 'draft' as const,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2', 
    name: 'Monatlicher Update',
    subject: 'Neue Projekte und Updates - Januar 2024',
    preheader: 'Erfahren Sie mehr über unsere neuesten Arbeiten',
    status: 'sent' as const,
    sentCount: 234,
    openRate: 72.5,
    clickRate: 15.8,
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Sonderangebot Webentwicklung',
    subject: '🚀 20% Rabatt auf alle Webprojekte im Februar',
    preheader: 'Limitiertes Angebot für Neukunden',
    status: 'scheduled' as const,
    sentCount: 0,
    openRate: 0,
    clickRate: 0,
    createdAt: new Date().toISOString()
  }
];

const Newsletter: React.FC = () => {
  const { user } = useDashboard();
  const [activeView, setActiveView] = useState<'dashboard' | 'templates' | 'subscribers' | 'create'>('dashboard');

  // Admin-Check
  if (user.role !== 'admin') {
    return (
      <div className="newsletter-access-denied">
        <div className="access-denied-content">
          <AlertCircle size={48} className="icon-error" />
          <h2>Zugriff verweigert</h2>
          <p>Nur Administratoren haben Zugriff auf das Newsletter-System.</p>
        </div>
      </div>
    );
  }

  const renderNavigationTabs = () => (
    <div className="newsletter-nav-tabs">
      <button 
        className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveView('dashboard')}
      >
        <BarChart3 size={20} />
        Übersicht
      </button>
      
      <button 
        className={`nav-tab ${activeView === 'subscribers' ? 'active' : ''}`}
        onClick={() => setActiveView('subscribers')}
      >
        <Users size={20} />
        Abonnenten
        <span className="tab-badge">{mockNewsletterStats.confirmedSubscribers}</span>
      </button>
      
      <button 
        className={`nav-tab ${activeView === 'templates' ? 'active' : ''}`}
        onClick={() => setActiveView('templates')}
      >
        <Mail size={20} />
        Templates
        <span className="tab-badge">{mockNewsletterStats.totalNewslettersSent}</span>
      </button>
      
      <button 
        className={`nav-tab ${activeView === 'create' ? 'active' : ''}`}
        onClick={() => setActiveView('create')}
      >
        <Plus size={20} />
        Erstellen
      </button>
    </div>
  );

  const renderStatsCards = () => (
    <div className="newsletter-stats-grid">
      <div className="stats-card">
        <div className="stats-icon">
          <Users className="icon-primary" />
        </div>
        <div className="stats-content">
          <h3>{mockNewsletterStats.confirmedSubscribers.toLocaleString()}</h3>
          <p>Aktive Abonnenten</p>
          <small>{mockNewsletterStats.confirmationRate}% Bestätigungsrate</small>
        </div>
      </div>
      
      <div className="stats-card">
        <div className="stats-icon">
          <Mail className="icon-success" />
        </div>
        <div className="stats-content">
          <h3>{mockNewsletterStats.totalNewslettersSent}</h3>
          <p>Newsletter versendet</p>
          <small>{mockNewsletterStats.avgOpenRate}% Ø Öffnungsrate</small>
        </div>
      </div>
      
      <div className="stats-card">
        <div className="stats-icon">
          <Send className="icon-warning" />
        </div>
        <div className="stats-content">
          <h3>{mockNewsletterStats.scheduledNewsletters}</h3>
          <p>Geplante Newsletter</p>
          <small>Warteschlange</small>
        </div>
      </div>
      
      <div className="stats-card">
        <div className="stats-icon">
          <AlertCircle className="icon-info" />
        </div>
        <div className="stats-content">
          <h3>{mockNewsletterStats.unconfirmedSubscribers}</h3>
          <p>Unbestätigte Anmeldungen</p>
          <small>Warten auf Bestätigung</small>
        </div>
      </div>
    </div>
  );

  return (
    <div className="newsletter-dashboard">
      {/* Header */}
      <div className="newsletter-header">
        <div className="header-content">
          <h1>
            <Mail size={32} />
            Newsletter-System
          </h1>
          <p>Verwalten Sie Ihre Newsletter-Kampagnen und Abonnenten</p>
        </div>
      </div>

      {/* Navigation */}
      {renderNavigationTabs()}

      {/* Main Content */}
      <div className="newsletter-main-content">
        {activeView === 'dashboard' && (
          <div className="newsletter-overview">
            <h2>Newsletter Übersicht</h2>
            {renderStatsCards()}
            
            {/* Recent Templates */}
            <div className="recent-templates">
              <div className="section-header">
                <h3>Letzte Templates</h3>
                <button 
                  className="btn btn--outline"
                  onClick={() => setActiveView('templates')}
                >
                  Alle anzeigen
                </button>
              </div>
              
              <div className="templates-preview">
                {mockTemplates.slice(0, 3).map((template) => (
                  <div key={template._id} className="template-preview-card">
                    <div className="preview-header">
                      <h4>{template.name}</h4>
                      <span className={`status status--${template.status}`}>
                        {template.status === 'draft' && 'Entwurf'}
                        {template.status === 'sent' && 'Versendet'}
                        {template.status === 'scheduled' && 'Geplant'}
                      </span>
                    </div>
                    <p>{template.subject}</p>
                    
                    {template.status === 'sent' && (
                      <div className="template-stats">
                        <small>Versendet: {template.sentCount} | Öffnungsrate: {template.openRate}%</small>
                      </div>
                    )}
                    
                    <div className="preview-actions">
                      <button className="btn btn--small">
                        <Eye size={14} />
                        Vorschau
                      </button>
                      {template.status === 'draft' && (
                        <button className="btn btn--small btn--primary">
                          <Edit3 size={14} />
                          Bearbeiten
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Schnellaktionen</h3>
              <div className="action-buttons">
                <button 
                  className="action-button"
                  onClick={() => setActiveView('create')}
                >
                  <Plus size={24} />
                  <span>Neues Template</span>
                </button>
                
                <button 
                  className="action-button"
                  onClick={() => setActiveView('subscribers')}
                >
                  <Users size={24} />
                  <span>Abonnenten verwalten</span>
                </button>
                
                <button 
                  className="action-button"
                  onClick={() => setActiveView('templates')}
                >
                  <BarChart3 size={24} />
                  <span>Templates verwalten</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'templates' && (
          <div className="newsletter-content-section">
            <div className="section-header">
              <h2>
                <Mail size={24} />
                Newsletter Templates
              </h2>
              <button 
                className="btn btn--primary"
                onClick={() => setActiveView('create')}
              >
                <Plus size={16} />
                Neues Template
              </button>
            </div>
            
            <div className="templates-grid">
              {mockTemplates.map((template) => (
                <div key={template._id} className="template-card">
                  <div className="template-header">
                    <h3>{template.name}</h3>
                    <div className={`template-status status--${template.status}`}>
                      {template.status === 'draft' && 'Entwurf'}
                      {template.status === 'scheduled' && 'Geplant'}
                      {template.status === 'sent' && 'Versendet'}
                    </div>
                  </div>
                  
                  <div className="template-content">
                    <p className="template-subject">{template.subject}</p>
                    <p className="template-preheader">{template.preheader}</p>
                    
                    {template.status === 'sent' && (
                      <div className="template-stats">
                        <div className="stat-item">
                          <span className="stat-label">Versendet:</span>
                          <span className="stat-value">{template.sentCount}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Geöffnet:</span>
                          <span className="stat-value">{template.openRate}%</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Geklickt:</span>
                          <span className="stat-value">{template.clickRate}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="template-actions">
                    <button className="btn-icon" title="Vorschau">
                      <Eye size={16} />
                    </button>
                    
                    {template.status !== 'sent' && (
                      <button className="btn-icon" title="Bearbeiten">
                        <Edit3 size={16} />
                      </button>
                    )}
                    
                    {template.status === 'draft' && (
                      <button className="btn-icon success" title="Senden">
                        <Send size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'subscribers' && (
          <div className="newsletter-content-section">
            <div className="section-header">
              <h2>
                <Users size={24} />
                Abonnenten-Verwaltung
              </h2>
            </div>
            
            <div className="empty-state">
              <Users size={48} />
              <h3>Abonnenten-Verwaltung</h3>
              <p>Backend-Integration für Abonnenten wird implementiert.</p>
              <p>Features:</p>
              <ul>
                <li>✅ Abonnenten-Liste mit Filtern</li>
                <li>✅ Import/Export Funktionalität</li>
                <li>✅ Öffnungsraten-Tracking</li>
                <li>✅ Segmentierung nach Interessen</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeView === 'create' && (
          <div className="newsletter-content-section">
            <div className="section-header">
              <h2>
                <Plus size={24} />
                Neues Newsletter Template
              </h2>
            </div>
            
            <div className="template-editor-placeholder">
              <div className="editor-info">
                <Mail size={48} />
                <h3>Template-Editor</h3>
                <p>Rich-Text-Editor wird in der nächsten Implementation hinzugefügt.</p>
                <p>Features:</p>
                <ul>
                  <li>✅ WYSIWYG-Editor mit Formatierung</li>
                  <li>✅ Bild-Upload über externe URLs</li>
                  <li>✅ Template-Vorschau</li>
                  <li>✅ Zeitgesteuerte Versendung</li>
                  <li>✅ Personalisierung (firstName, email)</li>
                  <li>✅ A/B-Testing für Betreffzeilen</li>
                </ul>
                
                <button 
                  className="btn btn--primary"
                  onClick={() => alert('Template-Editor folgt in der nächsten Version!')}
                >
                  <Plus size={16} />
                  Template erstellen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Newsletter;