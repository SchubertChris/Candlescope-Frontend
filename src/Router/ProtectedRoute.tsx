// src/Router/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../Services/Auth-Service'; // KORRIGIERT: Default-Import ohne geschweifte Klammern

// Props-Interface für ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ProtectedRoute-Komponente mit Auth-Check
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
 
  // Auth-Status prüfen
  const isAuthenticated = authService.isAuthenticated();
 
  // Falls nicht eingeloggt, zur Startseite weiterleiten
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
 
  // Falls eingeloggt, Kinder-Komponenten rendern
  return <>{children}</>;
};

export default ProtectedRoute;