// src/Pages/Dashboard/Components/DashboardProjects.tsx
import React from 'react';
import { HiPlus } from 'react-icons/hi';
import { DashboardProjectsProps } from '../Types/DashboardTypes';
import ProjectCard from './ProjectCard';

const DashboardProjects: React.FC<DashboardProjectsProps> = ({
  projects,
  userRole,
  onProjectUpdate
}) => {
  const handleProjectAction = (projectId: string, action: string) => {
    console.log(`Project ${projectId} action: ${action}`);
    // Hier später API-Calls für Projekt-Aktionen
  };

  const handleCreateProject = () => {
    console.log('Create new project');
    // Hier später Modal für neues Projekt
  };

  return (
    <div className="view-content">
      <section className="projects-full">
        <div className="section-header">
          <h2>Alle Projekte</h2>
          {userRole !== 'kunde' && (
            <button className="btn btn--primary" onClick={handleCreateProject}>
              <HiPlus className="icon icon--btn" />
              Neues Projekt
            </button>
          )}
        </div>
        
        <div className="projects-grid">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onProjectAction={handleProjectAction}
            />
          ))}
        </div>
        
        {projects.length === 0 && (
          <div className="empty-state">
            <p>Noch keine Projekte vorhanden.</p>
            {userRole !== 'kunde' && (
              <button className="btn btn--primary" onClick={handleCreateProject}>
                <HiPlus className="icon icon--btn" />
                Erstes Projekt erstellen
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardProjects;