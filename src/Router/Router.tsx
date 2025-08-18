// ===========================
// ROUTER CONFIGURATION
// ERWEITERT: Mit OAuth-Callback-Routes
// ===========================
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Layout Import
import StandardLayout from '../Components/Layouts/AppLayout-Standard/StandardLayout';
import ProtectedRoute from './ProtectedRoute'; // HINZUGEFÜGT: ProtectedRoute Import

// Lazy Loading für Seiten
const LandingPage = lazy(() => import('../Pages/LandingPage/LandingPage-Index'));
const Dashboard = lazy(() => import('../Pages/Dashboard/Dashboard-Index')); // HINZUGEFÜGT: Dashboard Import

// HINZUGEFÜGT: OAuth-Callback-Komponenten (Lazy Loading)
const OAuthSuccess = lazy(() => import('../Pages/OAuth/OAuthSuccess'));
const OAuthError = lazy(() => import('../Pages/OAuth/OAuthError'));

// Loading Component
const PageLoader = () => (
  <div className="flex-center" style={{ minHeight: '100vh' }}>
    <div className="animate-spin">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

// Route Wrapper mit Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

// Route Konfiguration
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <StandardLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <LandingPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // HINZUGEFÜGT: Dashboard-Route (Protected)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <Dashboard />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
  },
  // HINZUGEFÜGT: OAuth-Callback-Routes
  {
    path: '/oauth-success',
    element: (
      <SuspenseWrapper>
        <OAuthSuccess />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/oauth-error',
    element: (
      <SuspenseWrapper>
        <OAuthError />
      </SuspenseWrapper>
    ),
  },
  // 404 Route
  {
    path: '*',
    element: (
      <div className="flex-center flex-col" style={{ minHeight: '100vh' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>404</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Seite nicht gefunden</p>
        <a href="/" className="btn btn-primary">
          Zurück zur Startseite
        </a>
      </div>
    ),
  },
];

// Router erstellen
const router = createBrowserRouter(routes);
export default router;