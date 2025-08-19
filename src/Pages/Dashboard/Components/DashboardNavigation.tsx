// src/Pages/Dashboard/Components/DashboardNavigation.tsx
import React from 'react';
import { 
  HiTrendingUp,
  HiBriefcase,
  HiChatAlt2,
  HiUser
} from 'react-icons/hi';
import { DashboardNavigationProps, DashboardView } from '../Types/DashboardTypes';

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  activeView,
  notifications,
  onViewChange
}) => {
  const navItems: Array<{
    id: DashboardView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    {
      id: 'overview',
      label: 'Übersicht',
      icon: HiTrendingUp
    },
    {
      id: 'projects',
      label: 'Projekte',
      icon: HiBriefcase
    },
    {
      id: 'messages',
      label: 'Nachrichten',
      icon: HiChatAlt2,
      badge: notifications
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: HiUser
    }
  ];

  return (
    <nav className="dashboard-professional__nav">
      <div className="nav-container">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <IconComponent className="icon icon--nav" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <div className="nav-badge">{item.badge}</div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardNavigation;