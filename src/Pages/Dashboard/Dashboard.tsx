// src/Pages/Dashboard/Dashboard.tsx
// KORRIGIERT: Context um Outlet gewrapped + erweiterte Mock-Daten

import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
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
  const [notifications] = useState<number>(3);

  // Erweiterte Mock-Daten für alle Dashboard-Features
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
    },
    {
      id: '2',
      name: 'E-Commerce Shop',
      description: 'Online-Shop für Sportartikel',
      type: 'ecommerce',
      status: 'review',
      priority: 'medium',
      assignedAdmin: 'admin1',
      customerId: 'client2',
      deadline: '2024-03-01T23:59:59Z',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-25T16:45:00Z',
      messagesCount: 7,
      filesCount: 12,
      isActive: true,
      tags: ['Next.js', 'Shopify', 'PayPal']
    },
    {
      id: '3',
      name: 'Newsletter System',
      description: 'Automatisiertes Newsletter-System',
      type: 'newsletter',
      status: 'completed',
      priority: 'low',
      assignedAdmin: 'admin1',
      customerId: 'client3',
      deadline: '2024-01-30T23:59:59Z',
      createdAt: '2024-01-05T08:00:00Z',
      updatedAt: '2024-01-30T17:00:00Z',
      messagesCount: 2,
      filesCount: 8,
      isActive: true,
      tags: ['Node.js', 'SendGrid', 'MongoDB']
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
    },
    {
      id: '2',
      projectId: '1',
      senderId: 'admin1',
      senderName: 'Chris Schubert',
      senderRole: 'admin',
      content: 'Ja, können wir gerne machen. Haben Sie schon konkrete Vorstellungen?',
      timestamp: '2024-01-20T10:15:00Z',
      isRead: true,
      hasAttachment: false,
      customerId: 'client1',
      attachments: []
    },
    {
      id: '3',
      projectId: '2',
      senderId: 'client2',
      senderName: 'Sarah Weber',
      senderRole: 'kunde',
      content: 'Die Zahlungsintegration funktioniert perfekt! Wann können wir live gehen?',
      timestamp: '2024-01-25T14:20:00Z',
      isRead: false,
      hasAttachment: false,
      customerId: 'client2',
      attachments: []
    },
    {
      id: '4',
      projectId: '2',
      senderId: 'admin1',
      senderName: 'Chris Schubert',
      senderRole: 'admin',
      content: 'Super! Wir können nächste Woche live gehen. Ich bereite die finalen Tests vor.',
      timestamp: '2024-01-25T15:45:00Z',
      isRead: true,
      hasAttachment: false,
      customerId: 'client2',
      attachments: []
    },
    {
      id: '5',
      projectId: '3',
      senderId: 'client3',
      senderName: 'Thomas Klein',
      senderRole: 'kunde',
      content: 'Das Newsletter-System läuft einwandfrei. Vielen Dank!',
      timestamp: '2024-01-30T16:30:00Z',
      isRead: true,
      hasAttachment: false,
      customerId: 'client3',
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
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerId: 'client2',
      adminId: 'admin1',
      projectId: '2',
      status: 'paid',
      amount: 2800,
      currency: 'EUR',
      taxRate: 19,
      taxAmount: 532,
      totalAmount: 3332,
      dueDate: '2024-02-28T23:59:59Z',
      paidDate: '2024-01-25T12:00:00Z',
      description: 'E-Commerce Entwicklung - Erste Phase',
      items: [
        {
          id: 'item2',
          description: 'E-Commerce Setup',
          quantity: 40,
          unitPrice: 80,
          totalPrice: 3200
        }
      ],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-25T12:00:00Z',
      paymentMethod: 'bank_transfer'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerId: 'client3',
      adminId: 'admin1',
      projectId: '3',
      status: 'paid',
      amount: 800,
      currency: 'EUR',
      taxRate: 19,
      taxAmount: 152,
      totalAmount: 952,
      dueDate: '2024-01-31T23:59:59Z',
      paidDate: '2024-01-30T10:30:00Z',
      description: 'Newsletter-System Entwicklung',
      items: [
        {
          id: 'item3',
          description: 'Newsletter-Integration',
          quantity: 10,
          unitPrice: 90,
          totalPrice: 900
        }
      ],
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-30T10:30:00Z',
      paymentMethod: 'bank_transfer'
    }
  ]);

  const navigate = useNavigate();

  // Dashboard-Initialisierung
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        console.log('Dashboard initialization starting...');
        setIsLoading(true);
        setError(null);

        // User-Daten aus AuthService holen
        const currentUser = authService.getCurrentUser();
        
        if (!currentUser) {
          console.error('No user data found in auth');
          navigate('/', { replace: true });
          return;
        }
        
        // Erweiterte User-Daten für Dashboard-Features
        const dashboardUser: User = {
          id: currentUser.id,
          email: currentUser.email,
          role: 'admin', // Default für jetzt - später aus Backend
          firstName: currentUser.name?.split(' ')[0] || 'Benutzer',
          lastName: currentUser.name?.split(' ')[1] || '',
          avatar: currentUser.avatar,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          // Erweiterte Business-Daten für Settings
          businessData: {
            phone: '+49 160 941 683 48',
            website: 'portfolio-chris-schubert.vercel.app',
            taxId: '12345/67890',
            vatNumber: 'DE123456789',
            address: {
              street: 'Musterstraße 123',
              city: 'Potsdam',
              postalCode: '14482',
              country: 'Deutschland'
            }
          },
          // 2FA Settings für Settings-Page
          twoFactorAuth: {
            enabled: false,
            backupCodes: [],
            lastUsed: undefined
          }
        };
        
        console.log('User data loaded:', dashboardUser.email, dashboardUser.role);
        setUserData(dashboardUser);
        setIsLoading(false);

        console.log('Dashboard initialization completed');
      } catch (err) {
        console.error('Dashboard initialization error:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Laden des Dashboards');
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Event Handlers
  const handleProjectUpdate = (project: Project) => {
    console.log('PROJECT UPDATE:', project.id, project);
    // TODO: Implement real API call
  };

  const handleMessageRead = (messageId: string) => {
    console.log('MESSAGE READ:', messageId);
    // TODO: Implement real API call
  };

  const handleSendMessage = (projectId: string, content: string) => {
    console.log('SEND MESSAGE:', projectId, content);
    // TODO: Implement real API call
  };

  const handleInvoiceUpdate = (invoice: Invoice) => {
    console.log('INVOICE UPDATE:', invoice.id, invoice);
    // TODO: Implement real API call
  };

  const handlePayInvoice = (invoiceId: string) => {
    console.log('PAY INVOICE:', invoiceId);
    // TODO: Implement real API call
  };

  const handleCreateInvoice = () => {
    console.log('CREATE INVOICE');
    // TODO: Implement create invoice modal or navigation
  };

  const handleUserUpdate = (updatedUser: User) => {
    console.log('USER UPDATE:', updatedUser);
    setUserData(updatedUser);
    // TODO: Implement real API call
  };

  // Logout Handler
  const handleLogout = () => {
    console.log('LOGGING OUT...');
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
          <h1>Dashboard-Fehler</h1>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Neu laden
            </button>
            <button 
              className="btn btn--secondary"
              onClick={handleLogout}
            >
              Abmelden
            </button>
          </div>
        </div>
      </div>
    );
  }

  // KORRIGIERT: Context um DashboardLayout + Outlet gewrapped
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
      onUserUpdate={handleUserUpdate}
      onLogout={handleLogout}
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