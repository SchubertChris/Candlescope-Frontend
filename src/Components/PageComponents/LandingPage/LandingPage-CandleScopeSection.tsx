// src/Components/PageComponents/LandingPage/LandingPage-CandleScopeSection.tsx
// CandleScope Finance Tracker - Dezentrale Finanzanalyse & Portfolio-Tracking

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  BarChart3, 
  FileDown, 
  Zap, 
  Rocket, 
  CheckCircle,
  Clock,
  RotateCcw,
  Bitcoin,
  TrendingUp,
  DollarSign,
  Activity,
  Play,
  Lock,
  Github
} from 'lucide-react'; 
import './Style/LandingPage-CandleScopeSection.scss';

const CandleScopeSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Geändert: Features an die USB-/Offline-Tracking-App angepasst
  const features = [
    {
      id: 'offline',
      title: 'Offline & Eigenständig',
      description: 'Alle Daten bleiben lokal auf deinem USB-Stick. Keine Cloud, keine Server, volle Kontrolle.',
      icon: <Shield className="w-8 h-8" />,
      color: '#4CAF50'
    },
    {
      id: 'analysis',
      title: 'Finanzanalyse & Statistiken',
      description: 'Tracke deine Ausgaben, Investments und erhalte Auswertungen – komplett lokal berechnet.',
      icon: <BarChart3 className="w-8 h-8" />,
      color: '#2196F3'
    },
    {
      id: 'export',
      title: 'CSV & PDF Export',
      description: 'Exporte für Steuer, Archiv oder Backups – inklusive Anhänge wie PDF-Scans & Belege.',
      icon: <FileDown className="w-8 h-8" />,
      color: '#FF9800'
    },
    {
      id: 'prices',
      title: 'Live-Preisfeeds (lesend)',
      description: 'Hole dir aktuelle Kurse für Aktien, ETFs und Krypto – ohne eigene Daten preiszugeben.',
      icon: <Zap className="w-8 h-8" />,
      color: '#9C27B0'
    }
  ];

  // Geändert: TechSpecs an die USB-Idee angepasst
  const techSpecs = [
    { label: 'Plattform', value: 'Windows, macOS, Linux (portable vom USB)' },
    { label: 'Technologie', value: 'Tauri (Rust + React), Node.js optional' },
    { label: 'Datenhaltung', value: 'SQLite + SQLCipher (AES-256 Verschlüsselung)' },
    { label: 'Updates', value: 'Signierte Bundles (manuell oder auto-verifiziert)' }
  ];

  const floatingIcons = [
    <Bitcoin className="w-8 h-8" />,
    <TrendingUp className="w-8 h-8" />,
    <DollarSign className="w-8 h-8" />,
    <Activity className="w-8 h-8" />,
    <BarChart3 className="w-8 h-8" />,
    <Lock className="w-8 h-8" /> // Geändert: Schloss-Symbol für Sicherheit
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

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
      <div className="candlescope-bg">
        <div className="bg-grid" />
        <div className="bg-gradient" />
        <div className="floating-elements">
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
            <Rocket className="w-5 h-5 badge-icon" />
            <span className="badge-text">USB Finance App</span> {/* Geändert */}
          </div>
          
          <h2 className="candlescope-title">
            <span className="title-brand">CandleScope</span>
            <span className="title-tagline">Finance Tracker</span> {/* Geändert */}
          </h2>
          
          <p className="candlescope-subtitle">
            Portable Finanz-App direkt vom USB-Stick.  
            Offline, verschlüsselt, privat – mit optionalen Kurs-Feeds ohne Datenabgabe.
          </p>
        </div>

        {/* App Preview bleibt gleich, nur Text leicht angepasst */}
        <div className="candlescope-content">
          <div className={`app-preview ${isVisible ? 'preview-visible' : ''}`}>
            <div className="app-window">
              <div className="window-header">
                <div className="window-controls">
                  <span className="control close"></span>
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                </div>
                <div className="window-title">CandleScope v1.0.0</div> {/* Geändert: Version */}
              </div>
              
              <div className="window-content">
                <div className="video-placeholder">
                  <div className="video-container">
                    <div className="video-overlay">
                      <Play className="w-16 h-16 play-icon" />
                      <p className="video-text">Demo Video</p>
                      <span className="video-duration">2:30</span>
                    </div>
                    <div className="video-background">
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
                  <div className="feature-icon">{feature.icon}</div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
            
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

        {/* Tech Specs */}
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
            <h3>Deine Finanzen – deine Daten</h3>
            <p>
              CandleScope ist noch in Entwicklung – sichere dir jetzt Zugang zur Beta und gestalte die App mit!
            </p>
            <p>
            </p>
          </div>
          
            <div className="cta-buttons">
            <a href="/kontakt" className="btn-primary">
              <span>Beta-Zugang anfragen</span>
            </a>
            
            <a
              href="https://github.com/SchubertChris/Candlescope-Frontend"
              className="btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5 btn-icon" />
              <span>Dokumentation</span>
            </a>
          </div>
        </div>

        {/* Status */}
        <div className="development-status">
          <div className="status-item">
            <CheckCircle className="w-5 h-5 status-icon text-green-500" />
            <div className="status-text">Lokale DB & Verschlüsselung</div> {/* Geändert */}
          </div>
          <div className="status-item">
            <CheckCircle className="w-5 h-5 status-icon text-green-500" />
            <div className="status-text">Analyse & Statistiken</div> {/* Geändert */}
          </div>
          <div className="status-item">
            <RotateCcw className="w-5 h-5 status-icon text-blue-500" />
            <div className="status-text">Update-System</div> {/* Geändert */}
          </div>
          <div className="status-item">
            <Clock className="w-5 h-5 status-icon text-yellow-500" />
            <div className="status-text">Beta-Phase</div> {/* Geändert */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CandleScopeSection;
