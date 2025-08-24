// src/Pages/Dashboard/Components/DashboardNavigation.tsx
// ERWEITERT: 6 Bereiche statt 4 + Admin-Only Features
import React from 'react';
import { 
  HiHome,
  HiBriefcase,
  HiChatAlt2,
  HiUser,
  HiMail,
  HiCog,
  HiReceiptTax
} from 'react-icons/hi';
import { DashboardNavigationProps, DashboardView } from '../Types/DashboardTypes';

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  activeView,
  notifications,
  userRole,
  onViewChange
}) => {
  
  // ERWEITERT: Navigation Items mit Rollen-Berechtigung
  const navItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    adminOnly?: boolean;
    description: string;
  }> = [
    {
      id: 'overview',
      label: 'Übersicht',
      icon: HiHome,
      description: 'Dashboard-Übersicht mit allen wichtigen Informationen'
    },
    {
      id: 'projects',
      label: 'Projekte',
      icon: HiBriefcase,
      description: userRole === 'admin' ? 'Alle Kundenprojekte verwalten' : 'Ihre Projekte und Fortschritte'
    },
    {
      id: 'messages',
      label: 'Nachrichten',
      icon: HiChatAlt2,
      badge: notifications,
      description: userRole === 'admin' ? 'Kommunikation mit allen Kunden' : 'Direkte Kommunikation'
    },
    {
      id: 'invoices',
      label: 'Rechnungen',
      icon: HiReceiptTax,
      description: userRole === 'admin' ? 'Rechnungsübersicht aller Kunden' : 'Ihre Rechnungen und Zahlungen'
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: HiMail,
      adminOnly: true,
      description: 'Newsletter erstellen und an Abonnenten versenden'
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: HiCog,
      description: userRole === 'admin' ? 'System- und Profileinstellungen' : 'Profil und Sicherheitseinstellungen'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: HiUser,
      description: 'Persönliche Daten und Konto-Verwaltung'
    }
  ];

  // Filter Navigation Items basierend auf Benutzerrolle
  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || (item.adminOnly && userRole === 'admin')
  );

  return (
    <nav className="dashboard-professional__nav">
      <div className="nav-container">
        {filteredNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''} ${item.adminOnly ? 'admin-only' : ''}`}
              onClick={() => onViewChange(item.id)}
              title={item.description}
              aria-label={`${item.label} - ${item.description}`}
            >
              <div className="nav-item__icon">
                <IconComponent className="icon icon--nav" />
                {item.badge && item.badge > 0 && (
                  <div className="nav-badge" aria-label={`${item.badge} neue Benachrichtigungen`}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
                {item.adminOnly && (
                  <div className="admin-indicator" aria-label="Nur für Administratoren">
                    A
                  </div>
                )}
              </div>
              
              <span className="nav-item__label">{item.label}</span>
              
              {/* Optional: Mobile-optimierte Beschreibung */}
              <span className="nav-item__description" aria-hidden="true">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Footer Info für Admin */}
      {userRole === 'admin' && (
        <div className="nav-footer">
          <div className="nav-footer__info">
            <span className="admin-badge">Administrator</span>
            <span className="nav-footer__text">
              Vollzugriff auf alle Bereiche
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavigation;