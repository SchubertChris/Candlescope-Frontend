// src/Router/ProtectedRoute.tsx
// KORRIGIERT: Robuste Auth-Prüfung mit Debug-Logs
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../Services/Auth-Service';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  try {
    // KORRIGIERT: Detaillierte Auth-Prüfung
    const token = authService.getToken();
    const userData = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    
    // Debug-Logs für OAuth-Debug
    console.log('🔐 PROTECTED ROUTE CHECK:');
    console.log('  - Has Token:', !!token);
    console.log('  - Has User Data:', !!userData);
    console.log('  - Is Authenticated:', isAuthenticated);
    
    if (token) {
      console.log('  - Token Preview:', token.substring(0, 20) + '...');
    }
    
    if (userData) {
      console.log('  - User Email:', userData.email);
      console.log('  - User Name:', userData.name);
    }
    
    // Falls nicht authentifiziert
    if (!isAuthenticated || !token || !userData) {
      console.warn('❌ PROTECTED ROUTE: Access denied - redirecting to home');
      return <Navigate to="/" replace />;
    }
    
    // Falls authentifiziert
    console.log('✅ PROTECTED ROUTE: Access granted');
    return <>{children}</>;
    
  } catch (error) {
    console.error('❌ PROTECTED ROUTE ERROR:', error);
    
    // Bei Fehlern: Cleanup und Redirect
    authService.logout();
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;