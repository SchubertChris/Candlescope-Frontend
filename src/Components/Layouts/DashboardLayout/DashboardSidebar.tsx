// src/Components/Layouts/DashboardLayout/DashboardSidebar.tsx
// PROFESSIONAL: Dashboard Sidebar Navigation Component

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HiHome,
  HiFolderOpen, 
  HiChatAlt2, // ✅ KORRIGIERT: HiMessageSquare → HiChatAlt2
  HiReceiptTax,
  HiMail,
  HiCog,
  HiUser,
  HiLogout,
  HiCode
} from 'react-icons/hi';
import { UserRole, DashboardView } from '@/Pages/Dashboard/Types/DashboardTypes';

interface DashboardSidebarProps {
  userRole: UserRole;
  notifications: number;
  onLogout: () => void;
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
  onLogout
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
      icon: HiChatAlt2, // ✅ KORRIGIERT
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

  return (
    <aside className="dashboard-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">
          </div>
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
                >
                  <item.icon className="nav-icon" />
                  <span className="nav-text">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
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