// src/Components/Layouts/DashboardLayout/DashboardLayout.tsx
// PROFESSIONAL: Haupt-Dashboard-Layout-Component

import React from 'react';
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
  return (
    <div className="dashboard-layout">
      <AnimatedBackground />
      
      {/* Header */}
      <DashboardHeader 
        user={user}
        notifications={notifications}
        onLogout={onLogout}
      />
      
      {/* Sidebar */}
      <DashboardSidebar 
        userRole={user.role}
        notifications={notifications}
        onLogout={onLogout}
      />
      
      {/* Main Content */}
      <DashboardMainContent>
        <Outlet />
      </DashboardMainContent>
    </div>
  );
};

export default DashboardLayout;