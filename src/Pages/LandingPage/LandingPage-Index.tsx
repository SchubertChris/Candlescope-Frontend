// src/Pages/LandingPage/LandingPage-Index.tsx
// KORRIGIERT: Auto-Dashboard-Redirect für eingeloggte User
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '@/Services/Auth-Service';

// Components imports
import HeroSection from '@/Components/PageComponents/LandingPage/LandingPage-HeroSection';
import AboutSection from '@/Components/PageComponents/LandingPage/LandingPage-AboutSection';
import WorkSection from '@/Components/PageComponents/LandingPage/LandingPage-WorkSection';
import OffersSection from '@/Components/PageComponents/LandingPage/LandingPage-OffersSection';
import CTASection from '@/Components/PageComponents/LandingPage/LandingPage-ContactSection';
import { createFadeInObserver } from '@/Components/Utils/ScrollObserver';
import CookieBanner from '@/Components/Ui/CookieBanner';

const LandingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollHandledRef = useRef(false);

  // TEMPORÄR DEAKTIVIERT: Auth-Check für eingeloggte User
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const isAuthenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      console.log('🏠 LANDING PAGE AUTH CHECK:');
      console.log('  - Is Authenticated:', isAuthenticated);
      console.log('  - Current User:', currentUser?.email);
      
      // Falls User eingeloggt ist, zum Dashboard weiterleiten
      if (isAuthenticated && currentUser) {
        console.log('✅ LANDING PAGE: User is logged in, redirecting to dashboard...');
        
        // Kurze Verzögerung für bessere UX
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        console.log('ℹ️  LANDING PAGE: User not logged in, staying on landing page');
      }
    };
    
    // Auth-Check nur einmal ausführen
    checkAuthAndRedirect();
  }, []); // Leeres dependency array = nur beim Mount

  // Bestehende scroll animations
  useEffect(() => {
    const observer = createFadeInObserver();
    observer.observeAll('.reveal');
    
    return () => {
      observer.destroy();
    };
  }, []);

  // Bestehende scroll handling
  useEffect(() => {
    const scrollToSection = location.state?.scrollTo;
    
    if (scrollToSection && !scrollHandledRef.current) {
      console.log(`🎯 LANDING PAGE: Received scroll request for ${scrollToSection}`);
      
      scrollHandledRef.current = true;
      
      setTimeout(() => {
        const element = document.querySelector(`#${scrollToSection}`);
        
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          });
          
          window.history.replaceState({}, document.title);
        }
        
        setTimeout(() => {
          scrollHandledRef.current = false;
        }, 1000);
      }, 100);
    }
  }, [location.state?.scrollTo]);

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