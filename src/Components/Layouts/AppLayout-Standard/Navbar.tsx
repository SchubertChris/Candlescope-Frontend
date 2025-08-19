import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  HiHome,
  HiUser,
  HiBriefcase,
  HiMail,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiCheckCircle,
  HiExclamationCircle,
  HiQuestionMarkCircle,
  HiClock // HINZUGEFÜGT: Für Loading-Status
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import authService from '@/Services/Auth-Service';
import './Style/Navbar.scss';
import Logo from '@/assets/Images/Logo/CandleScopeLogo.png';

interface NavbarProps {
  className?: string;
  onNavigate?: (section: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Navbar: React.FC<NavbarProps> = ({ className = '', onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'info' | 'error'>('info');

  // Bestätigungs-States
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // HINZUGEFÜGT: Erweiterte Loading-States
  const [loadingStep, setLoadingStep] = useState('');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // HINZUGEFÜGT: OAuth-Loading-States
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [oauthProvider, setOAuthProvider] = useState<'google' | 'github' | null>(null);

  const navigate = useNavigate();

  const navigationItems: NavigationItem[] = useMemo(() => [
    { id: 'home', label: 'Übersicht', href: '#home', icon: HiHome },
    { id: 'about', label: 'Informationen', href: '#about', icon: HiUser },
    { id: 'work', label: 'Candlescope', href: '#work', icon: HiBriefcase },
    { id: 'contact', label: 'Kontakt', href: '/kontakt', icon: HiMail },
  ], []);

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation Handler
  const handleNavigation = useCallback((section: string) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(section);
    }
    const element = document.querySelector(`#${section}`);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  }, [onNavigate]);

  // Body scroll lock für Mobile
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobileMenuOpen]);

  // Feedback Message Auto-Clear
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage('');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // ERWEITERT: Loading-States zurücksetzen
  const resetLoadingStates = () => {
    setIsLoggingIn(false);
    setIsCheckingUser(false);
    setIsCreatingAccount(false);
    setIsSendingEmail(false);
    setIsOAuthLoading(false); // HINZUGEFÜGT: OAuth-Loading zurücksetzen
    setOAuthProvider(null); // HINZUGEFÜGT: OAuth-Provider zurücksetzen
    setLoadingStep('');
  };

  // ERWEITERT: Login-Handler mit detaillierten Loading-States
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setIsCheckingUser(true);
    setLoadingStep('Prüfe Benutzer...');
    setLoginError('');
    setFeedbackMessage('');

    try {
      const result = await authService.login({
        ...loginForm,
        confirmAccountCreation: false
      });

      setIsCheckingUser(false);

      // Check auf Bestätigungs-Anfrage
      if (result.requiresConfirmation) {
        setShowConfirmation(true);
        // KORRIGIERT: Nullish coalescing operator für undefined-Schutz
        setPendingEmail(result.email ?? loginForm.email);
        setLoadingStep('');
        resetLoadingStates();
        return;
      }

      // Account wurde erstellt
      if (result.accountCreated && result.emailSent) {
        setFeedbackType('info');
        setFeedbackMessage(`📧 Neuer Account wurde für ${loginForm.email} erstellt! Bitte prüfen Sie Ihre Emails für die Login-Daten.`);
        setLoginForm({ email: '', password: '' });

      } else if (result.accountCreated && !result.emailSent) {
        setFeedbackType('error');
        setFeedbackMessage(`⚠️ Account wurde erstellt, aber Email-Versand fehlgeschlagen. Bitte kontaktieren Sie den Support.`);

      } else {
        // Normaler Login erfolgreich
        setLoadingStep('Weiterleitung...');
        setTimeout(() => {
          setIsMobileMenuOpen(false);
          navigate('/dashboard');
        }, 500);
      }

    } catch (error: any) {
      setLoginError(error.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setTimeout(() => resetLoadingStates(), 500);
    }
  };

  // ERWEITERT: Account-Erstellung mit detailliertem Loading
  const handleConfirmAccountCreation = async () => {
    setIsLoggingIn(true);
    setIsCreatingAccount(true);
    setLoadingStep('Erstelle Account...');
    setShowConfirmation(false);

    try {
      // HINZUGEFÜGT: Simuliere Loading-Schritte für bessere UX
      await new Promise(resolve => setTimeout(resolve, 800));

      setLoadingStep('Generiere Passwort...');
      setIsSendingEmail(true);
      setIsCreatingAccount(false);

      await new Promise(resolve => setTimeout(resolve, 500));
      setLoadingStep('Sende Email...');

      const result = await authService.login({
        email: pendingEmail,
        password: loginForm.password,
        confirmAccountCreation: true
      });

      setIsSendingEmail(false);

      if (result.accountCreated && result.emailSent) {
        setLoadingStep('Email versendet!');
        setFeedbackType('success');
        setFeedbackMessage(`🎉 Account wurde für ${pendingEmail} erstellt! Login-Daten wurden per Email versendet.`);
        setLoginForm({ email: '', password: '' });
        setPendingEmail('');

      } else if (result.accountCreated && !result.emailSent) {
        setFeedbackType('error');
        setFeedbackMessage(`⚠️ Account wurde erstellt, aber Email-Versand fehlgeschlagen.`);
      }

    } catch (error: any) {
      setLoginError(error.message || 'Fehler bei der Account-Erstellung');
      setShowConfirmation(false);
      setPendingEmail('');
    } finally {
      setTimeout(() => resetLoadingStates(), 1000);
    }
  };

  // Bestätigung abbrechen
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setPendingEmail('');
    setLoginForm({ email: '', password: '' });
    resetLoadingStates();
  };

  // HINZUGEFÜGT: OAuth-Handler für Google und GitHub
  const handleOAuthLogin = (provider: 'google' | 'github') => {
    setIsOAuthLoading(true);
    setOAuthProvider(provider);
    setLoadingStep(`Weiterleitung zu ${provider === 'google' ? 'Google' : 'GitHub'}...`);

    try {
      // OAuth-Flow initiieren
      authService.initiateOAuth(provider);
      authService.setOAuthProvider(provider);
    } catch (error: any) {
      console.error(`❌ ${provider.toUpperCase()} OAUTH ERROR:`, error);
      setFeedbackType('error');
      setFeedbackMessage(`Fehler bei ${provider === 'google' ? 'Google' : 'GitHub'}-Anmeldung: ${error.message}`);
      resetLoadingStates();
    }
  };

  // HINZUGEFÜGT: OAuth-Button-Rendering-Funktion
  const renderOAuthButton = (provider: 'google' | 'github') => {
    const isCurrentlyLoading = isOAuthLoading && oauthProvider === provider;
    const Icon = provider === 'google' ? FcGoogle : FaGithub;
    const label = provider === 'google' ? 'Google' : 'GitHub';

    return (
      <button
        className={`navbar-mobile__social-btn navbar-mobile__social-btn--${provider} ${isCurrentlyLoading ? 'loading' : ''}`}
        onClick={() => handleOAuthLogin(provider)}
        disabled={isLoggingIn || isOAuthLoading}
      >
        {isCurrentlyLoading ? (
          <>
            <div className="navbar-mobile__oauth-spinner"></div>
            <span>Weiterleitung...</span>
          </>
        ) : (
          <>
            <Icon />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  };

  return (
    <>
      {/* MOBILE NAVBAR TOGGLE */}
      <button
        className={`navbar-mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <span className="hamburger">
          <span className="hamburger__line"></span>
          <span className="hamburger__line"></span>
          <span className="hamburger__line"></span>
        </span>
      </button>

      {/* Mobile Menu */}
      <div
        className={`navbar-mobile ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={(e) => e.target === e.currentTarget && setIsMobileMenuOpen(false)}
      >
        <div className="navbar-mobile__content">
          <div className="navbar-mobile__header">
            <img src={Logo} alt="CandleScope" className="navbar-mobile__logo" />
            <div className="navbar-mobile__logo-glow" />
          </div>

          <div className="navbar-mobile__login">
            {/* ERWEITERT: Loading-Status Anzeige für OAuth und Standard-Login */}
            {(isLoggingIn || isOAuthLoading) && loadingStep && (
              <div className="navbar-mobile__loading-status">
                <div className="navbar-mobile__loading-icon">
                  <HiClock />
                  <span className="navbar-mobile__loading-spinner"></span>
                </div>
                <div className="navbar-mobile__loading-text">
                  <p>{loadingStep}</p>
                  {isCheckingUser && <small>Überprüfe Login-Daten...</small>}
                  {isCreatingAccount && <small>Account wird erstellt...</small>}
                  {isSendingEmail && <small>Email wird versendet...</small>}
                  {isOAuthLoading && oauthProvider && (
                    <small>Verbinde mit {oauthProvider === 'google' ? 'Google' : 'GitHub'}...</small>
                  )}
                </div>
              </div>
            )}

            {/* Bestätigungs-Dialog */}
            {showConfirmation && !isLoggingIn && !isOAuthLoading && (
              <div className="navbar-mobile__confirmation">
                <div className="navbar-mobile__confirmation-header">
                  <HiQuestionMarkCircle />
                  <h3>Account erstellen?</h3>
                </div>
                <div className="navbar-mobile__confirmation-content">
                  <p>Die Email-Adresse <strong>{pendingEmail}</strong> ist noch nicht registriert.</p>
                  <p>Möchten Sie automatisch einen Account erstellen? Sie erhalten die Login-Daten per Email.</p>
                </div>
                <div className="navbar-mobile__confirmation-actions">
                  <button
                    onClick={handleConfirmAccountCreation}
                    className="navbar-mobile__confirm-btn"
                    disabled={isLoggingIn}
                  >
                    <HiCheckCircle />
                    Account erstellen
                  </button>
                  <button
                    onClick={handleCancelConfirmation}
                    className="navbar-mobile__cancel-btn"
                    disabled={isLoggingIn}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}

            {/* Feedback-Nachricht */}
            {feedbackMessage && !showConfirmation && !isLoggingIn && !isOAuthLoading && (
              <div className={`navbar-mobile__feedback navbar-mobile__feedback--${feedbackType}`}>
                <div className="navbar-mobile__feedback-icon">
                  {feedbackType === 'success' && <HiCheckCircle />}
                  {feedbackType === 'info' && <HiExclamationCircle />}
                  {feedbackType === 'error' && <HiExclamationCircle />}
                </div>
                <div className="navbar-mobile__feedback-text">
                  {feedbackMessage}
                </div>
              </div>
            )}

            {/* Error-Nachricht */}
            {loginError && !showConfirmation && !isLoggingIn && !isOAuthLoading && (
              <div className="navbar-mobile__error">
                {loginError}
              </div>
            )}

            {/* Info-Text für automatische Account-Erstellung */}
            {!showConfirmation && !feedbackMessage && !isLoggingIn && !isOAuthLoading && (
              <div className="navbar-mobile__info">
                <HiExclamationCircle />
                <span>Einfach mit Email + Passwort einloggen. Falls noch kein Account existiert, wird automatisch einer erstellt!</span>
              </div>
            )}

            {/* Login-Form (nur anzeigen wenn keine Bestätigung oder Loading läuft) */}
            {!showConfirmation && !isLoggingIn && !isOAuthLoading && (
              <>
                <form onSubmit={handleLogin} className="navbar-mobile__form">
                  <div className="navbar-mobile__input-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="navbar-mobile__input"
                      required
                    />
                    <div className="navbar-mobile__input-glow" />
                  </div>

                  <div className="navbar-mobile__input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Passwort"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="navbar-mobile__input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="navbar-mobile__password-toggle"
                    >
                      {showPassword ? <HiEyeOff /> : <HiEye />}
                    </button>
                    <div className="navbar-mobile__input-glow" />
                  </div>

                  <button
                    type="submit"
                    className="navbar-mobile__submit"
                    disabled={isLoggingIn || isOAuthLoading}
                  >
                    <HiLockClosed />
                    <span>Login</span>
                  </button>
                </form>

                <div className="navbar-mobile__divider">
                  <span>or continue with</span>
                </div>

                {/* ERWEITERT: OAuth-Buttons mit Loading-States */}
                <div className="navbar-mobile__social">
                  {renderOAuthButton('google')}
                  {renderOAuthButton('github')}
                </div>
              </>
            )}
          </div>

          <ul className="navbar-mobile__links">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li key={item.id} style={{ animationDelay: `${index * 0.1 + 0.3}s` }}>
                  <a
                    href={item.href}
                    className={`navbar-mobile__link ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();

                      if (item.id === 'contact') {
                        // ➜ Seite wechseln (Router Navigation)
                        navigate('/kontakt');
                      } else {
                        // ➜ In-Page scrollen
                        handleNavigation(item.id);
                      }
                    }}
                  >
                    <IconComponent className="navbar-icon" />
                    <span>{item.label}</span>
                    {isActive && <span className="navbar-mobile__active-dot" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;