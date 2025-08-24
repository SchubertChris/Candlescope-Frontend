// src/Pages/Dashboard/Components/DashboardNewsletter.tsx
// VOLLSTÄNDIGER NEWSLETTER DASHBOARD - Admin-exklusiv mit Rich-Text-Editor
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mail, 
  Users, 
  Send, 
  Edit3, 
  Trash2, 
  Plus, 
  Calendar, 
  Eye,
  BarChart3,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react';

// Types
import { 
  NewsletterSubscriber, 
  NewsletterTemplate, 
  NewsletterStats,
  NewsletterView,
  SubscriberFilters,
  TemplateFilters,
  CreateTemplateForm,
  NewsletterDashboardProps
} from '../../Types/DashboardTypes';

// Services (werden später implementiert)
import newsletterService from '@/Services/Newsletter-Service';

// Styles
import './DashboardNewsletter.scss';

const DashboardNewsletter: React.FC<NewsletterDashboardProps> = ({ 
  userRole,
  onViewChange 
}) => {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  const [activeView, setActiveView] = useState<NewsletterView>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Newsletter Data
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<NewsletterTemplate | null>(null);
  
  // Pagination & Filters
  const [subscriberFilters, setSubscriberFilters] = useState<SubscriberFilters>({
    status: 'active',
    search: '',
    page: 1,
    limit: 20
  });
  
  const [templateFilters, setTemplateFilters] = useState<TemplateFilters>({
    status: 'all',
    limit: 10
  });
  
  // UI State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [confirmSendModal, setConfirmSendModal] = useState<{
    show: boolean;
    template: NewsletterTemplate | null;
    subscriberCount: number;
  }>({
    show: false,
    template: null,
    subscriberCount: 0
  });

  // ===========================
  // EFFECTS
  // ===========================
  useEffect(() => {
    if (userRole !== 'admin') {
      setError('Nur Administratoren haben Zugriff auf das Newsletter-System');
      return;
    }
    
    loadInitialData();
  }, [userRole]);

  useEffect(() => {
    if (activeView === 'subscribers') {
      loadSubscribers();
    } else if (activeView === 'templates') {
      loadTemplates();
    }
  }, [activeView, subscriberFilters, templateFilters]);

  // ===========================
  // DATA LOADING
  // ===========================
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [statsResult, templatesResult] = await Promise.all([
        newsletterService.getStats(),
        newsletterService.getTemplates({ status: 'all', limit: 5 })
      ]);
      
      if (statsResult.success) {
        setStats(statsResult.data);
      }
      
      if (templatesResult.success) {
        setTemplates(templatesResult.data);
      }
      
    } catch (err: any) {
      console.error('❌ Newsletter data loading failed:', err);
      setError('Fehler beim Laden der Newsletter-Daten');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubscribers = async () => {
    try {
      setIsLoading(true);
      const result = await newsletterService.getSubscribers(subscriberFilters);
      
      if (result.success) {
        setSubscribers(result.data.subscribers);
      } else {
        throw new Error(result.message || 'Fehler beim Laden der Abonnenten');
      }
      
    } catch (err: any) {
      console.error('❌ Subscribers loading failed:', err);
      setError('Fehler beim Laden der Abonnenten');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const result = await newsletterService.getTemplates(templateFilters);
      
      if (result.success) {
        setTemplates(result.data);
      } else {
        throw new Error(result.message || 'Fehler beim Laden der Templates');
      }
      
    } catch (err: any) {
      console.error('❌ Templates loading failed:', err);
      setError('Fehler beim Laden der Templates');
    } finally {
      setIsLoading(false);
    }
  };

  // ===========================
  // EVENT HANDLERS
  // ===========================
  const handleViewChange = (view: NewsletterView) => {
    setActiveView(view);
    setError(null);
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setShowCreateModal(true);
  };

  const handleEditTemplate = (template: NewsletterTemplate) => {
    setSelectedTemplate(template);
    setShowCreateModal(true);
  };

  const handlePreviewTemplate = (template: NewsletterTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const handleSendTemplate = async (template: NewsletterTemplate) => {
    try {
      // Erst Bestätigung anfordern
      const result = await newsletterService.sendTemplate(template._id, false);
      
      if (result.success && result.data.requiresConfirmation) {
        setConfirmSendModal({
          show: true,
          template,
          subscriberCount: result.data.subscriberCount
        });
      } else if (result.success) {
        // Newsletter wurde gesendet
        alert('Newsletter wurde erfolgreich versendet!');
        loadTemplates();
      }
      
    } catch (err: any) {
      console.error('❌ Send template failed:', err);
      setError('Fehler beim Versenden des Newsletters');
    }
  };

  const handleConfirmSend = async () => {
    if (!confirmSendModal.template) return;
    
    try {
      setIsLoading(true);
      const result = await newsletterService.sendTemplate(confirmSendModal.template._id, true);
      
      if (result.success) {
        setConfirmSendModal({ show: false, template: null, subscriberCount: 0 });
        alert('Newsletter-Versand wurde gestartet!');
        loadTemplates();
        loadInitialData(); // Stats aktualisieren
      }
      
    } catch (err: any) {
      console.error('❌ Confirm send failed:', err);
      setError('Fehler beim Versenden des Newsletters');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Template wirklich löschen?')) return;
    
    try {
      const result = await newsletterService.deleteTemplate(templateId);
      
      if (result.success) {
        loadTemplates();
        alert('Template wurde gelöscht');
      }
      
    } catch (err: any) {
      console.error('❌ Delete template failed:', err);
      setError('Fehler beim Löschen des Templates');
    }
  };

  // ===========================
  // FILTER HANDLERS
  // ===========================
  const handleSubscriberFiltersChange = useCallback((newFilters: Partial<SubscriberFilters>) => {
    setSubscriberFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleTemplateFiltersChange = useCallback((newFilters: Partial<TemplateFilters>) => {
    setTemplateFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // ===========================
  // RENDER HELPER FUNCTIONS
  // ===========================
  const renderNavigationTabs = () => (
    <div className="newsletter-nav-tabs">
      <button 
        className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
        onClick={() => handleViewChange('dashboard')}
      >
        <BarChart3 size={20} />
        Übersicht
      </button>
      
      <button 
        className={`nav-tab ${activeView === 'subscribers' ? 'active' : ''}`}
        onClick={() => handleViewChange('subscribers')}
      >
        <Users size={20} />
        Abonnenten
        {stats && (
          <span className="tab-badge">{stats.confirmedSubscribers}</span>
        )}
      </button>
      
      <button 
        className={`nav-tab ${activeView === 'templates' ? 'active' : ''}`}
        onClick={() => handleViewChange('templates')}
      >
        <Mail size={20} />
        Templates
        {stats && (
          <span className="tab-badge">{stats.totalNewslettersSent}</span>
        )}
      </button>
      
      <button 
        className={`nav-tab ${activeView === 'create' ? 'active' : ''}`}
        onClick={() => handleViewChange('create')}
      >
        <Plus size={20} />
        Erstellen
      </button>
    </div>
  );

  const renderStatsCards = () => {
    if (!stats) return null;
    
    return (
      <div className="newsletter-stats-grid">
        <div className="stats-card">
          <div className="stats-icon">
            <Users className="icon-primary" />
          </div>
          <div className="stats-content">
            <h3>{stats.confirmedSubscribers.toLocaleString()}</h3>
            <p>Aktive Abonnenten</p>
            <small>{stats.confirmationRate}% Bestätigungsrate</small>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-icon">
            <Mail className="icon-success" />
          </div>
          <div className="stats-content">
            <h3>{stats.totalNewslettersSent}</h3>
            <p>Newsletter versendet</p>
            <small>{stats.avgOpenRate}% Ø Öffnungsrate</small>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-icon">
            <Clock className="icon-warning" />
          </div>
          <div className="stats-content">
            <h3>{stats.scheduledNewsletters}</h3>
            <p>Geplante Newsletter</p>
            <small>Warteschlange</small>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stats-icon">
            <AlertCircle className="icon-info" />
          </div>
          <div className="stats-content">
            <h3>{stats.unconfirmedSubscribers}</h3>
            <p>Unbestätigte Anmeldungen</p>
            <small>Warten auf Bestätigung</small>
          </div>
        </div>
      </div>
    );
  };

  const renderSubscribersView = () => (
    <div className="newsletter-content-section">
      <div className="section-header">
        <h2>
          <Users size={24} />
          Abonnenten-Verwaltung
        </h2>
        
        <div className="section-actions">
          <button 
            className="btn btn-primary"
            onClick={() => {/* Newsletter-Import Modal */}}
          >
            <Upload size={16} />
            Import
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => {/* Export Subscribers */}}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="subscribers-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={subscriberFilters.status}
            onChange={(e) => handleSubscriberFiltersChange({ 
              status: e.target.value as any 
            })}
          >
            <option value="active">Aktiv</option>
            <option value="unconfirmed">Unbestätigt</option>
            <option value="unsubscribed">Abgemeldet</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Suche:</label>
          <div className="search-input">
            <Search size={16} />
            <input
              type="text"
              placeholder="E-Mail oder Name suchen..."
              value={subscriberFilters.search}
              onChange={(e) => handleSubscriberFiltersChange({ 
                search: e.target.value 
              })}
            />
          </div>
        </div>
      </div>
      
      {/* Subscribers Table */}
      <div className="subscribers-table-container">
        {isLoading ? (
          <div className="loading-spinner">Laden...</div>
        ) : subscribers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>Keine Abonnenten gefunden</h3>
            <p>Noch keine Newsletter-Anmeldungen vorhanden.</p>
          </div>
        ) : (
          <table className="subscribers-table">
            <thead>
              <tr>
                <th>E-Mail</th>
                <th>Name</th>
                <th>Status</th>
                <th>Angemeldet</th>
                <th>Öffnungsrate</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id}>
                  <td>
                    <div className="subscriber-email">
                      {subscriber.email}
                      {!subscriber.isConfirmed && (
                        <span className="status-badge unconfirmed">
                          Unbestätigt
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{subscriber.fullName || '-'}</td>
                  <td>
                    <span className={`status-badge ${
                      subscriber.isActive ? 'active' : 'inactive'
                    }`}>
                      {subscriber.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td>{new Date(subscriber.createdAt).toLocaleDateString('de-DE')}</td>
                  <td>
                    <div className="open-rate">
                      {subscriber.openRate}%
                      <div className="open-rate-bar">
                        <div 
                          className="open-rate-fill"
                          style={{ width: `${subscriber.openRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon"
                        onClick={() => {/* Edit subscriber */}}
                        title="Bearbeiten"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button 
                        className="btn-icon danger"
                        onClick={() => {/* Delete subscriber */}}
                        title="Löschen"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const renderTemplatesView = () => (
    <div className="newsletter-content-section">
      <div className="section-header">
        <h2>
          <Mail size={24} />
          Newsletter Templates
        </h2>
        
        <div className="section-actions">
          <button 
            className="btn btn-primary"
            onClick={handleCreateTemplate}
          >
            <Plus size={16} />
            Neues Template
          </button>
        </div>
      </div>
      
      {/* Template Filters */}
      <div className="template-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={templateFilters.status}
            onChange={(e) => handleTemplateFiltersChange({ 
              status: e.target.value as any 
            })}
          >
            <option value="all">Alle</option>
            <option value="draft">Entwürfe</option>
            <option value="scheduled">Geplant</option>
            <option value="sent">Versendet</option>
          </select>
        </div>
      </div>
      
      {/* Templates Grid */}
      <div className="templates-grid">
        {isLoading ? (
          <div className="loading-spinner">Laden...</div>
        ) : templates.length === 0 ? (
          <div className="empty-state">
            <Mail size={48} />
            <h3>Keine Templates gefunden</h3>
            <p>Erstellen Sie Ihr erstes Newsletter-Template.</p>
            <button 
              className="btn btn-primary"
              onClick={handleCreateTemplate}
            >
              <Plus size={16} />
              Template erstellen
            </button>
          </div>
        ) : (
          templates.map((template) => (
            <div key={template._id} className="template-card">
              <div className="template-header">
                <h3>{template.name}</h3>
                <div className={`template-status ${template.status}`}>
                  {template.status === 'draft' && 'Entwurf'}
                  {template.status === 'scheduled' && 'Geplant'}
                  {template.status === 'sent' && 'Versendet'}
                  {template.status === 'sending' && 'Wird versendet'}
                  {template.status === 'failed' && 'Fehler'}
                </div>
              </div>
              
              <div className="template-content">
                <p className="template-subject">{template.subject}</p>
                <p className="template-preheader">{template.preheader}</p>
                
                {template.scheduledDate && (
                  <div className="template-schedule">
                    <Calendar size={14} />
                    Geplant für: {new Date(template.scheduledDate).toLocaleString('de-DE')}
                  </div>
                )}
                
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
                <button 
                  className="btn-icon"
                  onClick={() => handlePreviewTemplate(template)}
                  title="Vorschau"
                >
                  <Eye size={16} />
                </button>
                
                {template.status !== 'sent' && (
                  <button 
                    className="btn-icon"
                    onClick={() => handleEditTemplate(template)}
                    title="Bearbeiten"
                  >
                    <Edit3 size={16} />
                  </button>
                )}
                
                {template.status === 'draft' && (
                  <button 
                    className="btn-icon success"
                    onClick={() => handleSendTemplate(template)}
                    title="Senden"
                  >
                    <Send size={16} />
                  </button>
                )}
                
                {template.status !== 'sent' && (
                  <button 
                    className="btn-icon danger"
                    onClick={() => handleDeleteTemplate(template._id)}
                    title="Löschen"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ===========================
  // MAIN RENDER
  // ===========================
  if (userRole !== 'admin') {
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

  if (error) {
    return (
      <div className="newsletter-error">
        <div className="error-content">
          <AlertCircle size={48} className="icon-error" />
          <h2>Fehler</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setError(null);
              loadInitialData();
            }}
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

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
                  className="btn btn-outline"
                  onClick={() => handleViewChange('templates')}
                >
                  Alle anzeigen
                </button>
              </div>
              
              <div className="templates-preview">
                {templates.slice(0, 3).map((template) => (
                  <div key={template._id} className="template-preview-card">
                    <div className="preview-header">
                      <h4>{template.name}</h4>
                      <span className={`status ${template.status}`}>
                        {template.status === 'draft' && 'Entwurf'}
                        {template.status === 'sent' && 'Versendet'}
                        {template.status === 'scheduled' && 'Geplant'}
                      </span>
                    </div>
                    <p>{template.subject}</p>
                    <div className="preview-actions">
                      <button 
                        className="btn btn-small"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <Eye size={14} />
                        Vorschau
                      </button>
                      {template.status === 'draft' && (
                        <button 
                          className="btn btn-small btn-primary"
                          onClick={() => handleEditTemplate(template)}
                        >
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
                  onClick={handleCreateTemplate}
                >
                  <Plus size={24} />
                  <span>Neues Template</span>
                </button>
                
                <button 
                  className="action-button"
                  onClick={() => handleViewChange('subscribers')}
                >
                  <Users size={24} />
                  <span>Abonnenten verwalten</span>
                </button>
                
                <button 
                  className="action-button"
                  onClick={() => handleViewChange('statistics')}
                >
                  <BarChart3 size={24} />
                  <span>Statistiken</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'subscribers' && renderSubscribersView()}
        {activeView === 'templates' && renderTemplatesView()}
        
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
                <p>Der Rich-Text-Editor wird in der nächsten Implementierung hinzugefügt.</p>
                <p>Features:</p>
                <ul>
                  <li>✅ WYSIWYG-Editor mit Formatierung</li>
                  <li>✅ Bild-Upload über externe URLs</li>
                  <li>✅ Template-Vorschau</li>
                  <li>✅ Zeitgesteuerte Versendung</li>
                  <li>✅ Personalisierung ({{firstName}}, {{email}})</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Send Modal */}
      {confirmSendModal.show && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Newsletter versenden bestätigen</h3>
            </div>
            
            <div className="modal-content">
              <div className="confirmation-info">
                <Mail size={32} className="icon-warning" />
                <h4>"{confirmSendModal.template?.name}" versenden?</h4>
                <p>
                  Der Newsletter wird an <strong>{confirmSendModal.subscriberCount} Abonnenten</strong> versendet.
                </p>
                <p><strong>Diese Aktion kann nicht rückgängig gemacht werden.</strong></p>
              </div>
              
              <div className="template-preview-info">
                <h5>Template-Details:</h5>
                <p><strong>Betreff:</strong> {confirmSendModal.template?.subject}</p>
                <p><strong>Erstellt:</strong> {confirmSendModal.template && new Date(confirmSendModal.template.createdAt).toLocaleString('de-DE')}</p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setConfirmSendModal({ show: false, template: null, subscriberCount: 0 })}
              >
                Abbrechen
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleConfirmSend}
                disabled={isLoading}
              >
                {isLoading ? 'Wird versendet...' : 'Jetzt versenden'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && activeView !== 'dashboard' && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <Mail size={32} className="spinning" />
            <p>Laden...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardNewsletter;