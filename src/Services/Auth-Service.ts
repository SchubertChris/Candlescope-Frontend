// src/Services/Auth-Service.ts
// KORRIGIERT: OAuth-URLs und Route-Handling
import axiosInstance from './AxiosInstance-Service';

interface LoginData {
  email: string;
  password: string;
  confirmAccountCreation?: boolean;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
  message?: string;
  accountCreated?: boolean;
  emailSent?: boolean;
  requiresConfirmation?: boolean;
  email?: string;
}

type OAuthProvider = 'google' | 'github';

// KORRIGIERT: Dynamische Backend-URL mit korrekten OAuth-Routen
const getBackendURL = (): string => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

class AuthService {
  
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔐 LOGIN ATTEMPT:', loginData.email);
      const response = await axiosInstance.post('/auth/login', loginData);
     
      if (response.data.token && !response.data.requiresConfirmation) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        console.log('✅ LOGIN SUCCESS - Token stored');
      }
     
      return response.data;
    } catch (error: any) {
      console.error('❌ LOGIN ERROR:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login fehlgeschlagen. Bitte versuche es erneut.');
    }
  }

  // KORRIGIERT: OAuth-URLs verwenden jetzt /oauth statt /auth
  initiateOAuth(provider: OAuthProvider): void {
    const baseURL = getBackendURL();
    // GEÄNDERT: Verwende /oauth statt /auth für OAuth-Routen
    const oauthURL = `${baseURL}/oauth/${provider}`;
    
    console.log(`🔗 INITIATING ${provider.toUpperCase()} OAUTH:`, oauthURL);
    console.log('🌐 BACKEND URL:', baseURL);
    
    // KORRIGIERT: Direkte Weiterleitung zur OAuth-Route
    window.location.href = oauthURL;
  }

  async handleOAuthCallback(token: string, userDataString: string): Promise<AuthResponse> {
    try {
      console.log('🔄 HANDLING OAUTH CALLBACK');
      console.log('🎫 Token received:', token.substring(0, 20) + '...');
      console.log('👤 User data received:', userDataString);
      
      const userData = JSON.parse(decodeURIComponent(userDataString));
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      console.log('✅ OAUTH SUCCESS - Data stored:', userData.email);
      
      return {
        token,
        user: userData,
        message: 'OAuth-Login erfolgreich!',
        email: userData.email
      };
    } catch (error: any) {
      console.error('❌ OAUTH CALLBACK ERROR:', error);
      throw new Error('OAuth-Authentifizierung fehlgeschlagen');
    }
  }

  handleOAuthError(error: string): void {
    console.error('❌ OAUTH ERROR:', error);
    
    const errorMessages: Record<string, string> = {
      'token_generation_failed': 'Token-Generierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      'user_creation_failed': 'Benutzer-Erstellung fehlgeschlagen. Bitte kontaktieren Sie den Support.',
      'access_denied': 'Zugriff verweigert. Sie haben die OAuth-Anfrage abgelehnt.',
      'invalid_request': 'Ungültige Anfrage. Bitte versuchen Sie es erneut.'
    };
    
    const message = errorMessages[error] || 'Ein unbekannter Fehler ist aufgetreten.';
    throw new Error(message);
  }

  async register(registerData: { email: string; password: string }): Promise<{ message: string }> {
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

  logout(): void {
    console.log('🚪 LOGGING OUT');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('oauthProvider');
    window.location.href = '/';
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
  }

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

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isOAuthUser(): boolean {
    const user = this.getCurrentUser();
    return !!(user?.name || user?.avatar);
  }

  getOAuthProvider(): OAuthProvider | null {
    return localStorage.getItem('oauthProvider') as OAuthProvider | null;
  }

  setOAuthProvider(provider: OAuthProvider): void {
    localStorage.setItem('oauthProvider', provider);
  }

  async getRateLimitStatus(email: string): Promise<any> {
    try {
      const response = await axiosInstance.get(`/auth/rate-limit-status/${email}`);
      return response.data;
    } catch (error: any) {
      console.error('❌ RATE LIMIT STATUS ERROR:', error);
      return null;
    }
  }

  // HINZUGEFÜGT: Debug-Funktion für OAuth-Status
  async checkOAuthStatus(): Promise<void> {
    try {
      const response = await axiosInstance.get('/oauth/status');
      console.log('🔍 OAUTH STATUS:', response.data);
    } catch (error) {
      console.error('❌ OAUTH STATUS CHECK FAILED:', error);
    }
  }
}

const authService = new AuthService();

// Development Debug
if (import.meta.env.DEV) {
  (window as any).authService = authService;
}

export default authService;