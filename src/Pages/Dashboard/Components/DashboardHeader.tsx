// src/Pages/Dashboard/Components/DashboardHeader.tsx
// KORRIGIERT: Role-System angepasst
import React from 'react';
import { 
  HiLogout, 
  HiBell, 
  HiCode, 
  HiUserCircle 
} from 'react-icons/hi';
import { DashboardHeaderProps } from '../Types/DashboardTypes';
// Styles
import "./Style/DashboardComponents.scss"

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  notifications,
  onLogout
}) => {
  return (
    <header className="dashboard-professional__header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-logo">
            <HiCode className="icon icon--brand" />
          </div>
          <div className="brand-info">
            <h1>Development Portal</h1>
            <p>Projekt- & Kommunikationsmanagement</p>
          </div>
        </div>
        
        <div className="header-user">
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.firstName || user.email}</span>
              <span className="user-role">
                {/* KORRIGIERT: 'mitarbeiter' → 'admin' entfernt */}
                {user.role === 'kunde' ? 'Kunde' : 'Administrator'}
              </span>
            </div>
            <div className="user-avatar">
              <HiUserCircle className="icon icon--avatar" />
            </div>
          </div>
          
          <div className="header-actions">
            {notifications > 0 && (
              <button className="action-btn notification-btn">
                <HiBell className="icon icon--action" />
                <span className="notification-badge">{notifications}</span>
              </button>
            )}
            <button onClick={onLogout} className="action-btn logout-btn">
              <HiLogout className="icon icon--action" />
              <span className="action-label">Abmelden</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;