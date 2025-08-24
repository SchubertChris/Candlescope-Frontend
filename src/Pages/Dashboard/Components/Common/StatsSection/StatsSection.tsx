// src/Pages/Dashboard/Components/StatsSection.tsx
import React from 'react';

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number;
  label: string;
}

interface StatsSectionProps {
  stats: StatItem[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section className="stats-section">
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <IconComponent className="icon icon--stat" />
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsSection;