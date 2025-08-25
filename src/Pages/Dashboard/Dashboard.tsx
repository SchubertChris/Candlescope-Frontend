// src/Pages/Dashboard/Dashboard.tsx
// REFACTORED: Verwendet jetzt saubere Layout-Komponenten + Context

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/Services/Auth-Service';
import DashboardLayout from '@/Components/Layouts/DashboardLayout/DashboardLayout';
import DashboardLoading from './Components/Common/DashboardLoading/DashboardLoading';
import { DashboardProvider } from './Context/DashboardContext';

// Types
import { User, Project, Message, Invoice } from './Types/DashboardTypes';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications] = useState<number>(3); // Mock

  // Mock-Daten für das Dashboard
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
        
        // User-Daten an Dashboard-Format anpassen
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
      <div className="dashboard-error">
        <div className="error-content">
          <h1>⚠️ Dashboard-Fehler</h1>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              🔄 Neu laden
            </button>
            <button 
              className="btn btn--secondary"
              onClick={handleLogout}
            >
              🚪 Abmelden
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard mit neuem Layout + Context
  return (
    <DashboardProvider
      user={userData}
      projects={mockProjects}
      messages={mockMessages}
      invoices={mockInvoices}
      notifications={notifications}
      onProjectUpdate={handleProjectUpdate}
      onMessageRead={handleMessageRead}
      onSendMessage={handleSendMessage}
      onInvoiceUpdate={handleInvoiceUpdate}
      onCreateInvoice={handleCreateInvoice}
      onPayInvoice={handlePayInvoice}
    >
      <DashboardLayout 
        user={userData}
        notifications={notifications}
        onLogout={handleLogout}
      />
    </DashboardProvider>
  );
};

export default Dashboard;