// src/Services/AxiosInstance-Service.ts
// KORRIGIERT: BaseURL ohne doppeltes /api
import axios from 'axios';

// KORRIGIERT: Base URL für Backend-API (ohne /api am Ende)
const API_BASE_URL = 'http://localhost:5000/api';

// Axios-Instanz mit Standard-Konfiguration erstellen
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 Sekunden Timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request-Interceptor für automatisches Token-Handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Debug-Logging für die finale URL
    
    // Token aus localStorage holen und in Header setzen
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response-Interceptor für automatisches Token-Management
axiosInstance.interceptors.response.use(
  (response) => {
    // Debug-Logging für erfolgreiche Responses
    return response;
  },
  (error) => {
    // Debug-Logging für Fehler-Responses
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    
    // Bei 401 (Unauthorized) Token entfernen und zur Login-Seite weiterleiten
    if (error.response?.status === 401) {
      console.warn('🔐 Token ungültig - Logout erforderlich');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Zur Login-Seite weiterleiten (nur wenn nicht bereits auf Login-Seite)
      if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;