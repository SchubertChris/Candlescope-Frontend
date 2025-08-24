// src/Pages/Dashboard/Components/DashboardLoading.tsx
import React from 'react';

const DashboardLoading: React.FC = () => {
  return (
    <div className="dashboard-professional__loading">
      <div className="loading-spinner"></div>
      <p>Dashboard wird geladen...</p>
    </div>
  );
};

export default DashboardLoading;