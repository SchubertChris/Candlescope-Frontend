// src/Pages/Dashboard/Projects/Projects.tsx
// Dashboard Projects - Vollständige Projekt-Verwaltung mit Grid/List View

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
  HiExclamationTriangle,
  HiCheckCircle,
  HiRefresh
} from 'react-icons/hi';
import { useDashboard } from '../Context/DashboardContext';
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

  // Project Actions
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
        case 'archive':
          await onProjectUpdate({ ...project, isActive: false });
          break;
        case 'activate':
          await onProjectUpdate({ ...project, isActive: true });
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
      
      // Datum-Felder als Date-Objekte behandeln
      if (sortField === 'deadline' || sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // String-Vergleich
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [projects, searchQuery, statusFilter, priorityFilter, typeFilter, sortField, sortOrder]);

  // Status Badge Styling
  const getStatusBadge = (status: ProjectStatus) => {
    const styles = {
      planning: { class: 'status-planning', label: 'Planung' },
      inProgress: { class: 'status-progress', label: 'In Arbeit' },
      review: { class: 'status-review', label: 'Review' },
      completed: { class: 'status-completed', label: 'Abgeschlossen' }
    };
    return styles[status] || { class: 'status-default', label: status };
  };

  // Priority Badge Styling
  const getPriorityBadge = (priority: ProjectPriority) => {
    const styles = {
      low: { class: 'priority-low', label: 'Niedrig', icon: '🟢' },
      medium: { class: 'priority-medium', label: 'Mittel', icon: '🟡' },
      high: { class: 'priority-high', label: 'Hoch', icon: '🔴' }
    };
    return styles[priority] || { class: 'priority-default', label: priority, icon: '⚪' };
  };

  // Project Type Icon
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

  // Progress Calculation (Mock)
  const getProjectProgress = (project: Project): number => {
    switch (project.status) {
      case 'planning': return 15;
      case 'inProgress': return 60;
      case 'review': return 85;
      case 'completed': return 100;
      default: return 0;
    }
  };

  // Deadline Status
  const getDeadlineStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return { class: 'deadline-overdue', label: 'Überfällig' };
    if (diffDays <= 3) return { class: 'deadline-urgent', label: 'Dringend' };
    if (diffDays <= 7) return { class: 'deadline-soon', label: 'Bald fällig' };
    return { class: 'deadline-normal', label: 'Normal' };
  };

  // Format Date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="projects-page">
      {/* Page Header */}
      <header className="projects-header">
        <div className="header-content">
          <h1>Projekte</h1>
          <p className="subtitle">
            {filteredAndSortedProjects.length} von {projects.length} Projekten
          </p>
        </div>
        
        <div className="header-actions">
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
        {/* Search Box */}
        <div className="search-box">
          <HiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Projekte durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Selects */}
        <div className="filter-select">
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

        <div className="filter-select">
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

        <div className="filter-select">
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

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <HiViewGrid />
          </button>
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <HiViewList />
          </button>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="alert alert--error">
          <HiExclamationTriangle />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Projects Content */}
      {filteredAndSortedProjects.length > 0 ? (
        <section className={`projects-content ${viewMode}-view`}>
          {viewMode === 'grid' ? (
            <div className="projects-grid">
              {filteredAndSortedProjects.map((project) => {
                const progress = getProjectProgress(project);
                const statusBadge = getStatusBadge(project.status);
                const priorityBadge = getPriorityBadge(project.priority);
                const deadlineStatus = getDeadlineStatus(project.deadline);
                
                return (
                  <article key={project.id} className="project-card">
                    <header className="card-header">
                      <div className="project-title-section">
                        <div className="project-type-icon">
                          <span>{getProjectTypeIcon(project.type)}</span>
                        </div>
                        <div className="title-info">
                          <h3>{project.name}</h3>
                          <span className="project-type">{project.type}</span>
                        </div>
                      </div>
                      
                      <div className="project-menu">
                        <button className="menu-btn">
                          <HiDotsVertical />
                        </button>
                      </div>
                    </header>

                    <div className="card-content">
                      {project.description && (
                        <p className="project-description">{project.description}</p>
                      )}

                      <div className="project-badges">
                        <span className={`badge ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                        <span className={`badge ${priorityBadge.class}`}>
                          {priorityBadge.icon} {priorityBadge.label}
                        </span>
                        <span className={`badge ${deadlineStatus.class}`}>
                          {deadlineStatus.label}
                        </span>
                      </div>

                      <div className="project-progress">
                        <div className="progress-header">
                          <span className="progress-label">Fortschritt</span>
                          <span className="progress-value">{progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="project-meta">
                        <div className="meta-item">
                          <HiCalendar className="meta-icon" />
                          <span>{formatDate(project.deadline)}</span>
                        </div>
                        <div className="meta-item">
                          <HiUser className="meta-icon" />
                          <span>{project.assignedAdmin}</span>
                        </div>
                        <div className="meta-item">
                          <HiClock className="meta-icon" />
                          <span>{formatDate(project.createdAt)}</span>
                        </div>
                        <div className="meta-item">
                          <HiFlag className="meta-icon" />
                          <span>{project.messagesCount} Nachr.</span>
                        </div>
                      </div>
                    </div>

                    <footer className="card-actions">
                      <button
                        className="action-btn"
                        onClick={() => handleProjectAction(project.id, 'view')}
                      >
                        <HiEye /> Anzeigen
                      </button>
                      {user.role === 'admin' && (
                        <button
                          className="action-btn primary"
                          onClick={() => handleProjectAction(project.id, 'edit')}
                        >
                          <HiPencil /> Bearbeiten
                        </button>
                      )}
                    </footer>
                  </article>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="projects-list">
              {filteredAndSortedProjects.map((project) => {
                const progress = getProjectProgress(project);
                const statusBadge = getStatusBadge(project.status);
                const priorityBadge = getPriorityBadge(project.priority);
                
                return (
                  <div key={project.id} className="project-row">
                    <div className="project-info">
                      <div className="project-icon">
                        <span>{getProjectTypeIcon(project.type)}</span>
                      </div>
                      <div className="project-details">
                        <h3 className="project-name">{project.name}</h3>
                        <p className="project-description">
                          {project.description || 'Keine Beschreibung verfügbar'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="project-status-col">
                      <span className={`badge ${statusBadge.class}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    
                    <div className="project-priority-col">
                      <span className={`badge ${priorityBadge.class}`}>
                        {priorityBadge.icon} {priorityBadge.label}
                      </span>
                    </div>
                    
                    <div className="project-deadline-col">
                      <span>{formatDate(project.deadline)}</span>
                    </div>
                    
                    <div className="project-progress-col">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{progress}%</span>
                    </div>
                    
                    <div className="project-actions">
                      <button
                        className="action-btn view"
                        onClick={() => handleProjectAction(project.id, 'view')}
                        title="Projekt anzeigen"
                      >
                        <HiEye />
                      </button>
                      {user.role === 'admin' && (
                        <>
                          <button
                            className="action-btn edit"
                            onClick={() => handleProjectAction(project.id, 'edit')}
                            title="Projekt bearbeiten"
                          >
                            <HiPencil />
                          </button>
                          <button
                            className="action-btn delete"
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
              })}
            </div>
          )}
        </section>
      ) : (
        /* Empty State */
        <section className="projects-empty">
          <HiFolderOpen className="empty-icon" />
          <h3>Keine Projekte gefunden</h3>
          <p>
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
              ? 'Versuche andere Filtereinstellungen'
              : 'Erstelle dein erstes Projekt'
            }
          </p>
          {user.role === 'admin' && (
            <button className="create-first-btn" onClick={handleCreateProject}>
              <HiPlus /> Erstes Projekt erstellen
            </button>
          )}
        </section>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner">
            <HiRefresh />
          </div>
        </div>
      )}

      {/* Project Detail Panel (Sidebar) */}
      {selectedProjectId && (
        <aside className={`project-detail-panel ${selectedProjectId ? 'open' : ''}`}>
          <header className="panel-header">
            <h3 className="panel-title">Projektdetails</h3>
            <button 
              className="close-btn"
              onClick={() => setSelectedProjectId(null)}
            >
              ×
            </button>
          </header>
          
          <div className="panel-content">
            {(() => {
              const project = projects.find(p => p.id === selectedProjectId);
              if (!project) return <p>Projekt nicht gefunden</p>;
              
              return (
                <>
                  <div className="detail-section">
                    <h4>Grundinformationen</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="label">Projektname</div>
                        <div className="value">{project.name}</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Typ</div>
                        <div className="value">{project.type}</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Status</div>
                        <div className="value">{project.status}</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Priorität</div>
                        <div className="value">{project.priority}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Zeitplan</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="label">Erstellt am</div>
                        <div className="value">{formatDate(project.createdAt)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Deadline</div>
                        <div className="value">{formatDate(project.deadline)}</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Letzte Aktualisierung</div>
                        <div className="value">{formatDate(project.updatedAt)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Aktivität</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="label">Nachrichten</div>
                        <div className="value">{project.messagesCount}</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Dateien</div>
                        <div className="value">{project.filesCount}</div>
                      </div>
                      <div className="detail-item">
                        <div className="label">Zugewiesener Admin</div>
                        <div className="value">{project.assignedAdmin}</div>
                      </div>
                    </div>
                  </div>
                  
                  {project.description && (
                    <div className="detail-section">
                      <h4>Beschreibung</h4>
                      <p>{project.description}</p>
                    </div>
                  )}
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="detail-section">
                      <h4>Tags</h4>
                      <div className="project-tags">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
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