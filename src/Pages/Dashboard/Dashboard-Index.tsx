// src/Pages/Dashboard/Dashboard-Index.tsx
// KORRIGIERT: Dashboard mit Service-Integration
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/Services/Auth-Service';
import dashboardService from '@/Services/Dashboard-Service'; // HINZUGEFÜGT: Service-Import
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
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setError(null);

      // Prüfe Authentifizierung
      const user = authService.getCurrentUser();
      if (!user) {
        console.warn('⚠️ No authenticated user found - redirecting to login');
        navigate('/');
        return;
      }

      setUserData(user);

      // KORRIGIERT: Service-Aufruf mit Fehlerbehandlung
      try {
        const dashboardData = await dashboardService.getDashboardData();

        // Daten aus Service-Response setzen
        setProjects(dashboardData.projects || []);
        setMessages(dashboardData.messages || []);
        setNotifications(dashboardData.notifications || 0);


      } catch (serviceError: any) {
        console.warn('⚠️ Service call failed, falling back to mock data:', serviceError.message);

        // FALLBACK: Mock-Daten wenn Service nicht verfügbar
        await loadMockData(user);
      }

    } catch (error: any) {
      console.error('❌ Dashboard loading error:', error);
      setError('Fehler beim Laden der Dashboard-Daten');

      // Fallback zu Mock-Daten auch bei allgemeinen Fehlern
      const user = authService.getCurrentUser();
      if (user) {
        await loadMockData(user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // BEHALTEN: Mock-Daten als Fallback
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
        content: 'Design-Mockups für die Homepage sind fertig und warten auf Ihr Feedback.',
        timestamp: '2025-08-19T10:30:00Z',
        isRead: false,
        hasAttachment: true
      },
      {
        id: '2',
        projectId: '2',
        sender: 'Max Mustermann',
        senderRole: 'kunde',
        content: 'Newsletter-Template sieht fantastisch aus! Können wir das Corporate Design noch etwas anpassen?',
        timestamp: '2025-08-19T09:15:00Z',
        isRead: true,
        hasAttachment: false
      },
      {
        id: '3',
        projectId: '1',
        sender: 'Chris Schubert',
        senderRole: 'mitarbeiter',
        content: 'Responsive Versionen für Mobile und Tablet sind jetzt verfügbar.',
        timestamp: '2025-08-18T16:45:00Z',
        isRead: true,
        hasAttachment: true
      },
      {
        id: '4',
        projectId: '3',
        sender: 'Anna Schmidt',
        senderRole: 'kunde',
        content: 'Könnten wir einen Termin für die Besprechung der Bewerbungsseite vereinbaren?',
        timestamp: '2025-08-18T14:20:00Z',
        isRead: false,
        hasAttachment: false
      }
    ];

    setProjects(mockProjects);
    setMessages(mockMessages);
    setNotifications(mockMessages.filter(m => !m.isRead).length);

  };

  // HINZUGEFÜGT: Refresh-Funktion für Service-Integration
  const handleRefreshData = async () => {
    setIsLoading(true);
    await loadDashboardData();
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

  const handleMessageRead = async (messageId: string) => {
    try {
      // ERWEITERT: Service-Aufruf für Message-Read
      await dashboardService.markMessageAsRead(messageId);

      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
      );
      setNotifications(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error('❌ Error marking message as read:', error);
      // Fallback: Lokale State-Update
      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
      );
      setNotifications(prev => Math.max(0, prev - 1));
    }
  };

  const handleUserUpdate = async (updatedUserData: Partial<User>) => {
    try {
      // ERWEITERT: Service-Aufruf für Profile-Update
      const updatedUser = await dashboardService.updateProfile(updatedUserData);
      setUserData(updatedUser);

      // Auch localStorage aktualisieren
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const newUserData = { ...currentUser, ...updatedUser };
        localStorage.setItem('userData', JSON.stringify(newUserData));
      }

    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error; // Fehler an Component weiterreichen
    }
  };

  // Loading State
  if (isLoading || !userData) {
    return (
      <div className="dashboard-professional">
        <AnimatedBackground />
        <DashboardLoading />
      </div>
    );
  }

  // Error State (HINZUGEFÜGT)
  if (error) {
    return (
      <div className="dashboard-professional">
        <AnimatedBackground />
        <div className="dashboard-error" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Dashboard-Fehler</h1>
          <p style={{ marginBottom: '2rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleRefreshData}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              🔄 Erneut versuchen
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              🚪 Abmelden
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal Dashboard View
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