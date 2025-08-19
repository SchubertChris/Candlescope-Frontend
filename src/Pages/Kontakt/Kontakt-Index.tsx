// 1. ERSETZE: src/Pages/Kontakt/Kontakt-Index.tsx
// NEUE VERSION: Modernisierte Kontaktseite mit Backend-Integration

import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, Star, Gift, Users, Clock, CheckCircle } from 'lucide-react';
import './Kontakt-Index.scss';

// Erweiterte Interface für Contact Form
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

  // ECHTE API-Integration mit deinem Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'enhanced_contact_page'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        // Formular zurücksetzen nach erfolgreichem Senden
        setFormData({
          name: '', email: '', phone: '', company: '',
          projectType: 'website', budget: '', timeline: '',
          message: '', newsletter: false
        });
      } else {
        throw new Error(result.message || 'Fehler beim Senden');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const projectTypes = [
    { value: 'website', label: '🌐 Website Development', price: 'ab 2.500€' },
    { value: 'ecommerce', label: '🛒 E-Commerce Platform', price: 'ab 5.000€' },
    { value: 'webapp', label: '⚡ Web Application', price: 'ab 8.000€' },
    { value: 'consulting', label: '🎯 IT Consulting', price: 'ab 150€/h' },
    { value: 'seo', label: '📈 SEO Optimization', price: 'ab 800€/Monat' }
  ];

  const affiliateProducts = [
    {
      title: "Hostinger Premium Hosting",
      description: "Blitzschnelles Webhosting mit 24/7 Support",
      price: "2,99€/Monat",
      discount: "75% Rabatt",
      affiliate: "https://hostinger.com?ref=chris-schubert", // HIER ECHTE AFFILIATE-LINKS EINFÜGEN
      commission: "Ich erhalte eine kleine Provision"
    },
    {
      title: "Elementor Pro Website Builder",
      description: "Professionelle WordPress-Themes ohne Code",
      price: "49$/Jahr",
      discount: "20% mit Code CHRIS20",
      affiliate: "https://elementor.com?ref=chris-schubert", // HIER ECHTE AFFILIATE-LINKS EINFÜGEN
      commission: "Partnerschaft - keine Mehrkosten für dich"
    },
    {
      title: "Figma Professional",
      description: "Design-Tool für moderne UI/UX Entwicklung",
      price: "12$/Monat",
      discount: "Kostenlos testen",
      affiliate: "https://figma.com?ref=chris-schubert", // HIER ECHTE AFFILIATE-LINKS EINFÜGEN
      commission: "Empfehlung - Tool das ich täglich nutze"
    }
  ];

  return (
    <div className="kontakt-page" id='contact'>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="kontakt-container">
          <h1 className="page-title">
            Lass uns dein Projekt
            <span className="highlight">zum Leben erwecken</span>
          </h1>
          <p className="page-subtitle">
            Von der ersten Idee bis zur erfolgreichen Umsetzung - ich begleite dich mit über 13 Jahren Erfahrung 
            in Service und modernen Web-Technologien.
          </p>
        </div>
      </div>

      <div className="kontakt-container">
        <div className="kontakt-content">
          
          {/* HAUPTFORMULAR - 2/3 der Breite */}
          <div className="contact-form-section">
            
            {submitStatus === 'success' && (
              <div className="success-message">
                <CheckCircle className="success-icon" />
                <div>
                  <h3>Nachricht erfolgreich gesendet!</h3>
                  <p>Ich melde mich innerhalb von 24 Stunden bei dir.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="error-message">
                Fehler beim Senden. Bitte versuche es erneut oder kontaktiere mich direkt.
              </div>
            )}

            <h2 className="section-title">Kostenlose Projekt-Beratung</h2>

            <div className="contact-form">
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
                      required
                      disabled={isSubmitting}
                      placeholder="Dein Name"
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
                      disabled={isSubmitting}
                      placeholder="deine@email.de"
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
                      disabled={isSubmitting}
                      placeholder="+49 160 123 456 78"
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
                      disabled={isSubmitting}
                      placeholder="Dein Unternehmen"
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
                        className={`project-type-card ${formData.projectType === type.value ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, projectType: type.value }))}
                      >
                        <div className="project-type-icon">
                          <div className="icon">🌐</div>
                        </div>
                        <div className="project-type-info">
                          <h4>{type.label}</h4>
                          <p className="price-range">{type.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="budget">Budget</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Budget wählen</option>
                      <option value="unter-2500">Unter 2.500€</option>
                      <option value="2500-5000">2.500€ - 5.000€</option>
                      <option value="5000-10000">5.000€ - 10.000€</option>
                      <option value="10000-plus">Über 10.000€</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="timeline">Zeitrahmen</label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Zeitrahmen wählen</option>
                      <option value="asap">So schnell wie möglich</option>
                      <option value="1-month">Innerhalb 1 Monat</option>
                      <option value="2-3-months">2-3 Monate</option>
                      <option value="flexible">Flexibel</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Projekt-Beschreibung *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    disabled={isSubmitting}
                    placeholder="Beschreibe dein Projekt so detailliert wie möglich. Was sind deine Ziele? Wer ist deine Zielgruppe? Welche Features benötigst du?"
                  />
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
                    Ja, ich möchte den Newsletter mit Web-Tipps und exklusiven Angeboten erhalten
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="submit-icon" />
                      Kostenlose Beratung anfragen
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SIDEBAR - 1/3 der Breite */}
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
            <div className="cta-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                <Clock style={{ width: '1rem', height: '1rem' }} />
                <span style={{ fontWeight: '600' }}>Antwortzeit</span>
              </div>
              <p style={{ color: 'var(--color-success)', fontSize: '0.9rem', margin: 0 }}>
                Normalerweise innerhalb von 24 Stunden
              </p>
            </div>

            {/* Testimonial */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1))', 
              padding: '1.5rem', 
              borderRadius: '1rem', 
              border: '1px solid rgba(255, 193, 7, 0.3)',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: '1rem', height: '1rem', fill: '#ffc107', color: '#ffc107' }} />
                ))}
              </div>
              <p style={{ color: 'var(--color-text-primary)', fontWeight: '500', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                "Chris hat unsere E-Commerce-Plattform nicht nur technisch perfekt umgesetzt, sondern auch wertvolle Business-Insights geliefert."
              </p>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                - Maximilian Weber, CEO TechStart GmbH
              </div>
            </div>

            {/* Empfohlene Tools - MONETARISIERUNG */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gift style={{ width: '1.25rem', height: '1.25rem', color: '#e91e63' }} />
                Empfohlene Tools
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {affiliateProducts.map((product, index) => (
                  <div key={index} style={{ 
                    padding: '1rem', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    borderRadius: '0.75rem', 
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ color: 'var(--color-text-primary)', fontWeight: '500', fontSize: '0.9rem', margin: 0 }}>{product.title}</h4>
                      <span style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '0.85rem' }}>{product.price}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '0.75rem', margin: 0 }}>{product.description}</p>
                    
                    {product.discount && (
                      <div style={{ 
                        display: 'inline-block', 
                        background: 'rgba(233, 30, 99, 0.2)', 
                        color: '#f8bbd9', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.5rem', 
                        fontSize: '0.75rem', 
                        fontWeight: '500',
                        marginBottom: '0.75rem' 
                      }}>
                        {product.discount}
                      </div>
                    )}
                    
                    <a 
                      href={product.affiliate}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'block', 
                        width: '100%', 
                        textAlign: 'center', 
                        background: 'linear-gradient(135deg, #e91e63, #9c27b0)', 
                        color: 'white', 
                        padding: '0.5rem', 
                        borderRadius: '0.5rem', 
                        fontSize: '0.85rem', 
                        fontWeight: '500', 
                        textDecoration: 'none',
                        marginBottom: '0.5rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Jetzt entdecken
                    </a>
                    
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.7rem', margin: 0 }}>{product.commission}</p>
                  </div>
                ))}
              </div>
              
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                background: 'rgba(59, 130, 246, 0.2)', 
                border: '1px solid rgba(59, 130, 246, 0.3)', 
                borderRadius: '0.75rem' 
              }}>
                <p style={{ color: '#93c5fd', fontSize: '0.75rem', margin: 0 }}>
                  💡 Diese Tools nutze ich täglich in meinen Projekten. Als Partner erhalte ich eine kleine Provision, ohne dass für dich Mehrkosten entstehen.
                </p>
              </div>
            </div>

            {/* Newsletter Anmeldung */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.2), rgba(59, 130, 246, 0.2))', 
              padding: '1.5rem', 
              borderRadius: '1.5rem', 
              border: '1px solid rgba(139, 69, 19, 0.3)' 
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users style={{ width: '1.25rem', height: '1.25rem', color: '#8b4513' }} />
                Web-Entwickler Newsletter
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Exklusive Tipps, Tools und Trends direkt aus der Praxis
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="email"
                  placeholder="deine@email.de"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)', 
                    borderRadius: '0.5rem', 
                    color: 'var(--color-text-primary)', 
                    fontSize: '0.9rem' 
                  }}
                />
                <button style={{ 
                  width: '100%', 
                  background: '#8b4513', 
                  color: 'white', 
                  padding: '0.5rem', 
                  borderRadius: '0.5rem', 
                  fontSize: '0.9rem', 
                  fontWeight: '500', 
                  border: 'none', 
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}>
                  Kostenlos abonnieren
                </button>
              </div>
              
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b4513', fontSize: '0.75rem' }}>
                <Users style={{ width: '0.75rem', height: '0.75rem' }} />
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