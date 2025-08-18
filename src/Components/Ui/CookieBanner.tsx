import React, { useState, useEffect } from 'react';
import './CookieBanner.scss';
import { FaCookie, FaShieldAlt, FaChartLine, FaTimes } from 'react-icons/fa';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieBanner: React.FC = () => {
  // ⚠️ TEST MODE - WICHTIG: Vor Production auf false setzen!
  const TEST_MODE = false; // TODO: Auf false setzen für Production
  
  // Alternative: Nutze Environment Variable
  // const TEST_MODE = process.env.NODE_ENV === 'development';
  
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Immer true, kann nicht geändert werden
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    // Test Mode Check
    const urlParams = new URLSearchParams(window.location.search);
    const forceShow = urlParams.get('showcookie') === 'true';
    
    if (TEST_MODE || forceShow) {
      // Im Test-Modus immer zeigen
      setTimeout(() => setIsVisible(true), 500);
      return;
    }
    
    // Normale Logik: Prüfe ob Cookie-Einstellungen bereits gespeichert wurden
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (!savedPreferences) {
      // Zeige Banner nach kurzer Verzögerung
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    savePreferences(allAccepted);
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    savePreferences(onlyNecessary);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    // Im Test-Modus nicht speichern, damit Banner beim Reload wieder erscheint
    if (!TEST_MODE) {
      localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
    }
    
    setIsVisible(false);
    
    // Hier könntest du Analytics-Tools initialisieren basierend auf den Präferenzen
    if (prefs.analytics) {
      console.log('Analytics cookies aktiviert');
      // initializeAnalytics();
    }
    if (prefs.marketing) {
      console.log('Marketing cookies aktiviert');
      // initializeMarketing();
    }
  };

  const togglePreference = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return; // Notwendige Cookies können nicht deaktiviert werden
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!isVisible) return null;

  // Development Helper - Füge diese Funktion in die Browser-Konsole ein
  if (TEST_MODE && typeof window !== 'undefined') {
    (window as any).resetCookieBanner = () => {
      localStorage.removeItem('cookiePreferences');
      localStorage.removeItem('cookieConsentDate');
      window.location.reload();
    };
    console.log('🍪 Cookie Banner Test Mode aktiv!');
    console.log('📝 Nutze window.resetCookieBanner() zum Zurücksetzen');
    console.log('🔗 Oder füge ?showcookie=true zur URL hinzu');
  }

  return (
    <>
      {/* Backdrop */}
      <div className="cookie-banner-backdrop" onClick={() => setIsVisible(false)} />
      
      {/* Cookie Banner Modal */}
      <div className="cookie-banner">
        <div className="cookie-banner__container">
          {/* Header */}
          <div className="cookie-banner__header">
            <div className="cookie-banner__icon">
              <FaCookie />
            </div>
            <h2 className="cookie-banner__title">
              Cookie-Einstellungen
              {TEST_MODE && <span className="test-badge">TEST</span>}
            </h2>
            <button 
              className="cookie-banner__close"
              onClick={() => setIsVisible(false)}
              aria-label="Schließen"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          <div className="cookie-banner__content">
            <p className="cookie-banner__description">
              Wir verwenden Cookies, um deine Erfahrung auf unserer Website zu verbessern. 
              Du kannst deine Präferenzen jederzeit ändern.
            </p>

            {/* Quick Actions (wenn Details nicht angezeigt werden) */}
            {!showDetails && (
              <div className="cookie-banner__quick-actions">
                <button 
                  className="cookie-banner__button cookie-banner__button--reject"
                  onClick={handleRejectAll}
                >
                  Nur notwendige
                </button>
                <button 
                  className="cookie-banner__button cookie-banner__button--settings"
                  onClick={() => setShowDetails(true)}
                >
                  Einstellungen
                </button>
                <button 
                  className="cookie-banner__button cookie-banner__button--accept"
                  onClick={handleAcceptAll}
                >
                  Alle akzeptieren
                </button>
              </div>
            )}

            {/* Detailed Settings */}
            {showDetails && (
              <div className="cookie-banner__details">
                {/* Necessary Cookies */}
                <div className="cookie-category">
                  <div className="cookie-category__header">
                    <div className="cookie-category__info">
                      <FaShieldAlt className="cookie-category__icon" />
                      <div>
                        <h3 className="cookie-category__title">Notwendige Cookies</h3>
                        <p className="cookie-category__description">
                          Diese Cookies sind für die Grundfunktionen der Website erforderlich.
                        </p>
                      </div>
                    </div>
                    <div className="cookie-toggle cookie-toggle--disabled">
                      <input 
                        type="checkbox" 
                        checked={preferences.necessary}
                        disabled
                        readOnly
                      />
                      <span className="cookie-toggle__slider"></span>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="cookie-category">
                  <div className="cookie-category__header">
                    <div className="cookie-category__info">
                      <FaChartLine className="cookie-category__icon" />
                      <div>
                        <h3 className="cookie-category__title">Analyse-Cookies</h3>
                        <p className="cookie-category__description">
                          Helfen uns zu verstehen, wie Besucher mit der Website interagieren.
                        </p>
                      </div>
                    </div>
                    <div 
                      className="cookie-toggle"
                      onClick={() => togglePreference('analytics')}
                    >
                      <input 
                        type="checkbox" 
                        checked={preferences.analytics}
                        onChange={() => {}} // Handled by parent onClick
                        readOnly
                      />
                      <span className="cookie-toggle__slider"></span>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="cookie-category">
                  <div className="cookie-category__header">
                    <div className="cookie-category__info">
                      <FaCookie className="cookie-category__icon" />
                      <div>
                        <h3 className="cookie-category__title">Marketing-Cookies</h3>
                        <p className="cookie-category__description">
                          Werden verwendet, um Werbung relevanter zu gestalten.
                        </p>
                      </div>
                    </div>
                    <div 
                      className="cookie-toggle"
                      onClick={() => togglePreference('marketing')}
                    >
                      <input 
                        type="checkbox" 
                        checked={preferences.marketing}
                        onChange={() => {}} // Handled by parent onClick
                        readOnly
                      />
                      <span className="cookie-toggle__slider"></span>
                    </div>
                  </div>
                </div>

                {/* Detail Actions */}
                <div className="cookie-banner__detail-actions">
                  <button 
                    className="cookie-banner__button cookie-banner__button--back"
                    onClick={() => setShowDetails(false)}
                  >
                    Zurück
                  </button>
                  <button 
                    className="cookie-banner__button cookie-banner__button--save"
                    onClick={handleAcceptSelected}
                  >
                    Auswahl speichern
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="cookie-banner__footer">
            <a href="/datenschutz" className="cookie-banner__link">
              Datenschutzerklärung
            </a>
            <a href="/impressum" className="cookie-banner__link">
              Impressum
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieBanner;