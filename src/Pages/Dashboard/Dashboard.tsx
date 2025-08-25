// src/Pages/Dashboard/Dashboard.tsx
// SIMPLE VERSION: Funktioniert mit aktueller Struktur
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/Services/Auth-Service';
import AnimatedBackground from '@/Components/Ui/AnimatedBackground';

// ✅ KORREKTE Import-Pfade basierend auf aktueller Struktur
import DashboardHeader from './Components/Common/DashboardHeader/DashboardHeader';
import DashboardNavigation from './Components/Common/DashboardNavigation/DashboardNavigation';
import DashboardLoading from './Components/Common/DashboardLoading/DashboardLoading';

// ✅ KORREKTE Page-Imports (OHNE ./Views/)
import Overview from './Overview/Overview';
import Projects from './Projects/Projects';
import Messages from './Messages/Messages';
import Profile from './Profile/Profile';
import Settings from './Settings/Settings';
import Invoices from './Invoices/Invoices';
import Newsletter from './Newsletter/Newsletter';

// Types
import { 
  User, 
  DashboardView, 
  canUserAccessView,
  Project,
  Message,
  Invoice
} from './Types/DashboardTypes';

import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<number>(3); // Mock

  // ✅ MOCK-DATEN für das Dashboard
  const [mockProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Portfolio Website',
      description: 'Neue Portfolio-Website für Kunde',
      type: 'website',
      status: 'inProgress',
      priority: 'high',
      assignedAdmin: 'admin1',
      customerId: 'client1',
      deadline: '2024-02-15T23:59:59Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      messagesCount: 3,
      filesCount: 5,
      isActive: true,
      tags: ['React', 'TypeScript', 'SCSS']
    }
  ]);

  const [mockMessages] = useState<Message[]>([
    {
      id: '1',
      projectId: '1',
      senderId: 'client1',
      senderName: 'Max Mustermann',
      senderRole: 'kunde',
      content: 'Können wir das Logo noch anpassen?',
      timestamp: '2024-01-20T09:30:00Z',
      isRead: false,
      hasAttachment: false,
      customerId: 'client1',
      attachments: []
    }
  ]);

  const [mockInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerId: 'client1',
      adminId: 'admin1',
      projectId: '1',
      status: 'sent',
      amount: 1500,
      currency: 'EUR',
      taxRate: 19,
      taxAmount: 285,
      totalAmount: 1785,
      dueDate: '2024-02-19T23:59:59Z',
      description: 'Frontend Entwicklung Portfolio',
      items: [
        {
          id: 'item1',
          description: 'Frontend Entwicklung',
          quantity: 25,
          unitPrice: 70,
          totalPrice: 1750
        }
      ],
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
      paymentMethod: 'bank_transfer'
    }
  ]);

  const navigate = useNavigate();

  // Initialisierung
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        console.log('🚀 DASHBOARD INITIALIZATION STARTING...');
        setIsLoading(true);
        setError(null);

        // User-Daten aus AuthService holen
        const currentUser = authService.getCurrentUser();
        
        if (!currentUser) {
          console.error('❌ No user data found in auth');
          navigate('/', { replace: true });
          return;
        }
        
        // ✅ FIXED: User-Daten an Dashboard-Format anpassen
        const dashboardUser: User = {
          id: currentUser.id,
          email: currentUser.email,
          role: 'admin', // Default für jetzt - später aus Backend
          firstName: currentUser.name?.split(' ')[0],
          lastName: currentUser.name?.split(' ')[1],
          avatar: currentUser.avatar,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        console.log('✅ User data loaded:', dashboardUser.email, dashboardUser.role);
        setUserData(dashboardUser);
        setIsLoading(false);

        console.log('✅ DASHBOARD INITIALIZATION COMPLETED');
      } catch (err) {
        console.error('❌ DASHBOARD INITIALIZATION ERROR:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Laden des Dashboards');
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Event Handlers
  const handleProjectUpdate = (project: Project) => {
    console.log('📋 PROJECT UPDATE:', project.id, project);
    // Hier würde normalerweise eine API-Anfrage gemacht
  };

  const handleMessageRead = (messageId: string) => {
    console.log('📩 MESSAGE READ:', messageId);
    // Hier würde normalerweise eine API-Anfrage gemacht
  };

  const handleSendMessage = (projectId: string, content: string) => {
    console.log('📤 SEND MESSAGE:', projectId, content);
    // Hier würde normalerweise eine API-Anfrage gemacht
  };

  const handleInvoiceUpdate = (invoice: Invoice) => {
    console.log('🧾 INVOICE UPDATE:', invoice.id, invoice);
    // Hier würde normalerweise eine API-Anfrage gemacht
  };

  const handlePayInvoice = (invoiceId: string) => {
    console.log('💳 PAY INVOICE:', invoiceId);
    // Hier würde normalerweise eine API-Anfrage gemacht
  };

  const handleCreateInvoice = () => {
    console.log('📄 CREATE INVOICE');
    // Hier würde normalerweise ein Modal geöffnet oder zur Erstellungsseite navigiert
  };

  // View Change Handler
  const handleViewChange = (view: DashboardView) => {
    if (!userData) return;
    
    if (!canUserAccessView(userData.role, view)) {
      console.warn(`❌ User ${userData.role} has no access to view: ${view}`);
      return;
    }
    
    console.log(`🔄 CHANGING VIEW: ${activeView} → ${view}`);
    setActiveView(view);
  };

  // Logout Handler
  const handleLogout = () => {
    console.log('🚪 LOGGING OUT...');
    authService.logout();
    navigate('/', { replace: true });
  };

  // Loading State
  if (isLoading || !userData) {
    return <DashboardLoading />;
  }

  // Error State
  if (error) {
    return (
      <div className="dashboard-professional">
        <AnimatedBackground />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          color: 'white',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1>⚠️ Dashboard-Fehler</h1>
          <p>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button onClick={() => window.location.reload()}>🔄 Neu laden</button>
            <button onClick={handleLogout}>🚪 Abmelden</button>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="dashboard-professional">
      <AnimatedBackground />

      {/* Header */}
      <DashboardHeader
        user={userData}
        notifications={notifications}
        onLogout={handleLogout}
      />

      {/* Navigation */}
      <DashboardNavigation
        activeView={activeView}
        notifications={notifications}
        userRole={userData.role}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="dashboard-professional__main">
        <div className="main-container">
          
          {/* ✅ ERWEITERTE View-Rendering mit korrekten Props */}
          {activeView === 'overview' && (
            <Overview 
              projects={mockProjects}
              messages={mockMessages}
              notifications={notifications}
              onViewChange={handleViewChange}
            />
          )}
          
          {activeView === 'projects' && (
            <Projects 
              projects={mockProjects}
              userRole={userData.role}
              onProjectUpdate={handleProjectUpdate}
            />
          )}
          
          {activeView === 'messages' && (
            <Messages 
              messages={mockMessages}
              projects={mockProjects}
              onMessageRead={handleMessageRead}
              onSendMessage={handleSendMessage}
            />
          )}
          
          {activeView === 'invoices' && (
            <Invoices 
              invoices={mockInvoices}
              userRole={userData.role}
              onInvoiceUpdate={handleInvoiceUpdate}
              onCreateInvoice={handleCreateInvoice}
              onPayInvoice={handlePayInvoice}
            />
          )}
          
          {activeView === 'settings' && <Settings />}
          {activeView === 'profile' && <Profile />}
          
          {/* Newsletter nur für Admin */}
          {activeView === 'newsletter' && userData.role === 'admin' && <Newsletter />}
          
          {/* Fallback */}
          {!['overview', 'projects', 'messages', 'invoices', 'newsletter', 'settings', 'profile'].includes(activeView) && (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              color: 'white',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '12px'
            }}>
              <h2>Bereich nicht verfügbar</h2>
              <p>Der Bereich "{activeView}" existiert nicht oder Sie haben keine Berechtigung.</p>
              <button onClick={() => handleViewChange('overview')}>
                Zurück zur Übersicht
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Development Debug */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontFamily: 'monospace'
        }}>
          <div>View: {activeView}</div>
          <div>User: {userData.email}</div>
          <div>Role: {userData.role}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;