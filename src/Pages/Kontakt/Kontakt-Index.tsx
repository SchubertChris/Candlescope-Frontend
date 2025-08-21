// src/Pages/Kontakt/Kontakt-Index.tsx
// VOLLSTÄNDIG KORRIGIERT: Port-Fix, API-URL-Logik, Robuste Fehlerbehandlung

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Mail, Phone, MapPin, Star, X, Clock, CheckCircle, Gift, Users, ChevronDown } from 'lucide-react';
import AnimatedBackground from '@/Components/Ui/AnimatedBackground';
import './Kontakt-Index.scss';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  newsletter: boolean;
}

const KontaktIndex: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'website',
    budget: '',
    timeline: '',
    message: '',
    newsletter: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  
  // Dropdown States
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [showTimelineDropdown, setShowTimelineDropdown] = useState(false);
  const budgetDropdownRef = useRef<HTMLDivElement>(null);
  const timelineDropdownRef = useRef<HTMLDivElement>(null);
  
  // Field Focus States
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Auto-Close Dropdown bei Klick außerhalb
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (budgetDropdownRef.current && !budgetDropdownRef.current.contains(event.target as Node)) {
      setShowBudgetDropdown(false);
    }
    if (timelineDropdownRef.current && !timelineDropdownRef.current.contains(event.target as Node)) {
      setShowTimelineDropdown(false);
    }
  }, []);

  // Keyboard Navigation für Dropdowns
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowBudgetDropdown(false);
      setShowTimelineDropdown(false);
    }
  }, []);

  // Event Listeners für bessere UX
  useEffect(() => {
    if (showBudgetDropdown || showTimelineDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showBudgetDropdown, showTimelineDropdown, handleClickOutside, handleKeyDown]);

  // Pop-up nur einmal pro Session
  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem('hasSeenPromoPopup');
    
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setShowPromoPopup(true);
        sessionStorage.setItem('hasSeenPromoPopup', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  // KORRIGIERT: Backend-Integration mit korrektem Port
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      console.log('📧 SENDING CONTACT REQUEST...');
      console.log('📊 Form Data:', formData);
      
      // KORRIGIERT: API URL mit richtigem Port (5000)
      let apiUrl: string;
      
      if (import.meta.env.VITE_API_BASE_URL) {
        // Production oder explizit gesetzt
        apiUrl = `${import.meta.env.VITE_API_BASE_URL}/contact`;
        console.log('🔗 Using VITE_API_BASE_URL:', apiUrl);
      } else if (import.meta.env.DEV) {
        // Development: Backend läuft auf Port 5000 (aus deiner .env)
        apiUrl = 'http://localhost:5000/api/contact';
        console.log('🔗 Development URL (hardcoded):', apiUrl);
      } else {
        // Production Fallback
        apiUrl = '/api/contact';
        console.log('🔗 Production URL:', apiUrl);
      }
      
      console.log('🎯 Final API URL:', apiUrl);
      
      // KORRIGIERT: Request-Daten aufbereiten
      const requestData = {
        ...formData,
        source: 'contact_page',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      
      console.log('📤 Sending request data:', requestData);
      
      // KORRIGIERT: Fetch mit expliziten Headers
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // HINZUGEFÜGT: Explicit CORS headers für Development
          'Access-Control-Allow-Origin': '*'
        },
        // HINZUGEFÜGT: Credentials für CORS
        credentials: import.meta.env.DEV ? 'omit' : 'include',
        body: JSON.stringify(requestData)
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // KORRIGIERT: Response Text für besseres Debugging
      const responseText = await response.text();
      console.log('📄 Raw response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON PARSE ERROR:', parseError);
        console.error('📄 Response was:', responseText.substring(0, 200));
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`);
      }
      
      console.log('📨 Parsed response:', result);
      
      if (!response.ok) {
        console.error('❌ HTTP ERROR:', response.status, response.statusText);
        console.error('📄 Error response:', result);
        
        throw new Error(
          result?.message || 
          `HTTP ${response.status}: ${response.statusText}`
        );
      }
      
      if (result.success) {
        console.log('✅ CONTACT FORM SUCCESS');
        setSubmitStatus('success');
        
        // Analytics-Tracking
        try {
          const gtagFunc = (window as any).gtag;
          if (gtagFunc && typeof gtagFunc === 'function') {
            gtagFunc('event', 'contact_form_submit', {
              event_category: 'engagement',
              event_label: formData.projectType,
              value: 1
            });
            console.log('📊 Analytics event sent');
          }
        } catch (analyticsError) {
          console.warn('⚠️ Analytics tracking failed:', analyticsError);
        }
        
        // Formular zurücksetzen
        setFormData({
          name: '', email: '', phone: '', company: '',
          projectType: 'website', budget: '', timeline: '',
          message: '', newsletter: false
        });
        
        // Scroll to success message
        setTimeout(() => {
          const successElement = document.querySelector('.success-message');
          if (successElement) {
            successElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
        
      } else {
        console.error('❌ Backend returned error:', result.message);
        throw new Error(result.message || 'Unbekannter Serverfehler');
      }
      
    } catch (error: any) {
      console.error('❌ CONTACT FORM ERROR:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      setSubmitStatus('error');
      
      // KORRIGIERT: User-freundliche Fehlermeldung
      let userMessage = 'Ein Fehler ist aufgetreten. ';
      
      if (error.message.includes('Failed to fetch')) {
        userMessage += 'Bitte prüfe deine Internetverbindung und versuche es erneut.';
      } else if (error.message.includes('JSON')) {
        userMessage += 'Server-Antwort ungültig. Bitte versuche es erneut.';
      } else if (error.message.includes('HTTP 404')) {
        userMessage += 'Backend-Service nicht erreichbar. Ist der Server gestartet?';
      } else if (error.message.includes('HTTP 500')) {
        userMessage += 'Server-Fehler. Bitte kontaktiere mich direkt.';
      } else if (error.message.includes('CORS')) {
        userMessage += 'Verbindungsfehler. Bitte lade die Seite neu.';
      } else {
        userMessage += error.message;
      }
      
      console.log('💬 User message:', userMessage);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Custom Select Handler mit automatischem Schließen
  const handleSelectChange = (field: 'budget' | 'timeline', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Alle Dropdowns schließen
    setShowBudgetDropdown(false);
    setShowTimelineDropdown(false);
    
    // Kurzes Feedback für User
    const button = field === 'budget' ? budgetDropdownRef.current : timelineDropdownRef.current;
    if (button) {
      button.style.transform = 'scale(0.98)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
  };

  // Toggle-Funktionen für bessere UX
  const toggleBudgetDropdown = () => {
    setShowBudgetDropdown(!showBudgetDropdown);
    setShowTimelineDropdown(false); // Anderen schließen
  };

  const toggleTimelineDropdown = () => {
    setShowTimelineDropdown(!showTimelineDropdown);
    setShowBudgetDropdown(false); // Anderen schließen
  };

  // Projekt-Typen mit korrekten Preisen
  const projectTypes = [
    { value: 'website', label: 'Website Development', price: 'ab 2.500€', icon: '🌐', description: 'Moderne Websites mit React/TypeScript' },
    { value: 'ecommerce', label: 'E-Commerce Platform', price: 'ab 5.000€', icon: '🛒', description: 'Online-Shops mit Payment-Integration' },
    { value: 'bewerbung', label: 'Bewerbungsseite', price: 'ab 1.200€', icon: '📋', description: 'Professionelle Online-Bewerbung' },
    { value: 'newsletter', label: 'Newsletter-System', price: 'ab 800€', icon: '📧', description: 'E-Mail-Marketing & Automation' },
    { value: 'consulting', label: 'IT Consulting', price: 'ab 150€/h', icon: '🎯', description: 'Technische Beratung & Code-Review' }
  ];

  // Budget-Optionen für Custom Select
  const budgetOptions = [
    { value: '', label: 'Budget wählen', disabled: true },
    { value: 'unter-2500', label: 'Unter 2.500€' },
    { value: '2500-5000', label: '2.500€ - 5.000€' },
    { value: '5000-10000', label: '5.000€ - 10.000€' },
    { value: '10000-plus', label: 'Über 10.000€' }
  ];

  // Timeline-Optionen für Custom Select
  const timelineOptions = [
    { value: '', label: 'Zeitrahmen wählen', disabled: true },
    { value: 'asap', label: 'So schnell wie möglich' },
    { value: '1-month', label: 'Innerhalb 1 Monat' },
    { value: '2-3-months', label: '2-3 Monate' },
    { value: 'flexible', label: 'Flexibel' }
  ];

  // Empfohlene Tools für Pop-up
  const affiliateProducts = [
    {
      title: "Hostinger Premium",
      description: "Blitzschnelles Webhosting für deine Website",
      price: "2,99€/Monat",
      discount: "75% Rabatt",
      affiliate: "https://hostinger.com?ref=chris-schubert",
      commission: "Partnerlink"
    },
    {
      title: "Elementor Pro",
      description: "Professioneller Website Builder",
      price: "49$/Jahr",
      discount: "20% Rabatt", 
      affiliate: "https://elementor.com?ref=chris-schubert",
      commission: "Tool-Empfehlung"
    }
  ];

  return (
    <div className="kontakt-page" id="contact">
      {/* AnimatedBackground für Konsistenz */}
      <AnimatedBackground />

      {/* Promo Pop-up nur einmal pro Session */}
      {showPromoPopup && (
        <div className="promo-popup-overlay" onClick={() => setShowPromoPopup(false)}>
          <div className="promo-popup" onClick={(e) => e.stopPropagation()}>
            <button 
              className="popup-close"
              onClick={() => setShowPromoPopup(false)}
              aria-label="Schließen"
            >
              <X size={20} />
            </button>
            
            <div className="popup-header">
              <Gift className="popup-icon" />
              <h3>Exklusive Tool-Empfehlungen</h3>
              <p>Tools, die ich täglich für erfolgreiche Projekte nutze</p>
            </div>

            <div className="popup-content">
              {affiliateProducts.map((product, index) => (
                <div key={index} className="popup-product">
                  <div className="popup-product-header">
                    <h4>{product.title}</h4>
                    <span className="popup-price">{product.price}</span>
                  </div>
                  <p>{product.description}</p>
                  
                  {product.discount && (
                    <div className="popup-discount">
                      {product.discount}
                    </div>
                  )}
                  
                  <a 
                    href={product.affiliate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="popup-cta"
                  >
                    Jetzt entdecken
                  </a>
                  
                  <span className="popup-commission">{product.commission}</span>
                </div>
              ))}
            </div>

            <div className="popup-footer">
              <p>💡 Diese Tools nutze ich täglich - Keine Mehrkosten für dich</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="kontakt-container">
          <h1 className="page-title">
            Lass uns dein Projekt
            <span className="highlight"> zum Leben erwecken</span>
          </h1>
          <p className="page-subtitle">
            Von der ersten Idee bis zur erfolgreichen Umsetzung - ich begleite dich mit über 13 Jahren Erfahrung 
            in Service und modernen Web-Technologien.
          </p>
        </div>
      </div>

      <div className="kontakt-container">
        <div className="kontakt-content">
          
          {/* HAUPTFORMULAR */}
          <div className="contact-form-section">
            
            {submitStatus === 'success' && (
              <div className="success-message">
                <CheckCircle className="success-icon" />
                <div>
                  <h3>Nachricht erfolgreich gesendet! 🎉</h3>
                  <p>Ich melde mich innerhalb von 24 Stunden bei dir. Check auch dein E-Mail-Postfach für eine Bestätigung.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="error-message">
                <strong>Fehler beim Senden!</strong><br/>
                Bitte versuche es erneut oder kontaktiere mich direkt per E-Mail: 
                <a href="mailto:schubert_chris@rocketmail.com">schubert_chris@rocketmail.com</a>
              </div>
            )}

            <h2 className="section-title">Kostenlose Projekt-Beratung</h2>

            <form className="contact-form" onSubmit={handleSubmit}>
              {/* Persönliche Daten */}
              <div className="form-section">
                <h3 className="form-section-title">Persönliche Daten</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      disabled={isSubmitting}
                      placeholder="Dein Name"
                      className={`${focusedField === 'name' ? 'focused' : ''} ${formData.name ? 'has-value' : ''}`}
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
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      disabled={isSubmitting}
                      placeholder="deine@email.de"
                      className={`${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'has-value' : ''}`}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Telefon</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      disabled={isSubmitting}
                      placeholder="+49 160 123 456 78"
                      className={`${focusedField === 'phone' ? 'focused' : ''} ${formData.phone ? 'has-value' : ''}`}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company">Unternehmen</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('company')}
                      onBlur={() => setFocusedField(null)}
                      disabled={isSubmitting}
                      placeholder="Dein Unternehmen"
                      className={`${focusedField === 'company' ? 'focused' : ''} ${formData.company ? 'has-value' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Projekt-Details */}
              <div className="form-section">
                <h3 className="form-section-title">Projekt-Details</h3>
                
                <div className="form-group">
                  <label>Projekt-Typ *</label>
                  <div className="project-type-grid">
                    {projectTypes.map((type) => (
                      <div 
                        key={type.value} 
                        className={`project-type-card ${formData.projectType === type.value ? 'selected' : ''} ${isSubmitting ? 'disabled' : ''}`}
                        onClick={() => !isSubmitting && setFormData(prev => ({ ...prev, projectType: type.value }))}
                        role="button"
                        tabIndex={isSubmitting ? -1 : 0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            !isSubmitting && setFormData(prev => ({ ...prev, projectType: type.value }));
                          }
                        }}
                        aria-pressed={formData.projectType === type.value}
                      >
                        <div className="project-type-header">
                          <div className="project-type-icon">
                            <span className="icon" role="img" aria-label={type.label}>{type.icon}</span>
                          </div>
                          <div className="project-type-info">
                            <h4>{type.label}</h4>
                            <span className="price-range">{type.price}</span>
                          </div>
                        </div>
                        <p className="project-description">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  {/* Custom Budget Select mit Accessibility */}
                  <div className="form-group">
                    <label htmlFor="budget">Budget</label>
                    <div className="custom-select-wrapper" ref={budgetDropdownRef}>
                      <div 
                        className={`custom-select ${showBudgetDropdown ? 'open' : ''} ${formData.budget ? 'has-value' : ''}`}
                        onClick={() => !isSubmitting && toggleBudgetDropdown()}
                        role="combobox"
                        aria-expanded={showBudgetDropdown}
                        aria-haspopup="listbox"
                        tabIndex={isSubmitting ? -1 : 0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            !isSubmitting && toggleBudgetDropdown();
                          }
                        }}
                        aria-label="Budget auswählen"
                      >
                        <span className="select-value">
                          {budgetOptions.find(opt => opt.value === formData.budget)?.label || 'Budget wählen'}
                        </span>
                        <ChevronDown className={`select-arrow ${showBudgetDropdown ? 'rotated' : ''}`} />
                      </div>
                      {showBudgetDropdown && (
                        <div className="select-dropdown" role="listbox">
                          {budgetOptions.map((option) => (
                            <div
                              key={option.value}
                              className={`select-option ${formData.budget === option.value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                              onClick={() => !option.disabled && handleSelectChange('budget', option.value)}
                              role="option"
                              aria-selected={formData.budget === option.value}
                              aria-disabled={option.disabled}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Custom Timeline Select mit Accessibility */}
                  <div className="form-group">
                    <label htmlFor="timeline">Zeitrahmen</label>
                    <div className="custom-select-wrapper" ref={timelineDropdownRef}>
                      <div 
                        className={`custom-select ${showTimelineDropdown ? 'open' : ''} ${formData.timeline ? 'has-value' : ''}`}
                        onClick={() => !isSubmitting && toggleTimelineDropdown()}
                        role="combobox"
                        aria-expanded={showTimelineDropdown}
                        aria-haspopup="listbox"
                        tabIndex={isSubmitting ? -1 : 0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            !isSubmitting && toggleTimelineDropdown();
                          }
                        }}
                        aria-label="Zeitrahmen auswählen"
                      >
                        <span className="select-value">
                          {timelineOptions.find(opt => opt.value === formData.timeline)?.label || 'Zeitrahmen wählen'}
                        </span>
                        <ChevronDown className={`select-arrow ${showTimelineDropdown ? 'rotated' : ''}`} />
                      </div>
                      {showTimelineDropdown && (
                        <div className="select-dropdown" role="listbox">
                          {timelineOptions.map((option) => (
                            <div
                              key={option.value}
                              className={`select-option ${formData.timeline === option.value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                              onClick={() => !option.disabled && handleSelectChange('timeline', option.value)}
                              role="option"
                              aria-selected={formData.timeline === option.value}
                              aria-disabled={option.disabled}
                            >
                              {option.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Projekt-Beschreibung *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={6}
                    disabled={isSubmitting}
                    maxLength={2000}
                    placeholder="Beschreibe dein Projekt so detailliert wie möglich. Was sind deine Ziele? Wer ist deine Zielgruppe? Welche Features benötigst du?"
                    className={`${focusedField === 'message' ? 'focused' : ''} ${formData.message ? 'has-value' : ''}`}
                  />
                  <div className="character-count">
                    {formData.message.length}/2000 Zeichen
                  </div>
                </div>

                {/* Newsletter Checkbox */}
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">
                      Ja, ich möchte den Newsletter mit Web-Tipps und exklusiven Angeboten erhalten
                      <small>Du kannst dich jederzeit wieder abmelden</small>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                  className="submit-button"
                  aria-describedby="submit-status"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner" aria-hidden="true"></div>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="submit-icon" aria-hidden="true" />
                      Kostenlose Beratung anfragen
                    </>
                  )}
                </button>
                
                {/* Form Progress Indicator */}
                <div className="form-progress">
                  <div className="progress-text">
                    Formular: {Math.round(((formData.name ? 1 : 0) + (formData.email ? 1 : 0) + (formData.message ? 1 : 0)) / 3 * 100)}% ausgefüllt
                  </div>
                  <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(((formData.name ? 1 : 0) + (formData.email ? 1 : 0) + (formData.message ? 1 : 0)) / 3 * 100)} aria-valuemin={0} aria-valuemax={100}>
                    <div 
                      className="progress-fill" 
                      style={{ width: `${((formData.name ? 1 : 0) + (formData.email ? 1 : 0) + (formData.message ? 1 : 0)) / 3 * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* SIDEBAR - Kontaktinformationen */}
          <div className="contact-info-section">
            
            {/* Kontakt-Info */}
            <h3 className="section-title">Direkte Kontaktaufnahme</h3>
            
            <div className="contact-info-grid">
              <div className="contact-info-item">
                <div className="contact-icon">
                  <Mail className="icon" />
                </div>
                <div className="contact-details">
                  <span className="contact-label">E-Mail</span>
                  <a href="mailto:schubert_chris@rocketmail.com" className="contact-value">
                    schubert_chris@rocketmail.com
                  </a>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-icon">
                  <Phone className="icon" />
                </div>
                <div className="contact-details">
                  <span className="contact-label">Telefon</span>
                  <a href="tel:+4916094168348" className="contact-value">
                    +49 160 941 683 48
                  </a>
                </div>
              </div>
              
              <div className="contact-info-item">
                <div className="contact-icon">
                  <MapPin className="icon" />
                </div>
                <div className="contact-details">
                  <span className="contact-label">Standort</span>
                  <span className="contact-value">Potsdam, Brandenburg</span>
                </div>
              </div>
            </div>

            {/* Antwortzeit Info */}
            <div className="response-time-info">
              <div className="response-time-header">
                <Clock className="clock-icon" />
                <span className="response-time-label">Antwortzeit</span>
              </div>
              <p className="response-time-text">
                Normalerweise innerhalb von 24 Stunden
              </p>
            </div>

            {/* Testimonial */}
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star filled" />
                ))}
              </div>
              <p className="testimonial-text">
                "Chris hat unsere E-Commerce-Plattform nicht nur technisch perfekt umgesetzt, sondern auch wertvolle Business-Insights geliefert."
              </p>
              <div className="testimonial-author">
                - Maximilian Weber, CEO TechStart GmbH
              </div>
            </div>

            {/* Newsletter Anmeldung */}
            <div className="newsletter-card">
              <h4 className="newsletter-title">
                <Users className="newsletter-icon" />
                Web-Entwickler Newsletter
              </h4>
              <p className="newsletter-description">
                Exklusive Tipps, Tools und Trends direkt aus der Praxis
              </p>
              
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="deine@email.de"
                  className="newsletter-input"
                />
                <button className="newsletter-button">
                  Kostenlos abonnieren
                </button>
              </div>
              
              <div className="newsletter-stats">
                <Users className="stats-icon" />
                <span>Bereits 1.247 Abonnenten</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default KontaktIndex;