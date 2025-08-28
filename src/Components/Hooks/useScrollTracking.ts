// src/Components/Hooks/useScrollTracking.ts
// Custom Hook für Landing Page Scroll-Tracking und Navigation

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseScrollTrackingOptions {
  onSectionChange?: (sectionId: string) => void;
  sections: string[];
  threshold?: number;
  rootMargin?: string;
}

interface ScrollTrackingState {
  progress: number;
  currentSection: string;
  isScrolling: boolean;
  direction: 'up' | 'down' | null;
}

export const useScrollTracking = ({
  onSectionChange,
  sections,
  threshold = 0.3,
  rootMargin = '0px'
}: UseScrollTrackingOptions) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<string>(sections[0] || '');
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  
  const lastScrollY = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const observerRef = useRef<IntersectionObserver>();

  // Calculate scroll progress
  const calculateScrollProgress = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = documentHeight - windowHeight;
    
    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) : 0;
    setScrollProgress(Math.min(1, Math.max(0, progress)));

    // Determine scroll direction
    const currentScrollY = window.pageYOffset;
    if (currentScrollY > lastScrollY.current) {
      setScrollDirection('down');
    } else if (currentScrollY < lastScrollY.current) {
      setScrollDirection('up');
    }
    lastScrollY.current = currentScrollY;

    // Set scrolling state
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  // Section detection with Intersection Observer
  const setupSectionObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        let visibleSection = currentSection;
        let maxIntersectionRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
            maxIntersectionRatio = entry.intersectionRatio;
            visibleSection = entry.target.id;
          }
        });

        if (visibleSection !== currentSection) {
          setCurrentSection(visibleSection);
          onSectionChange?.(visibleSection);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    // Observe all sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });
  }, [sections, threshold, rootMargin, currentSection, onSectionChange]);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(() => {
    let ticking = false;

    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };
  }, [calculateScrollProgress]);

  // Setup event listeners
  useEffect(() => {
    const scrollHandler = throttledScrollHandler();
    
    // Initial setup
    calculateScrollProgress();
    setupSectionObserver();

    // Event listeners
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', calculateScrollProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', calculateScrollProgress);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [throttledScrollHandler, calculateScrollProgress, setupSectionObserver]);

  // Smooth scroll to section function
  const scrollToSection = useCallback((sectionId: string, offset: number = 80) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }, []);

  // Get section visibility percentages
  const getSectionVisibility = useCallback(() => {
    const visibilityMap: Record<string, number> = {};

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) {
        visibilityMap[sectionId] = 0;
        return;
      }

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, -rect.top);
      const visibleBottom = Math.min(rect.height, windowHeight - Math.max(0, rect.top));
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityPercentage = rect.height > 0 ? visibleHeight / rect.height : 0;

      visibilityMap[sectionId] = Math.min(1, Math.max(0, visibilityPercentage));
    });

    return visibilityMap;
  }, [sections]);

  // Return state and functions
  return {
    // Primary values
    scrollProgress,
    currentSection,
    isScrolling,
    scrollDirection,
    
    // Utility functions
    scrollToSection,
    getSectionVisibility,
    
    // State object for convenience
    state: {
      progress: scrollProgress,
      currentSection,
      isScrolling,
      direction: scrollDirection
    } as ScrollTrackingState
  };
};