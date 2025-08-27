// =============================================================================
// DASHBOARD HEADER COMPONENT - MIT KOMPAKT-SYSTEM
// Datei: DashboardHeader.tsx
// KORRIGIERT: Alle Referenzen auf isHeaderVisible entfernt
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
  
  // KORRIGIERT: States für kompaktes Header-System
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Live-Zeit für futuristisches Feeling
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // KORRIGIERT: Header-Kompaktierung mit flacherem Schwellenwert
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // KORRIGIERT: Flacherer Trigger - bereits ab 50px statt 100px
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
        {/* Brand Section - modernes rundes Logo mit flexibler Schriftpositionierung */}
        <div className="header-brand modern-brand">
          <div className="brand-logo-wrapper">
            <a href="/" aria-label="Zur Startseite">
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

          {/* Header Actions - NUR die 3 gewünschten Buttons */}
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

            {/* Logout */}
            <button
              className="action-btn logout-btn"
              onClick={onLogout}
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