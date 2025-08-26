// src/Pages/Dashboard/Profile/Profile.tsx
// Dashboard Profile Page - KORRIGIERT für bessere Struktur

import React, { useState } from 'react';
import {
  HiUser,
  HiMail,
  HiShieldCheck,
  HiBell,
  HiCog,
  HiLogout,
  HiChevronRight,
  HiUserCircle,
  HiPhone,
  HiOfficeBuilding,
  HiKey,
  HiExclamationCircle
} from 'react-icons/hi';
import { useDashboard } from '../Context/DashboardContext';
import './Profile.scss';

// Import Types
import { DashboardProfileProps } from '../Types/DashboardTypes';
import { HiExclamationTriangle } from 'react-icons/hi2';

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  badge?: string | number;
  danger?: boolean;
}

const Profile: React.FC = () => {
  // Context Hook für Dashboard-Daten
  const { user, onLogout } = useDashboard();
  
  // Local State für Loading/Error States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Menu Item Click Handler
  const handleMenuItemClick = (action: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      
      switch (action) {
        case 'edit-profile':
          console.log('Edit profile clicked');
          // TODO: Modal für Profil-Bearbeitung öffnen
          break;
        case 'email-settings':
          console.log('Email settings clicked');
          // TODO: E-Mail Einstellungen Modal
          break;
        case 'security':
          console.log('Security settings clicked');
          // TODO: Sicherheits-Einstellungen
          break;
        case 'notifications':
          console.log('Notification settings clicked');
          // TODO: Benachrichtigungs-Einstellungen
          break;
        case 'push-notifications':
          console.log('Push notification settings clicked');
          // TODO: Push-Benachrichtigungen
          break;
        case 'change-password':
          console.log('Change password clicked');
          // TODO: Passwort ändern Modal
          break;
        case 'two-factor':
          console.log('Two-factor auth clicked');
          // TODO: 2FA Einstellungen
          break;
        case 'delete-account':
          console.log('Delete account clicked');
          // TODO: Account löschen mit Bestätigung
          break;
        case 'logout':
          if (onLogout) {
            onLogout();
          }
          break;
        default:
          setError(`Unbekannte Aktion: ${action}`);
          console.warn('Unknown action:', action);
      }
    }, 500);
  };

  // Menu Sections Configuration
  const menuSections: MenuSection[] = [
    {
      title: 'Account-Verwaltung',
      items: [
        {
          id: 'edit-profile',
          icon: HiUser,
          label: 'Profil bearbeiten',
          description: 'Name, Avatar und persönliche Informationen'
        },
        {
          id: 'email-settings',
          icon: HiMail,
          label: 'E-Mail Einstellungen',
          description: 'E-Mail-Adresse und Kommunikation'
        },
        {
          id: 'security',
          icon: HiShieldCheck,
          label: 'Sicherheit',
          description: 'Passwort und Sicherheitseinstellungen'
        }
      ]
    },
    {
      title: 'Benachrichtigungen',
      items: [
        {
          id: 'notifications',
          icon: HiBell,
          label: 'Push-Benachrichtigungen',
          description: 'Browser und App-Benachrichtigungen'
        },
        {
          id: 'push-notifications',
          icon: HiMail,
          label: 'E-Mail Benachrichtigungen',
          description: 'Newsletter und Updates per E-Mail'
        }
      ]
    },
    {
      title: 'Erweiterte Einstellungen',
      items: [
        {
          id: 'change-password',
          icon: HiKey,
          label: 'Passwort ändern',
          description: 'Aktuelles Passwort aktualisieren'
        },
        {
          id: 'two-factor',
          icon: HiShieldCheck,
          label: 'Zwei-Faktor-Authentifizierung',
          description: user.twoFactorAuth?.enabled ? 'Aktiviert' : 'Deaktiviert',
          badge: user.twoFactorAuth?.enabled ? '✓' : '!'
        }
      ]
    }
  ];

  // Gefahrenzone - nur für bestimmte Rollen
  const dangerZoneItems: MenuItem[] = [
    {
      id: 'delete-account',
      icon: HiExclamationTriangle,
      label: 'Account löschen',
      description: 'Unwiderruflich alle Daten löschen',
      danger: true
    }
  ];

  // Loading State
  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <div className="loading-text">Lade Profil...</div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <HiExclamationTriangle className="error-icon" />
          <h3 className="error-title">Fehler beim Laden</h3>
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => {
              setError(null);
              setIsLoading(false);
            }}
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-section">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={`${user.firstName || 'User'} Avatar`} />
            ) : (
              <HiUserCircle className="icon icon--profile-avatar" />
            )}
          </div>
          <h2>{user.firstName || 'Benutzer'} {user.lastName || ''}</h2>
          <p>{user.email}</p>
          <span className="role-badge">
            {user.role === 'kunde' ? 'Kunde' : 'Administrator'}
          </span>
          
          {/* Optional: Quick Stats */}
          {user.role === 'admin' && (
            <div className="profile-stats">
              <div className="stat-card">
                <div className="stat-value">42</div>
                <div className="stat-label">Verwaltete Kunden</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">18</div>
                <div className="stat-label">Aktive Projekte</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">98%</div>
                <div className="stat-label">Zufriedenheit</div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="profile-menu">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="menu-section">
              <h3>{section.title}</h3>
              <div className="menu-items">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      className="menu-item"
                      onClick={() => handleMenuItemClick(item.id)}
                      disabled={isLoading}
                    >
                      <IconComponent className="icon icon--menu" />
                      <div className="menu-content">
                        <span className="menu-label">{item.label}</span>
                        {item.description && (
                          <small className="menu-description">{item.description}</small>
                        )}
                      </div>
                      {item.badge && (
                        <span className="menu-badge">{item.badge}</span>
                      )}
                      <HiChevronRight className="icon icon--chevron" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Danger Zone - Account Deletion */}
          {user.role === 'admin' && (
            <div className="menu-section danger-zone">
              <h3>Gefahrenzone</h3>
              <div className="menu-items">
                {dangerZoneItems.map((item) => {
                  const IconComponent = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      className={`menu-item ${item.danger ? 'danger' : ''}`}
                      onClick={() => handleMenuItemClick(item.id)}
                      disabled={isLoading}
                    >
                      <IconComponent className="icon icon--menu" />
                      <div className="menu-content">
                        <span className="menu-label">{item.label}</span>
                        {item.description && (
                          <small className="menu-description">{item.description}</small>
                        )}
                      </div>
                      <HiChevronRight className="icon icon--chevron" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Logout Section */}
          <div className="menu-section">
            <div className="menu-items">
              <button
                className="menu-item logout"
                onClick={() => handleMenuItemClick('logout')}
                disabled={isLoading}
              >
                <HiLogout className="icon icon--menu" />
                <div className="menu-content">
                  <span className="menu-label">Abmelden</span>
                  <small className="menu-description">Aus dem Dashboard abmelden</small>
                </div>
                <HiChevronRight className="icon icon--chevron" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;