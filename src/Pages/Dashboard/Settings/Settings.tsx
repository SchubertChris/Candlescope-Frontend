// src/Pages/Dashboard/Settings/Settings.tsx
// Dashboard Settings - Vollständige Einstellungsseite mit Admin/User Features

import React, { useState, useEffect } from 'react';
import {
  HiUser,
  HiShieldCheck,
  HiBell,
  HiMail,
  HiGlobe,
  HiServer,
  HiKey,
  HiEye,
  HiEyeOff,
  HiExclamationTriangle,
  HiCheckCircle,
  HiRefresh,
  HiDownload,
  HiTrash,
  HiCog,
  HiUserGroup,
  HiChartBar,
  HiDatabase
} from 'react-icons/hi';
import { useDashboard } from '../Context/DashboardContext';
import { User } from '../Types/DashboardTypes';
import './Settings.scss';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  website: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  projectUpdates: boolean;
  messageNotifications: boolean;
  invoiceReminders: boolean;
  newsletterSubscription: boolean;
}

const Settings: React.FC = () => {
  const { user, onUserUpdate } = useDashboard();
  
  // Form States
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    company: user.company || '',
    phone: user.businessData?.phone || '',
    website: user.businessData?.website || ''
  });
  
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    messageNotifications: true,
    invoiceReminders: true,
    newsletterSubscription: false
  });

  // UI States
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');

  // Password Strength Calculation
  const calculatePasswordStrength = (password: string): 'weak' | 'fair' | 'good' | 'strong' => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score === 3) return 'fair';
    if (score === 4) return 'good';
    return 'strong';
  };

  // Update password strength when new password changes
  useEffect(() => {
    if (passwordData.newPassword) {
      setPasswordStrength(calculatePasswordStrength(passwordData.newPassword));
    }
  }, [passwordData.newPassword]);

  // Show success/error messages temporarily
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Save Profile
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      const updatedUser: User = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        company: profileData.company,
        businessData: {
          ...user.businessData,
          phone: profileData.phone,
          website: profileData.website
        }
      };
      
      await onUserUpdate(updatedUser);
      setSuccessMessage('Profil erfolgreich aktualisiert');
    } catch (error) {
      setErrorMessage('Fehler beim Speichern des Profils');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('Passwörter stimmen nicht überein');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }
    
    setIsSaving(true);
    setErrorMessage('');
    
    try {
      // TODO: API Call für Passwort-Änderung
      console.log('Change password:', passwordData);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccessMessage('Passwort erfolgreich geändert');
    } catch (error) {
      setErrorMessage('Fehler beim Ändern des Passworts');
      console.error('Password change error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Notifications
  const handleSaveNotifications = async () => {
    setIsSaving(true);
    
    try {
      console.log('Save notifications:', notifications);
      setSuccessMessage('Benachrichtigungseinstellungen gespeichert');
    } catch (error) {
      setErrorMessage('Fehler beim Speichern der Einstellungen');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Notification Setting
  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Export Data
  const handleExportData = () => {
    const data = {
      user: user,
      settings: notifications,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSuccessMessage('Daten erfolgreich exportiert');
  };

  // Delete Account
  const handleDeleteAccount = () => {
    if (confirm('Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) {
      console.log('Delete account confirmed');
      // TODO: Delete Account API Call
    }
  };

  // Tab Configuration
  const tabs = [
    { id: 'profile', label: 'Profil', icon: HiUser },
    { id: 'security', label: 'Sicherheit', icon: HiShieldCheck },
    { id: 'notifications', label: 'Benachrichtigungen', icon: HiBell },
    ...(user.role === 'admin' ? [
      { id: 'system', label: 'System', icon: HiServer },
      { id: 'users', label: 'Benutzer', icon: HiUserGroup }
    ] : [])
  ];

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Einstellungen</h1>
        <p className="page-subtitle">Verwalte deine Account- und Systemeinstellungen</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="alert alert--success">
          <HiCheckCircle className="alert-icon" />
          <div className="alert-content">
            <div className="alert-message">{successMessage}</div>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="alert alert--error">
          <HiExclamationTriangle className="alert-icon" />
          <div className="alert-content">
            <div className="alert-message">{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="settings-tabs">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <IconComponent />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <div className="settings-sections">
        
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Profil-Einstellungen</h3>
              <p className="section-description">
                Verwalte deine persönlichen Informationen und Geschäftsdaten
              </p>
            </div>
            
            <div className="section-content">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Vorname</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Dein Vorname"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nachname</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Dein Nachname"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">E-Mail-Adresse</label>
                <input
                  type="email"
                  className="form-input"
                  value={user.email}
                  disabled
                />
                <div className="form-help">
                  E-Mail kann nicht hier geändert werden. Kontaktiere den Support.
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Unternehmen</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.company}
                  onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Dein Unternehmen (optional)"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+49 123 456 789"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    className="form-input"
                    value={profileData.website}
                    onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  className="btn btn--primary"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? <HiRefresh className="spinning" /> : null}
                  Profil speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Sicherheits-Einstellungen</h3>
              <p className="section-description">
                Passwort ändern und Sicherheitsoptionen verwalten
              </p>
            </div>
            
            <div className="section-content">
              <div className="form-group">
                <label className="form-label">Aktuelles Passwort</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Aktuelles Passwort eingeben"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Neues Passwort</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Neues Passwort (min. 8 Zeichen)"
                />
                {passwordData.newPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div className={`strength-fill ${passwordStrength}`}></div>
                    </div>
                    <div className={`strength-text ${passwordStrength}`}>
                      Passwort-Stärke: {passwordStrength === 'weak' ? 'Schwach' : 
                                       passwordStrength === 'fair' ? 'Ausreichend' :
                                       passwordStrength === 'good' ? 'Gut' : 'Stark'}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Passwort bestätigen</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Neues Passwort wiederholen"
                />
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <div className="form-error">Passwörter stimmen nicht überein</div>
                )}
              </div>
              
              <div className="form-actions">
                <button
                  className="btn btn--primary"
                  onClick={handleChangePassword}
                  disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                >
                  {isSaving ? <HiRefresh className="spinning" /> : <HiKey />}
                  Passwort ändern
                </button>
              </div>
              
              {/* Two-Factor Authentication */}
              <div className="security-section">
                <h4>Zwei-Faktor-Authentifizierung</h4>
                <div className="security-item">
                  <div className="security-info">
                    <div className="security-title">2FA Status</div>
                    <div className="security-description">
                      Zusätzliche Sicherheitsschicht für deinen Account
                    </div>
                    <div className={`security-status ${user.twoFactorAuth?.enabled ? 'enabled' : 'disabled'}`}>
                      {user.twoFactorAuth?.enabled ? 'Aktiviert' : 'Deaktiviert'}
                    </div>
                  </div>
                  <div className="security-action">
                    <button className="btn btn--secondary">
                      {user.twoFactorAuth?.enabled ? 'Deaktivieren' : 'Aktivieren'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Benachrichtigungs-Einstellungen</h3>
              <p className="section-description">
                Kontrolliere, wann und wie du benachrichtigt werden möchtest
              </p>
            </div>
            
            <div className="section-content">
              <div className="notification-preferences">
                <div className="notification-category">
                  <h4 className="category-title">E-Mail Benachrichtigungen</h4>
                  <div className="notification-options">
                    <div className="toggle-group">
                      <div className="toggle-info">
                        <div className="toggle-label">E-Mail Benachrichtigungen</div>
                        <div className="toggle-description">Allgemeine E-Mail Benachrichtigungen erhalten</div>
                      </div>
                      <div 
                        className={`toggle-switch ${notifications.emailNotifications ? 'active' : ''}`}
                        onClick={() => toggleNotification('emailNotifications')}
                      >
                        <div className="toggle-handle"></div>
                      </div>
                    </div>
                    
                    <div className="toggle-group">
                      <div className="toggle-info">
                        <div className="toggle-label">Projekt-Updates</div>
                        <div className="toggle-description">Bei Änderungen an deinen Projekten benachrichtigen</div>
                      </div>
                      <div 
                        className={`toggle-switch ${notifications.projectUpdates ? 'active' : ''}`}
                        onClick={() => toggleNotification('projectUpdates')}
                      >
                        <div className="toggle-handle"></div>
                      </div>
                    </div>
                    
                    <div className="toggle-group">
                      <div className="toggle-info">
                        <div className="toggle-label">Neue Nachrichten</div>
                        <div className="toggle-description">Bei neuen Chat-Nachrichten benachrichtigen</div>
                      </div>
                      <div 
                        className={`toggle-switch ${notifications.messageNotifications ? 'active' : ''}`}
                        onClick={() => toggleNotification('messageNotifications')}
                      >
                        <div className="toggle-handle"></div>
                      </div>
                    </div>
                    
                    <div className="toggle-group">
                      <div className="toggle-info">
                        <div className="toggle-label">Rechnungs-Erinnerungen</div>
                        <div className="toggle-description">Erinnerungen für fällige Rechnungen</div>
                      </div>
                      <div 
                        className={`toggle-switch ${notifications.invoiceReminders ? 'active' : ''}`}
                        onClick={() => toggleNotification('invoiceReminders')}
                      >
                        <div className="toggle-handle"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="notification-category">
                  <h4 className="category-title">Browser-Benachrichtigungen</h4>
                  <div className="notification-options">
                    <div className="toggle-group">
                      <div className="toggle-info">
                        <div className="toggle-label">Push-Benachrichtigungen</div>
                        <div className="toggle-description">Desktop-Benachrichtigungen im Browser</div>
                      </div>
                      <div 
                        className={`toggle-switch ${notifications.pushNotifications ? 'active' : ''}`}
                        onClick={() => toggleNotification('pushNotifications')}
                      >
                        <div className="toggle-handle"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="notification-category">
                  <h4 className="category-title">Marketing</h4>
                  <div className="notification-options">
                    <div className="toggle-group">
                      <div className="toggle-info">
                        <div className="toggle-label">Newsletter-Abonnement</div>
                        <div className="toggle-description">Updates und News per E-Mail</div>
                      </div>
                      <div 
                        className={`toggle-switch ${notifications.newsletterSubscription ? 'active' : ''}`}
                        onClick={() => toggleNotification('newsletterSubscription')}
                      >
                        <div className="toggle-handle"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  className="btn btn--primary"
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                >
                  {isSaving ? <HiRefresh className="spinning" /> : <HiBell />}
                  Einstellungen speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {/* System Settings - Admin Only */}
        {activeTab === 'system' && user.role === 'admin' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>System-Einstellungen</h3>
              <p className="section-description">
                Erweiterte Systemkonfiguration und Wartung
              </p>
            </div>
            
            <div className="section-content">
              <div className="system-overview">
                <h4>System-Status</h4>
                <div className="status-grid">
                  <div className="status-item">
                    <div className="status-info">
                      <div className="status-title">Database</div>
                      <div className="status-description">PostgreSQL Verbindung</div>
                    </div>
                    <div className="status-indicator enabled">
                      <span className="status-dot"></span>
                      Online
                    </div>
                  </div>
                  
                  <div className="status-item">
                    <div className="status-info">
                      <div className="status-title">E-Mail Service</div>
                      <div className="status-description">SMTP Server</div>
                    </div>
                    <div className="status-indicator enabled">
                      <span className="status-dot"></span>
                      Aktiv
                    </div>
                  </div>
                  
                  <div className="status-item">
                    <div className="status-info">
                      <div className="status-title">File Storage</div>
                      <div className="status-description">Cloud Storage</div>
                    </div>
                    <div className="status-indicator enabled">
                      <span className="status-dot"></span>
                      Verfügbar
                    </div>
                  </div>
                  
                  <div className="status-item">
                    <div className="status-info">
                      <div className="status-title">Backup Service</div>
                      <div className="status-description">Automatische Sicherung</div>
                    </div>
                    <div className="status-indicator disabled">
                      <span className="status-dot"></span>
                      Inaktiv
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="system-stats">
                <h4>System-Statistiken</h4>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h5>Registrierte Benutzer</h5>
                    <span className="stat-value">42</span>
                  </div>
                  <div className="stat-card">
                    <h5>Aktive Projekte</h5>
                    <span className="stat-value">18</span>
                  </div>
                  <div className="stat-card">
                    <h5>Newsletter-Abonnenten</h5>
                    <span className="stat-value">156</span>
                  </div>
                  <div className="stat-card">
                    <h5>API-Aufrufe (heute)</h5>
                    <span className="stat-value">1,247</span>
                  </div>
                </div>
              </div>
              
              <div className="system-actions">
                <h4>System-Aktionen</h4>
                <div className="action-buttons">
                  <button className="btn btn--secondary">
                    <HiDatabase />
                    Backup erstellen
                  </button>
                  <button className="btn btn--secondary">
                    <HiRefresh />
                    Cache leeren
                  </button>
                  <button className="btn btn--secondary">
                    <HiDownload />
                    Logs exportieren
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management - Admin Only */}
        {activeTab === 'users' && user.role === 'admin' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>Benutzer-Verwaltung</h3>
              <p className="section-description">
                Verwalte Benutzeraccounts und Berechtigungen
              </p>
            </div>
            
            <div className="section-content">
              <div className="user-stats">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">42</div>
                    <div className="stat-label">Gesamt Benutzer</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">38</div>
                    <div className="stat-label">Kunden</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">4</div>
                    <div className="stat-label">Administratoren</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">12</div>
                    <div className="stat-label">Aktiv heute</div>
                  </div>
                </div>
              </div>
              
              <div className="user-actions">
                <div className="action-buttons">
                  <button className="btn btn--primary">
                    <HiUser />
                    Neuen Benutzer hinzufügen
                  </button>
                  <button className="btn btn--secondary">
                    <HiDownload />
                    Benutzerliste exportieren
                  </button>
                  <button className="btn btn--secondary">
                    <HiMail />
                    Massen-E-Mail senden
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data & Privacy */}
        <div className="settings-section">
          <div className="section-header">
            <h3>Daten & Datenschutz</h3>
            <p className="section-description">
              Verwalte deine Daten und Datenschutzeinstellungen
            </p>
          </div>
          
          <div className="section-content">
            <div className="data-actions">
              <div className="action-item">
                <div className="action-info">
                  <div className="action-title">Daten exportieren</div>
                  <div className="action-description">
                    Lade eine Kopie aller deiner Daten herunter
                  </div>
                </div>
                <button className="btn btn--secondary" onClick={handleExportData}>
                  <HiDownload />
                  Exportieren
                </button>
              </div>
              
              <div className="action-item">
                <div className="action-info">
                  <div className="action-title">Account-Informationen</div>
                  <div className="action-description">
                    Erstellt am: {new Date(user.createdAt).toLocaleDateString('de-DE')}
                  </div>
                </div>
                <div className="info-badge">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} Tage
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="section-header">
            <h3>Gefahrenzone</h3>
            <p className="section-description">
              Irreversible Aktionen - Vorsicht beim Verwenden
            </p>
          </div>
          <div className="section-content">
            <div className="danger-item">
              <div className="danger-info">
                <div className="danger-title">Account löschen</div>
                <div className="danger-description">
                  Lösche deinen Account und alle zugehörigen Daten permanent
                </div>
              </div>
              <div className="danger-action">
                <button 
                  className="btn btn--danger"
                  onClick={handleDeleteAccount}
                >
                  <HiTrash />
                  Account löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner">
            <HiRefresh />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;