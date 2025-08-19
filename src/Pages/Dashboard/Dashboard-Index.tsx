// src/Pages/Dashboard/Dashboard-Index.tsx
// KORRIGIERT: Alle TypeScript-Fehler behoben
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/Services/Auth-Service';
import dashboardService from '@/Services/Dashboard-Service';
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

      try {
        const dashboardData = await dashboardService.getDashboardData();
        setProjects(dashboardData.projects || []);
        setMessages(dashboardData.messages || []);
        setNotifications(dashboardData.notifications || 0);
      } catch (serviceError: any) {
        console.warn('⚠️ Service call failed, falling back to mock data:', serviceError.message);
        await loadMockData(user);
      }

    } catch (error: any) {
      console.error('❌ Dashboard loading error:', error);
      setError('Fehler beim Laden der Dashboard-Daten');

      const user = authService.getCurrentUser();
      if (user) {
        await loadMockData(user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // KORRIGIERT: Mock-Daten entsprechend DashboardTypes
  const loadMockData = async (user: User) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Corporate Website Redesign',
        type: 'website',
        status: 'inProgress',
        assignedAdmin: 'Chris Schubert', // KORRIGIERT: assignedAdmin statt assignedEmployee
        customerId: 'customer1', // HINZUGEFÜGT: Erforderliche Property
        deadline: '2025-09-15',
        createdAt: '2025-08-01',
        updatedAt: '2025-08-19', // HINZUGEFÜGT: Erforderliche Property
        messagesCount: 12,
        filesCount: 8,
        // ENTFERNT: progress (existiert nicht in DashboardTypes)
        priority: 'high',
        description: 'Komplettes Redesign der Firmenwebsite mit modernem Design',
        isActive: true // HINZUGEFÜGT: Erforderliche Property
      },
      {
        id: '2',
        name: 'Newsletter System Setup',
        type: 'newsletter',
        status: 'review',
        assignedAdmin: 'Chris Schubert', // KORRIGIERT: assignedAdmin statt assignedEmployee
        customerId: 'customer2', // HINZUGEFÜGT: Erforderliche Property
        deadline: '2025-08-30',
        createdAt: '2025-08-10',
        updatedAt: '2025-08-19', // HINZUGEFÜGT: Erforderliche Property
        messagesCount: 5,
        filesCount: 3,
        // ENTFERNT: progress (existiert nicht in DashboardTypes)
        priority: 'medium',
        description: 'Automatisiertes Newsletter-System mit Template-Verwaltung',
        isActive: true // HINZUGEFÜGT: Erforderliche Property
      },
      {
        id: '3',
        name: 'Executive Job Application Page',
        type: 'bewerbung',
        status: 'planning',
        assignedAdmin: 'Chris Schubert', // KORRIGIERT: assignedAdmin statt assignedEmployee
        customerId: 'customer3', // HINZUGEFÜGT: Erforderliche Property
        deadline: '2025-10-01',
        createdAt: '2025-08-18',
        updatedAt: '2025-08-19', // HINZUGEFÜGT: Erforderliche Property
        messagesCount: 2,
        filesCount: 1,
        // ENTFERNT: progress (existiert nicht in DashboardTypes)
        priority: 'medium',
        description: 'Professionelle Bewerbungsseite für Führungskräfte',
        isActive: true // HINZUGEFÜGT: Erforderliche Property
      },
      {
        id: '4',
        name: 'E-Commerce Platform',
        type: 'ecommerce',
        status: 'completed',
        assignedAdmin: 'Chris Schubert', // KORRIGIERT: assignedAdmin statt assignedEmployee
        customerId: 'customer4', // HINZUGEFÜGT: Erforderliche Property
        deadline: '2025-08-15',
        createdAt: '2025-07-01',
        updatedAt: '2025-08-15', // HINZUGEFÜGT: Erforderliche Property
        messagesCount: 28,
        filesCount: 15,
        // ENTFERNT: progress (existiert nicht in DashboardTypes)
        priority: 'high',
        description: 'Vollständige E-Commerce-Lösung mit Payment-Integration',
        isActive: false // HINZUGEFÜGT: Erforderliche Property (completed = nicht aktiv)
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        projectId: '1',
        senderId: 'admin1', // KORRIGIERT: senderId statt sender
        senderRole: 'admin', // KORRIGIERT: admin statt mitarbeiter
        senderName: 'Chris Schubert', // HINZUGEFÜGT: Erforderliche Property
        content: 'Design-Mockups für die Homepage sind fertig und warten auf Ihr Feedback.',
        timestamp: '2025-08-19T10:30:00Z',
        isRead: false,
        hasAttachment: true,
        customerId: 'customer1' // HINZUGEFÜGT: Erforderliche Property
      },
      {
        id: '2',
        projectId: '2',
        senderId: 'customer2', // KORRIGIERT: senderId statt sender
        senderRole: 'kunde', // KORRIGIERT: kunde bleibt kunde
        senderName: 'Max Mustermann', // HINZUGEFÜGT: Erforderliche Property
        content: 'Newsletter-Template sieht fantastisch aus! Können wir das Corporate Design noch etwas anpassen?',
        timestamp: '2025-08-19T09:15:00Z',
        isRead: true,
        hasAttachment: false,
        customerId: 'customer2' // HINZUGEFÜGT: Erforderliche Property
      },
      {
        id: '3',
        projectId: '1',
        senderId: 'admin1', // KORRIGIERT: senderId statt sender
        senderRole: 'admin', // KORRIGIERT: admin statt mitarbeiter
        senderName: 'Chris Schubert', // HINZUGEFÜGT: Erforderliche Property
        content: 'Responsive Versionen für Mobile und Tablet sind jetzt verfügbar.',
        timestamp: '2025-08-18T16:45:00Z',
        isRead: true,
        hasAttachment: true,
        customerId: 'customer1' // HINZUGEFÜGT: Erforderliche Property
      },
      {
        id: '4',
        projectId: '3',
        senderId: 'customer3', // KORRIGIERT: senderId statt sender
        senderRole: 'kunde', // KORRIGIERT: kunde bleibt kunde
        senderName: 'Anna Schmidt', // HINZUGEFÜGT: Erforderliche Property
        content: 'Könnten wir einen Termin für die Besprechung der Bewerbungsseite vereinbaren?',
        timestamp: '2025-08-18T14:20:00Z',
        isRead: false,
        hasAttachment: false,
        customerId: 'customer3' // HINZUGEFÜGT: Erforderliche Property
      }
    ];

    setProjects(mockProjects);
    setMessages(mockMessages);
    setNotifications(mockMessages.filter(m => !m.isRead).length);
  };

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
      await dashboardService.markMessageAsRead(messageId);
      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
      );
      setNotifications(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('❌ Error marking message as read:', error);
      setMessages(prev =>
        prev.map(m => m.id === messageId ? { ...m, isRead: true } : m)
      );
      setNotifications(prev => Math.max(0, prev - 1));
    }
  };

  // HINZUGEFÜGT: Fehlende onSendMessage Funktion für DashboardMessages
  const handleSendMessage = async (projectId: string, content: string) => {
    try {
      // Backend-Call hier später implementieren
      console.log('Send message:', { projectId, content });
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  const handleUserUpdate = async (updatedUserData: Partial<User>) => {
    try {
      const updatedUser = await dashboardService.updateProfile(updatedUserData);
      setUserData(updatedUser);

      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const newUserData = { ...currentUser, ...updatedUser };
        localStorage.setItem('userData', JSON.stringify(newUserData));
      }
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  };

  if (isLoading || !userData) {
    return (
      <div className="dashboard-professional">
        <AnimatedBackground />
        <DashboardLoading />
      </div>
    );
  }

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
            <button onClick={handleRefreshData}>🔄 Erneut versuchen</button>
            <button onClick={handleLogout}>🚪 Abmelden</button>
          </div>
        </div>
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
              onSendMessage={handleSendMessage}
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