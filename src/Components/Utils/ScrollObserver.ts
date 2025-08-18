// ===========================
// SCROLL OBSERVER UTILITY
// ===========================

export interface ScrollObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  animationClass?: string;
  once?: boolean;
}

export class ScrollObserver {
  private observer: IntersectionObserver;
  private observedElements: Map<Element, ScrollObserverOptions> = new Map();
  private callbacks: Map<Element, (entry: IntersectionObserverEntry) => void> = new Map();
  private defaultOptions: ScrollObserverOptions;

  constructor(defaultOptions: ScrollObserverOptions = {}) {
    this.defaultOptions = {
      threshold: 0.1,
      rootMargin: '0px',
      root: null,
      animationClass: 'revealed',
      once: true,
      ...defaultOptions
    };

    this.observer = this.createObserver();
  }

  /**
   * Erstellt einen neuen Intersection Observer
   */
  private createObserver(): IntersectionObserver {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        const options = this.observedElements.get(element) || this.defaultOptions;
        const callback = this.callbacks.get(element);

        if (entry.isIntersecting) {
          // Element ist sichtbar
          if (options.animationClass) {
            element.classList.add(options.animationClass);
          }

          if (callback) {
            callback(entry);
          }

          // Bei once: true Element nicht mehr beobachten
          if (options.once) {
            this.unobserve(element);
          }
        } else if (!options.once && options.animationClass) {
          // Element ist nicht mehr sichtbar (nur wenn once: false)
          element.classList.remove(options.animationClass);
        }
      });
    }, {
      threshold: this.defaultOptions.threshold,
      rootMargin: this.defaultOptions.rootMargin,
      root: this.defaultOptions.root
    });
  }

  /**
   * Beginnt ein Element zu beobachten
   */
  observe(element: Element, options?: ScrollObserverOptions, callback?: (entry: IntersectionObserverEntry) => void): void {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    this.observedElements.set(element, mergedOptions);
    
    if (callback) {
      this.callbacks.set(element, callback);
    }

    // Füge initiale Klasse hinzu wenn gewünscht
    if (mergedOptions.animationClass && !element.classList.contains(mergedOptions.animationClass)) {
      element.classList.add('reveal');
    }

    this.observer.observe(element);
  }

  /**
   * Beobachtet mehrere Elemente
   */
  observeAll(selector: string, options?: ScrollObserverOptions, callback?: (entry: IntersectionObserverEntry) => void): void {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      this.observe(element, options, callback);
    });
  }

  /**
   * Stoppt die Beobachtung eines Elements
   */
  unobserve(element: Element): void {
    this.observer.unobserve(element);
    this.observedElements.delete(element);
    this.callbacks.delete(element);
  }

  /**
   * Stoppt die Beobachtung aller Elemente
   */
  unobserveAll(): void {
    this.observedElements.forEach((_, element) => {
      this.observer.unobserve(element);
    });
    this.observedElements.clear();
    this.callbacks.clear();
  }

  /**
   * Zerstört den Observer
   */
  destroy(): void {
    this.observer.disconnect();
    this.observedElements.clear();
    this.callbacks.clear();
  }

  /**
   * Prüft ob ein Element beobachtet wird
   */
  isObserving(element: Element): boolean {
    return this.observedElements.has(element);
  }
}

// Factory Funktionen für häufige Anwendungsfälle

/**
 * Erstellt einen Observer für Fade-In Animationen
 */
export function createFadeInObserver(options?: ScrollObserverOptions): ScrollObserver {
  return new ScrollObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    animationClass: 'revealed',
    once: true,
    ...options
  });
}

/**
 * Erstellt einen Observer für Parallax-Effekte
 */
export function createParallaxObserver(_callback: (entry: IntersectionObserverEntry) => void): ScrollObserver {
  const observer = new ScrollObserver({
    threshold: Array.from({ length: 101 }, (_, i) => i / 100),
    once: false
  });

  return observer;
}

/**
 * Erstellt einen Observer für Sticky Navigation
 */
export function createStickyNavObserver(callback: (isSticky: boolean) => void): ScrollObserver {
  const observer = new ScrollObserver({
    threshold: [0, 1],
    rootMargin: '-1px 0px 0px 0px',
    once: false
  });

  // Beobachte ein Sentinel-Element am Top der Seite
  const sentinel = document.createElement('div');
  sentinel.style.position = 'absolute';
  sentinel.style.top = '0';
  sentinel.style.height = '1px';
  sentinel.style.width = '100%';
  document.body.prepend(sentinel);

  observer.observe(sentinel, {}, (entry) => {
    callback(!entry.isIntersecting);
  });

  return observer;
}

// Standard Export
export default ScrollObserver;