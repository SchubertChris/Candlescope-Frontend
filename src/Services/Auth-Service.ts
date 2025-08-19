// src/Services/Auth-Service.ts
// ERWEITERT: Auth-Service für OAuth-Integration mit dynamischen URLs
import axiosInstance from './AxiosInstance-Service';

// HINZUGEFÜGT: Erweiterte TypeScript-Interfaces für OAuth
interface LoginData {
  email: string;
  password: string;
  confirmAccountCreation?: boolean; // HINZUGEFÜGT: Für automatische Account-Erstellung
}

interface RegisterData {
  email: string;
  password: string;
}

// KORRIGIERT: AuthResponse Interface mit optionaler email-Funktion entfernt
interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string; // HINZUGEFÜGT: Für OAuth-User
    avatar?: string; // HINZUGEFÜGT: Für OAuth-User
  };
  message?: string;
  accountCreated?: boolean; // HINZUGEFÜGT: Flag für neue Accounts
  emailSent?: boolean; // HINZUGEFÜGT: Flag für Email-Versand
  requiresConfirmation?: boolean; // HINZUGEFÜGT: Flag für Bestätigung
  email?: string; // HINZUGEFÜGT: Optional für Bestätigungs-Cases
}

// HINZUGEFÜGT: OAuth-Provider Types
type OAuthProvider = 'google' | 'github';

// HINZUGEFÜGT: Dynamische Backend-URL Funktion
const getBackendURL = (): string => {
  // Priorität: Environment Variable → Development Default
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

class AuthService {
  
  // ERWEITERT: Login-Funktion mit OAuth-Support
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔐 LOGIN ATTEMPT:', loginData.email);
      const response = await axiosInstance.post('/auth/login', loginData);
     
      // Token und User-Daten im localStorage speichern (nur bei erfolgreichem Login)
      if (response.data.token && !response.data.requiresConfirmation) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        console.log('✅ LOGIN SUCCESS - Token stored');
      }
     
      return response.data;
    } catch (error: any) {
      console.error('❌ LOGIN ERROR:', error);
      // Fehlerbehandlung für verschiedene HTTP-Status-Codes
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login fehlgeschlagen. Bitte versuche es erneut.');
    }
  }

  // KORRIGIERT: OAuth-Login mit dynamischer Backend-URL
  initiateOAuth(provider: OAuthProvider): void {
    const baseURL = getBackendURL(); // GEÄNDERT: Dynamische URL
    const oauthURL = `${baseURL}/auth/${provider}`;
    
    console.log(`🔗 INITIATING ${provider.toUpperCase()} OAUTH:`, oauthURL);
    
    // OAuth-Flow initiieren
    window.location.href = oauthURL;
  }

  // KORRIGIERT: OAuth-Callback-Handler mit korrektem AuthResponse
  async handleOAuthCallback(token: string, userDataString: string): Promise<AuthResponse> {
    try {
      console.log('🔄 HANDLING OAUTH CALLBACK');
      
      // User-Daten parsen
      const userData = JSON.parse(decodeURIComponent(userDataString));
      
      // Token und User-Daten speichern
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      console.log('✅ OAUTH SUCCESS - Data stored:', userData.email);
      
      // KORRIGIERT: Vollständige AuthResponse mit allen erforderlichen Feldern
      return {
        token,
        user: userData,
        message: 'OAuth-Login erfolgreich!',
        email: userData.email // HINZUGEFÜGT: Email-Feld für Kompatibilität
      };
    } catch (error: any) {
      console.error('❌ OAUTH CALLBACK ERROR:', error);
      throw new Error('OAuth-Authentifizierung fehlgeschlagen');
    }
  }

  // HINZUGEFÜGT: OAuth-Error-Handler
  handleOAuthError(error: string): void {
    console.error('❌ OAUTH ERROR:', error);
    
    // Fehler-Mapping für bessere User-Erfahrung
    const errorMessages: Record<string, string> = {
      'token_generation_failed': 'Token-Generierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      'user_creation_failed': 'Benutzer-Erstellung fehlgeschlagen. Bitte kontaktieren Sie den Support.',
      'access_denied': 'Zugriff verweigert. Sie haben die OAuth-Anfrage abgelehnt.',
      'invalid_request': 'Ungültige Anfrage. Bitte versuchen Sie es erneut.'
    };
    
    const message = errorMessages[error] || 'Ein unbekannter Fehler ist aufgetreten.';
    throw new Error(message);
  }

  // ERWEITERT: Register-Funktion (unverändert)
  async register(registerData: RegisterData): Promise<{ message: string }> {
    try {
      console.log('📝 REGISTER ATTEMPT:', registerData.email);
      const response = await axiosInstance.post('/auth/register', registerData);
      return response.data;
    } catch (error: any) {
      console.error('❌ REGISTER ERROR:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
    }
  }

  // ERWEITERT: Logout-Funktion mit OAuth-Cleanup
  logout(): void {
    console.log('🚪 LOGGING OUT');
    
    // Alle Auth-Daten aus localStorage entfernen
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Zusätzliche OAuth-spezifische Cleanup (falls nötig)
    localStorage.removeItem('oauthProvider');
    
    // Zur Startseite weiterleiten
    window.location.href = '/';
  }

  // ERWEITERT: Check ob User eingeloggt ist
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    // Beide müssen vorhanden sein für gültige Authentifizierung
    return !!(token && userData);
  }

  // ERWEITERT: User-Daten aus localStorage holen
  getCurrentUser(): { id: string; email: string; name?: string; avatar?: string } | null {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed;
      } catch (error) {
        this.logout();
        return null;
      }
    }
    return null;
  }

  // UNVERÄNDERT: Token aus localStorage holen
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // HINZUGEFÜGT: Check ob User über OAuth eingeloggt ist
  isOAuthUser(): boolean {
    const user = this.getCurrentUser();
    return !!(user?.name || user?.avatar); // OAuth-User haben meist name/avatar
  }

  // HINZUGEFÜGT: OAuth-Provider ermitteln (falls gespeichert)
  getOAuthProvider(): OAuthProvider | null {
    return localStorage.getItem('oauthProvider') as OAuthProvider | null;
  }

  // HINZUGEFÜGT: OAuth-Provider speichern
  setOAuthProvider(provider: OAuthProvider): void {
    localStorage.setItem('oauthProvider', provider);
  }

  // HINZUGEFÜGT: Rate-Limit Status abfragen
  async getRateLimitStatus(email: string): Promise<any> {
    try {
      const response = await axiosInstance.get(`/auth/rate-limit-status/${email}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ RATE LIMIT STATUS ERROR:', error);
      return null;
    }
  }
}

// Singleton-Pattern: Eine Instanz für die ganze App
const authService = new AuthService();

// HINZUGEFÜGT: Development Debug (nur in Development-Modus)
if (import.meta.env.DEV) {
  (window as any).authService = authService; // Für Browser-Console Debug
}

export default authService;