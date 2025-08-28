// src/Components/Layouts/AppLayout-Standard/Navbar.tsx
// ERWEITERT: Login-Status-Anzeige + Dashboard-Navigation + Button-Position
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
  HiClock,
  HiViewGrid, // HINZUGEFÜGT: Dashboard Icon
  HiLogout,   // HINZUGEFÜGT: Logout Icon
  HiUserCircle // HINZUGEFÜGT: Profile Icon
} from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate, useLocation } from 'react-router-dom';
import './Style/Navbar.scss';
import Logo from '@/assets/Images/Logo/CandleScopeLogo.png';
import authService, { initiateOAuth } from '@/Services/Auth-Service';

interface NavbarProps {
  className?: string;
  onNavigate?: (section: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isRoute?: boolean;
  requiresAuth?: boolean; // HINZUGEFÜGT: Auth-Requirement
  authOnly?: boolean;     // HINZUGEFÜGT: Nur für eingeloggte User
  showWhenLoggedIn?: boolean; // HINZUGEFÜGT: Anzeige-Logic
}

// HINZUGEFÜGT: User-Status Interface
interface UserStatus {
  isLoggedIn: boolean;
  userData: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  } | null;
}

const Navbar: React.FC<NavbarProps> = ({ className = '', onNavigate }) => {
  // Bestehende States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'info' | 'error'>('info');

  // Bestehende Login States
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [loadingStep, setLoadingStep] = useState('');
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [oauthProvider, setOAuthProvider] = useState<'google' | 'github' | null>(null);

  // HINZUGEFÜGT: User Status State
  const [userStatus, setUserStatus] = useState<UserStatus>({
    isLoggedIn: false,
    userData: null
  });

  const navigate = useNavigate();
  const location = useLocation();

  // ERWEITERT: Navigation Items mit Auth-Logic und Dashboard
  const navigationItems: NavigationItem[] = useMemo(() => {
    const baseItems: NavigationItem[] = [
      { id: 'home', label: 'Übersicht', href: '/', icon: HiHome, isRoute: false },
      { id: 'about', label: 'Informationen', href: '#about', icon: HiUser, isRoute: false },
      { id: 'work', label: 'Candlescope', href: '#work', icon: HiBriefcase, isRoute: false },
      { id: 'contact', label: 'Kontakt', href: '/kontakt', icon: HiMail, isRoute: true },
    ];

    // HINZUGEFÜGT: Dashboard-Item nur für eingeloggte User
    if (userStatus.isLoggedIn) {
      baseItems.push({
        id: 'dashboard',
        label: 'zum Dashboard',
        href: '/dashboard',
        icon: HiViewGrid,
        isRoute: true,
        authOnly: true,
        showWhenLoggedIn: true
      });
    }

    return baseItems;
  }, [userStatus.isLoggedIn]);

  // HINZUGEFÜGT: User Status überwachen
  useEffect(() => {
    const checkUserStatus = () => {
      const isAuthenticated = authService.isAuthenticated();
      const userData = authService.getCurrentUser();
      
      console.log('🔍 NAVBAR: Checking user status:', {
        isAuthenticated,
        userData: userData?.email
      });

      setUserStatus({
        isLoggedIn: isAuthenticated,
        userData: userData
      });
    };

    // Initial check
    checkUserStatus();

    // Listen for auth changes (storage events)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'userData') {
        console.log('🔄 NAVBAR: Auth data changed, rechecking status');
        checkUserStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Bestehende Effects bleiben unverändert
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // KORRIGIERT: Navigation Handler bleibt unverändert
  const handleNavigation = useCallback((section: string) => {
    const navItem = navigationItems.find(item => item.id === section);

    if (!navItem) {
      console.warn(`❌ Navigation item not found: ${section}`);
      return;
    }

    console.log(`🧭 NAVIGATION: ${section} (${navItem.isRoute ? 'ROUTE' : 'SCROLL'})`);

    setActiveSection(section);
    setIsMobileMenuOpen(false);

    if (navItem.isRoute) {
      console.log(`🔗 ROUTER NAVIGATION: ${navItem.href}`);
      navigate(navItem.href);
    } else {
      console.log(`🎯 SCROLL NAVIGATION: ${section} on ${location.pathname}`);

      if (location.pathname !== '/') {
        console.log(`📍 NOT ON LANDING PAGE - Navigate to / + scroll to ${section}`);
        navigate('/', { state: { scrollTo: section } });
      } else {
        console.log(`📍 ON LANDING PAGE - Direct scroll to ${section}`);
        scrollToSection(section);
      }
    }

    if (onNavigate) {
      onNavigate(section);
    }
  }, [navigationItems, navigate, location.pathname, onNavigate]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;

      console.log(`⬇️ SCROLLING TO: ${sectionId} (Position: ${elementPosition - offset})`);

      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    } else {
      console.warn(`❌ Element #${sectionId} not found for scrolling`);
    }
  }, []);

  // HINZUGEFÜGT: Logout Handler
  const handleLogout = useCallback(async () => {
    console.log('🚪 NAVBAR: Logging out user');
    setIsLoggingIn(true);
    setLoadingStep('Wird abgemeldet...');
    
    try {
      // Auth Service logout (ohne redirect)
      authService.logout();
      
      // User Status zurücksetzen
      setUserStatus({
        isLoggedIn: false,
        userData: null
      });
      
      // Mobile Menu schließen
      setIsMobileMenuOpen(false);
      
      // Zur Startseite navigieren
      navigate('/');
      
      // Feedback anzeigen
      setFeedbackType('success');
      setFeedbackMessage('Du wurdest erfolgreich abgemeldet.');
      
    } catch (error: any) {
      console.error('❌ LOGOUT ERROR:', error);
      setFeedbackType('error');
      setFeedbackMessage('Fehler beim Abmelden. Bitte versuche es erneut.');
    } finally {
      setTimeout(() => {
        setIsLoggingIn(false);
        setLoadingStep('');
      }, 500);
    }
  }, [navigate]);

  // Body scroll lock für Mobile bleibt unverändert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobileMenuOpen]);

  // Feedback Message Auto-Clear bleibt unverändert
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage('');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // ALLE BISHERIGEN LOGIN-HANDLER BLEIBEN UNVERÄNDERT
  const resetLoadingStates = () => {
    setIsLoggingIn(false);
    setIsCheckingUser(false);
    setIsCreatingAccount(false);
    setIsSendingEmail(false);
    setIsOAuthLoading(false);
    setOAuthProvider(null);
    setLoadingStep('');
  };

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

      if (result.requiresConfirmation) {
        setShowConfirmation(true);
        setPendingEmail(result.email ?? loginForm.email);
        setLoadingStep('');
        resetLoadingStates();
        return;
      }

      if (result.accountCreated && result.emailSent) {
        setFeedbackType('info');
        setFeedbackMessage(`📧 Neuer Account wurde für ${loginForm.email} erstellt! Bitte prüfe deine Emails für die Login-Daten.`);
        setLoginForm({ email: '', password: '' });
      } else if (result.accountCreated && !result.emailSent) {
        setFeedbackType('error');
        setFeedbackMessage(`⚠️ Account wurde erstellt, aber Email-Versand fehlgeschlagen. Bitte kontaktiere den Support.`);
      } else {
        // HINZUGEFÜGT: User Status nach erfolgreichem Login aktualisieren
        const userData = authService.getCurrentUser();
        setUserStatus({
          isLoggedIn: true,
          userData: userData
        });
        
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

  const handleConfirmAccountCreation = async () => {
    setIsLoggingIn(true);
    setIsCreatingAccount(true);
    setLoadingStep('Erstelle Account...');
    setShowConfirmation(false);

    try {
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

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setPendingEmail('');
    setLoginForm({ email: '', password: '' });
    resetLoadingStates();
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    setIsOAuthLoading(true);
    setOAuthProvider(provider);
    setLoadingStep(`Weiterleitung zu ${provider === 'google' ? 'Google' : 'GitHub'}...`);

    try {
      initiateOAuth(provider);
      authService.setOAuthProvider(provider);
    } catch (error: any) {
      console.error(`❌ ${provider.toUpperCase()} OAUTH ERROR:`, error);
      setFeedbackType('error');
      setFeedbackMessage(`Fehler bei ${provider === 'google' ? 'Google' : 'GitHub'}-Anmeldung: ${error.message}`);
      resetLoadingStates();
    }
  };

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

  // HINZUGEFÜGT: Login Status Anzeige Component
  const renderLoginStatus = () => {
    if (!userStatus.isLoggedIn) return null;

    const { userData } = userStatus;
    const displayName = userData?.name || userData?.email?.split('@')[0] || 'User';

    return (
      <div className="navbar-mobile__user-status">
        <div className="navbar-mobile__user-info">
          <div className="navbar-mobile__user-avatar">
            {userData?.avatar ? (
              <img src={userData.avatar} alt={displayName} />
            ) : (
              <HiUserCircle />
            )}
          </div>
          <div className="navbar-mobile__user-details">
            <div className="navbar-mobile__user-name">{displayName}</div>
            <div className="navbar-mobile__user-email">{userData?.email}</div>
          </div>
        </div>
        <button
          className="navbar-mobile__logout-btn"
          onClick={handleLogout}
          disabled={isLoggingIn}
          title="Abmelden"
        >
          <HiLogout />
          <span>Abmelden</span>
        </button>
      </div>
    );
  };

  return (
    <>
      {/* KORRIGIERT: Mobile Toggle Button - unten rechts */}
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
            <a href="/" onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); navigate('/'); }}>
              <img src={Logo} alt="CandleScope" className="navbar-mobile__logo" />
              <div className="navbar-mobile__logo-glow" />
            </a>
          </div>

          {/* ERWEITERT: Login Status oder Login Form */}
          {userStatus.isLoggedIn ? (
            // User ist eingeloggt - Status anzeigen
            renderLoginStatus()
          ) : (
            // User ist nicht eingeloggt - Login Form anzeigen
            <div className="navbar-mobile__login">
              {/* Alle bisherigen Login-Components bleiben unverändert */}
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

              {showConfirmation && !isLoggingIn && !isOAuthLoading && (
                <div className="navbar-mobile__confirmation">
                  <div className="navbar-mobile__confirmation-header">
                    <HiQuestionMarkCircle />
                    <h3>Account erstellen?</h3>
                  </div>
                  <div className="navbar-mobile__confirmation-content">
                    <p>Die Email-Adresse <strong>{pendingEmail}</strong> ist noch nicht registriert.</p>
                    <p>Möchtest du automatisch einen Account erstellen? Du erhältst die Login-Daten per Email.</p>
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

              {loginError && !showConfirmation && !isLoggingIn && !isOAuthLoading && (
                <div className="navbar-mobile__error">
                  {loginError}
                </div>
              )}

              {!showConfirmation && !feedbackMessage && !isLoggingIn && !isOAuthLoading && (
                <div className="navbar-mobile__info">
                  <HiExclamationCircle />
                  <span>Einfach mit Email + Passwort einloggen. Falls noch kein Account existiert, wird automatisch einer erstellt!</span>
                </div>
              )}

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
                        className={`navbar-mobile__input ${loginForm.email ? 'has-value' : ''}`}
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
                        className={`navbar-mobile__input ${loginForm.password ? 'has-value' : ''}`}
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
                    <span>oder weiter mit</span>
                  </div>

                  <div className="navbar-mobile__social">
                    {renderOAuthButton('google')}
                    {renderOAuthButton('github')}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation Links - ERWEITERT mit Dashboard */}
          <ul className="navbar-mobile__links">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li key={item.id} style={{ animationDelay: `${index * 0.1 + 0.3}s` }}>
                  <a
                    href={item.href}
                    className={`navbar-mobile__link ${isActive ? 'active' : ''} ${item.authOnly ? 'auth-only' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.id);
                    }}
                  >
                    <IconComponent className="navbar-icon" />
                    <span>{item.label}</span>
                    {isActive && <span className="navbar-mobile__active-dot" />}
                    {/* HINZUGEFÜGT: Dashboard Badge für neuen Bereich */}
                    {item.id === 'dashboard' && (
                      <span className="navbar-mobile__new-badge">NEU</span>
                    )}
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