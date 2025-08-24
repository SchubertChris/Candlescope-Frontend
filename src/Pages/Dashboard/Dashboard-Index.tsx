// src/Pages/Dashboard/Dashboard-Index.tsx
// ERWEITERT: 6 Dashboard-Bereiche + Settings & Invoices Components
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
import DashboardNewsletter from './Components/DashboardNewsletter';

// NEU: Import der neuen Components
import DashboardSettings from './Components/DashboardSettings';
import DashboardInvoices from './Components/DashboardInvoices';

// Types
import { 
  User, 
  Project, 
  Message, 
  Invoice, 
  DashboardView, 
  canUserAccessView 
} from './Types/DashboardTypes';

import './Dashboard-Index.scss';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]); // NEU: Invoices State
  const [notifications, setNotifications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Initialisierung
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Auth prüfen
        if (!authService.isAuthenticated()) {
          navigate('/', { replace: true });
          return;
        }

        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          navigate('/', { replace: true });
          return;
        }

        setUserData(currentUser);

        // Dashboard-Daten laden
        console.log('📊 LOADING DASHBOARD DATA...');
        const dashboardData = await dashboardService.getDashboardData();
        
        setProjects(dashboardData.projects || []);
        setMessages(dashboardData.messages || []);
        setNotifications(dashboardData.stats?.unreadMessages || 0);

        // NEU: Invoices laden (Mockup für jetzt)
        // TODO: Echte API-Call später
        setInvoices(generateMockInvoices(currentUser));

        console.log('✅ DASHBOARD DATA LOADED');
        
      } catch (error: any) {
        console.error('❌ DASHBOARD INIT ERROR:', error);
        setError(error.message || 'Fehler beim Laden des Dashboards');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // NEU: Mock Invoices generieren (temporär für Development)
  const generateMockInvoices = (user: User): Invoice[] => {
    if (user.role === 'admin') {
      // Admin sieht alle Rechnungen
      return [
        {
          id: '1',
          invoiceNumber: 'INV-001',
          customerId: 'customer1',
          adminId: user.id,
          status: 'paid',
          amount: 2500.00,
          currency: 'EUR',
          taxRate: 19,
          taxAmount: 475.00,
          totalAmount: 2975.00,
          dueDate: '2024-12-31',
          paidDate: '2024-12-15',
          description: 'Website-Entwicklung',
          items: [
            { id: '1', description: 'Frontend-Entwicklung', quantity: 1, unitPrice: 1500.00, totalPrice: 1500.00 },
            { id: '2', description: 'Backend-Integration', quantity: 1, unitPrice: 1000.00, totalPrice: 1000.00 }
          ],
          createdAt: '2024-11-01',
          updatedAt: '2024-12-15'
        }
      ];
    } else {
      // Kunde sieht nur seine Rechnungen
      return [
        {
          id: '2',
          invoiceNumber: 'INV-002',
          customerId: user.id,
          adminId: 'admin1',
          status: 'sent',
          amount: 1800.00,
          currency: 'EUR',
          taxRate: 19,
          taxAmount: 342.00,
          totalAmount: 2142.00,
          dueDate: '2025-01-15',
          description: 'Projekt: Portfolio-Website',
          items: [
            { id: '1', description: 'Design & Development', quantity: 1, unitPrice: 1800.00, totalPrice: 1800.00 }
          ],
          createdAt: '2024-12-01',
          updatedAt: '2024-12-01'
        }
      ];
    }
  };

  // View Change Handler mit Berechtigung prüfen
  const handleViewChange = (view: DashboardView) => {
    if (!userData) return;
    
    if (!canUserAccessView(userData.role, view)) {
      console.warn(`❌ User ${userData.role} has no access to view: ${view}`);
      return;
    }
    
    console.log(`🔄 CHANGING VIEW: ${activeView} → ${view}`);
    setActiveView(view);
  };

  // Event Handlers
  const handleLogout = () => {
    console.log('🚪 LOGGING OUT...');
    authService.logout();
    navigate('/', { replace: true });
  };

  const handleRefreshData = async () => {
    setError(null);
    // Re-run initialization
    window.location.reload();
  };

  // Handler für Updates
  const handleUserUpdate = (updatedUser: User) => {
    setUserData(updatedUser);
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

  const handleSendMessage = async (projectId: string, content: string) => {
    // TODO: Implement message sending
    console.log('📤 SENDING MESSAGE:', { projectId, content });
  };

  // NEU: Invoice Handlers
  const handleInvoiceUpdate = (updatedInvoice: Invoice) => {
    setInvoices(prev => 
      prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv)
    );
  };

  const handlePayInvoice = async (invoiceId: string) => {
    console.log('💳 PAYING INVOICE:', invoiceId);
    // TODO: Implement payment processing
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
        userRole={userData.role}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
      />

      <main className="dashboard-professional__main">
        <div className="main-container">
          
          {/* ÜBERSICHT */}
          {activeView === 'overview' && (
            <DashboardOverview
              projects={projects}
              messages={messages}
              notifications={notifications}
              onViewChange={handleViewChange}
            />
          )}

          {/* PROJEKTE */}
          {activeView === 'projects' && (
            <DashboardProjects
              projects={projects}
              userRole={userData.role}
              onProjectUpdate={handleProjectUpdate}
            />
          )}

          {/* NACHRICHTEN */}
          {activeView === 'messages' && (
            <DashboardMessages
              messages={messages}
              projects={projects}
              onMessageRead={handleMessageRead}
              onSendMessage={handleSendMessage}
            />
          )}

          {/* NEU: RECHNUNGEN */}
          {activeView === 'invoices' && (
            <DashboardInvoices
              invoices={invoices}
              userRole={userData.role}
              onInvoiceUpdate={handleInvoiceUpdate}
              onPayInvoice={handlePayInvoice}
            />
          )}

          {/* NEU: NEWSLETTER (nur Admin) */}
          {activeView === 'newsletter' && userData.role === 'admin' && (
            <DashboardNewsletter
              userRole={userData.role}
              onViewChange={handleViewChange}
            />
          )}

          {/* NEU: EINSTELLUNGEN */}
          {activeView === 'settings' && (
            <DashboardSettings
              user={userData}
              userRole={userData.role}
              onUserUpdate={handleUserUpdate}
            />
          )}

          {/* PROFIL */}
          {activeView === 'profile' && (
            <DashboardProfile
              user={userData}
              onLogout={handleLogout}
              onUserUpdate={handleUserUpdate}
            />
          )}

          {/* Fallback für unbekannte Views */}
          {!['overview', 'projects', 'messages', 'invoices', 'newsletter', 'settings', 'profile'].includes(activeView) && (
            <div className="view-content">
              <div style={{ 
                textAlign: 'center', 
                padding: '4rem 2rem',
                color: 'var(--color-text-secondary)'
              }}>
                <h2>Bereich nicht gefunden</h2>
                <p>Der angeforderte Bereich "{activeView}" ist nicht verfügbar.</p>
                <button 
                  onClick={() => handleViewChange('overview')}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Zur Übersicht
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Debug Info (Development only) */}
      {import.meta.env.DEV && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '10px',
          fontFamily: 'monospace',
          zIndex: 9999
        }}>
          <div>View: {activeView}</div>
          <div>Role: {userData.role}</div>
          <div>User: {userData.email}</div>
          <div>Projects: {projects.length}</div>
          <div>Messages: {messages.length}</div>
          <div>Invoices: {invoices.length}</div>
          <div>Notifications: {notifications}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;