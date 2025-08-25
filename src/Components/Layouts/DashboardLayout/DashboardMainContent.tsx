// src/Components/Layouts/DashboardLayout/DashboardMainContent.tsx
// PROFESSIONAL: Dashboard Main Content Wrapper Component

import React from 'react';

interface DashboardMainContentProps {
  children: React.ReactNode;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  children
}) => {
  return (
    <main className="dashboard-main-content">
      <div className="content-container">
        {children}
      </div>
    </main>
  );
};

export default DashboardMainContent;