/* Toggle Button zum wiederverwenden */

// ===========================
// THEME TOGGLE SERVICE
// ===========================

export type Theme = 'light' | 'dark';

class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';
  private readonly DEFAULT_THEME: Theme = 'light';
  private currentTheme: Theme;
  private listeners: ((theme: Theme) => void)[] = [];

  constructor() {
    this.currentTheme = this.loadTheme();
    this.applyTheme(this.currentTheme);
    this.setupSystemThemeListener();
  }

  /**
   * Lädt das gespeicherte Theme oder verwendet System-Präferenz
   */
  private loadTheme(): Theme {
    // Versuche gespeichertes Theme zu laden
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    
    if (savedTheme && this.isValidTheme(savedTheme)) {
      return savedTheme;
    }

    // Fallback auf System-Präferenz
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return this.DEFAULT_THEME;
  }

  /**
   * Validiert Theme-Wert
   */
  private isValidTheme(theme: string): theme is Theme {
    return theme === 'light' || theme === 'dark';
  }

  /**
   * Wendet Theme auf das DOM an
   */
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Meta Theme Color für mobile Browser
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1814' : '#F2EFE9');
    }
  }

  /**
   * Listener für System-Theme-Änderungen
   */
  private setupSystemThemeListener(): void {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Nur reagieren wenn kein manuelles Theme gesetzt ist
      if (!localStorage.getItem(this.THEME_KEY)) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        this.setTheme(newTheme, false);
      }
    });
  }

  /**
   * Gibt das aktuelle Theme zurück
   */
  getTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Setzt ein neues Theme
   */
  setTheme(theme: Theme, save: boolean = true): void {
    if (!this.isValidTheme(theme)) {
      console.error(`Invalid theme: ${theme}`);
      return;
    }

    this.currentTheme = theme;
    this.applyTheme(theme);

    if (save) {
      localStorage.setItem(this.THEME_KEY, theme);
    }

    // Benachrichtige alle Listener
    this.notifyListeners(theme);
  }

  /**
   * Wechselt zwischen Themes
   */
  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Registriert einen Listener für Theme-Änderungen
   */
  subscribe(listener: (theme: Theme) => void): () => void {
    this.listeners.push(listener);
    
    // Gibt Unsubscribe-Funktion zurück
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Benachrichtigt alle Listener über Theme-Änderung
   */
  private notifyListeners(theme: Theme): void {
    this.listeners.forEach(listener => {
      try {
        listener(theme);
      } catch (error) {
        console.error('Error in theme listener:', error);
      }
    });
  }

  /**
   * Setzt Theme auf System-Standard zurück
   */
  resetToSystemTheme(): void {
    localStorage.removeItem(this.THEME_KEY);
    const systemTheme: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.setTheme(systemTheme, false);
  }
}

// Singleton Instance
const themeService = new ThemeService();

// Export als default und named export
export default themeService;
export { themeService };