// src/Services/AxiosInstance-Service.ts
import axios from 'axios';

// KONFIGURIERT: Base URL für Backend-API
const API_BASE_URL = 'http://localhost:5000/api';

// Axios-Instanz mit Standard-Konfiguration erstellen
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 Sekunden Timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// HINZUGEFÜGT: Request-Interceptor für automatisches Token-Handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Token aus localStorage holen und in Header setzen
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// HINZUGEFÜGT: Response-Interceptor für automatisches Token-Management
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Bei 401 (Unauthorized) Token entfernen und zur Login-Seite weiterleiten
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      // Hier könntest du zur Login-Seite weiterleiten
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;