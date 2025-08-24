// src/Router/Router.tsx
// STABILISIERT: React 18 + Router 6 Kompatibilität
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';

// Layout Import
import StandardLayout from '../Components/Layouts/AppLayout-Standard/StandardLayout';
import ProtectedRoute from './ProtectedRoute';

// OPTIMIERT: Lazy Loading mit Error Boundaries
const LandingPage = lazy(() => 
  import('../Pages/LandingPage/LandingPage-Index').catch((err) => {
    console.error('Fehler beim Laden der Startseite:', err);
    return {
      default: () => (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column'
        }}>
          <h2>Fehler beim Laden der Startseite</h2>
          <button onClick={() => window.location.reload()}>
            Seite neu laden
          </button>
        </div>
      )
    };
  })
);

const KontaktPage = lazy(() => 
  import('../Pages/Kontakt/Kontakt-Index').catch((err) => {
    console.error('Fehler beim Laden der Kontakt-Seite:', err);
    return {
      default: () => (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column'
        }}>
          <h2>Fehler beim Laden der Kontakt-Seite</h2>
          <button onClick={() => window.location.reload()}>
            Seite neu laden
          </button>
        </div>
      )
    };
  })
);

const Dashboard = lazy(() => 
  import('../Pages/Dashboard/Dashboard-Index').catch((err) => {
    console.error('Fehler beim Laden des Dashboards:', err);
    return {
      default: () => (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          flexDirection: 'column'
        }}>
          <h2>Fehler beim Laden des Dashboards</h2>
          <button onClick={() => window.location.reload()}>
            Seite neu laden
          </button>
        </div>
      )
    };
  })
);

const OAuthSuccess = lazy(() => 
  import('../Pages/OAuth/OAuthSuccess').catch(() => ({
    default: () => <div>OAuth Success - Fehler beim Laden</div>
  }))
);

const OAuthError = lazy(() => 
  import('../Pages/OAuth/OAuthError').catch(() => ({
    default: () => <div>OAuth Error - Fehler beim Laden</div>
  }))
);

// OPTIMIERT: Loading Component mit besserer Performance
const PageLoader = () => (
  <div 
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minBlockSize: '100vh',
      backgroundColor: 'var(--color-background, #000000ff)'
    }}
  >
    <div style={{ animation: 'spin 1s linear infinite' }}>
      <svg 
        width="55" 
        height="55" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </div>
);

// OPTIMIERT: Suspense Wrapper mit expliziter Typisierung
const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

// BEREINIGT: Route Konfiguration
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
      {
        path: 'kontakt',
        element: (
          <SuspenseWrapper>
            <KontaktPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  
  // Dashboard-Route (Protected)
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
  
  // OAuth-Callback-Routes
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
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minBlockSize: '100vh',
          textAlign: 'center'
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          404
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
          Seite nicht gefunden
        </p>
        <a 
          href="/" 
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--color-primary, #007bff)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600'
          }}
        >
          Zurück zur Startseite
        </a>
      </div>
    ),
  },
];

// Router erstellen
const router = createBrowserRouter(routes);
export default router;