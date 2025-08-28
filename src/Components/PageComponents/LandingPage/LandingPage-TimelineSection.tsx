// src/Components/PageComponents/LandingPage/LandingPage-TimelineSection.tsx
// EXPERTISE SHOWCASE - Professionelle 3-Bereiche-Präsentation mit Swipe-Navigation

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Style/LandingPage-TimelineSection.scss';

// =============================================================================
// INTERFACES & TYPES
// =============================================================================

interface SkillItem {
  name: string;
  level: 'expert' | 'advanced' | 'intermediate';
}

interface ExpertiseArea {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  image: string;
  primaryColor: string;
  skills: SkillItem[];
  achievements: string[];
  experience: {
    years: string;
    positions: string;
  };
}

interface AnimatedStat {
  value: number;
  label: string;
  suffix?: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const TimelineSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // State Management
  const [currentIndex, setCurrentIndex] = useState(0); // Start mit erster Karte (IT)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  // =============================================================================
  // EXPERTISE BEREICHE DATEN
  // =============================================================================

  const expertiseAreas: ExpertiseArea[] = [
    {
      id: 2,
      title: 'IT & Softwareentwicklung',
      subtitle: 'Full-Stack Development & Innovation',
      description: 'Moderne Webtechnologien, innovative Lösungsansätze und eine Leidenschaft für sauberen Code. Von React-Frontends bis zu Node.js-Backends entwickle ich durchdachte digitale Lösungen.',
      icon: '💻',
      image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80',
      primaryColor: '#0066CC',
      skills: [
        { name: 'React & TypeScript', level: 'advanced' },
        { name: 'Node.js & Backend APIs', level: 'intermediate' },
        { name: 'HTML5, CSS3, SCSS', level: 'advanced' },
        { name: 'Git & Versionskontrolle', level: 'advanced' },
        { name: 'UI/UX Design Principles', level: 'intermediate' },
        { name: 'Agile Entwicklung', level: 'intermediate' }
      ],
      achievements: [
        'Eigene Desktop-App CandleScope entwickelt',
        'Portfolio 2.0 mit Full-Stack Architektur',
        'DCI Weiterbildung Full-Stack Development',
        '7 Eigene Projekte realisiert',
        'Moderne Tech-Stack Expertise'
      ],
      experience: {
        years: 'Advanced',
        positions: '7 Eigene Projekte'
      }
    },
    {
      id: 1,
      title: 'Gastronomie & Service',
      subtitle: 'Premium Hospitality Excellence',
      description: 'Vom Bundestag bis zur gehobenen Gastronomie – meine Expertise in erstklassigem Service und Kundenbetreuung bildet das Fundament für außergewöhnliche Kundenerlebnisse.',
      icon: '🍽️',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      primaryColor: '#8B4513',
      skills: [
        { name: 'Kundenservice Excellence', level: 'expert' },
        { name: 'Teamführung & Koordination', level: 'expert' },
        { name: 'Qualitätsmanagement', level: 'advanced' },
        { name: 'Konfliktmanagement', level: 'expert' },
        { name: 'Cross-Cultural Communication', level: 'advanced' },
        { name: 'Hochdruck-Situationen', level: 'expert' }
      ],
      achievements: [
        'Service im Deutschen Bundestag',
        'Gehobene Gastronomie Potsdam',
        'IHK Hotelfachmann Ausbildung',
        'VIP & Diplomaten-Betreuung',
        'Multichannel Customer Experience'
      ],
      experience: {
        years: 'Expert',
        positions: '4 Premium-Positionen'
      }
    },
    {
      id: 3,
      title: 'Finanzwesen & Krypto',
      subtitle: 'Financial Technology & Blockchain',
      description: 'Von traditionellen Finanzprozessen bis hin zu innovativen Blockchain-Lösungen. Meine Expertise vereint klassisches Banking mit der Zukunft der dezentralen Finanztechnologie.',
      icon: '📊',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      primaryColor: '#228B22',
      skills: [
        { name: 'Kryptowährungsanalyse', level: 'advanced' },
        { name: 'Blockchain Technologie', level: 'intermediate' },
        { name: 'Finanzmarktanalyse', level: 'advanced' },
        { name: 'Risk Management', level: 'intermediate' },
        { name: 'Trading Algorithmen', level: 'intermediate' },
        { name: 'DeFi Protokolle', level: 'intermediate' }
      ],
      achievements: [
        'CandleScope Finance App entwickelt',
        'CSV/PDF Export für Trading-Daten',
        'Krypto-Portfolio Management',
        'Marktanalyse & Trend-Erkennung',
        'Fintech Innovation Projects'
      ],
      experience: {
        years: 'Advanced',
        positions: '2 FinTech Projekte'
      }
    }
  ];

  // =============================================================================
  // ANIMIERTE STATISTIKEN
  // =============================================================================

  const animatedStats: AnimatedStat[] = [
    { value: 7, label: 'Eigene Projekte' },
    { value: 3, label: 'Qualifikationen' },
    { value: 4, label: 'Branchen' },
    { value: 17, label: 'Jahre Erfahrung' }
  ];

  // =============================================================================
  // NAVIGATION LOGIC
  // =============================================================================

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => prev === 2 ? 0 : prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? 2 : prev - 1);
  }, []);

  // =============================================================================
  // AUTO-PLAY LOGIC
  // =============================================================================

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 10000); // 10 Sekunden

    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  // =============================================================================
  // TOUCH HANDLERS
  // =============================================================================

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStartX(0);
    setTouchEndX(0);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  // =============================================================================
  // INTERSECTION OBSERVER FÜR STATS
  // =============================================================================

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // =============================================================================
  // SKILL LEVEL MAPPING
  // =============================================================================

  const getSkillLevelClass = (level: string): string => {
    switch (level) {
      case 'expert': return 'skill-expert';
      case 'advanced': return 'skill-advanced';
      case 'intermediate': return 'skill-intermediate';
      default: return 'skill-beginner';
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <section className="timeline-section expertise-showcase" id="timeline" ref={sectionRef}>
      {/* Section Header */}
      <div className="expertise-header">
        <h2 className="expertise-title">
          <span className="title-accent">Meine</span>
          <span className="title-main">Expertise</span>
        </h2>
        <p className="expertise-subtitle">
          Drei Kernbereiche, die meine vielseitige Erfahrung und Leidenschaft für Exzellenz widerspiegeln
        </p>
      </div>

      {/* Mobile Swipe Cards */}
      <div className="expertise-carousel" ref={carouselRef}>
        <div 
          className="carousel-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(-${currentIndex * 100}vw)`,
            transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {expertiseAreas.map((area, index) => (
            <div 
              key={area.id} 
              className={`expertise-card ${index === currentIndex ? 'active' : ''}`}
              style={{ '--primary-color': area.primaryColor } as React.CSSProperties}
            >
              <div>
                <div className="card-header">
                  <div className="card-icon">{area.icon}</div>
                  <div className="card-badge" style={{ backgroundColor: area.primaryColor }}>
                    {area.experience.years}
                  </div>
                </div>

                <div className="card-image">
                  <img src={area.image} alt={area.title} loading="lazy" />
                  <div className="image-overlay"></div>
                </div>

                <div className="card-content">
                  <h3 className="card-title">{area.title}</h3>
                  <h4 className="card-subtitle">{area.subtitle}</h4>
                  <p className="card-description">{area.description}</p>

                  <div className="skills-section">
                    <h5 className="skills-title">Kernkompetenzen</h5>
                    <div className="skills-grid">
                      {area.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className={`skill-item ${getSkillLevelClass(skill.level)}`}>
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-level"></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="achievements-section">
                    <h5 className="achievements-title">Erfolge & Meilensteine</h5>
                    <ul className="achievements-list">
                      {area.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="achievement-item">
                          <span className="achievement-icon">✓</span>
                          <span className="achievement-text">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="experience-stats">
                    <div className="stat">
                      <span className="stat-value">{area.experience.years}</span>
                      <span className="stat-label">Level</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{area.experience.positions}</span>
                      <span className="stat-label">Portfolio</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-navigation">
          {expertiseAreas.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Zur Expertise ${index + 1}`}
            />
          ))}
        </div>

        <div className="swipe-indicator">
          <span className="swipe-text">← Swipe →</span>
        </div>
      </div>

      {/* Desktop Grid - Kompakt nebeneinander */}
      <div className="expertise-desktop-grid">
        {expertiseAreas.map((area) => (
          <div 
            key={area.id} 
            className="desktop-card"
            style={{ '--primary-color': area.primaryColor } as React.CSSProperties}
          >
            <div className="desktop-card-image">
              <img src={area.image} alt={area.title} loading="lazy" />
              <div className="image-overlay"></div>
            </div>

            <div 
              className="card-badge" 
              style={{ backgroundColor: area.primaryColor }}
            >
              {area.experience.years}
            </div>

            <div className="desktop-card-content">
              <div className="desktop-card-header">
                <h3 className="card-title">{area.title}</h3>
                <h4 className="card-subtitle">{area.subtitle}</h4>
                <p className="card-description">{area.description}</p>
              </div>

              <div className="desktop-skills-compact">
                <h5 className="skills-title">Top Skills</h5>
                <div className="skills-compact-grid">
                  {area.skills.slice(0, 4).map((skill, skillIndex) => (
                    <div 
                      key={skillIndex} 
                      className={`skill-compact ${getSkillLevelClass(skill.level)}`}
                      style={{ '--index': skillIndex } as React.CSSProperties}
                    >
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level"></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="desktop-experience-stats">
                <div className="stat">
                  <span className="stat-value">{area.experience.years}</span>
                  <span className="stat-label">Level</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{area.achievements.length}</span>
                  <span className="stat-label">Erfolge</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Animated Stats */}
      <div className={`expertise-stats ${statsVisible ? 'visible' : ''}`}>
        {animatedStats.map((stat, index) => (
          <div key={index} className="stat-item" style={{ '--delay': `${index * 0.2}s` } as React.CSSProperties}>
            <div className="stat-number">
              <span className="counter">
                {statsVisible ? stat.value : 0}
              </span>
              {stat.suffix && <span className="suffix">{stat.suffix}</span>}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimelineSection;