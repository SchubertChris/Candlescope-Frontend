// src/Pages/OAuth/OAuthSuccess.tsx
// KORRIGIERT: Direkter Dashboard-Redirect nach OAuth
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiCheckCircle, HiArrowRight, HiRefresh } from 'react-icons/hi';
import authService from '@/Services/Auth-Service';
import './Style/OAuthCallback.scss';

const OAuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verarbeite OAuth-Authentifizierung...');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const token = searchParams.get('token');
        const userDataString = searchParams.get('user');

        console.log('🔄 OAUTH SUCCESS HANDLER START');
        console.log('  - Token received:', !!token);
        console.log('  - User data received:', !!userDataString);

        if (!token || !userDataString) {
          throw new Error('Fehlende OAuth-Parameter');
        }

        // OAuth-Callback verarbeiten
        const result = await authService.handleOAuthCallback(token, userDataString);
        
        console.log('✅ OAUTH SUCCESS: Auth data processed');
        console.log('  - User Email:', result.user.email);
        console.log('  - Token stored in localStorage');
        
        setStatus('success');
        setMessage('OAuth-Authentifizierung erfolgreich!');
        setUserEmail(result.user.email || 'User');

        // KORRIGIERT: Sofort zum Dashboard weiterleiten (ohne 2s Delay)
        console.log('🚀 OAUTH SUCCESS: Redirecting to dashboard immediately');
        
        // Kurze Verzögerung nur für UX (User sieht "Success")
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1600);

      } catch (error: any) {
        console.error('❌ OAUTH SUCCESS HANDLER ERROR:', error);
        setStatus('error');
        setMessage(error.message || 'OAuth-Authentifizierung fehlgeschlagen');
        
        // Bei Fehler nach 3s zur Home-Seite
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleOAuthSuccess();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/', { replace: true });
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="oauth-callback">
      <div className="oauth-callback__container">
        <div className="oauth-callback__content">
          
          {/* Loading State */}
          {status === 'loading' && (
            <>
              <div className="oauth-callback__icon oauth-callback__icon--loading">
                <HiRefresh className="oauth-callback__spinner" />
              </div>
              <h1 className="oauth-callback__title">Verarbeite Anmeldung...</h1>
              <p className="oauth-callback__message">{message}</p>
              <div className="oauth-callback__progress">
                <div className="oauth-callback__progress-bar"></div>
              </div>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="oauth-callback__icon oauth-callback__icon--success">
                <HiCheckCircle />
              </div>
              <h1 className="oauth-callback__title">Anmeldung erfolgreich!</h1>
              <p className="oauth-callback__message">
                Willkommen zurück, <strong>{userEmail}</strong>!
              </p>
              <p className="oauth-callback__sub-message">
                Du wirst zum Dashboard weitergeleitet...
              </p>
              <button 
                onClick={handleGoToDashboard}
                className="oauth-callback__button oauth-callback__button--primary"
              >
                <span>Zum Dashboard</span>
                <HiArrowRight />
              </button>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="oauth-callback__icon oauth-callback__icon--error">
                <HiCheckCircle />
              </div>
              <h1 className="oauth-callback__title">Anmeldung fehlgeschlagen</h1>
              <p className="oauth-callback__message">{message}</p>
              <div className="oauth-callback__actions">
                <button 
                  onClick={handleRetry}
                  className="oauth-callback__button oauth-callback__button--primary"
                >
                  <HiRefresh />
                  <span>Erneut versuchen</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;