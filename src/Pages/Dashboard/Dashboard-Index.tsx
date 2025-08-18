// src/Pages/Dashboard/Dashboard-Index.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiLogout, HiUser, HiMail, HiShieldCheck } from 'react-icons/hi';
import authService from '@/Services/Auth-Service';
import './Dashboard-Index.scss';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<{ id: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // HINZUGEFÜGT: User-Daten laden
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/');
      return;
    }
    setUserData(user);
  }, [navigate]);

  // HINZUGEFÜGT: Logout-Handler
  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (!userData) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-loading__spinner"></div>
        <p>Dashboard wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* HINZUGEFÜGT: Dashboard Header */}
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <div className="dashboard__welcome">
            <h1 className="dashboard__title">
              🕯️ CandleScope Dashboard
            </h1>
            <p className="dashboard__subtitle">
              Willkommen zurück, {userData.email}
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="dashboard__logout-btn"
            aria-label="Logout"
          >
            <HiLogout />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* HINZUGEFÜGT: Dashboard Main Content */}
      <main className="dashboard__main">
        <div className="dashboard__container">
          
          {/* User Info Card */}
          <div className="dashboard__card dashboard__card--user">
            <div className="dashboard__card-header">
              <HiUser className="dashboard__card-icon" />
              <h2>Benutzerinformationen</h2>
            </div>
            <div className="dashboard__card-content">
              <div className="dashboard__info-item">
                <HiMail />
                <span>{userData.email}</span>
              </div>
              <div className="dashboard__info-item">
                <HiShieldCheck />
                <span>Account verifiziert</span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="dashboard__stats">
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-value">1</div>
              <div className="dashboard__stat-label">Aktive Session</div>
            </div>
            
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-value">0</div>
              <div className="dashboard__stat-label">Projekte</div>
            </div>
            
            <div className="dashboard__stat-card">
              <div className="dashboard__stat-value">100%</div>
              <div className="dashboard__stat-label">Uptime</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard__card dashboard__card--actions">
            <div className="dashboard__card-header">
              <h2>Schnellaktionen</h2>
            </div>
            <div className="dashboard__card-content">
              <div className="dashboard__actions">
                <button className="dashboard__action-btn">
                  📊 Analytics anzeigen
                </button>
                <button className="dashboard__action-btn">
                  ⚙️ Einstellungen
                </button>
                <button className="dashboard__action-btn">
                  📝 Neues Projekt
                </button>
                <button className="dashboard__action-btn">
                  💼 Portfolio bearbeiten
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard__card dashboard__card--activity">
            <div className="dashboard__card-header">
              <h2>Letzte Aktivitäten</h2>
            </div>
            <div className="dashboard__card-content">
              <div className="dashboard__activity-list">
                <div className="dashboard__activity-item">
                  <div className="dashboard__activity-dot"></div>
                  <div className="dashboard__activity-content">
                    <p>Account erfolgreich erstellt</p>
                    <time>Gerade eben</time>
                  </div>
                </div>
                <div className="dashboard__activity-item">
                  <div className="dashboard__activity-dot"></div>
                  <div className="dashboard__activity-content">
                    <p>Login-Daten per Email erhalten</p>
                    <time>Vor wenigen Minuten</time>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;