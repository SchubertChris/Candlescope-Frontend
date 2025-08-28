// src/Components/PageComponents/LandingPage/LandingPage-TimelineSection.tsx
// Timeline mit Story Cards - Small & Big Width Rectangles + Badge System

import React, { useEffect, useRef } from 'react';
import './Style/LandingPage-TimelineSection.scss';

interface TimelineItem {
  id: number;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: 'small' | 'big';
  category: 'education' | 'work' | 'project' | 'achievement';
  image: string;
  badge: {
    text: string;
    color: string;
  };
  tags: string[];
}

const TimelineSection: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const timelineData: TimelineItem[] = [
    {
      id: 1,
      year: '2024',
      title: 'Full-Stack Entwicklung',
      subtitle: 'Digital Career Institute Berlin',
      description: 'Intensive Weiterbildung in modernen Webtechnologien mit Fokus auf React, TypeScript und Node.js. Entwicklung von mehreren Real-World Projekten.',
      type: 'big',
      category: 'education',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80',
      badge: {
        text: 'Aktuell',
        color: '#4CAF50'
      },
      tags: ['React', 'TypeScript', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      year: '2021-2023',
      title: 'Vorstandsfahrer & Allrounder',
      subtitle: 'BBU Verband Berlin-Brandenburgischer Wohnungsunternehmen',
      description: 'Verantwortung für die logistische Betreuung des Vorstands und administrative Aufgaben.',
      type: 'small',
      category: 'work',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
      badge: {
        text: '2 Jahre',
        color: '#2196F3'
      },
      tags: ['Organisation', 'Kommunikation', 'Verantwortung']
    },
    {
      id: 3,
      year: '2022',
      title: 'CandleScope Finance App',
      subtitle: 'Eigenständige Produktentwicklung',
      description: 'Entwicklung einer dezentralen Finanz-Analysesoftware für Krypto-Trading mit CSV/PDF Export-Funktionalität.',
      type: 'big',
      category: 'project',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      badge: {
        text: 'Innovation',
        color: '#FF9800'
      },
      tags: ['FinTech', 'Krypto', 'Data Analysis', 'Desktop App']
    },
    {
      id: 4,
      year: '2018-2021',
      title: 'Stationskellner',
      subtitle: 'Brasserie zu Gutenberg Potsdam',
      description: 'Hochwertige Gastronomie mit Fokus auf Kundenerfahrung und Teamwork in anspruchsvollem Umfeld.',
      type: 'small',
      category: 'work',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
      badge: {
        text: '3 Jahre',
        color: '#9C27B0'
      },
      tags: ['Kundenservice', 'Teamwork', 'Qualität']
    },
    {
      id: 5,
      year: '2015-2018',
      title: 'Deutscher Bundestag',
      subtitle: 'Käfer Restaurant - Stationskellner',
      description: 'Exklusive Gastronomie im politischen Zentrum Deutschlands. Höchste Servicestandards und Diskretion.',
      type: 'big',
      category: 'work',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      badge: {
        text: 'Prestige',
        color: '#E91E63'
      },
      tags: ['Premium Service', 'Bundestag', 'Networking', 'Diskretion']
    },
    {
      id: 6,
      year: '2012-2015',
      title: 'Hotelfachmann IHK',
      subtitle: 'Romantik Hotel am Jägertor Potsdam',
      description: 'Vollständige Ausbildung in allen Hotelbereichen mit Fokus auf Gästebetreuung und operative Exzellenz.',
      type: 'small',
      category: 'education',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
      badge: {
        text: 'IHK',
        color: '#607D8B'
      },
      tags: ['Ausbildung', 'Hotelmanagement', 'Kundenorientierung']
    }
  ];

  useEffect(() => {
    // Intersection Observer für Scroll-Animationen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('timeline-item-visible');
          }
        });
      },
      { 
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    const timelineItems = timelineRef.current?.querySelectorAll('.timeline-item');
    timelineItems?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="timeline-section" id="timeline" ref={timelineRef}>
      {/* Section Header */}
      <div className="timeline-header reveal">
        <h2 className="timeline-title">
          <span className="timeline-title-accent">Meine</span>
          <span className="timeline-title-main">Journey</span>
        </h2>
        <p className="timeline-subtitle">
          Von der Hotellerie über den Bundestag zur Softwareentwicklung - 
          eine Geschichte von kontinuierlicher Weiterentwicklung und vielfältigen Erfahrungen.
        </p>
      </div>

      {/* Timeline Container */}
      <div className="timeline-container">
        {/* Vertical Line */}
        <div className="timeline-line" />

        {/* Timeline Items */}
        <div className="timeline-items">
          {timelineData.map((item, index) => (
            <div
              key={item.id}
              className={`timeline-item timeline-item-${item.type} timeline-card`}
              data-category={item.category}
              style={{
                '--item-delay': `${index * 0.2}s`,
                '--item-index': index
              } as React.CSSProperties}
            >
              {/* Year Indicator */}
              <div className="timeline-year">
                <span className="year-text">{item.year}</span>
                <div className="year-dot" />
              </div>

              {/* Story Card */}
              <div className="story-card">
                {/* Badge */}
                <div 
                  className="story-badge"
                  style={{ backgroundColor: item.badge.color }}
                >
                  {item.badge.text}
                </div>

                {/* Image Container */}
                <div className="story-image">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />
                  <div className="story-overlay" />
                </div>

                {/* Content */}
                <div className="story-content">
                  <div className="story-category">
                    {item.category === 'education' && '🎓 Bildung'}
                    {item.category === 'work' && '💼 Beruf'}
                    {item.category === 'project' && '🚀 Projekt'}
                    {item.category === 'achievement' && '🏆 Erfolg'}
                  </div>

                  <h3 className="story-title">{item.title}</h3>
                  <h4 className="story-subtitle">{item.subtitle}</h4>
                  <p className="story-description">{item.description}</p>

                  {/* Tags */}
                  <div className="story-tags">
                    {item.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="story-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Elements */}
                <div className="story-interactions">
                  <button className="story-expand" aria-label="Details anzeigen">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="timeline-stats reveal">
        <div className="stat-item">
          <div className="stat-number">13+</div>
          <div className="stat-label">Jahre Berufserfahrung</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">4</div>
          <div className="stat-label">Verschiedene Branchen</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">2</div>
          <div className="stat-label">Abgeschlossene Ausbildungen</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">1</div>
          <div className="stat-label">Eigenes Projekt</div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;