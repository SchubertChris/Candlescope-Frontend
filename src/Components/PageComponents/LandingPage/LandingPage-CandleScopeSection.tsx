// src/Components/PageComponents/LandingPage/LandingPage-CandleScopeSection.tsx
// CandleScope Finance App - Dezentrale Trading-Analyse mit CSV/PDF Export

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  BarChart3, 
  FileDown, 
  Zap, 
  Rocket, 
  Mail, 
  BookOpen,
  CheckCircle,
  Clock,
  RotateCcw,
  Bitcoin,
  TrendingUp,
  DollarSign,
  Activity,
  Play
} from 'lucide-react'; // Importiere alle benötigten Icons
import './Style/LandingPage-CandleScopeSection.scss';

const CandleScopeSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Geändert: Emojis durch Lucide React Icons ersetzt
  const features = [
    {
      id: 'offline',
      title: 'Offline & Dezentral',
      description: 'Deine Daten bleiben bei dir - keine Cloud, keine Server, keine Überwachung.',
      icon: <Shield className="w-8 h-8" />, // Icon als React Component
      color: '#4CAF50'
    },
    {
      id: 'analysis',
      title: 'Erweiterte Analyse',
      description: 'Candlestick-Patterns, technische Indikatoren und Portfolio-Tracking in Echtzeit.',
      icon: <BarChart3 className="w-8 h-8" />,
      color: '#2196F3'
    },
    {
      id: 'export',
      title: 'CSV & PDF Export',
      description: 'Alle Daten exportierbar - für Steuererklärung, Archivierung oder weitere Analyse.',
      icon: <FileDown className="w-8 h-8" />,
      color: '#FF9800'
    },
    {
      id: 'crypto',
      title: 'Multi-Exchange',
      description: 'Unterstützt alle großen Krypto-Börsen mit automatischem Import.',
      icon: <Zap className="w-8 h-8" />,
      color: '#9C27B0'
    }
  ];

  const techSpecs = [
    { label: 'Plattform', value: 'Windows, macOS, Linux' },
    { label: 'Sprache', value: 'TypeScript + Electron' },
    { label: 'Datenbank', value: 'Lokale SQLite' },
    { label: 'Sicherheit', value: 'AES-256 Verschlüsselung' }
  ];

  // Geändert: Floating Icons als Lucide Components
  const floatingIcons = [
    <Bitcoin className="w-8 h-8" />,
    <TrendingUp className="w-8 h-8" />,
    <DollarSign className="w-8 h-8" />,
    <Activity className="w-8 h-8" />,
    <BarChart3 className="w-8 h-8" />,
    <Zap className="w-8 h-8" />
  ];

  // Auto-Feature Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Visibility Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    const section = document.querySelector('.candlescope-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="candlescope-section" id="candlescope">
      {/* Background Elements */}
      <div className="candlescope-bg">
        <div className="bg-grid" />
        <div className="bg-gradient" />
        <div className="floating-elements">
          {/* Geändert: Icons als React Components */}
          {floatingIcons.map((icon, i) => (
            <div key={i} className={`floating-element element-${i + 1}`}>
              {icon}
            </div>
          ))}
        </div>
      </div>

      <div className="candlescope-container">
        {/* Header */}
        <div className={`candlescope-header ${isVisible ? 'header-visible' : ''}`}>
          <div className="header-badge">
            {/* Geändert: Rocket Icon statt Emoji */}
            <Rocket className="w-5 h-5 badge-icon" />
            <span className="badge-text">Mein Flagship Projekt</span>
          </div>
          
          <h2 className="candlescope-title">
            <span className="title-brand">CandleScope</span>
            <span className="title-tagline">Finance Analyzer</span>
          </h2>
          
          <p className="candlescope-subtitle">
            Dezentrale Desktop-Anwendung für professionelle Krypto-Analyse. 
            Offline, sicher und vollständig unter deiner Kontrolle.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="candlescope-content">
          {/* App Preview */}
          <div className={`app-preview ${isVisible ? 'preview-visible' : ''}`}>
            <div className="app-window">
              <div className="window-header">
                <div className="window-controls">
                  <span className="control close"></span>
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                </div>
                <div className="window-title">CandleScope v2.1.0</div>
              </div>
              
              <div className="window-content">
                {/* Geändert: Video Placeholder statt Chart-Grafiken */}
                <div className="video-placeholder">
                  <div className="video-container">
                    <div className="video-overlay">
                      <Play className="w-16 h-16 play-icon" />
                      <p className="video-text">App Demo Video</p>
                      <span className="video-duration">2:30</span>
                    </div>
                    <div className="video-background">
                      {/* Minimale Interface-Elemente als Hintergrund */}
                      <div className="interface-hint">
                        <div className="hint-header">
                          <span className="hint-pair">BTC/EUR</span>
                          <span className="hint-price">€42,350.00</span>
                          <span className="hint-change positive">+2.34%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Carousel */}
          <div className={`features-section ${isVisible ? 'features-visible' : ''}`}>
            <div className="features-header">
              <h3>Warum CandleScope?</h3>
            </div>
            
            <div className="features-carousel">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`feature-card ${activeFeature === index ? 'feature-active' : ''}`}
                  style={{ '--feature-color': feature.color } as React.CSSProperties}
                  onClick={() => setActiveFeature(index)}
                >
                  {/* Geändert: Icon als React Component */}
                  <div className="feature-icon">{feature.icon}</div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
            
            {/* Feature Navigation */}
            <div className="feature-nav">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${activeFeature === index ? 'dot-active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                  aria-label={`Feature ${index + 1} anzeigen`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className={`tech-specs ${isVisible ? 'specs-visible' : ''}`}>
          <h3 className="specs-title">Technische Details</h3>
          <div className="specs-grid">
            {techSpecs.map((spec, index) => (
              <div key={index} className="spec-item">
                <div className="spec-label">{spec.label}</div>
                <div className="spec-value">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`candlescope-cta ${isVisible ? 'cta-visible' : ''}`}>
          <div className="cta-content">
            <h3>Bereit für professionelle Krypto-Analyse?</h3>
            <p>
              CandleScope befindet sich in der Beta-Phase. 
              Melde dich für Early Access und exklusive Updates an.
            </p>
          </div>
          
          <div className="cta-buttons">
            <button className="btn-primary">
              {/* Geändert: Mail Icon statt Emoji */}
              <Mail className="w-5 h-5 btn-icon" />
              <span>Early Access anfragen</span>
            </button>
            
            <button className="btn-secondary">
              {/* Geändert: BookOpen Icon statt Emoji */}
              <BookOpen className="w-5 h-5 btn-icon" />
              <span>Dokumentation</span>
            </button>
          </div>
        </div>

        {/* Development Status */}
        <div className="development-status">
          <div className="status-item">
            {/* Geändert: CheckCircle Icon statt Emoji */}
            <CheckCircle className="w-5 h-5 status-icon text-green-500" />
            <div className="status-text">Core Engine</div>
          </div>
          <div className="status-item">
            <CheckCircle className="w-5 h-5 status-icon text-green-500" />
            <div className="status-text">Chart Analysis</div>
          </div>
          <div className="status-item">
            {/* Geändert: RotateCcw Icon statt Emoji */}
            <RotateCcw className="w-5 h-5 status-icon text-blue-500" />
            <div className="status-text">Multi-Exchange API</div>
          </div>
          <div className="status-item">
            {/* Geändert: Clock Icon statt Emoji */}
            <Clock className="w-5 h-5 status-icon text-yellow-500" />
            <div className="status-text">Beta Testing</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CandleScopeSection;