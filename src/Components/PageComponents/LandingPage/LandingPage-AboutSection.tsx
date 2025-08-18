// ===========================
// ABOUT SECTION - OHNE FILTER FUNKTION
// ===========================

import React, { useEffect, useRef, useState, useMemo } from 'react';
import './Style/LandingPage-AboutSection.scss';
import { createFadeInObserver } from '@/Components/Utils/ScrollObserver';

// Interface für bessere Type Safety
interface ServiceData {
  readonly id: number;
  readonly title: string;
  readonly category: 'business' | 'personal' | 'digital' | 'custom';
  readonly description: string;
  readonly features: readonly string[];
  readonly icon: string;
  readonly color: string;
  readonly examples: readonly string[];
}

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // ENTFERNT: activeCategory State und Filter-Logik
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  // Konstante Daten - alle Services werden immer angezeigt
  const services: readonly ServiceData[] = useMemo(() => [
    {
      id: 1,
      title: "Lokale Unternehmen",
      category: "business" as const,
      description: "Professionelle Websites für kleine Betriebe und lokale Dienstleister",
      features: ["Responsive Design", "SEO-Optimierung", "Kontaktformulare", "Google Maps Integration"],
      icon: "🏪",
      color: "var(--color-primary)", // GEÄNDERT: Einheitliche Farbe
      examples: ["Bäckereien", "Fahrradwerkstätten", "Restaurants", "Friseursalons"]
    },
    {
      id: 2,
      title: "Bewerbungs - Page",
      category: "personal" as const,
      description: "Individuelle Online-Präsenzen für Jobsuchende und Freelancer",
      features: ["Portfolio-Showcase", "CV-Integration", "Skill-Darstellung", "Kontakt-System"],
      icon: "👤",
      color: "var(--color-primary)", // GEÄNDERT: Einheitliche Farbe
      examples: ["Designer-Portfolios", "Entwickler-CVs", "Künstler-Websites", "Freelancer-Profile"]
    },
    {
      id: 3,
      title: "Newsletter & E-Mail",
      category: "digital" as const,
      description: "Programmierte Newsletter-Systeme und E-Mail-Marketing-Lösungen",
      features: ["HTML-Templates", "Responsive E-Mails", "Automation", "Analytics"],
      icon: "📧",
      color: "var(--color-primary)", // GEÄNDERT: Einheitliche Farbe
      examples: ["Firmen-Newsletter", "Event-Updates", "Produkt-Launches", "Kundenservice"]
    },
    {
      id: 4,
      title: "Custom Solutions",
      category: "custom" as const,
      description: "Maßgeschneiderte Webanwendungen für spezielle Anforderungen",
      features: ["API-Integration", "Datenbank-Design", "Admin-Panels", "Custom Features"],
      icon: "⚡",
      color: "var(--color-primary)", // GEÄNDERT: Einheitliche Farbe
      examples: ["Booking-Systeme", "Inventar-Management", "CRM-Tools", "E-Commerce"]
    }
  ], []);

  // ENTFERNT: handleCategoryChange und filteredServices

  // Intersection Observer Setup
  useEffect(() => {
    const observer = createFadeInObserver();
    
    const cardObserver = new IntersectionObserver(
      (entries) => {
        const newVisibleCards = new Set<number>();
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.getAttribute('data-card-id') || '0', 10);
            if (cardId > 0) {
              newVisibleCards.add(cardId);
            }
          }
        });
        
        if (newVisibleCards.size > 0) {
          setVisibleCards(prev => new Set([...prev, ...newVisibleCards]));
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    const section = sectionRef.current;
    if (section) {
      const cards = section.querySelectorAll('.service-card');
      cards.forEach(card => cardObserver.observe(card));
    }

    return () => {
      observer.destroy();
      cardObserver.disconnect();
    };
  }, [services]); // GEÄNDERT: services statt filteredServices

  if (!services.length) {
    return (
      <section className="about-section">
        <div className="about-header">
          <h2 className="about-title">Services werden geladen...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="about-section" id='about' ref={sectionRef}>
      {/* Header Section */}
      <header className="about-header reveal">
        <h2 className="about-title">
          <span className="about-title-accent">Meine</span>
          <span className="about-title-main">Services</span>
        </h2>
        <p className="about-subtitle">
          Von kleinen lokalen Unternehmen bis hin zu individuellen Bewerbungswebsites - 
          ich entwickle maßgeschneiderte digitale Lösungen für jeden Bedarf.
        </p>
      </header>

      {/* ENTFERNT: Filter Navigation */}

      {/* Services Grid */}
      <main className="about-services-grid" role="main"> {/* GEÄNDERT: role von tabpanel zu main */}
        {services.map((service, index) => ( // GEÄNDERT: services statt filteredServices
          <article
            key={service.id}
            data-card-id={service.id}
            className={`service-card service-card-${service.category} ${
              visibleCards.has(service.id) ? 'service-card-visible' : ''
            }`}
            style={{
              '--card-color': service.color,
              '--animation-delay': `${index * 0.1}s`,
            } as React.CSSProperties}
            aria-label={`Service: ${service.title}`}
          >
            {/* Card Header */}
            <header className="service-card-header">
              <div className="service-card-icon">
                <span className="service-icon-emoji" aria-hidden="true">
                  {service.icon}
                </span>
              </div>
              <div className="service-card-category">
                {/* VEREINFACHT: Direkte Kategorie-Anzeige */}
                {service.category === 'business' && 'Unternehmen'}
                {service.category === 'personal' && 'Personal'}
                {service.category === 'digital' && 'Digital'}
                {service.category === 'custom' && 'Custom'}
              </div>
            </header>

            {/* Card Content */}
            <div className="service-card-content">
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-description">{service.description}</p>

              {/* Features Section */}
              <div className="service-features">
                <h4 className="service-features-title">Features:</h4>
                <ul className="service-features-list">
                  {service.features.map((feature, i) => (
                    <li key={i} className="service-feature-item">
                      <span className="service-feature-dot" aria-hidden="true"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples Section */}
              <div className="service-examples">
                <h4 className="service-examples-title">Beispiele:</h4>
                <div className="service-examples-tags">
                  {service.examples.map((example, i) => (
                    <span 
                      key={i} 
                      className="service-example-tag"
                      role="button"
                      tabIndex={0}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <footer className="service-card-footer">
              <button 
                className="service-card-cta"
                aria-label={`Mehr über ${service.title} erfahren`}
              >
                <span>Mehr erfahren</span>
                <span className="service-cta-arrow" aria-hidden="true">→</span>
              </button>
            </footer>
          </article>
        ))}
      </main>

    </section>
  );
};

export default AboutSection;