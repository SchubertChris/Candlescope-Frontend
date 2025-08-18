import React from 'react';
import '@components/Layouts/AppLayout-Standard/Style/Footer.scss';

// React Icons imports
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp
} from 'react-icons/fa';

interface SocialLink {
  id: string;
  icon: React.ReactNode;
  url: string;
  label: string;
}


const Footer: React.FC = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Social Links Data
  const socialLinks: SocialLink[] = [
    {
      id: 'github',
      icon: <FaGithub />,
      url: 'https://github.com/schubert-chris',
      label: 'GitHub'
    },
    {
      id: 'linkedin',
      icon: <FaLinkedin />,
      url: 'https://linkedin.com/in/chris-schubert',
      label: 'LinkedIn'
    },
    {
      id: 'instagram',
      icon: <FaInstagram />,
      url: 'https://instagram.com',
      label: 'Instagram'
    },
    {
      id: 'email',
      icon: <FaEnvelope />,
      url: 'mailto:schubert_chris@rocketmail.com',
      label: 'Email'
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="business-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section footer-section--about">
            <h3 className="footer-section__title">Chris Schubert</h3>
            <p className="footer-section__description">
              Full-Stack Developer mit Fokus auf moderne Web-Technologien. 
              Spezialisiert auf React, TypeScript und Node.js.
            </p>
            <div className="footer-section__contact">
              <a href="mailto:schubert_chris@rocketmail.com" className="contact-item">
                <FaEnvelope />
                <span>schubert_chris@rocketmail.com</span>
              </a>
              <a href="tel:+491609416348" className="contact-item">
                <FaPhone />
                <span>+49 160 941 683 48</span>
              </a>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>Potsdam, Deutschland</span>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section footer-section--links">
            <h3 className="footer-section__title">Quick Links</h3>
            <nav className="footer-nav">
              <a href="#about" className="footer-nav__link">Das bin ich</a>
              <a href="#projects" className="footer-nav__link">Library</a>
              <a href="#contact" className="footer-nav__link">Kontaktanfrage</a>
              <a href="/impressum" className="footer-nav__link">Impressum</a>
              <a href="/datenschutz" className="footer-nav__link">Datenschutz</a>
            </nav>
          </div>

          {/* Social Section */}
          <div className="footer-section footer-section--social">
            <h3 className="footer-section__title">Connect</h3>
            <div className="social-links">
              {socialLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={link.label}
                  title={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            <div className="footer-cta">
              <p className="cta-text">Bereit für Ihr nächstes Projekt?</p>
              <a href="#contact" className="cta-button">
                Kontakt aufnehmen
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom__content">
            <p className="copyright">
              © {currentYear} Chris Schubert. Alle Rechte vorbehalten.
            </p>
            <p className="footer-note">
              Entwickelt mit React & TypeScript | Gehostet auf Vercel
            </p>
          </div>
          <button 
            className="scroll-to-top"
            onClick={scrollToTop}
            aria-label="Nach oben scrollen"
          >
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;