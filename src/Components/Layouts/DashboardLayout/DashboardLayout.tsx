// src/Components/Layouts/DashboardLayout/DashboardLayout.tsx
// KORRIGIERT: State Management für Sidebar Expansion hinzugefügt

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardMainContent from './DashboardMainContent';
import AnimatedBackground from '@/Components/Ui/AnimatedBackground';
import { User } from '@/Pages/Dashboard/Types/DashboardTypes';
import './Style/DashboardLayout.scss';

interface DashboardLayoutProps {
  user: User;
  notifications: number;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  notifications,
  onLogout
}) => {
  // KORRIGIERT: State für Sidebar Expansion
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className={`dashboard-layout ${isSidebarExpanded ? 'layout--sidebar-expanded' : 'layout--sidebar-collapsed'}`}>
      <AnimatedBackground />
      
      {/* Header */}
      <DashboardHeader 
        user={user}
        notifications={notifications}
        onLogout={onLogout}
      />
      
      {/* Sidebar - KORRIGIERT: Props für Expansion State */}
      <DashboardSidebar 
        userRole={user.role}
        notifications={notifications}
        onLogout={onLogout}
        isExpanded={isSidebarExpanded}
        onToggle={handleSidebarToggle}
      />
      
      {/* Main Content */}
      <DashboardMainContent>
        <Outlet />
      </DashboardMainContent>
    </div>
  );
};

export default DashboardLayout;