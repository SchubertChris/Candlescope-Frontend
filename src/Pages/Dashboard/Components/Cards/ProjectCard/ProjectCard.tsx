// src/Pages/Dashboard/Components/Cards/ProjectCard/ProjectCard.tsx
// KORRIGIERT: Angepasst für neue Projects.tsx Integration

import React from 'react';
import { 
  HiGlobe,
  HiMail,
  HiDocument,
  HiDesktopComputer,
  HiCode,
  HiFolder,
  HiDotsVertical,
  HiUser,
  HiCalendar,
  HiChatAlt2,
  HiEye,
  HiClock,
  HiFlag
} from 'react-icons/hi';
import { Project, ProjectType } from '@/Pages/Dashboard/Types/DashboardTypes';
import './ProjectCard.scss';

interface ProjectCardProps {
  project: Project;
  userRole: 'admin' | 'kunde';
  onProjectAction: (projectId: string, action: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, userRole, onProjectAction }) => {
  const getProjectTypeConfig = (type: ProjectType) => {
    switch (type) {
      case 'website':
        return { label: 'Website', icon: HiGlobe, color: '#3b82f6' };
      case 'newsletter':
        return { label: 'Newsletter', icon: HiMail, color: '#f59e0b' };
      case 'bewerbung':
        return { label: 'Bewerbungsseite', icon: HiDocument, color: '#8b5cf6' };
      case 'ecommerce':
        return { label: 'E-Commerce', icon: HiDesktopComputer, color: '#10b981' };
      case 'custom':
        return { label: 'Custom Solution', icon: HiCode, color: '#ef4444' };
      default:
        return { label: 'Projekt', icon: HiFolder, color: 'var(--color-primary)' };
    }
  };

  const getStatusConfig = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return { label: 'Planung', color: '#fbbf24', class: 'project-card__status--planning' };
      case 'inProgress':
        return { label: 'In Bearbeitung', color: '#3b82f6', class: 'project-card__status--progress' };
      case 'review':
        return { label: 'Review', color: '#8b5cf6', class: 'project-card__status--review' };
      case 'completed':
        return { label: 'Abgeschlossen', color: '#10b981', class: 'project-card__status--completed' };
      default:
        return { label: 'Unbekannt', color: '#6b7280', class: 'project-card__status--default' };
    }
  };

  const getPriorityConfig = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return { label: 'Hoch', color: '#ef4444', class: 'project-card__priority--high' };
      case 'medium':
        return { label: 'Mittel', color: '#f59e0b', class: 'project-card__priority--medium' };
      case 'low':
        return { label: 'Niedrig', color: '#10b981', class: 'project-card__priority--low' };
      default:
        return { label: 'Normal', color: 'var(--color-primary)', class: 'project-card__priority--default' };
    }
  };

  const typeConfig = getProjectTypeConfig(project.type);
  const statusConfig = getStatusConfig(project.status);
  const priorityConfig = getPriorityConfig(project.priority);
  const TypeIcon = typeConfig.icon;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className={`project-card project-card--type-${project.type}`}>
      <div className="project-card__header">
        <div className="project-card__title-section">
          <div className="project-card__icon">
            <TypeIcon className="project-card__type-icon" />
          </div>
          <div className="project-card__title-info">
            <h3 className="project-card__name">{project.name}</h3>
            <p className="project-card__type">{typeConfig.label}</p>
          </div>
        </div>
        
        {userRole === 'admin' && (
          <button 
            className="project-card__menu-btn"
            onClick={() => onProjectAction(project.id, 'menu')}
          >
            <HiDotsVertical />
          </button>
        )}
      </div>
      
      <div className="project-card__content">
        <div className="project-card__badges">
          <span className={`project-card__status-badge ${statusConfig.class}`}>
            {statusConfig.label}
          </span>
          {userRole === 'admin' && (
            <span className={`project-card__priority-badge ${priorityConfig.class}`}>
              {priorityConfig.label}
            </span>
          )}
        </div>
        
        <div className="project-card__details">
          <div className="project-card__detail-item">
            <HiUser className="project-card__detail-icon" />
            <span className="project-card__detail-text">
              {userRole === 'admin' ? `Admin: ${project.assignedAdmin}` : 'Ihr Projektmanager'}
            </span>
          </div>
          <div className="project-card__detail-item">
            <HiCalendar className="project-card__detail-icon" />
            <span className="project-card__detail-text">{formatDate(project.deadline)}</span>
          </div>
          <div className="project-card__detail-item">
            <HiChatAlt2 className="project-card__detail-icon" />
            <span className="project-card__detail-text">{project.messagesCount} Nachrichten</span>
          </div>
          <div className="project-card__detail-item">
            <HiFolder className="project-card__detail-icon" />
            <span className="project-card__detail-text">{project.filesCount} Dateien</span>
          </div>
        </div>

        {project.description && (
          <div className="project-card__description">
            <p>{project.description}</p>
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="project-card__tags">
            {project.tags.map((tag, index) => (
              <span key={index} className="project-card__tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      
      <div className="project-card__actions">
        <button 
          className="btn btn--secondary"
          onClick={() => onProjectAction(project.id, 'view')}
        >
          <HiEye />
          <span>Details</span>
        </button>
        <button 
          className="btn btn--primary"
          onClick={() => onProjectAction(project.id, 'message')}
        >
          <HiChatAlt2 />
          <span>Nachricht</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;