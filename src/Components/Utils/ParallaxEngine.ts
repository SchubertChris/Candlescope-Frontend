// src/Components/Utils/ParallaxEngine.ts
// NEUE PARALLAX ENGINE - 3D Kino-Effekte mit Performance-Optimierung

export interface ParallaxConfig {
  element: HTMLElement;
  speed: number;
  direction?: 'vertical' | 'horizontal' | 'both';
  scale?: boolean;
  opacity?: boolean;
  rotation?: boolean;
  depth?: number; // Z-Index Simulation für 3D-Effekt
  threshold?: number; // Wann Animation startet (0-1)
}

export class ParallaxEngine {
  private elements: Map<HTMLElement, ParallaxConfig> = new Map();
  private isRunning: boolean = false;
  private rafId: number | null = null;
  private scrollY: number = 0;
  private windowHeight: number = window.innerHeight;
  private windowWidth: number = window.innerWidth;
  
  // Performance-Optimierung: Throttling
  private lastUpdateTime: number = 0;
  private readonly FPS_LIMIT = 60;
  private readonly FRAME_TIME = 1000 / this.FPS_LIMIT;

  constructor() {
    this.handleScroll = this.handleScroll.bind(this);
    this.updateElements = this.updateElements.bind(this);
    this.handleResize = this.handleResize.bind(this);
    
    // Event Listeners
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize, { passive: true });
    
    // Initial Values
    this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
    this.start();
  }

  // Element zur Parallax-Engine hinzufügen
  addElement(element: HTMLElement, config: Omit<ParallaxConfig, 'element'>): void {
    const fullConfig: ParallaxConfig = {
      element,
      direction: 'vertical',
      scale: false,
      opacity: false,
      rotation: false,
      depth: 1,
      threshold: 0,
      ...config
    };
    
    this.elements.set(element, fullConfig);
    
    // Initial CSS Setup für 3D
    element.style.willChange = 'transform, opacity';
    element.style.transformStyle = 'preserve-3d';
    element.style.backfaceVisibility = 'hidden';
  }

  // Element entfernen
  removeElement(element: HTMLElement): void {
    this.elements.delete(element);
    
    // Cleanup CSS
    element.style.willChange = 'auto';
    element.style.transform = '';
    element.style.opacity = '';
  }

  private handleScroll(): void {
    this.scrollY = window.pageYOffset || document.documentElement.scrollTop;
  }

  private handleResize(): void {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }

  private updateElements(): void {
    const currentTime = performance.now();
    
    // FPS-Limiting für bessere Performance
    if (currentTime - this.lastUpdateTime < this.FRAME_TIME) {
      this.rafId = requestAnimationFrame(this.updateElements);
      return;
    }

    this.lastUpdateTime = currentTime;

    this.elements.forEach((config, element) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + this.scrollY;
      const elementHeight = rect.height;
      
      // Sichtbarkeits-Check für Performance
      const isInViewport = (
        rect.top < this.windowHeight + 200 && // 200px Puffer
        rect.bottom > -200
      );

      if (!isInViewport) return;

      // Scroll-Progress berechnen (0 = oben, 1 = unten)
      const scrollProgress = Math.max(0, Math.min(1, 
        (this.scrollY - elementTop + this.windowHeight) / 
        (this.windowHeight + elementHeight)
      ));

      // Threshold Check
      if (scrollProgress < config.threshold) return;

      // Transform-Komponenten berechnen
      let transforms: string[] = [];
      let opacity = 1;

      // PARALLAX BEWEGUNG
      if (config.direction === 'vertical' || config.direction === 'both') {
        const translateY = -(scrollProgress - 0.5) * config.speed * config.depth;
        transforms.push(`translateY(${translateY}px)`);
      }

      if (config.direction === 'horizontal' || config.direction === 'both') {
        const translateX = (scrollProgress - 0.5) * config.speed * 0.5;
        transforms.push(`translateX(${translateX}px)`);
      }

      // 3D SCALE EFFEKT (Kino-ähnlich)
      if (config.scale) {
        const scaleProgress = 0.8 + (scrollProgress * 0.4); // 0.8 bis 1.2
        const scale = Math.max(0.1, Math.min(2, scaleProgress));
        transforms.push(`scale3d(${scale}, ${scale}, 1)`);
        
        // Z-Translation für echten 3D-Effekt
        const translateZ = (scrollProgress - 0.5) * config.depth * 50;
        transforms.push(`translateZ(${translateZ}px)`);
      }

      // 3D ROTATION
      if (config.rotation) {
        const rotateX = (scrollProgress - 0.5) * 30 * config.depth; // Max 30 Grad
        const rotateY = (scrollProgress - 0.5) * 15 * config.depth; // Max 15 Grad
        transforms.push(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
      }

      // OPACITY FADE
      if (config.opacity) {
        // Smooth fade basierend auf Scroll-Position
        opacity = Math.max(0, Math.min(1, 
          1 - Math.abs((scrollProgress - 0.5) * 2)
        ));
      }

      // CSS anwenden
      element.style.transform = transforms.join(' ');
      element.style.opacity = opacity.toString();
    });

    this.rafId = requestAnimationFrame(this.updateElements);
  }

  // Engine starten
  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.rafId = requestAnimationFrame(this.updateElements);
    }
  }

  // Engine stoppen
  stop(): void {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Cleanup
  destroy(): void {
    this.stop();
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    
    // Alle Elemente zurücksetzen
    this.elements.forEach((_, element) => {
      this.removeElement(element);
    });
    
    this.elements.clear();
  }

  // Scroll-Progress für externe Komponenten
  getScrollProgress(): number {
    const maxScroll = document.documentElement.scrollHeight - this.windowHeight;
    return Math.max(0, Math.min(1, this.scrollY / maxScroll));
  }

  // Current Scroll Position
  getScrollY(): number {
    return this.scrollY;
  }
}

// Singleton Instance
export const parallaxEngine = new ParallaxEngine();