// src/Components/PageComponents/LandingPage/LandingPage-OffersSection.tsx
// KORRIGIERT: TypeScript-Fehler behoben + Verbesserte Performance und mobile Kompatibilität
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiGlobe,
  HiDocument,
  HiMail,
  HiStar,
  HiArrowRight,
  HiClock,
  HiCheckCircle,
  HiEye
} from 'react-icons/hi';
import './Style/LandingPage-OffersSection.scss';

interface ProjectOffer {
  id: string;
  title: string;
  type: 'website' | 'bewerbung' | 'newsletter';
  description: string;
  features: string[];
  priceRange: string;
  duration: string;
  clientName: string;
  clientCompany: string;
  feedback: string;
  rating: number;
  backgroundImage: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OffersSection: React.FC = () => {
  const [activeOffer, setActiveOffer] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const navigate = useNavigate();

  // Mobile Detection Hook
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Projektdaten mit hochauflösenden Bildern
  const projectOffers: ProjectOffer[] = [
    {
      id: 'onepager',
      title: 'Premium One-Page Website',
      type: 'website',
      description: 'Moderne, responsive Landingpage mit professionellem Design und optimaler Performance.',
      features: [
        'Responsive Design (Mobile-First)',
        'SEO-Optimierung',
        'Performance-Optimierung',
        'Kontaktformular',
        'Social Media Integration',
        'Content Management',
        'SSL-Zertifikat inklusive',
        'Google Analytics Setup'
      ],
      priceRange: '499€ - 899€',
      duration: '5-10 Werktage',
      clientName: 'Sarah Meyer',
      clientCompany: 'Wellness Studio Balance',
      feedback: 'Chris hat unsere Vision perfekt umgesetzt. Die Website ist nicht nur schön, sondern auch technisch einwandfrei. Unsere Buchungsanfragen haben sich verdreifacht!',
      rating: 5,
      backgroundImage: 'https://cdn.pixabay.com/photo/2022/09/05/17/15/vancouver-7434702_960_720.jpg',
      icon: HiGlobe
    },
    {
      id: 'bewerbung',
      title: 'Executive Bewerbungsseite',
      type: 'bewerbung',
      description: 'Professionelle Online-Präsenz für Führungskräfte mit interaktivem Lebenslauf und Portfolio.',
      features: [
        'Interaktiver Lebenslauf',
        'Portfolio-Galerie',
        'Skill-Visualisierung',
        'Download-Bereich',
        'Kontakt-Integration',
        'Professional Branding',
        'PDF-Export Funktion',
        'LinkedIn-Integration'
      ],
      priceRange: '649€ - 1.200€',
      duration: '7-14 Werktage',
      clientName: 'Dr. Michael Hoffmann',
      clientCompany: 'Senior Marketing Director',
      feedback: 'Die Bewerbungsseite war ausschlaggebend für meinen neuen Job als Marketing Director. Das Design ist elegant und die Technik überzeugt jeden Personaler.',
      rating: 5,
      backgroundImage: 'https://cdn.pixabay.com/photo/2022/09/05/16/17/baltic-sea-7434540_960_720.jpg',
      icon: HiDocument
    },
    {
      id: 'newsletter',
      title: 'Newsletter-System Pro',
      type: 'newsletter',
      description: 'Vollautomatisiertes Newsletter-System mit Template-Design und Tracking-Analytics.',
      features: [
        'Responsive Email-Templates',
        'Automatisierung & Sequenzen',
        'Subscriber-Management',
        'Analytics & Tracking',
        'A/B Testing',
        'DSGVO-konform',
        'Multi-Template Library',
        'Personalisierung Engine'
      ],
      priceRange: '799€ - 1.200€',
      duration: '10-14 Werktage',
      clientName: 'Lisa Schneider',
      clientCompany: 'E-Commerce Boutique',
      feedback: 'Unser Newsletter-System läuft seit 6 Monaten perfekt. Die Open-Rate ist um 40% gestiegen und die Automatisierung spart uns täglich Stunden!',
      rating: 5,
      backgroundImage: 'https://cdn.pixabay.com/photo/2025/06/01/17/31/denali-9635666_960_720.jpg',
      icon: HiMail
    }
  ];

  // KORRIGIERT: CTA-Handler mit TypeScript-konformer Analytics
  const handleCTAClick = (projectType: string, projectId?: string) => {
    // KORRIGIERT: Type-Assertion für gtag-Funktionen
    try {
      const gtagFunc = (window as any).gtag;
      if (gtagFunc && typeof gtagFunc === 'function') {
        gtagFunc('event', 'cta_click', {
          event_category: 'engagement',
          event_label: projectType,
          project_id: projectId
        });
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }

    navigate(`/kontakt?projekt=${projectType}`);
  };

  // Effizientere Star-Rendering
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <HiStar
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      />
    ));
  };

  // Touch-Handler für bessere mobile Erfahrung
  const handleOfferInteraction = (offerId: string, isTouch: boolean = false) => {
    if (isMobile && isTouch) {
      // Auf Mobile: Toggle-Verhalten für Touch
      setActiveOffer(activeOffer === offerId ? null : offerId);
    } else if (!isMobile) {
      // Auf Desktop: Standard Hover-Verhalten
      setActiveOffer(offerId);
    }
  };

  // Keyboard Navigation Support
  const handleKeyDown = (event: React.KeyboardEvent, offerId: string, projectType: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCTAClick(projectType, offerId);
    }
  };

  return (
    <section className="offers-section" id="offer">
      <div className="offers-header">
        <h2 className="section-title">
          Erfolgreiche Projekte & <span className="highlight">Zufriedene Kunden</span>
        </h2>
        <p className="section-subtitle">
          Entdecken Sie realisierte Projekte mit echtem Kunden-Feedback und transparenten Preisen
        </p>
      </div>

      <div className="offers-grid">
        {projectOffers.map((offer, index) => {
          const IconComponent = offer.icon;
          const isActive = activeOffer === offer.id;
          const isEven = index % 2 === 0;

          return (
            <div
              key={offer.id}
              className={`offer-container ${isEven ? '' : 'mirrored'} ${isActive ? 'active' : ''}`}
              style={{ backgroundImage: `url(${offer.backgroundImage})` }}
              onMouseEnter={() => !isMobile && handleOfferInteraction(offer.id)}
              onMouseLeave={() => !isMobile && setActiveOffer(null)}
              onClick={() => isMobile && handleOfferInteraction(offer.id, true)}
              onKeyDown={(e) => handleKeyDown(e, offer.id, offer.type)}
              tabIndex={0}
              role="button"
              aria-label={`${offer.title} - ${offer.description}`}
            >
              <div className="offer-overlay" />

              <div className="offer-content">
                {/* Content Safe Zone Wrapper für kritischen Content */}
                <div className="content-safe-zone">
                  <div className="project-header">
                    <div className="project-icon">
                      <IconComponent className="icon" />
                    </div>
                    <div className="project-meta">
                      <h3 className="project-title">{offer.title}</h3>
                      <p className="project-description">{offer.description}</p>
                    </div>
                  </div>

                  <div className="project-details">
                    <div className="detail-row">
                      <div className="price-tag">
                        <span className="price">{offer.priceRange}</span>
                      </div>
                      <div className="duration">
                        <HiClock className="duration-icon" />
                        <span>{offer.duration}</span>
                      </div>
                    </div>

                    <div className="features-list">
                      {/* Intelligente Feature-Anzeige basierend auf Screen-Size */}
                      {offer.features.slice(0, isMobile ? 3 : 4).map((feature, idx) => (
                        <div key={idx} className="feature-item">
                          <HiCheckCircle className="check-icon" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {offer.features.length > (isMobile ? 3 : 4) && (
                        <div className="feature-more">
                          +{offer.features.length - (isMobile ? 3 : 4)} weitere Features
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="customer-feedback">
                    <div className="feedback-header">
                      <div className="customer-info">
                        <strong>{offer.clientName}</strong>
                        <span className="company">{offer.clientCompany}</span>
                      </div>
                      <div className="rating" aria-label={`Bewertung: ${offer.rating} von 5 Sternen`}>
                        {renderStars(offer.rating)}
                      </div>
                    </div>
                    <blockquote className="feedback-text">
                      "{offer.feedback}"
                    </blockquote>
                  </div>

                  <div className="cta-section">
                    <button
                      className="cta-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCTAClick(offer.type, offer.id);
                      }}
                      aria-label={`Projekt ${offer.title} anfragen`}
                    >
                      <span>Projekt anfragen</span>
                      <HiArrowRight className="cta-icon" />
                    </button>
                    <span className="cta-note">Kostenlose Beratung & Angebot</span>
                  </div>
                </div>

                {/* Hover Details mit besserer Positionierung */}
                {isActive && (
                  <div
                    className="hover-details"
                    role="dialog"
                    aria-label="Alle Features anzeigen"
                  >
                    <div className="hover-header">
                      <HiEye className="eye-icon" />
                      <span>Alle Features anzeigen</span>
                    </div>
                    <div className="all-features">
                      {offer.features.map((feature, idx) => (
                        <div key={idx} className="feature-item-hover">
                          <HiCheckCircle className="check-icon" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    {/* Close Button für Mobile */}
                    {isMobile && (
                      <button
                        className="close-details"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveOffer(null);
                        }}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid var(--color-primary)',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        aria-label="Details schließen"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bottom-cta">
        <h3>Bereit für Ihr Projekt?</h3>
        <p>Lassen Sie uns gemeinsam Ihre Vision verwirklichen</p>
        <button
          className="main-cta-button"
          onClick={() => handleCTAClick('custom')}
          aria-label="Kostenlose Beratung für individuelles Projekt vereinbaren"
        >
          Kostenlose Beratung vereinbaren
          <HiArrowRight className="cta-icon" />
        </button>
      </div>
    </section>
  );
};
// kommentar
export default OffersSection;