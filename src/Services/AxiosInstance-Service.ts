// src/Services/AxiosInstance-Service.ts
// KORRIGIERT: Keine automatische Weiterleitung bei 401-Fehlern
import axios from "axios";

// Base URL aus Vite Env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios-Instanz
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request-Interceptor für automatisches Token-Handling
axiosInstance.interceptors.request.use(
  (config) => {
    // Token aus localStorage holen und in Header setzen
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// Response-Interceptor für automatisches Token-Management
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Debug-Logging für Fehler-Responses
    console.error(
      `API Error: ${error.response?.status} ${error.config?.url}`,
      error.response?.data
    );

    // KORRIGIERT: Bei 401 nur Token entfernen, KEINE automatische Weiterleitung
    if (error.response?.status === 401) {
      console.warn("Token ungültig - Entferne Auth-Daten");
      
      // Auth-Daten entfernen
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("oauthProvider");
      
      // ENTFERNT: Automatische Weiterleitung - überlassen wir den Components
      // if (!window.location.pathname.includes("/login") && window.location.pathname !== "/") {
      //   window.location.href = "/";
      // }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;