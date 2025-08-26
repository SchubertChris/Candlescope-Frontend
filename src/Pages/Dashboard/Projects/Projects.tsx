// src/Pages/Dashboard/Projects/Projects.tsx
// KORRIGIERT: Verwendet ProjectCard-Komponente statt inline HTML

import React, { useState, useMemo } from 'react';
import {
  HiFolderOpen,
  HiPlus,
  HiSearch,
  HiFilter,
  HiViewGrid,
  HiViewList,
  HiDotsVertical,
  HiClock,
  HiUser,
  HiCalendar,
  HiFlag,
  HiEye,
  HiPencil,
  HiTrash,
  HiDownload,
  HiUpload,
  HiExclamationCircle,
  HiCheckCircle,
  HiRefresh
} from 'react-icons/hi';
import { HiExclamationTriangle } from 'react-icons/hi2';

import { useDashboard } from '../Context/DashboardContext';
import ProjectCard from '../Components/Cards/ProjectCard/ProjectCard';
import { Project, ProjectStatus, ProjectPriority, ProjectType } from '../Types/DashboardTypes';
import './Projects.scss';

type ViewMode = 'grid' | 'list';
type SortField = 'name' | 'status' | 'priority' | 'deadline' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const Projects: React.FC = () => {
  const { user, projects, onProjectUpdate } = useDashboard();
  
  // View States
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('deadline');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Project Actions - KORRIGIERT: Vereinfacht für ProjectCard
  const handleProjectAction = async (projectId: string, action: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projekt nicht gefunden');
      
      switch (action) {
        case 'view':
          setSelectedProjectId(projectId);
          break;
        case 'message':
          // Navigate to messages with this project
          console.log('Navigate to messages for project:', projectId);
          // TODO: Router navigation to /dashboard/messages?project=projectId
          break;
        case 'menu':
          console.log('Show menu for project:', projectId);
          // TODO: Show context menu
          break;
        case 'edit':
          console.log('Edit project:', projectId);
          // TODO: Edit Modal öffnen
          break;
        case 'delete':
          if (confirm('Projekt wirklich löschen?')) {
            console.log('Delete project:', projectId);
            // TODO: Delete API Call
          }
          break;
        case 'complete':
          await onProjectUpdate({ ...project, status: 'completed' });
          break;
        default:
          console.warn('Unknown action:', action);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  // Create Project
  const handleCreateProject = () => {
    console.log('Create new project');
    // TODO: Create Project Modal
  };

  // Filter & Sort Logic
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || project.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });

    // Sortierung
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'deadline' || sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [projects, searchQuery, statusFilter, priorityFilter, typeFilter, sortField, sortOrder]);

  // Format Date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // List View Project Item Component
  const ProjectListItem: React.FC<{ project: Project }> = ({ project }) => {
    const getStatusBadge = (status: ProjectStatus) => {
      const styles = {
        planning: { class: 'projects-status-planning', label: 'Planung' },
        inProgress: { class: 'projects-status-progress', label: 'In Arbeit' },
        review: { class: 'projects-status-review', label: 'Review' },
        completed: { class: 'projects-status-completed', label: 'Abgeschlossen' }
      };
      return styles[status] || { class: 'projects-status-default', label: status };
    };

    const getPriorityBadge = (priority: ProjectPriority) => {
      const styles = {
        low: { class: 'projects-priority-low', label: 'Niedrig', icon: '🟢' },
        medium: { class: 'projects-priority-medium', label: 'Mittel', icon: '🟡' },
        high: { class: 'projects-priority-high', label: 'Hoch', icon: '🔴' }
      };
      return styles[priority] || { class: 'projects-priority-default', label: priority, icon: '⚪' };
    };

    const getProjectTypeIcon = (type: ProjectType) => {
      const icons = {
        website: '🌐',
        newsletter: '📧',
        bewerbung: '📄',
        ecommerce: '🛒',
        custom: '⚙️'
      };
      return icons[type] || '📁';
    };

    const getProjectProgress = (project: Project): number => {
      switch (project.status) {
        case 'planning': return 15;
        case 'inProgress': return 60;
        case 'review': return 85;
        case 'completed': return 100;
        default: return 0;
      }
    };

    const progress = getProjectProgress(project);
    const statusBadge = getStatusBadge(project.status);
    const priorityBadge = getPriorityBadge(project.priority);

    return (
      <div className="projects-list-item">
        <div className="projects-list-item-info">
          <div className="projects-list-item-icon">
            <span>{getProjectTypeIcon(project.type)}</span>
          </div>
          <div className="projects-list-item-details">
            <h3 className="projects-list-item-name">{project.name}</h3>
            <p className="projects-list-item-description">
              {project.description || 'Keine Beschreibung verfügbar'}
            </p>
          </div>
        </div>
        
        <div className="projects-list-item-status">
          <span className={`projects-badge ${statusBadge.class}`}>
            {statusBadge.label}
          </span>
        </div>
        
        <div className="projects-list-item-priority">
          <span className={`projects-badge ${priorityBadge.class}`}>
            {priorityBadge.icon} {priorityBadge.label}
          </span>
        </div>
        
        <div className="projects-list-item-deadline">
          <span>{formatDate(project.deadline)}</span>
        </div>
        
        <div className="projects-list-item-progress">
          <div className="projects-progress-bar">
            <div 
              className="projects-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="projects-progress-text">{progress}%</span>
        </div>
        
        <div className="projects-list-item-actions">
          <button
            className="projects-action-btn projects-action-btn--view"
            onClick={() => handleProjectAction(project.id, 'view')}
            title="Projekt anzeigen"
          >
            <HiEye />
          </button>
          {user.role === 'admin' && (
            <>
              <button
                className="projects-action-btn projects-action-btn--edit"
                onClick={() => handleProjectAction(project.id, 'edit')}
                title="Projekt bearbeiten"
              >
                <HiPencil />
              </button>
              <button
                className="projects-action-btn projects-action-btn--delete"
                onClick={() => handleProjectAction(project.id, 'delete')}
                title="Projekt löschen"
              >
                <HiTrash />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="projects-page">
      {/* Page Header */}
      <header className="projects-page-header">
        <div className="projects-header-content">
          <h1>Projekte</h1>
          <p className="projects-subtitle">
            {filteredAndSortedProjects.length} von {projects.length} Projekten
          </p>
        </div>
        
        <div className="projects-header-actions">
          {user.role === 'admin' && (
            <button className="btn btn--primary" onClick={handleCreateProject}>
              <HiPlus />
              Neues Projekt
            </button>
          )}
          <button className="btn btn--secondary">
            <HiUpload />
            Import
          </button>
          <button className="btn btn--secondary">
            <HiDownload />
            Export
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <section className="projects-filters">
        <div className="projects-search-box">
          <HiSearch className="projects-search-icon" />
          <input
            type="text"
            placeholder="Projekte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="projects-filter-select">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
          >
            <option value="all">Alle Status</option>
            <option value="planning">Planung</option>
            <option value="inProgress">In Arbeit</option>
            <option value="review">Review</option>
            <option value="completed">Abgeschlossen</option>
          </select>
        </div>

        <div className="projects-filter-select">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as ProjectPriority | 'all')}
          >
            <option value="all">Alle Prioritäten</option>
            <option value="low">Niedrig</option>
            <option value="medium">Mittel</option>
            <option value="high">Hoch</option>
          </select>
        </div>

        <div className="projects-filter-select">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ProjectType | 'all')}
          >
            <option value="all">Alle Typen</option>
            <option value="website">Website</option>
            <option value="newsletter">Newsletter</option>
            <option value="bewerbung">Bewerbung</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="custom">Individuell</option>
          </select>
        </div>

        <div className="projects-view-toggle">
          <button
            className={`projects-toggle-btn ${viewMode === 'grid' ? 'projects-toggle-btn--active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <HiViewGrid />
          </button>
          <button
            className={`projects-toggle-btn ${viewMode === 'list' ? 'projects-toggle-btn--active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <HiViewList />
          </button>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="projects-alert projects-alert--error">
          <HiExclamationTriangle />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Projects Content */}
      {filteredAndSortedProjects.length > 0 ? (
        <section className={`projects-content projects-content--${viewMode}`}>
          {viewMode === 'grid' ? (
            /* Grid View - KORRIGIERT: Verwendet ProjectCard-Komponente */
            <div className="projects-grid">
              {filteredAndSortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  userRole={user.role}
                  onProjectAction={handleProjectAction}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="projects-list">
              {filteredAndSortedProjects.map((project) => (
                <ProjectListItem
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Empty State */
        <section className="projects-empty">
          <HiFolderOpen className="projects-empty-icon" />
          <h3>Keine Projekte gefunden</h3>
          <p>
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
              ? 'Versuche andere Filtereinstellungen'
              : 'Erstelle dein erstes Projekt'
            }
          </p>
          {user.role === 'admin' && (
            <button className="projects-create-first-btn" onClick={handleCreateProject}>
              <HiPlus /> Erstes Projekt erstellen
            </button>
          )}
        </section>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="projects-loading-overlay">
          <div className="projects-spinner">
            <HiRefresh />
          </div>
        </div>
      )}

      {/* Project Detail Panel (Sidebar) */}
      {selectedProjectId && (
        <aside className={`projects-detail-panel ${selectedProjectId ? 'projects-detail-panel--open' : ''}`}>
          <header className="projects-panel-header">
            <h3 className="projects-panel-title">Projektdetails</h3>
            <button 
              className="projects-close-btn"
              onClick={() => setSelectedProjectId(null)}
            >
              ×
            </button>
          </header>
          
          <div className="projects-panel-content">
            {(() => {
              const project = projects.find(p => p.id === selectedProjectId);
              if (!project) return <p>Projekt nicht gefunden</p>;
              
              return (
                <>
                  <div className="projects-detail-section">
                    <h4>Grundinformationen</h4>
                    <div className="projects-detail-grid">
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Projektname</div>
                        <div className="projects-detail-value">{project.name}</div>
                      </div>
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Typ</div>
                        <div className="projects-detail-value">{project.type}</div>
                      </div>
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Status</div>
                        <div className="projects-detail-value">{project.status}</div>
                      </div>
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Priorität</div>
                        <div className="projects-detail-value">{project.priority}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="projects-detail-section">
                    <h4>Zeitplan</h4>
                    <div className="projects-detail-grid">
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Erstellt am</div>
                        <div className="projects-detail-value">{formatDate(project.createdAt)}</div>
                      </div>
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Deadline</div>
                        <div className="projects-detail-value">{formatDate(project.deadline)}</div>
                      </div>
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Letzte Aktualisierung</div>
                        <div className="projects-detail-value">{formatDate(project.updatedAt)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="projects-detail-section">
                    <h4>Aktivität</h4>
                    <div className="projects-detail-grid">
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Nachrichten</div>
                        <div className="projects-detail-value">{project.messagesCount}</div>
                      </div>
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Dateien</div>
                        <div className="projects-detail-value">{project.filesCount}</div>
                      </div>
                      <div className="projects-detail-item">
                        <div className="projects-detail-label">Zugewiesener Admin</div>
                        <div className="projects-detail-value">{project.assignedAdmin}</div>
                      </div>
                    </div>
                  </div>
                  
                  {project.description && (
                    <div className="projects-detail-section">
                      <h4>Beschreibung</h4>
                      <p>{project.description}</p>
                    </div>
                  )}
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="projects-detail-section">
                      <h4>Tags</h4>
                      <div className="projects-tags">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="projects-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </aside>
      )}
    </div>
  );
};

export default Projects;