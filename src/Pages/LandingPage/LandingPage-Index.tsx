// ===========================
// LANDING PAGE INDEX - KORRIGIERT mit Router State Handling
// ===========================
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '@/Components/PageComponents/LandingPage/LandingPage-HeroSection';
import AboutSection from '@/Components/PageComponents/LandingPage/LandingPage-AboutSection';
import WorkSection from '@/Components/PageComponents/LandingPage/LandingPage-WorkSection';
import OffersSection from '@/Components/PageComponents/LandingPage/LandingPage-OffersSection';
import CTASection from '@/Components/PageComponents/LandingPage/LandingPage-ContactSection';
import { createFadeInObserver } from '@/Components/Utils/ScrollObserver';
import CookieBanner from '@/Components/Ui/CookieBanner';

const LandingPage: React.FC = () => {
  const location = useLocation();
  const scrollHandledRef = useRef(false); // KORRIGIERT: Verhindert doppeltes Scrollen

  useEffect(() => {
    // Initialize scroll animations
    const observer = createFadeInObserver();
    
    // Observe all reveal elements
    observer.observeAll('.reveal');

    return () => {
      observer.destroy();
    };
  }, []);

  // KORRIGIERT: Router State Scroll Handling
  useEffect(() => {
    // Prüfen ob wir eine Scroll-Anfrage vom Router haben
    const scrollToSection = location.state?.scrollTo;
    
    if (scrollToSection && !scrollHandledRef.current) {
      console.log(`🎯 LANDING PAGE: Received scroll request for ${scrollToSection}`);
      
      scrollHandledRef.current = true; // Markiere als behandelt
      
      // Warten bis alle Komponenten gemountet sind
      setTimeout(() => {
        const element = document.querySelector(`#${scrollToSection}`);
        
        if (element) {
          const offset = 80; // Navbar-Höhe
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          
          console.log(`⬇️ LANDING PAGE: Scrolling to ${scrollToSection} at position ${elementPosition - offset}`);
          
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
          
          // KORRIGIERT: State nach dem Scrollen clearen
          window.history.replaceState({}, document.title);
          
        } else {
          console.warn(`❌ LANDING PAGE: Section #${scrollToSection} not found`);
        }
        
        // Reset nach kurzer Zeit für zukünftige Navigationen
        setTimeout(() => {
          scrollHandledRef.current = false;
        }, 1000);
      }, 100);
    }
  }, [location.state?.scrollTo]);

  // KORRIGIERT: Cleanup bei Unmount
  useEffect(() => {
    return () => {
      scrollHandledRef.current = false;
    };
  }, []);

  return (
    <div className="landing-page">
      <CookieBanner />
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <OffersSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;