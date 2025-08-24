// src/Pages/Dashboard/Components/DashboardSettings.tsx
// NEU: Settings-Component mit 2FA + Geschäftsdaten (Mockup)
import React, { useState } from 'react';
import { 
  HiUser,
  HiBriefcase,
  HiShieldCheck,
  HiKey,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiCog,
  HiSave,
  HiEye,
  HiEyeOff,
  HiQrcode,
  HiClipboardCopy,
  HiCheck
} from 'react-icons/hi';
import { DashboardSettingsProps } from '../Types/DashboardTypes';

const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  user,
  userRole,
  onUserUpdate
}) => {
  // Form States
  const [personalData, setPersonalData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    company: user.company || ''
  });

  const [businessData, setBusinessData] = useState({
    taxId: user.businessData?.taxId || '',
    vatNumber: user.businessData?.vatNumber || '',
    phone: user.businessData?.phone || '',
    website: user.businessData?.website || '',
    address: {
      street: user.businessData?.address?.street || '',
      city: user.businessData?.address?.city || '',
      postalCode: user.businessData?.address?.postalCode || '',
      country: user.businessData?.address?.country || 'Deutschland'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // 2FA States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.twoFactorAuth?.enabled || false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // UI States
  const [activeTab, setActiveTab] = useState<'personal' | 'business' | 'security' | 'system'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Mock Backup Codes für 2FA
  const mockBackupCodes = [
    'A1B2-C3D4-E5F6',
    'G7H8-I9J0-K1L2',
    'M3N4-O5P6-Q7R8',
    'S9T0-U1V2-W3X4',
    'Y5Z6-A7B8-C9D0',
    'E1F2-G3H4-I5J6',
    'K7L8-M9N0-O1P2',
    'Q3R4-S5T6-U7V8'
  ];

  const handleSavePersonalData = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      console.log('💾 SAVING PERSONAL DATA:', personalData);
      
      // TODO: Implement real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      onUserUpdate({
        ...user,
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        email: personalData.email,
        company: personalData.company
      });
      
      setSaveMessage('Persönliche Daten erfolgreich gespeichert!');
      
    } catch (error) {
      setSaveMessage('Fehler beim Speichern der Daten.');
      console.error('❌ Save personal data error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBusinessData = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      console.log('🏢 SAVING BUSINESS DATA:', businessData);
      
      // TODO: Implement real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      onUserUpdate({
        ...user,
        businessData: businessData
      });
      
      setSaveMessage('Geschäftsdaten erfolgreich gespeichert!');
      
    } catch (error) {
      setSaveMessage('Fehler beim Speichern der Geschäftsdaten.');
      console.error('❌ Save business data error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveMessage('Neue Passwörter stimmen nicht überein.');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setSaveMessage('Neues Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }
    
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      console.log('🔑 CHANGING PASSWORD');
      
      // TODO: Implement real API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveMessage('Passwort erfolgreich geändert!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
    } catch (error) {
      setSaveMessage('Fehler beim Ändern des Passworts.');
      console.error('❌ Password change error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      if (!twoFactorEnabled) {
        // 2FA aktivieren
        console.log('🔐 ENABLING 2FA');
        setShowQRCode(true);
        setBackupCodes(mockBackupCodes);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTwoFactorEnabled(true);
        setSaveMessage('2FA wurde erfolgreich aktiviert!');
        
      } else {
        // 2FA deaktivieren
        console.log('🔓 DISABLING 2FA');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTwoFactorEnabled(false);
        setShowQRCode(false);
        setBackupCodes([]);
        setSaveMessage('2FA wurde deaktiviert.');
      }
      
      // Update user data
      onUserUpdate({
        ...user,
        twoFactorAuth: {
          enabled: !twoFactorEnabled,
          backupCodes: !twoFactorEnabled ? mockBackupCodes : [],
          lastUsed: new Date().toISOString()
        }
      });
      
    } catch (error) {
      setSaveMessage('Fehler beim Ändern der 2FA-Einstellungen.');
      console.error('❌ 2FA toggle error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('❌ Copy to clipboard failed:', error);
    }
  };

  const tabs = [
    { id: 'personal' as const, label: 'Persönliche Daten', icon: HiUser },
    { id: 'business' as const, label: 'Geschäftsdaten', icon: HiBriefcase },
    { id: 'security' as const, label: 'Sicherheit', icon: HiShieldCheck },
    ...(userRole === 'admin' ? [{ id: 'system' as const, label: 'System', icon: HiCog }] : [])
  ];

  return (
    <div className="view-content">
      <div className="view-header">
        <h1>Einstellungen</h1>
        <p>Verwalten Sie Ihre Konto- und Sicherheitseinstellungen</p>
      </div>

      <div className="settings-container">
        {/* Tab Navigation */}
        <div className="settings-tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent className="icon icon--btn" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`save-message ${saveMessage.includes('Fehler') ? 'error' : 'success'}`}>
            {saveMessage}
          </div>
        )}

        {/* Tab Contents */}
        <div className="settings-content">
          
          {/* PERSÖNLICHE DATEN */}
          {activeTab === 'personal' && (
            <div className="settings-section">
              <h2>
                <HiUser className="icon icon--action" />
                Persönliche Daten
              </h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Vorname</label>
                  <input
                    type="text"
                    value={personalData.firstName}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Ihr Vorname"
                  />
                </div>
                
                <div className="form-group">
                  <label>Nachname</label>
                  <input
                    type="text"
                    value={personalData.lastName}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Ihr Nachname"
                  />
                </div>
                
                <div className="form-group">
                  <label>E-Mail-Adresse</label>
                  <input
                    type="email"
                    value={personalData.email}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ihre@email.com"
                  />
                </div>
                
                <div className="form-group">
                  <label>Unternehmen</label>
                  <input
                    type="text"
                    value={personalData.company}
                    onChange={(e) => setPersonalData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Ihr Unternehmen (optional)"
                  />
                </div>
              </div>
              
              <button 
                className="btn btn--primary"
                onClick={handleSavePersonalData}
                disabled={isSaving}
              >
                <HiSave className="icon icon--btn" />
                {isSaving ? 'Speichere...' : 'Änderungen speichern'}
              </button>
            </div>
          )}

          {/* GESCHÄFTSDATEN */}
          {activeTab === 'business' && (
            <div className="settings-section">
              <h2>
                <HiBriefcase className="icon icon--action" />
                Geschäftsdaten
              </h2>
              <p className="section-description">
                Diese Daten werden für Rechnungen und steuerliche Zwecke verwendet.
              </p>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Steuer-ID</label>
                  <input
                    type="text"
                    value={businessData.taxId}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, taxId: e.target.value }))}
                    placeholder="12345/67890"
                  />
                </div>
                
                <div className="form-group">
                  <label>USt-IdNr.</label>
                  <input
                    type="text"
                    value={businessData.vatNumber}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, vatNumber: e.target.value }))}
                    placeholder="DE123456789"
                  />
                </div>
                
                <div className="form-group">
                  <label>Telefon</label>
                  <input
                    type="tel"
                    value={businessData.phone}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+49 123 456789"
                  />
                </div>
                
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={businessData.website}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://ihre-website.de"
                  />
                </div>
              </div>
              
              <h3>Geschäftsadresse</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Straße und Hausnummer</label>
                  <input
                    type="text"
                    value={businessData.address.street}
                    onChange={(e) => setBusinessData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, street: e.target.value }
                    }))}
                    placeholder="Musterstraße 123"
                  />
                </div>
                
                <div className="form-group">
                  <label>PLZ</label>
                  <input
                    type="text"
                    value={businessData.address.postalCode}
                    onChange={(e) => setBusinessData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, postalCode: e.target.value }
                    }))}
                    placeholder="12345"
                  />
                </div>
                
                <div className="form-group">
                  <label>Stadt</label>
                  <input
                    type="text"
                    value={businessData.address.city}
                    onChange={(e) => setBusinessData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    placeholder="Musterstadt"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Land</label>
                  <select
                    value={businessData.address.country}
                    onChange={(e) => setBusinessData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, country: e.target.value }
                    }))}
                  >
                    <option value="Deutschland">Deutschland</option>
                    <option value="Österreich">Österreich</option>
                    <option value="Schweiz">Schweiz</option>
                  </select>
                </div>
              </div>
              
              <button 
                className="btn btn--primary"
                onClick={handleSaveBusinessData}
                disabled={isSaving}
              >
                <HiSave className="icon icon--btn" />
                {isSaving ? 'Speichere...' : 'Geschäftsdaten speichern'}
              </button>
            </div>
          )}

          {/* SICHERHEIT */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>
                <HiShieldCheck className="icon icon--action" />
                Sicherheitseinstellungen
              </h2>
              
              {/* Passwort ändern */}
              <div className="security-subsection">
                <h3>
                  <HiKey className="icon icon--detail" />
                  Passwort ändern
                </h3>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Aktuelles Passwort</label>
                    <div className="password-input">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Aktuelles Passwort"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="password-toggle"
                      >
                        {showPasswords.current ? <HiEyeOff /> : <HiEye />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Neues Passwort</label>
                    <div className="password-input">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Neues Passwort"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="password-toggle"
                      >
                        {showPasswords.new ? <HiEyeOff /> : <HiEye />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Neues Passwort bestätigen</label>
                    <div className="password-input">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Neues Passwort bestätigen"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="password-toggle"
                      >
                        {showPasswords.confirm ? <HiEyeOff /> : <HiEye />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn btn--secondary"
                  onClick={handlePasswordChange}
                  disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword}
                >
                  <HiKey className="icon icon--btn" />
                  {isSaving ? 'Ändere...' : 'Passwort ändern'}
                </button>
              </div>
              
              {/* 2FA Einstellungen */}
              <div className="security-subsection">
                <h3>
                  <HiShieldCheck className="icon icon--detail" />
                  Zwei-Faktor-Authentifizierung (2FA)
                </h3>
                <p className="section-description">
                  Zusätzliche Sicherheit durch einen zweiten Authentifizierungsschritt.
                </p>
                
                <div className="twofa-status">
                  <div className={`status-indicator ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                    <span className="status-dot"></span>
                    <span>2FA ist {twoFactorEnabled ? 'aktiviert' : 'deaktiviert'}</span>
                  </div>
                  
                  <button 
                    className={`btn ${twoFactorEnabled ? 'btn--secondary' : 'btn--primary'}`}
                    onClick={handleToggle2FA}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Verarbeite...' : (twoFactorEnabled ? '2FA deaktivieren' : '2FA aktivieren')}
                  </button>
                </div>
                
                {/* QR Code für 2FA Setup */}
                {showQRCode && !twoFactorEnabled && (
                  <div className="twofa-setup">
                    <h4>2FA einrichten</h4>
                    <div className="qr-code-section">
                      <div className="qr-code-placeholder">
                        <HiQrcode className="icon icon--project-type" />
                        <p>QR-Code für Authenticator-App</p>
                        <small>Scannen Sie diesen Code mit Google Authenticator, Authy oder einer ähnlichen App</small>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Backup Codes */}
                {backupCodes.length > 0 && twoFactorEnabled && (
                  <div className="backup-codes">
                    <h4>Backup-Codes</h4>
                    <p className="section-description">
                      Speichern Sie diese Codes sicher. Sie können jeden Code nur einmal verwenden.
                    </p>
                    <div className="codes-grid">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="backup-code">
                          <span className="code">{code}</span>
                          <button
                            onClick={() => copyToClipboard(code, `code-${index}`)}
                            className="copy-button"
                            title="Code kopieren"
                          >
                            {copied === `code-${index}` ? <HiCheck /> : <HiClipboardCopy />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SYSTEM (nur Admin) */}
          {activeTab === 'system' && userRole === 'admin' && (
            <div className="settings-section">
              <h2>
                <HiCog className="icon icon--action" />
                System-Einstellungen
              </h2>
              <p className="section-description">
                Administrator-Einstellungen für das gesamte System.
              </p>
              
              <div className="system-settings">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Newsletter-Service</h4>
                    <p>Status des E-Mail-Newsletter-Systems</p>
                  </div>
                  <div className="setting-status">
                    <span className="status-indicator enabled">
                      <span className="status-dot"></span>
                      Aktiv
                    </span>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Automatische Backups</h4>
                    <p>Tägliche Sicherung der Datenbank</p>
                  </div>
                  <div className="setting-status">
                    <span className="status-indicator enabled">
                      <span className="status-dot"></span>
                      Aktiv
                    </span>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>OAuth-Integration</h4>
                    <p>Google und GitHub Anmeldung</p>
                  </div>
                  <div className="setting-status">
                    <span className="status-indicator enabled">
                      <span className="status-dot"></span>
                      Aktiv
                    </span>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>API-Rate Limiting</h4>
                    <p>Schutz vor API-Missbrauch</p>
                  </div>
                  <div className="setting-status">
                    <span className="status-indicator enabled">
                      <span className="status-dot"></span>
                      Aktiv
                    </span>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Debug-Modus</h4>
                    <p>Erweiterte Protokollierung für Entwicklung</p>
                  </div>
                  <div className="setting-status">
                    <span className="status-indicator disabled">
                      <span className="status-dot"></span>
                      Inaktiv
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="system-stats">
                <h3>System-Statistiken</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h4>Registrierte Benutzer</h4>
                    <span className="stat-value">42</span>
                  </div>
                  <div className="stat-card">
                    <h4>Aktive Projekte</h4>
                    <span className="stat-value">18</span>
                  </div>
                  <div className="stat-card">
                    <h4>Newsletter-Abonnenten</h4>
                    <span className="stat-value">156</span>
                  </div>
                  <div className="stat-card">
                    <h4>API-Aufrufe (heute)</h4>
                    <span className="stat-value">1,247</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;