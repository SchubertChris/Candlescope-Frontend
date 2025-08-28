// src/Pages/LandingPage/LandingPage-Index.tsx
// KORRIGIERT: Conditional redirect - Logo-Navigation ohne Auto-Logout
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

  // KORRIGIERT: Conditional Auth-Redirect mit Navigation Intent Detection
  useEffect(() => {
    const checkAuthAndConditionalRedirect = () => {
      const isAuthenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      console.log('🏠 LANDING PAGE AUTH CHECK:');
      console.log('  - Is Authenticated:', isAuthenticated);
      console.log('  - Current User:', currentUser?.email);
      console.log('  - Location State:', location.state);
      
      // WICHTIG: Prüfe Navigation Intent Flags
      const isFromDashboard = location.state?.fromDashboard === true;
      const hasScrollIntent = location.state?.scrollTo;
      
      console.log('🎯 NAVIGATION FLAGS:');
      console.log('  - fromDashboard:', isFromDashboard);
      console.log('  - scrollTo:', hasScrollIntent);
      
      if (isAuthenticated && currentUser) {
        if (isFromDashboard) {
          console.log('✅ LANDING PAGE: User came from dashboard - STAYING logged in on landing page');
          // State cleanup für zukünftige normale Redirects
          window.history.replaceState({}, document.title);
          return; // KEIN REDIRECT - User bleibt auf Landing Page eingeloggt
        }
        
        if (hasScrollIntent) {
          console.log('✅ LANDING PAGE: User has scroll intent - staying on landing page');
          return; // KEIN REDIRECT - User will zu Section scrollen
        }
        
        // NUR redirect wenn User direkt/zufällig auf Landing Page gelandet ist
        console.log('🔄 LANDING PAGE: Direct access while logged in - redirecting to dashboard');
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        console.log('ℹ️  LANDING PAGE: User not logged in - staying on landing page');
      }
    };
    
    // Auth-Check nur einmal beim Mount
    checkAuthAndConditionalRedirect();
  }, [navigate, location.state]);

  // Scroll animations
  useEffect(() => {
    const observer = createFadeInObserver();
    observer.observeAll('.reveal');
    
    return () => {
      observer.destroy();
    };
  }, []);

  // Scroll handling für Navigation
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
          
          // State cleanup nach Scroll
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