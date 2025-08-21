// src/Components/Dashboard/DashboardNavigation/DashboardNavigation.tsx
// AKTUALISIERT: Newsletter-Integration mit Admin-Bereich und Icons
import React from 'react';
import { 
  Home, 
  FolderOpen, 
  MessageSquare, 
  User, 
  Mail,
  Settings,
  LogOut 
} from 'lucide-react';
import { 
  DashboardView, 
  UserRole, 
  DashboardNavigationProps,
  getDashboardNavigationItems,
  canUserAccessView
} from '../../../Pages/Dashboard/Types/DashboardTypes';
import './Style/DashboardComponents.scss';

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  activeView,
  notifications,
  userRole,
  onViewChange,
  onLogout
}) => {
  
  // Icon-Mapping für dynamische Icons
  const iconMap = {
    Home,
    FolderOpen,
    MessageSquare,
    User,
    Mail,
    Settings
  };
  
  // ERWEITERT: Navigation Items mit Admin-Newsletter aus Types
  const navigationItems = getDashboardNavigationItems(notifications);
  
  // GEFILTERT: Nur Items anzeigen, die für die User-Rolle erlaubt sind
  const filteredNavigationItems = navigationItems.filter(item => 
    canUserAccessView(userRole, item.id)
  );
  
  // GETRENNT: Admin-only Items für separate Darstellung
  const standardItems = filteredNavigationItems.filter(item => !item.adminOnly);
  const adminItems = filteredNavigationItems.filter(item => item.adminOnly);

  const handleNavClick = (viewId: DashboardView) => {
    onViewChange(viewId);
  };

  // HELPER: Icon-Component dynamisch rendern
  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="navigation-icon" /> : <Settings className="navigation-icon" />;
  };

  return (
    <nav className="dashboard-navigation">
      <div className="navigation-header">
        <div className="navigation-logo">
          <Settings className="logo-icon" />
          <span className="logo-text">Dashboard</span>
        </div>
        
        {/* ERWEITERT: Rollen-Indikator mit Badge */}
        <div className={`role-indicator ${userRole}`}>
          <span className="role-label">
            {userRole === 'admin' ? 'Administrator' : 'Kunde'}
          </span>
          {userRole === 'admin' && (
            <span className="role-badge">Admin</span>
          )}
        </div>
      </div>

      <div className="navigation-menu">
        {/* Standard-Navigation */}
        <ul className="navigation-list">
          {standardItems.map((item) => {
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id} className="navigation-item">
                <button
                  className={`navigation-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  title={item.label}
                >
                  {renderIcon(item.icon)}
                  <span className="navigation-text">{item.label}</span>
                  
                  {/* Badge für Benachrichtigungen */}
                  {item.badge && (
                    <span className="navigation-badge">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* NEU: Admin-Bereich Separator (nur für Admins mit Newsletter-Zugriff) */}
        {userRole === 'admin' && adminItems.length > 0 && (
          <>
            <div className="navigation-separator">
              <span className="separator-text">Admin-Bereich</span>
              <div className="separator-line"></div>
            </div>
            
            <ul className="navigation-list admin-section">
              {adminItems.map((item) => {
                const isActive = activeView === item.id;
                
                return (
                  <li key={item.id} className="navigation-item">
                    <button
                      className={`navigation-link admin-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      title={`${item.label} (Admin)`}
                    >
                      {renderIcon(item.icon)}
                      <span className="navigation-text">{item.label}</span>
                      
                      {/* Admin-Badge */}
                      <span className="navigation-status admin-only">
                        Admin
                      </span>
                      
                      {/* Badge für Newsletter-spezifische Benachrichtigungen */}
                      {item.badge && (
                        <span className="navigation-badge">
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        
        {/* ERWEITERT: Quick-Stats für Admin (Newsletter-Preview) */}
        {userRole === 'admin' && (
          <div className="navigation-quick-stats">
            <div className="quick-stats-header">
              <Mail className="stats-icon" />
              <span>Newsletter</span>
            </div>
            <div className="quick-stats-content">
              <div className="stat-item">
                <span className="stat-label">Abonnenten</span>
                <span className="stat-value">-</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Letzte Kampagne</span>
                <span className="stat-value">-</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ERWEITERT: Footer mit User-Info und Logout */}
      <div className="navigation-footer">
        {/* User-Info */}
        <div className="user-info">
          <div className="user-avatar">
            <User className="avatar-icon" />
          </div>
          <div className="user-details">
            <span className="user-name">
              {userRole === 'admin' ? 'Admin' : 'Benutzer'}
            </span>
            <span className="user-role">
              {userRole === 'admin' ? 'Administrator' : 'Kunde'}
            </span>
          </div>
        </div>
        
        {/* Logout Button */}
        <button 
          className="navigation-link logout-link"
          onClick={onLogout}
          title="Abmelden"
        >
          <LogOut className="navigation-icon" />
          <span className="navigation-text">Abmelden</span>
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavigation;