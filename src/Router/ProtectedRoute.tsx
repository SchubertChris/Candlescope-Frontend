// src/Router/ProtectedRoute.tsx
// BEREINIGT: Import-Konflikte behoben
import { type ReactNode } from 'react'; // KORRIGIERT: Nur ReactNode importiert, React kommt über JSX Transform
import { Navigate } from 'react-router-dom';
import authService from '../Services/Auth-Service';

// Props-Interface für ProtectedRoute
interface ProtectedRouteProps {
  children: ReactNode;
}

// OPTIMIERT: ProtectedRoute mit verbesserter Fehlerbehandlung
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  try {
    // Auth-Status prüfen
    const isAuthenticated = authService.isAuthenticated();
    
    // Falls nicht eingeloggt, zur Startseite weiterleiten
    if (!isAuthenticated) {
      console.warn('Zugriff auf geschützte Route ohne Authentifizierung verhindert');
      return <Navigate to="/" replace />;
    }
    
    // Falls eingeloggt, Kinder-Komponenten rendern
    return <>{children}</>;
    
  } catch (error) {
    // HINZUGEFÜGT: Fehlerbehandlung für Auth-Service-Probleme
    console.error('Fehler beim Prüfen der Authentifizierung:', error);
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;