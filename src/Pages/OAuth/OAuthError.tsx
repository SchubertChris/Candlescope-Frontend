// src/Pages/OAuth/OAuthError.tsx
// ERSTELLT: OAuth Error Callback-Handler
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiExclamationCircle, HiRefresh, HiHome } from 'react-icons/hi';
import authService from '@/Services/Auth-Service';
import './Style/OAuthCallback.scss';

const OAuthError: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('Ein unbekannter Fehler ist aufgetreten.');

  useEffect(() => {
    const error = searchParams.get('error');
    
    if (error) {
      try {
        authService.handleOAuthError(error);
      } catch (errorObj: any) {
        setErrorMessage(errorObj.message);
      }
    }
  }, [searchParams]);

  const handleRetry = () => {
    navigate('/', { replace: true });
  };

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="oauth-callback">
      <div className="oauth-callback__container">
        <div className="oauth-callback__content">
          <div className="oauth-callback__icon oauth-callback__icon--error">
            <HiExclamationCircle />
          </div>
          
          <h1 className="oauth-callback__title">Anmeldung fehlgeschlagen</h1>
          
          <p className="oauth-callback__message">{errorMessage}</p>
          
          <div className="oauth-callback__error-details">
            <p className="oauth-callback__sub-message">
              Mögliche Ursachen:
            </p>
            <ul className="oauth-callback__error-list">
              <li>Du hast die Berechtigung verweigert</li>
              <li>Netzwerkverbindung unterbrochen</li>
              <li>Temporärer Server-Fehler</li>
            </ul>
          </div>

          <div className="oauth-callback__actions">
            <button 
              onClick={handleRetry}
              className="oauth-callback__button oauth-callback__button--primary"
            >
              <HiRefresh />
              <span>Erneut versuchen</span>
            </button>
            
            <button 
              onClick={handleGoHome}
              className="oauth-callback__button oauth-callback__button--secondary"
            >
              <HiHome />
              <span>Zur Startseite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthError;