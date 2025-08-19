// src/Pages/Dashboard/Components/ProjectPreviewCard.tsx
import React from 'react';
import { 
  HiGlobe,
  HiMail,
  HiDocument,
  HiDesktopComputer,
  HiCode,
  HiFolder,
  HiChatAlt2,
  HiCalendar
} from 'react-icons/hi';
import { Project, ProjectType } from '../Types/DashboardTypes';

interface ProjectPreviewCardProps {
  project: Project;
}

const ProjectPreviewCard: React.FC<ProjectPreviewCardProps> = ({ project }) => {
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

  const typeConfig = getProjectTypeConfig(project.type);
  const statusConfig = getStatusConfig(project.status);
  const TypeIcon = typeConfig.icon;

  return (
    <div className="project-preview-card">
      <div className="project-header">
        <div className="project-icon">
          <TypeIcon className="icon icon--project-type" />
        </div>
        <div className="project-info">
          <h3>{project.name}</h3>
          <p className="project-type">{typeConfig.label}</p>
        </div>
        <div className="project-status">
          <span 
            className="status-badge"
            style={{ color: statusConfig.color, borderColor: statusConfig.color }}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>
      
      <div className="project-progress">
        <div className="progress-info">
          <span>Fortschritt</span>
          <span>{project.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      
      <div className="project-meta">
        <div className="meta-item">
          <HiChatAlt2 className="icon icon--meta" />
          <span>{project.messagesCount} Nachrichten</span>
        </div>
        <div className="meta-item">
          <HiFolder className="icon icon--meta" />
          <span>{project.filesCount} Dateien</span>
        </div>
        <div className="meta-item">
          <HiCalendar className="icon icon--meta" />
          <span>{new Date(project.deadline).toLocaleDateString('de-DE')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreviewCard;