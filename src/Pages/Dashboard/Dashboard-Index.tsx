// src/Pages/Dashboard/Dashboard-Index.tsx
// MAIN DASHBOARD - Komponenten-basierte Struktur
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/Services/Auth-Service';
import AnimatedBackground from '@/Components/Ui/AnimatedBackground';

// Dashboard Components
import DashboardHeader from './Components/DashboardHeader';
import DashboardNavigation from './Components/DashboardNavigation';
import DashboardOverview from './Components/DashboardOverview';
import DashboardProjects from './Components/DashboardProjects';
import DashboardMessages from './Components/DashboardMessages';
import DashboardProfile from './Components/DashboardProfile';
import DashboardLoading from './Components/DashboardLoading';

// Types
import { User, Project, Message, DashboardView } from './Types/DashboardTypes';

import './Dashboard-Index.scss';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        navigate('/');
        return;
      }
      
      setUserData(user);
      
      // Load data from backend services (später implementiert)
      // const projectsData = await projectService.getProjects();
      // const messagesData = await messageService.getMessages();
      
      // Für jetzt: Mock-Daten laden
      await loadMockData(user);
      
    } catch (error) {
      console.error('Fehler beim Laden der Dashboard-Daten:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock-Daten (später durch echte Services ersetzen)
  const loadMockData = async (user: User) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock Projects
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Corporate Website Redesign',
        type: 'website',
        status: 'inProgress',
        assignedEmployee: 'Chris Schubert',
        deadline: '2025-09-15',
        createdAt: '2025-08-01',
        messagesCount: 12,
        filesCount: 8,
        progress: 65,
        priority: 'high',
        description: 'Komplettes Redesign der Firmenwebsite mit modernem Design'
      },
      {
        id: '2',
        name: 'Newsletter System Setup',
        type: 'newsletter',
        status: 'review',
        assignedEmployee: 'Chris Schubert',
        deadline: '2025-08-30',
        createdAt: '2025-08-10',
        messagesCount: 5,
        filesCount: 3,
        progress: 90,
        priority: 'medium',
        description: 'Automatisiertes Newsletter-System mit Template-Verwaltung'
      },
      {
        id: '3',
        name: 'Executive Job Application Page',
        type: 'bewerbung',
        status: 'planning',
        assignedEmployee: 'Chris Schubert',
        deadline: '2025-10-01',
        createdAt: '2025-08-18',
        messagesCount: 2,
        filesCount: 1,
        progress: 15,
        priority: 'medium',
        description: 'Professionelle Bewerbungsseite für Führungskräfte'
      },
      {
        id: '4',
        name: 'E-Commerce Platform',
        type: 'ecommerce',
        status: 'completed',
        assignedEmployee: 'Chris Schubert',
        deadline: '2025-08-15',
        createdAt: '2025-07-01',
        messagesCount: 28,
        filesCount: 15,
        progress: 100,
        priority: 'high',
        description: 'Vollständige E-Commerce-Lösung mit Payment-Integration'
      }
    ];

    // Mock Messages
    const mockMessages: Message[] = [
      {
        id: '1',
        projectId: '1',
        sender: 'Chris Schubert',
        senderRole: 'mitarbeiter',
        content: 'Design-Mockups für die Homepage sind fertig und warten auf Ihr Feedback. Die neuen Layouts berücksichtigen alle Ihre Wünsche bezüglich der Benutzerführung.',
        timestamp: '2025-08-19T10:30:00Z',
        isRead: false,
        hasAttachment: true
      },
      {
        id: '2',
        projectId: '2',
        sender: 'Max Mustermann',
        senderRole: 'kunde',
        content: 'Newsletter-Template sieht fantastisch aus! Können wir das Corporate Design noch etwas anpassen? Besonders die Farbgebung sollte mehr zu unserer Marke passen.',
        timestamp: '2025-08-19T09:15:00Z',
        isRead: true,
        hasAttachment: false
      },
      {
        id: '3',
        projectId: '1',
        sender: 'Chris Schubert',
        senderRole: 'mitarbeiter',
        content: 'Responsive Versionen für Mobile und Tablet sind jetzt verfügbar. Alle Breakpoints wurden getestet und optimiert.',
        timestamp: '2025-08-18T16:45:00Z',
        isRead: true,
        hasAttachment: true
      },
      {
        id: '4',
        projectId: '3',
        sender: 'Anna Schmidt',
        senderRole: 'kunde',
        content: 'Könnten wir einen Termin für die Besprechung der Bewerbungsseite vereinbaren? Ich hätte gerne noch einige Details besprochen.',
        timestamp: '2025-08-18T14:20:00Z',
        isRead: false,
        hasAttachment: false
      }
    ];

    setProjects(mockProjects);
    setMessages(mockMessages);
    setNotifications(mockMessages.filter(m => !m.isRead).length);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const handleViewChange = (view: DashboardView) => {
    setActiveView(view);
  };

  const handleProjectUpdate = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
  };

  const handleMessageRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
    );
    setNotifications(prev => Math.max(0, prev - 1));
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUserData(updatedUser);
  };

  if (isLoading || !userData) {
    return (
      <div className="dashboard-professional">
        <AnimatedBackground />
        <DashboardLoading />
      </div>
    );
  }

  return (
    <div className="dashboard-professional">
      <AnimatedBackground />
      
      <DashboardHeader 
        user={userData}
        notifications={notifications}
        onLogout={handleLogout}
      />
      
      <DashboardNavigation 
        activeView={activeView}
        notifications={notifications}
        onViewChange={handleViewChange}
      />
      
      <main className="dashboard-professional__main">
        <div className="main-container">
          {activeView === 'overview' && (
            <DashboardOverview 
              projects={projects}
              messages={messages}
              notifications={notifications}
              onViewChange={handleViewChange}
            />
          )}
          
          {activeView === 'projects' && (
            <DashboardProjects 
              projects={projects}
              userRole={userData.role}
              onProjectUpdate={handleProjectUpdate}
            />
          )}
          
          {activeView === 'messages' && (
            <DashboardMessages 
              messages={messages}
              projects={projects}
              onMessageRead={handleMessageRead}
            />
          )}
          
          {activeView === 'profile' && (
            <DashboardProfile 
              user={userData}
              onLogout={handleLogout}
              onUserUpdate={handleUserUpdate}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;