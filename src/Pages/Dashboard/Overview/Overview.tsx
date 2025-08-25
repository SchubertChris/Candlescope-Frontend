// src/Pages/Dashboard/Overview/Overview.tsx
// Updated für neue SCSS-Struktur und Context

import React from 'react';
import { 
  HiHome, 
  HiFolderOpen, 
  HiChatAlt2, 
  HiReceiptTax,
  HiClock,
  HiTrendingUp,
  HiUsers,
  HiDocumentText,
  HiArrowRight
} from 'react-icons/hi';
import { useDashboard } from '../Context/DashboardContext';
import './Overview.scss';

const Overview: React.FC = () => {
  const { user, projects, messages, invoices, notifications } = useDashboard();

  // Aktuelle Zeit für Begrüßung
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  // Statistiken berechnen
  const stats = [
    {
      icon: HiFolderOpen,
      title: 'Aktive Projekte',
      value: projects.filter(p => p.status !== 'completed').length,
      label: 'In Bearbeitung',
      trend: '+2 diese Woche'
    },
    {
      icon: HiChatAlt2,
      title: 'Neue Nachrichten',
      value: messages.filter(m => !m.isRead).length,
      label: 'Ungelesen',
      trend: 'Zuletzt vor 2h'
    },
    {
      icon: HiReceiptTax,
      title: 'Offene Rechnungen',
      value: invoices.filter(i => i.status === 'sent').length,
      label: 'Ausstehend',
      trend: `€${invoices.reduce((sum, i) => i.status === 'sent' ? sum + i.totalAmount : sum, 0)}`
    },
    {
      icon: HiTrendingUp,
      title: 'Monatsumsatz',
      value: '€12,450',
      label: 'Dezember 2024',
      trend: '+15% vs. Vormonat'
    }
  ];

  // Quick Actions
  const quickActions = [
    {
      icon: HiDocumentText,
      title: 'Neue Rechnung erstellen',
      description: 'Rechnung für Kunde erstellen',
      path: '/dashboard/invoices'
    },
    {
      icon: HiFolderOpen,
      title: 'Projekt anlegen',
      description: 'Neues Kundenprojekt starten',
      path: '/dashboard/projects'
    },
    {
      icon: HiChatAlt2,
      title: 'Nachrichten prüfen',
      description: 'Kundennachrichten bearbeiten',
      path: '/dashboard/messages'
    },
    {
      icon: HiUsers,
      title: 'Kunde hinzufügen',
      description: 'Neuen Kunden registrieren',
      path: '/dashboard/settings'
    }
  ];

  return (
    <div className="dashboard-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>{getTimeGreeting()}, {user.firstName || user.email}!</h1>
        <p>Hier ist Ihre Dashboard-Übersicht für heute.</p>
        <div className="welcome-time">
          {new Date().toLocaleDateString('de-DE', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="overview-stats">
        <h2 className="section-title">Übersicht</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <stat.icon className="icon--stat" />
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                {stat.trend && (
                  <div className="stat-trend positive">
                    {stat.trend}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        {/* Recent Projects */}
        <div className="activity-section recent-projects">
          <div className="section-header">
            <h3>Aktuelle Projekte</h3>
            <a href="/dashboard/projects" className="view-all-btn">
              Alle anzeigen
            </a>
          </div>
          <div className="projects-list">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="project-item">
                <div className="project-icon">
                  <HiFolderOpen className="icon--project-type" />
                </div>
                <div className="project-info">
                  <div className="project-name">{project.name}</div>
                  <div className="project-status">{project.status}</div>
                </div>
                <div className="project-progress">
                  <div className="progress-fill" style={{ width: '65%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="activity-section quick-actions">
          <div className="section-header">
            <h3>Schnellaktionen</h3>
          </div>
          <div className="actions-list">
            {quickActions.map((action, index) => (
              <a key={index} href={action.path} className="action-item">
                <div className="action-icon">
                  <action.icon className="icon--action" />
                </div>
                <div className="action-info">
                  <div className="action-title">{action.title}</div>
                  <p className="action-description">{action.description}</p>
                </div>
                <div className="action-arrow">
                  <HiArrowRight />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Metrics */}
      <div className="dashboard-metrics">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{projects.length}</div>
            <div className="metric-label">Gesamt Projekte</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{messages.length}</div>
            <div className="metric-label">Nachrichten</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{invoices.length}</div>
            <div className="metric-label">Rechnungen</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">98%</div>
            <div className="metric-label">Zufriedenheit</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;