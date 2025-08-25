// src/Pages/Dashboard/Components/ProjectCard.tsx
// ANGEPASST: Ohne Progress, Admin/Kunde System
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
  HiEye
} from 'react-icons/hi';
import { Project, ProjectType } from '@/Pages/Dashboard/Types/DashboardTypes';

interface ProjectCardProps {
  project: Project;
  userRole: 'admin' | 'kunde';
  onProjectAction: (projectId: string, action: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, userRole, onProjectAction }) => {
  const getProjectTypeConfig = (type: ProjectType) => {
    switch (type) {
      case 'website':
        return { label: 'Website', icon: HiGlobe, color: 'var(--color-primary)' };
      case 'newsletter':
        return { label: 'Newsletter', icon: HiMail, color: 'var(--color-success)' };
      case 'bewerbung':
        return { label: 'Bewerbungsseite', icon: HiDocument, color: 'var(--color-warning)' };
      case 'ecommerce':
        return { label: 'E-Commerce', icon: HiDesktopComputer, color: 'var(--color-primary)' };
      case 'custom':
        return { label: 'Custom Solution', icon: HiCode, color: 'var(--color-primary)' };
      default:
        return { label: 'Projekt', icon: HiFolder, color: 'var(--color-primary)' };
    }
  };

  const getStatusConfig = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return { label: 'Planung', color: 'var(--color-warning)' };
      case 'inProgress':
        return { label: 'In Bearbeitung', color: 'var(--color-primary)' };
      case 'review':
        return { label: 'Review', color: 'var(--color-warning)' };
      case 'completed':
        return { label: 'Abgeschlossen', color: 'var(--color-success)' };
      default:
        return { label: 'Unbekannt', color: '#6b7280' };
    }
  };

  const getPriorityConfig = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return { label: 'Hoch', color: 'var(--color-error)' };
      case 'medium':
        return { label: 'Mittel', color: 'var(--color-warning)' };
      case 'low':
        return { label: 'Niedrig', color: 'var(--color-success)' };
      default:
        return { label: 'Normal', color: 'var(--color-primary)' };
    }
  };

  const typeConfig = getProjectTypeConfig(project.type);
  const statusConfig = getStatusConfig(project.status);
  const priorityConfig = getPriorityConfig(project.priority);
  const TypeIcon = typeConfig.icon;

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-title-section">
          <div className="project-icon">
            <TypeIcon className="icon icon--project-type" />
          </div>
          <div className="project-title-info">
            <h3>{project.name}</h3>
            <p>{typeConfig.label}</p>
          </div>
        </div>
        {/* Nur Admin sieht Menu */}
        {userRole === 'admin' && (
          <button 
            className="project-menu-btn"
            onClick={() => onProjectAction(project.id, 'menu')}
          >
            <HiDotsVertical className="icon icon--menu" />
          </button>
        )}
      </div>
      
      <div className="project-card-content">
        <div className="project-badges">
          <span 
            className="status-badge"
            style={{ color: statusConfig.color, borderColor: statusConfig.color }}
          >
            {statusConfig.label}
          </span>
          {/* Nur Admin sieht Priorität */}
          {userRole === 'admin' && (
            <span 
              className="priority-badge"
              style={{ color: priorityConfig.color, borderColor: priorityConfig.color }}
            >
              {priorityConfig.label}
            </span>
          )}
        </div>
        
        {/* ENTFERNT: Progress Bar komplett */}
        
        <div className="project-details">
          {/* Admin sieht zugewiesenen Admin, Kunde sieht "Ihr Projektmanager" */}
          <div className="detail-item">
            <HiUser className="icon icon--detail" />
            <span>
              {userRole === 'admin' ? `Admin: ${project.assignedAdmin}` : 'Ihr Projektmanager'}
            </span>
          </div>
          <div className="detail-item">
            <HiCalendar className="icon icon--detail" />
            <span>{new Date(project.deadline).toLocaleDateString('de-DE')}</span>
          </div>
          <div className="detail-item">
            <HiChatAlt2 className="icon icon--detail" />
            <span>{project.messagesCount} Nachrichten</span>
          </div>
          <div className="detail-item">
            <HiFolder className="icon icon--detail" />
            <span>{project.filesCount} Dateien</span>
          </div>
        </div>

        {/* Projekt-Beschreibung */}
        {project.description && (
          <div className="project-description">
            <p>{project.description}</p>
          </div>
        )}
      </div>
      
      <div className="project-card-actions">
        <button 
          className="btn btn--secondary"
          onClick={() => onProjectAction(project.id, 'view')}
        >
          <HiEye className="icon icon--btn" />
          Details
        </button>
        <button 
          className="btn btn--primary"
          onClick={() => onProjectAction(project.id, 'message')}
        >
          <HiChatAlt2 className="icon icon--btn" />
          Nachricht
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;