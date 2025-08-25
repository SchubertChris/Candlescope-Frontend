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
import { User, DashboardView, canUserAccessView } from './Types/DashboardTypes';

import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<number>(3); // Mock

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
        
        console.log('✅ User data loaded:', currentUser.email, currentUser.role);
        setUserData(currentUser);
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
          
          {/* ✅ EINFACHE View-Rendering ohne komplexe Props */}
          {activeView === 'overview' && <Overview />}
          {activeView === 'projects' && <Projects />}
          {activeView === 'messages' && <Messages />}
          {activeView === 'invoices' && <Invoices />}
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