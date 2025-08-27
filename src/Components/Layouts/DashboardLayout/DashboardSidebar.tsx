// src/Components/Layouts/DashboardLayout/DashboardSidebar.tsx
// KORRIGIERT: Collapsible Sidebar - Standard nur Icons, aufklappbar für Text
// Mobile Navigation bleibt unverändert

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HiHome,
  HiFolderOpen, 
  HiChatAlt2,
  HiReceiptTax,
  HiMail,
  HiCog,
  HiUser,
  HiLogout,
  HiViewGrid // KORRIGIERT: 9-Punkt Grid Icon statt Chevron
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

  // KORRIGIERT: Toggle über Props statt lokalem State
  const toggleSidebar = () => {
    onToggle();
  };

  return (
    <aside className={`dashboard-sidebar ${isExpanded ? 'dashboard-sidebar--expanded' : 'dashboard-sidebar--collapsed'}`}>
      {/* KORRIGIERT: Sidebar Toggle Button mit 9-Punkt Grid Icon */}
      <button 
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        title={isExpanded ? 'Sidebar einklappen' : 'Sidebar ausklappen'}
      >
        <HiViewGrid />
      </button>

      {/* Sidebar Header - nur bei expanded */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">
            {/* Icon hier falls gewünscht */}
          </div>
          {isExpanded && (
            <div className="brand-text">Dashboard</div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            // Admin-only Items filtern
            if (item.adminOnly && userRole !== 'admin') {
              return null;
            }

            return (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  title={!isExpanded ? item.label : ''} // Tooltip nur bei collapsed
                >
                  <div className="nav-icon-wrapper">
                    <item.icon className="nav-icon" />
                    {/* KORRIGIERT: Badge als vertikaler Streifen statt Zahlen */}
                    {item.badge && item.badge > 0 && (
                      <span className="nav-badge-stripe"></span>
                    )}
                  </div>
                  
                  {/* KORRIGIERT: Text nur bei expanded anzeigen */}
                  {isExpanded && (
                    <span className="nav-text">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {/* Kann noch was rein [Werbung etc.] */}
      </div>
    </aside>
  );
};

export default DashboardSidebar;