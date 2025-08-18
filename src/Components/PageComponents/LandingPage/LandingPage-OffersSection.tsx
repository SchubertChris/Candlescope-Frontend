import React from 'react';
import './Style/LandingPage-OffersSection.scss';

const OffersSection: React.FC = () => {
  return (
    <div className="offers-section">
      <div className="offers-container">
        {/* Inhalt für Angebot 1 */}
      </div>
      <div className="offers-container mirrored">
        {/* Inhalt für Angebot 2 */}
      </div>
      <div className="offers-container">
        {/* Inhalt für Angebot 3 */}
      </div>
    </div>
  );
};

export default OffersSection;