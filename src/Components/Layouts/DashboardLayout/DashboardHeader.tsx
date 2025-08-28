// =============================================================================
// DASHBOARD HEADER COMPONENT - MIT LOGO-NAVIGATION OHNE LOGOUT
// Datei: DashboardHeader.tsx
// KORRIGIERT: Logo-Navigation ohne automatischen Logout
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiCode,
  HiUserCircle,
  HiMail,
  HiCog,
  HiLogout,
  HiMenuAlt3,
  HiSparkles,
  HiLightningBolt
} from 'react-icons/hi';
import { User } from '@/Pages/Dashboard/Types/DashboardTypes';
import authService from '@/Services/Auth-Service';

interface DashboardHeaderProps {
  user: User;
  notifications: number;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  notifications,
  onLogout
}) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Live-Zeit für futuristisches Feeling
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Header-Kompaktierung mit flacherem Schwellenwert
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setIsHeaderCompact(true);
      } else {
        setIsHeaderCompact(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  // KORRIGIERT: Logo-Click-Handler MIT STATE-FLAG
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    console.log('LOGO CLICKED: Navigating to landing page (staying logged in)');
    
    // Navigate zur Landing Page mit State-Flag - KEIN LOGOUT
    navigate('/', {
      state: {
        fromDashboard: true,
        timestamp: Date.now()
      }
    });
  };

  // KORRIGIERT: Echter Logout-Handler
  const handleLogout = () => {
    console.log('LOGOUT BUTTON CLICKED: Performing full logout');
    
    // Parent-Callback ausführen (falls vorhanden)
    if (onLogout) {
      onLogout();
    }
    
    // Dann direkten Logout mit Redirect
    authService.logoutAndRedirect();
  };

  const handleMobileMenuToggle = () => {
    console.log('Toggle mobile menu');
  };

  const handleNotifications = () => {
    navigate('/dashboard/messages');
  };

  const handleSettings = () => {
    navigate('/dashboard/settings');
  };

  const getUserDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email.split('@')[0];
  };

  const getRoleLabel = () => {
    return user.role === 'admin' ? 'Administrator' : 'Kunde';
  };

  return (
    <header className={`dashboard-header ${isHeaderCompact ? 'dashboard-header--compact' : 'dashboard-header--full'}`}>
      <div className="header-container">
        {/* Brand Section - KORRIGIERT: Logo mit onClick-Handler und State */}
        <div className="header-brand modern-brand">
          <div className="brand-logo-wrapper">
            <a 
              href="/" 
              aria-label="Zur Startseite (eingeloggt bleiben)"
              onClick={handleLogoClick}  // WICHTIG: Dieser Handler ist entscheidend
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/CandleScopeLogo.png"
                alt="CandleScope Logo"
                className="brand-logo-img"
              />
            </a>
          </div>
          <div className="brand-info">
            <h1 className="brand-title">Candlescope</h1>
            <p className="brand-subtitle">Chris Schubert We(B)Art</p>
            <div className="brand-status">
              <HiLightningBolt className="status-icon" />
              <span className="status-text">Online</span>
              <span className="status-time">
                {currentTime.toLocaleTimeString('de-DE', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="header-user">
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{getUserDisplayName()}</span>
              <span className="user-role">{getRoleLabel()}</span>
            </div>
            <div className="user-avatar">
              <HiUserCircle className="icon--avatar" />
            </div>
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Notifications - NUR ICON mit Brief */}
            <button 
              className="action-btn notification-btn"
              onClick={handleNotifications}
              title="Benachrichtigungen"
            >
              <HiMail className="icon--action" />
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>

            {/* Settings - NUR ICON */}
            <button 
              className="action-btn settings-btn"
              onClick={handleSettings}
              title="Einstellungen"
            >
              <HiCog className="icon--action" />
            </button>

            {/* KORRIGIERT: Logout Button mit richtigem Handler */}
            <button
              className="action-btn logout-btn"
              onClick={handleLogout}  // WICHTIG: Verwendet handleLogout, nicht onLogout
              title="Abmelden"
            >
              <HiLogout className="icon--action" />
              <span className="action-label">Abmelden</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;