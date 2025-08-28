// src/Components/Layouts/DashboardLayout/DashboardSidebar.tsx
// KORRIGIERT: Subtiler 9-Punkte-Raster Toggle, komplett innerhalb Sidebar

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HiHome,
  HiFolderOpen, 
  HiChatAlt2,
  HiReceiptTax,
  HiMail,
  HiCog,
  HiUser
} from 'react-icons/hi';
import { UserRole, DashboardView } from '@/Pages/Dashboard/Types/DashboardTypes';

interface DashboardSidebarProps {
  userRole: UserRole;
  notifications: number;
  onLogout: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: DashboardView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  adminOnly?: boolean;
  badge?: number;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  userRole,
  notifications,
  onLogout,
  isExpanded,
  onToggle
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Übersicht',
      icon: HiHome,
      path: '/dashboard'
    },
    {
      id: 'projects',
      label: 'Projekte',
      icon: HiFolderOpen,
      path: '/dashboard/projects'
    },
    {
      id: 'messages',
      label: 'Nachrichten',
      icon: HiChatAlt2,
      path: '/dashboard/messages',
      badge: notifications
    },
    {
      id: 'invoices',
      label: 'Rechnungen',
      icon: HiReceiptTax,
      path: '/dashboard/invoices'
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: HiMail,
      path: '/dashboard/newsletter',
      adminOnly: true
    },
    {
      id: 'settings',
      label: 'Einstellungen',
      icon: HiCog,
      path: '/dashboard/settings'
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: HiUser,
      path: '/dashboard/profile'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    onToggle();
  };

  return (
    <aside className={`dashboard-sidebar ${isExpanded ? 'dashboard-sidebar--expanded' : 'dashboard-sidebar--collapsed'}`}>
      {/* KORRIGIERT: 9-Punkte-Raster Toggle komplett innerhalb Sidebar */}
      <button 
        className="sidebar-toggle-btn tactile-toggle"
        onClick={toggleSidebar}
        title={isExpanded ? 'Sidebar schließen' : 'Sidebar öffnen'}
      >
        <div className="tactile-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </button>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            if (item.adminOnly && userRole !== 'admin') {
              return null;
            }

            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  title={!isExpanded ? item.label : ''}
                >
                  <div className="nav-icon-wrapper">
                    <item.icon className="nav-icon" />
                    {!isExpanded && item.badge && item.badge > 0 && (
                      <span className="nav-badge-stripe nav-badge-stripe--on-icon"></span>
                    )}
                  </div>
                  
                  {isExpanded && (
                    <div className="nav-text-container">
                      <span className="nav-text">{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="nav-badge-stripe nav-badge-stripe--after-text"></span>
                      )}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;