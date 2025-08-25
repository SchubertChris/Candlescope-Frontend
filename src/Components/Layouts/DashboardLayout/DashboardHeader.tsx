// src/Components/Layouts/DashboardLayout/DashboardHeader.tsx
// PROFESSIONAL: Dashboard Header Component

import React from 'react';
import { 
  HiCode, 
  HiUserCircle, 
  HiBell, 
  HiCog, 
  HiLogout,
  HiMenuAlt3 // ✅ KORRIGIERT: HiMenu → HiMenuAlt3
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
  const handleMobileMenuToggle = () => {
    // TODO: Implementieren für mobile Sidebar-Toggle
    console.log('Toggle mobile menu');
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={handleMobileMenuToggle}
          aria-label="Toggle Menu"
        >
          <HiMenuAlt3 className="icon--menu" />
        </button>

        {/* Brand */}
        <div className="header-brand">
          <div className="brand-logo">
            <HiCode className="icon--brand" />
          </div>
          <div className="brand-info">
            <h1>Chris Schubert</h1>
            <p>Web Development Dashboard</p>
          </div>
        </div>

        {/* User Section */}
        <div className="header-user">
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.email
                }
              </span>
              <span className="user-role">
                {user.role === 'admin' ? 'Administrator' : 'Kunde'}
              </span>
            </div>
            <div className="user-avatar">
              <HiUserCircle className="icon--avatar" />
            </div>
          </div>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Notifications */}
            <button className="action-btn notification-btn">
              <HiBell className="icon--action" />
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
              <span className="action-label">Benachrichtigungen</span>
            </button>

            {/* Settings */}
            <button className="action-btn settings-btn">
              <HiCog className="icon--action" />
              <span className="action-label">Einstellungen</span>
            </button>

            {/* Logout */}
            <button 
              className="action-btn logout-btn"
              onClick={onLogout}
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