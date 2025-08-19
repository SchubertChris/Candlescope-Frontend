// src/Pages/Kontakt/Kontakt-Index.tsx
// BEREINIGT: Keine doppelten Deklarationen
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Kontakt-Index.scss';

// Interface für Kontaktformular
interface ContactFormData {
  name: string;
  email: string;
  projekt: string;
  nachricht: string;
}

// Interface für URL-Parameter
interface LocationState {
  projekt?: string;
}

// EINZIGE DEKLARATION: KontaktIndex Komponente
const KontaktIndex: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State für Formular
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projekt: '',
    nachricht: ''
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // URL-Parameter auslesen (für Projekt-Vorauswahl)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const projektParam = searchParams.get('projekt');
    
    if (projektParam) {
      setFormData(prev => ({
        ...prev,
        projekt: projektParam
      }));
    }
  }, [location]);

  // Input-Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form-Submit-Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      // Hier würde der API-Call zur Kontakt-Übermittlung stehen
      // const response = await contactService.sendMessage(formData);
      
      // Simuliere API-Call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      
      // Formular nach erfolgreichem Senden zurücksetzen
      setFormData({
        name: '',
        email: '',
        projekt: '',
        nachricht: ''
      });
      
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="kontakt-page">
      <div className="kontakt-container">
        <header className="kontakt-header">
          <h1>Kontakt aufnehmen</h1>
          <p>Lassen Sie uns über Ihr Projekt sprechen</p>
        </header>

        <div className="kontakt-content">
          <div className="contact-info">
            <h2>Kontaktinformationen</h2>
            <div className="info-item">
              <strong>E-Mail:</strong>
              <span>schubert_chris@rocketmail.com</span>
            </div>
            <div className="info-item">
              <strong>Telefon:</strong>
              <span>0160 941 683 48</span>
            </div>
            <div className="info-item">
              <strong>Standort:</strong>
              <span>Potsdam, Brandenburg</span>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-Mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="projekt">Projekt-Typ</label>
              <select
                id="projekt"
                name="projekt"
                value={formData.projekt}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option value="">Bitte wählen...</option>
                <option value="website">Website</option>
                <option value="bewerbung">Bewerbungsseite</option>
                <option value="newsletter">Newsletter-System</option>
                <option value="custom">Individuelles Projekt</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nachricht">Nachricht *</label>
              <textarea
                id="nachricht"
                name="nachricht"
                value={formData.nachricht}
                onChange={handleInputChange}
                rows={5}
                required
                disabled={isLoading}
                placeholder="Beschreiben Sie Ihr Projekt..."
              />
            </div>

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Wird gesendet...' : 'Nachricht senden'}
            </button>

            {submitStatus === 'success' && (
              <div className="status-message success">
                ✅ Ihre Nachricht wurde erfolgreich gesendet!
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="status-message error">
                ❌ Fehler beim Senden. Bitte versuchen Sie es erneut.
              </div>
            )}
          </form>
        </div>

        <div className="back-navigation">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
          >
            ← Zurück zur Startseite
          </button>
        </div>
      </div>
    </div>
  );
};

// EINZIGER EXPORT: Default Export
export default KontaktIndex;