// src/Pages/Dashboard/Dashboard.tsx
// PROFESSIONAL: Complete Dashboard with Best Practices & UX Focus
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/Services/Auth-Service';
import dashboardService from '@/Services/Dashboard-Service';
import AnimatedBackground from '@/Components/Ui/AnimatedBackground';

// ✅ FIXED: Corrected Import Paths for New Structure
// Dashboard Common Components
import DashboardHeader from './Components/Common/DashboardHeader/DashboardHeader';
import DashboardNavigation from './Components/Common/DashboardNavigation/DashboardNavigation';
import DashboardLoading from './Components/Common/DashboardLoading/DashboardLoading';

// Dashboard Views
import DashboardOverview from './Views/Overview/DashboardOverview';
import DashboardProjects from './Views/Projects/DashboardProjects';
import DashboardMessages from './Views/Messages/DashboardMessages';
import DashboardProfile from './Views/Profile/DashboardProfile';
import DashboardSettings from './Views/Settings/DashboardSettings';
import DashboardInvoices from './Views/Invoices/DashboardInvoices';
import DashboardNewsletter from './Views/Newsletter/DashboardNewsletter';

// Types
import { 
  User, 
  Project, 
  Message, 
  Invoice, 
  DashboardView, 
  canUserAccessView 
} from './Types/DashboardTypes';

import './Dashboard.scss';

// ===========================
// INTERFACES & TYPES
// ===========================
interface DashboardState {
  userData: User | null;
  projects: Project[];
  messages: Message[];
  invoices: Invoice[];
  notifications: number;
  isLoading: boolean;
  activeView: DashboardView;
  error: string | null;
  lastRefresh: Date | null;
}

interface LoadingSteps {
  auth: boolean;
  projects: boolean;
  messages: boolean;
  invoices: boolean;
  notifications: boolean;
}

// ===========================
// MAIN DASHBOARD COMPONENT
// ===========================
const Dashboard: React.FC = () => {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  const [state, setState] = useState<DashboardState>({
    userData: null,
    projects: [],
    messages: [],
    invoices: [],
    notifications: 0,
    isLoading: true,
    activeView: 'overview',
    error: null,
    lastRefresh: null
  });

  const [loadingSteps, setLoadingSteps] = useState<LoadingSteps>({
    auth: false,
    projects: false,
    messages: false,
    invoices: false,
    notifications: false
  });

  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();

  // ===========================
  // COMPUTED VALUES (MEMOIZED)
  // ===========================
  const dashboardStats = useMemo(() => {
    if (!state.userData) return null;
    
    const activeProjects = state.projects.filter(p => p.status !== 'completed');
    const totalFiles = state.projects.reduce((acc, p) => acc + (p.filesCount || 0), 0);
    const unreadMessages = state.messages.filter(m => !m.isRead).length;
    const upcomingDeadlines = activeProjects.filter(p => {
      const deadline = new Date(p.deadline);
      const now = new Date();
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilDeadline <= 30 && daysUntilDeadline > 0;
    }).length;

    return {
      activeProjects: activeProjects.length,
      totalProjects: state.projects.length,
      totalFiles,
      unreadMessages,
      upcomingDeadlines,
      completionRate: state.projects.length > 0 
        ? Math.round((state.projects.filter(p => p.status === 'completed').length / state.projects.length) * 100)
        : 0
    };
  }, [state.projects, state.messages]);

  // ===========================
  // DATA LOADING FUNCTIONS
  // ===========================
  const updateLoadingStep = useCallback((step: keyof LoadingSteps, completed: boolean) => {
    setLoadingSteps(prev => ({ ...prev, [step]: completed }));
  }, []);

  const loadUserData = useCallback(async (): Promise<User> => {
    updateLoadingStep('auth', false);
    
    try {
      // ✅ FIXED: Get user data from authService (not dashboardService.getUserData)
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        throw new Error('Keine Benutzerdaten gefunden. Bitte melden Sie sich erneut an.');
      }

      // Additional auth validation
      if (!authService.isAuthenticated()) {
        throw new Error('Sitzung abgelaufen. Bitte melden Sie sich erneut an.');
      }

      console.log('✅ User data loaded:', { 
        email: currentUser.email, 
        role: currentUser.role,
        id: currentUser.id 
      });

      updateLoadingStep('auth', true);
      return currentUser;
      
    } catch (error) {
      console.error('❌ Auth Error:', error);
      updateLoadingStep('auth', false);
      throw error;
    }
  }, [updateLoadingStep]);

  const loadProjects = useCallback(async (): Promise<Project[]> => {
    updateLoadingStep('projects', false);
    
    try {
      const projectsData = await dashboardService.getProjects();
      console.log(`✅ Projects loaded: ${projectsData.length} items`);
      
      updateLoadingStep('projects', true);
      return projectsData;
      
    } catch (error: any) {
      console.error('❌ Projects Error:', error);
      updateLoadingStep('projects', false);
      
      // Fallback für Development - Mock-Daten bei API-Fehler
      if (process.env.NODE_ENV === 'development') {
        console.warn('🔄 Using mock projects data for development');
        return generateMockProjects();
      }
      
      throw error;
    }
  }, [updateLoadingStep]);

  const loadMessages = useCallback(async (): Promise<Message[]> => {
    updateLoadingStep('messages', false);
    
    try {
      const messagesData = await dashboardService.getMessages();
      console.log(`✅ Messages loaded: ${messagesData.length} items`);
      
      updateLoadingStep('messages', true);
      return messagesData;
      
    } catch (error: any) {
      console.error('❌ Messages Error:', error);
      updateLoadingStep('messages', false);
      
      // Fallback für Development
      if (process.env.NODE_ENV === 'development') {
        console.warn('🔄 Using mock messages data for development');
        return generateMockMessages();
      }
      
      throw error;
    }
  }, [updateLoadingStep]);

  const loadInvoices = useCallback(async (user: User): Promise<Invoice[]> => {
    updateLoadingStep('invoices', false);
    
    try {
      // TODO: Replace with real API call when backend is ready
      // const invoicesData = await dashboardService.getInvoices();
      
      const invoicesData = generateMockInvoices(user);
      console.log(`✅ Invoices loaded: ${invoicesData.length} items`);
      
      updateLoadingStep('invoices', true);
      return invoicesData;
      
    } catch (error: any) {
      console.error('❌ Invoices Error:', error);
      updateLoadingStep('invoices', false);
      
      // Always provide fallback for invoices
      return generateMockInvoices(user);
    }
  }, [updateLoadingStep]);

  // ===========================
  // MAIN INITIALIZATION FUNCTION
  // ===========================
  const initializeDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
      } else {
        setIsRefreshing(true);
      }

      console.log('🚀 DASHBOARD INITIALIZATION STARTING...');
      const startTime = performance.now();

      // Step 1: Load and validate user data
      console.log('📝 Step 1: Loading user data...');
      const userData = await loadUserData();

      // Step 2: Load all dashboard data in parallel for better performance
      console.log('📊 Step 2: Loading dashboard data in parallel...');
      const [projects, messages, invoices] = await Promise.allSettled([
        loadProjects(),
        loadMessages(),
        loadInvoices(userData)
      ]);

      // Process results with error handling
      const projectsData = projects.status === 'fulfilled' ? projects.value : [];
      const messagesData = messages.status === 'fulfilled' ? messages.value : [];
      const invoicesData = invoices.status === 'fulfilled' ? invoices.value : [];

      // Step 3: Calculate notifications
      console.log('🔔 Step 3: Calculating notifications...');
      updateLoadingStep('notifications', false);
      const notificationCount = messagesData.filter(m => !m.isRead).length;
      updateLoadingStep('notifications', true);

      // Step 4: Update state with all data
      console.log('📋 Step 4: Updating dashboard state...');
      setState(prev => ({
        ...prev,
        userData,
        projects: projectsData,
        messages: messagesData,
        invoices: invoicesData,
        notifications: notificationCount,
        isLoading: false,
        error: null,
        lastRefresh: new Date()
      }));

      const loadTime = Math.round(performance.now() - startTime);
      console.log(`✅ DASHBOARD INITIALIZATION COMPLETED in ${loadTime}ms`);

      // Log any partial failures
      if (projects.status === 'rejected') console.warn('⚠️ Projects failed to load:', projects.reason.message);
      if (messages.status === 'rejected') console.warn('⚠️ Messages failed to load:', messages.reason.message);
      if (invoices.status === 'rejected') console.warn('⚠️ Invoices failed to load:', invoices.reason.message);

      setRetryCount(0); // Reset retry counter on success

    } catch (error: any) {
      console.error('❌ DASHBOARD INITIALIZATION ERROR:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Unbekannter Fehler beim Laden des Dashboards'
      }));

      // Auto-retry logic for network errors
      if (error.message.includes('Netzwerk') && retryCount < 3) {
        console.log(`🔄 Auto-retry ${retryCount + 1}/3 in 2 seconds...`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          initializeDashboard(isRefresh);
        }, 2000);
      }
      
    } finally {
      setIsRefreshing(false);
    }
  }, [loadUserData, loadProjects, loadMessages, loadInvoices, updateLoadingStep, retryCount]);

  // ===========================
  // LIFECYCLE EFFECTS
  // ===========================
  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  // Auto-refresh every 5 minutes when tab is active
  useEffect(() => {
    if (!state.userData) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && state.lastRefresh) {
        const timeSinceRefresh = Date.now() - state.lastRefresh.getTime();
        if (timeSinceRefresh > 5 * 60 * 1000) { // 5 minutes
          console.log('🔄 Auto-refreshing dashboard data...');
          initializeDashboard(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.userData, state.lastRefresh, initializeDashboard]);

  // ===========================
  // EVENT HANDLERS
  // ===========================
  const handleViewChange = useCallback((view: DashboardView) => {
    if (!state.userData) return;
    
    if (!canUserAccessView(state.userData.role, view)) {
      console.warn(`❌ User ${state.userData.role} has no access to view: ${view}`);
      return;
    }
    
    console.log(`🔄 CHANGING VIEW: ${state.activeView} → ${view}`);
    setState(prev => ({ ...prev, activeView: view }));
  }, [state.userData, state.activeView]);

  const handleLogout = useCallback(() => {
    console.log('🚪 LOGGING OUT...');
    authService.logout();
    navigate('/', { replace: true });
  }, [navigate]);

  const handleRefreshData = useCallback(async () => {
    console.log('🔄 Manual refresh triggered');
    setState(prev => ({ ...prev, error: null }));
    await initializeDashboard(true);
  }, [initializeDashboard]);

  const handleRetryWithReload = useCallback(() => {
    console.log('🔄 Retrying with full reload...');
    window.location.reload();
  }, []);

  // Update handlers for child components
  const handleUserUpdate = useCallback((updatedUser: User) => {
    setState(prev => ({ ...prev, userData: updatedUser }));
    console.log('👤 User data updated:', updatedUser.email);
  }, []);

  const handleProjectUpdate = useCallback((updatedProject: Project) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
    }));
    console.log('📂 Project updated:', updatedProject.name);
  }, []);

  const handleMessageRead = useCallback((messageId: string) => {
    setState(prev => {
      const updatedMessages = prev.messages.map(m => 
        m.id === messageId ? { ...m, isRead: true } : m
      );
      const newNotifications = Math.max(0, prev.notifications - 1);
      
      return {
        ...prev,
        messages: updatedMessages,
        notifications: newNotifications
      };
    });
    console.log('💬 Message marked as read:', messageId);
  }, []);

  const handleSendMessage = useCallback(async (projectId: string, content: string) => {
    try {
      console.log('📤 SENDING MESSAGE:', { projectId, content: content.substring(0, 50) + '...' });
      // TODO: Implement message sending with API
      // await dashboardService.sendMessage({ projectId, content });
      // For now, just log the action
    } catch (error: any) {
      console.error('❌ Send message error:', error);
      setState(prev => ({ ...prev, error: error.message }));
    }
  }, []);

  const handleInvoiceUpdate = useCallback((updatedInvoice: Invoice) => {
    setState(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv)
    }));
    console.log('💰 Invoice updated:', updatedInvoice.invoiceNumber);
  }, []);

  const handlePayInvoice = useCallback(async (invoiceId: string) => {
    try {
      console.log('💳 PAYING INVOICE:', invoiceId);
      // TODO: Implement payment processing
      // await paymentService.processPayment(invoiceId);
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      setState(prev => ({ ...prev, error: error.message }));
    }
  }, []);

  // ===========================
  // MOCK DATA GENERATORS (for Development)
  // ===========================
  const generateMockProjects = useCallback((): Project[] => [
    {
      id: 'proj_1',
      name: 'E-Commerce Website',
      type: 'ecommerce',
      status: 'inProgress',
      assignedAdmin: 'admin1',
      customerId: 'customer1',
      deadline: '2025-02-28',
      createdAt: '2024-12-01',
      updatedAt: '2025-01-15',
      messagesCount: 12,
      filesCount: 8,
      priority: 'high',
      description: 'Moderne E-Commerce Plattform mit React und Node.js',
      isActive: true
    },
    {
      id: 'proj_2',
      name: 'Corporate Website',
      type: 'website',
      status: 'review',
      assignedAdmin: 'admin1',
      customerId: 'customer2',
      deadline: '2025-01-31',
      createdAt: '2024-11-15',
      updatedAt: '2025-01-10',
      messagesCount: 6,
      filesCount: 15,
      priority: 'medium',
      description: 'Responsive Unternehmenswebsite mit CMS',
      isActive: true
    }
  ], []);

  const generateMockMessages = useCallback((): Message[] => [
    {
      id: 'msg_1',
      projectId: 'proj_1',
      senderId: 'customer1',
      senderRole: 'kunde',
      senderName: 'Max Mustermann',
      content: 'Wann können wir mit dem ersten Review rechnen?',
      timestamp: '2025-01-20T10:30:00Z',
      isRead: false,
      hasAttachment: false,
      customerId: 'customer1'
    },
    {
      id: 'msg_2',
      projectId: 'proj_2',
      senderId: 'admin1',
      senderRole: 'admin',
      senderName: 'Chris Schubert',
      content: 'Das Design ist fertig. Bitte schauen Sie es sich an.',
      timestamp: '2025-01-19T14:15:00Z',
      isRead: true,
      hasAttachment: true,
      customerId: 'customer2'
    }
  ], []);

  const generateMockInvoices = useCallback((user: User): Invoice[] => {
    if (user.role === 'admin') {
      return [
        {
          id: 'inv_1',
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
          description: 'E-Commerce Website Entwicklung',
          items: [
            { id: '1', description: 'Frontend-Entwicklung', quantity: 1, unitPrice: 1500.00, totalPrice: 1500.00 },
            { id: '2', description: 'Backend-Integration', quantity: 1, unitPrice: 1000.00, totalPrice: 1000.00 }
          ],
          createdAt: '2024-11-01',
          updatedAt: '2024-12-15'
        }
      ];
    } else {
      return [
        {
          id: 'inv_2',
          invoiceNumber: 'INV-002',
          customerId: user.id,
          adminId: 'admin1',
          status: 'sent',
          amount: 1800.00,
          currency: 'EUR',
          taxRate: 19,
          taxAmount: 342.00,
          totalAmount: 2142.00,
          dueDate: '2025-02-15',
          description: 'Corporate Website Development',
          items: [
            { id: '1', description: 'Design & Development', quantity: 1, unitPrice: 1800.00, totalPrice: 1800.00 }
          ],
          createdAt: '2024-12-01',
          updatedAt: '2024-12-01'
        }
      ];
    }
  }, []);

  // ===========================
  // RENDER LOADING STATE
  // ===========================
  if (state.isLoading && !state.userData) {
    return (
      <DashboardLoading 
        loadingSteps={loadingSteps}
        showSteps={true}
      />
    );
  }

  // ===========================
  // RENDER ERROR STATE
  // ===========================
  if (state.error && !state.userData) {
    return (
      <div className="dashboard-professional">
        <AnimatedBackground />
        <div className="dashboard-error">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Dashboard-Fehler</h1>
            <p className="error-message">{state.error}</p>
            
            {retryCount > 0 && (
              <p className="retry-info">
                Wiederholungsversuch {retryCount}/3
              </p>
            )}
            
            <div className="error-actions">
              <button 
                className="btn btn--primary"
                onClick={handleRefreshData}
                disabled={isRefreshing}
              >
                {isRefreshing ? '🔄 Wird geladen...' : '🔄 Erneut versuchen'}
              </button>
              
              <button 
                className="btn btn--secondary"
                onClick={handleRetryWithReload}
              >
                🔄 Seite neu laden
              </button>
              
              <button 
                className="btn btn--outline"
                onClick={handleLogout}
              >
                🚪 Abmelden
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="error-debug">
                <summary>Debug-Informationen</summary>
                <pre>{JSON.stringify({ 
                  error: state.error, 
                  retryCount, 
                  loadingSteps,
                  userAgent: navigator.userAgent
                }, null, 2)}</pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===========================
  // RENDER MAIN DASHBOARD
  // ===========================
  return (
    <div className="dashboard-professional">
      <AnimatedBackground />

      {/* Header with refresh indicator */}
      <DashboardHeader
        user={state.userData!}
        notifications={state.notifications}
        onLogout={handleLogout}
        onRefresh={handleRefreshData}
        isRefreshing={isRefreshing}
        lastRefresh={state.lastRefresh}
        dashboardStats={dashboardStats}
      />

      {/* Navigation */}
      <DashboardNavigation
        activeView={state.activeView}
        notifications={state.notifications}
        userRole={state.userData!.role}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="dashboard-professional__main">
        <div className="main-container">
          
          {/* Error Banner (for non-critical errors) */}
          {state.error && state.userData && (
            <div className="error-banner">
              <span className="error-banner__message">⚠️ {state.error}</span>
              <button 
                className="error-banner__close"
                onClick={() => setState(prev => ({ ...prev, error: null }))}
              >
                ×
              </button>
            </div>
          )}
          
          {/* OVERVIEW */}
          {state.activeView === 'overview' && (
            <DashboardOverview
              projects={state.projects}
              messages={state.messages}
              notifications={state.notifications}
              onViewChange={handleViewChange}
              dashboardStats={dashboardStats}
              isRefreshing={isRefreshing}
            />
          )}

          {/* PROJECTS */}
          {state.activeView === 'projects' && (
            <DashboardProjects
              projects={state.projects}
              userRole={state.userData!.role}
              onProjectUpdate={handleProjectUpdate}
              isLoading={isRefreshing}
            />
          )}

          {/* MESSAGES */}
          {state.activeView === 'messages' && (
            <DashboardMessages
              messages={state.messages}
              projects={state.projects}
              onMessageRead={handleMessageRead}
              onSendMessage={handleSendMessage}
              isLoading={isRefreshing}
            />
          )}

          {/* INVOICES */}
          {state.activeView === 'invoices' && (
            <DashboardInvoices
              invoices={state.invoices}
              userRole={state.userData!.role}
              onInvoiceUpdate={handleInvoiceUpdate}
              onPayInvoice={handlePayInvoice}
              isLoading={isRefreshing}
            />
          )}

          {/* NEWSLETTER (nur Admin) */}
          {state.activeView === 'newsletter' && state.userData!.role === 'admin' && (
            <DashboardNewsletter
              userRole={state.userData!.role}
              onViewChange={handleViewChange}
            />
          )}

          {/* SETTINGS */}
          {state.activeView === 'settings' && (
            <DashboardSettings
              user={state.userData!}
              userRole={state.userData!.role}
              onUserUpdate={handleUserUpdate}
            />
          )}

          {/* PROFILE */}
          {state.activeView === 'profile' && (
            <DashboardProfile
              user={state.userData!}
              onLogout={handleLogout}
              onUserUpdate={handleUserUpdate}
            />
          )}

          {/* Fallback für unbekannte Views */}
          {!['overview', 'projects', 'messages', 'invoices', 'newsletter', 'settings', 'profile'].includes(state.activeView) && (
            <div className="view-content">
              <div className="fallback-view">
                <h2>Unbekannte Ansicht: {state.activeView}</h2>
                <p>Diese Ansicht existiert nicht oder Sie haben keine Berechtigung dafür.</p>
                <button 
                  className="btn btn--primary"
                  onClick={() => handleViewChange('overview')}
                >
                  Zurück zur Übersicht
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Performance Monitoring in Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="dev-monitor">
          <details>
            <summary>Dashboard Performance</summary>
            <div>
              <p>Letzte Aktualisierung: {state.lastRefresh?.toLocaleTimeString()}</p>
              <p>Projekte: {state.projects.length}</p>
              <p>Nachrichten: {state.messages.length}</p>
              <p>Rechnungen: {state.invoices.length}</p>
              <p>Benachrichtigungen: {state.notifications}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default Dashboard;