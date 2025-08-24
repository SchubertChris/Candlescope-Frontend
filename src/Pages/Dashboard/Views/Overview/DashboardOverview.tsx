// src/Pages/Dashboard/Components/DashboardOverview.tsx
import React from 'react';
import { 
  HiBriefcase,
  HiChatAlt2,
  HiFolder,
  HiCalendar,
  HiChevronRight,
  HiCloudUpload,
  HiDownload,
  HiCog
} from 'react-icons/hi';
import { DashboardOverviewProps } from '../../Types/DashboardTypes';
import StatsSection from '../../Components/Common/StatsSection/StatsSection';
import ProjectPreviewCard from '../../Components/Cards/ProjectPreviewCard/ProjectPreviewCard';

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  projects,
  messages,
  notifications,
  onViewChange
}) => {
  const activeProjects = projects.filter(p => p.status !== 'completed');
  const totalFiles = projects.reduce((acc, p) => acc + p.filesCount, 0);
  const upcomingDeadlines = projects.filter(p => p.status !== 'completed').length;

  const stats = [
    {
      icon: HiBriefcase,
      title: 'Aktive Projekte',
      value: activeProjects.length,
      label: `von ${projects.length} Gesamt`
    },
    {
      icon: HiChatAlt2,
      title: 'Ungelesene Nachrichten',
      value: notifications,
      label: 'neue Mitteilungen'
    },
    {
      icon: HiFolder,
      title: 'Projektdateien',
      value: totalFiles,
      label: 'Dateien verfügbar'
    },
    {
      icon: HiCalendar,
      title: 'Anstehende Deadlines',
      value: upcomingDeadlines,
      label: 'in den nächsten 30 Tagen'
    }
  ];

  const quickActions = [
    {
      icon: HiCloudUpload,
      title: 'Datei hochladen',
      description: 'Dokumente und Assets zu Projekten hinzufügen'
    },
    {
      icon: HiChatAlt2,
      title: 'Neue Nachricht',
      description: 'Direkten Kontakt zum Projektteam aufnehmen'
    },
    {
      icon: HiDownload,
      title: 'Downloads',
      description: 'Fertige Deliverables und Projektdateien'
    },
    {
      icon: HiCog,
      title: 'Einstellungen',
      description: 'Profil und Benachrichtigungen verwalten'
    }
  ];

  return (
    <div className="view-content">
      {/* Statistics Section */}
      <StatsSection stats={stats} />

      {/* Recent Projects */}
      <section className="recent-projects">
        <div className="section-header">
          <h2>Aktuelle Projekte</h2>
          <button 
            onClick={() => onViewChange('projects')} 
            className="btn btn--secondary"
          >
            Alle anzeigen
            <HiChevronRight className="icon icon--btn" />
          </button>
        </div>
        
        <div className="projects-preview">
          {projects.slice(0, 3).map(project => (
            <ProjectPreviewCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="section-header">
          <h2>Schnellzugriff</h2>
        </div>
        
        <div className="actions-grid">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            
            return (
              <button key={index} className="action-card">
                <IconComponent className="icon icon--action-card" />
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;