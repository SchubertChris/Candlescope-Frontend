// ===========================
// HERO SECTION COMPONENT - KRASSE iOS ENTRANCE ANIMATION
// ===========================

import React, { useEffect, useState } from 'react';
import './Style/LandingPage-HeroSection.scss';
import Logo from '@/assets/Images/Logo/CandleScopeLogo.png';

const HeroSection: React.FC = () => {
  const [animationComplete, setAnimationComplete] = useState(false); // HINZUGEFÜGT: State für Animation-Status
  const [showParticles, setShowParticles] = useState(false); // HINZUGEFÜGT: State für Partikel-Animation

  useEffect(() => {
    // HINZUGEFÜGT: Delayed particle activation für staggered effect
    const particleTimer = setTimeout(() => {
      setShowParticles(true);
    }, 800); // Startet nach Logo-Scale-Animation

    // HINZUGEFÜGT: Animation completion handler
    const completeTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500); // Gesamte Animation-Duration

    return () => {
      clearTimeout(particleTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  return (
    <section className="hero-section">
      {/* HINZUGEFÜGT: Animated Background Particles */}
      <div className="hero-bg-particles">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={`particle particle-${i + 1} ${showParticles ? 'particle-active' : ''}`}
            style={{
              '--delay': `${i * 0.1}s`, // Staggered delays für jeden Partikel
              '--random-x': `${Math.random() * 100}%`,
              '--random-y': `${Math.random() * 100}%`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* HINZUGEFÜGT: Main Logo Container mit Glassmorphism */}
      <div className="hero-logo-container">
        {/* HINZUGEFÜGT: Glow Ring Effect */}
        <div className="hero-glow-ring hero-glow-ring-1"></div>
        <div className="hero-glow-ring hero-glow-ring-2"></div>
        
        {/* HINZUGEFÜGT: Glassmorphic Background */}
        <div className="hero-glass-bg"></div>
        
        {/* HAUPTÄNDERUNG: Logo mit krasser Entrance Animation */}
        <div className="hero-logo-wrapper">
          <img 
            src={Logo} 
            alt="CandleScope Logo" 
            className="hero-logo-img"
          />
          
          {/* HINZUGEFÜGT: Logo Shimmer Overlay */}
          <div className="hero-logo-shimmer"></div>
        </div>
        
        {/* HINZUGEFÜGT: Pulsing Dots um das Logo */}
        <div className="hero-orbit-dots">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="hero-orbit-dot"
              style={{
                '--orbit-angle': `${i * 45}deg`,
                '--orbit-delay': `${i * 0.15}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* HINZUGEFÜGT: Animated Text Reveal (falls später Text hinzugefügt wird) */}
      <div className={`hero-text-container ${animationComplete ? 'hero-text-reveal' : ''}`}>
        <h1 className="hero-title">
          <span className="hero-title-word">Candle</span>
          <span className="hero-title-word">Scope</span>
        </h1>
        <p className="hero-subtitle">Building Modern Experiences</p>
      </div>

      {/* HINZUGEFÜGT: Scroll Indicator mit Delay */}
      <div className={`hero-scroll-indicator ${animationComplete ? 'hero-scroll-show' : ''}`}>
        <div className="hero-scroll-line"></div>
        <div className="hero-scroll-dot"></div>
      </div>
    </section>
  );
};

export default HeroSection;