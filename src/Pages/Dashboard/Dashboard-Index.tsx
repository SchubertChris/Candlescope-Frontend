// src/Pages/Dashboard/Dashboard-Index.tsx
// KORRIGIERT: Newsletter-Integration vollständig hinzugefügt
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
// HINZUGEFÜGT: Newsletter-Import
import DashboardNewsletter from './Components/DashboardNewsletter';

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

  // HINZUGEFÜGT: Helper-Funktion für User-Vollständigkeit
  const ensureCompleteUser = (partialUser: any): User => {
    return {
      id: partialUser.id,
      email: partialUser.email,
      role: partialUser.role || 'kunde', // KORRIGIERT: Default role
      firstName: partialUser.firstName || partialUser.name?.split(' ')[0],
      lastName: partialUser.lastName || partialUser.name?.split(' ')[1],
      company: partialUser.company,
      avatar: partialUser.avatar,
      createdAt: partialUser.createdAt || new Date().toISOString(), // KORRIGIERT: Default createdAt
      lastLogin: partialUser.lastLogin,
      assignedAdmin: partialUser.assignedAdmin
    };
  };

  const loadDashboardData = async () => {
    try {
      setError(null);

      // Prüfe Authentifizierung
      const rawUser = authService.getCurrentUser();
      if (!rawUser) {
        console.warn('⚠️ No authenticated user found - redirecting to login');
        navigate('/');
        return;
      }

      // KORRIGIERT: User-Objekt vollständig machen (Zeile 50)
      const completeUser = ensureCompleteUser(rawUser);
      setUserData(completeUser);

      try {
        const dashboardData = await dashboardService.getDashboardData();
        setProjects(dashboardData.projects || []);
        setMessages(dashboardData.messages || []);
        setNotifications(dashboardData.notifications || 0);
      } catch (serviceError: any) {
        console.warn('⚠️ Service call failed, falling back to mock data:', serviceError.message);
        // KORRIGIERT: Vollständigen User an loadMockData übergeben (Zeile 59)
        await loadMockData(completeUser);
      }

    } catch (error: any) {
      console.error('❌ Dashboard loading error:', error);
      setError('Fehler beim Laden der Dashboard-Daten');

      const rawUser = authService.getCurrentUser();
      if (rawUser) {
        // KORRIGIERT: Vollständigen User an loadMockData übergeben (Zeile 68)
        const completeUser = ensureCompleteUser(rawUser);
        await loadMockData(completeUser);
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
        assignedAdmin: 'Chris Schubert',
        customerId: 'customer1',
        deadline: '2025-09-15',
        createdAt: '2025-08-01',
        updatedAt: '2025-08-19',
        messagesCount: 12,
        filesCount: 8,
        priority: 'high',
        description: 'Komplettes Redesign der Firmenwebsite mit modernem Design',
        isActive: true
      },
      {
        id: '2',
        name: 'Newsletter System Setup',
        type: 'newsletter',
        status: 'review',
        assignedAdmin: 'Chris Schubert',
        customerId: 'customer2',
        deadline: '2025-08-30',
        createdAt: '2025-08-10',
        updatedAt: '2025-08-19',
        messagesCount: 5,
        filesCount: 3,
        priority: 'medium',
        description: 'Automatisiertes Newsletter-System mit Template-Verwaltung',
        isActive: true
      },
      {
        id: '3',
        name: 'Executive Job Application Page',
        type: 'bewerbung',
        status: 'planning',
        assignedAdmin: 'Chris Schubert',
        customerId: 'customer3',
        deadline: '2025-10-01',
        createdAt: '2025-08-18',
        updatedAt: '2025-08-19',
        messagesCount: 2,
        filesCount: 1,
        priority: 'medium',
        description: 'Professionelle Bewerbungsseite für Führungskräfte',
        isActive: true
      },
      {
        id: '4',
        name: 'E-Commerce Platform',
        type: 'ecommerce',
        status: 'completed',
        assignedAdmin: 'Chris Schubert',
        customerId: 'customer4',
        deadline: '2025-08-15',
        createdAt: '2025-07-01',
        updatedAt: '2025-08-15',
        messagesCount: 28,
        filesCount: 15,
        priority: 'high',
        description: 'Vollständige E-Commerce-Lösung mit Payment-Integration',
        isActive: false
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        projectId: '1',
        senderId: 'admin1',
        senderRole: 'admin',
        senderName: 'Chris Schubert',
        content: 'Design-Mockups für die Homepage sind fertig und warten auf Ihr Feedback.',
        timestamp: '2025-08-19T10:30:00Z',
        isRead: false,
        hasAttachment: true,
        customerId: 'customer1'
      },
      {
        id: '2',
        projectId: '2',
        senderId: 'customer2',
        senderRole: 'kunde',
        senderName: 'Max Mustermann',
        content: 'Newsletter-Template sieht fantastisch aus! Können wir das Corporate Design noch etwas anpassen?',
        timestamp: '2025-08-19T09:15:00Z',
        isRead: true,
        hasAttachment: false,
        customerId: 'customer2'
      },
      {
        id: '3',
        projectId: '1',
        senderId: 'admin1',
        senderRole: 'admin',
        senderName: 'Chris Schubert',
        content: 'Responsive Versionen für Mobile und Tablet sind jetzt verfügbar.',
        timestamp: '2025-08-18T16:45:00Z',
        isRead: true,
        hasAttachment: true,
        customerId: 'customer1'
      },
      {
        id: '4',
        projectId: '3',
        senderId: 'customer3',
        senderRole: 'kunde',
        senderName: 'Anna Schmidt',
        content: 'Könnten wir einen Termin für die Besprechung der Bewerbungsseite vereinbaren?',
        timestamp: '2025-08-18T14:20:00Z',
        isRead: false,
        hasAttachment: false,
        customerId: 'customer3'
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

  const handleSendMessage = async (projectId: string, content: string) => {
    try {
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

      {/* KORRIGIERT: userRole und onLogout Props hinzugefügt */}
      <DashboardNavigation
        activeView={activeView}
        notifications={notifications}
        userRole={userData.role}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
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

          {/* HINZUGEFÜGT: Newsletter-View */}
          {activeView === 'newsletter' && (
            <DashboardNewsletter
              userRole={userData.role}
              onViewChange={handleViewChange}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;