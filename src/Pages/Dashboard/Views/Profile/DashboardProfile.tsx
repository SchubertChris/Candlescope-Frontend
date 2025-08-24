// src/Pages/Dashboard/Components/DashboardProfile.tsx
// KORRIGIERT: Role-System angepasst
import React from 'react';
import { 
  HiUser,
  HiMail,
  HiShieldCheck,
  HiBell,
  HiCog,
  HiLogout,
  HiChevronRight,
  HiUserCircle
} from 'react-icons/hi';
import { DashboardProfileProps } from '../../Types/DashboardTypes';

const DashboardProfile: React.FC<DashboardProfileProps> = ({
  user,
  onLogout,
  onUserUpdate
}) => {
  const handleMenuItemClick = (action: string) => {
    switch (action) {
      case 'edit-profile':
        console.log('Edit profile');
        // Hier später Modal für Profil-Bearbeitung
        break;
      case 'email-settings':
        console.log('Email settings');
        break;
      case 'security':
        console.log('Security settings');
        break;
      case 'notifications':
        console.log('Notification settings');
        break;
      case 'push-notifications':
        console.log('Push notification settings');
        break;
      case 'logout':
        onLogout();
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'edit-profile',
          icon: HiUser,
          label: 'Profil bearbeiten'
        },
        {
          id: 'email-settings',
          icon: HiMail,
          label: 'E-Mail Einstellungen'
        },
        {
          id: 'security',
          icon: HiShieldCheck,
          label: 'Sicherheit'
        }
      ]
    },
    {
      title: 'Benachrichtigungen',
      items: [
        {
          id: 'notifications',
          icon: HiBell,
          label: 'Push-Benachrichtigungen'
        },
        {
          id: 'push-notifications',
          icon: HiMail,
          label: 'E-Mail Benachrichtigungen'
        }
      ]
    }
  ];

  return (
    <div className="view-content">
      <section className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <HiUserCircle className="icon icon--profile-avatar" />
          </div>
          <h2>{user.firstName || 'Benutzer'}</h2>
          <p>{user.email}</p>
          <span className="role-badge">
            {/* KORRIGIERT: 'mitarbeiter' → 'admin' entfernt */}
            {user.role === 'kunde' ? 'Kunde' : 'Administrator'}
          </span>
        </div>
        
        <div className="profile-menu">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="menu-section">
              <h3>{section.title}</h3>
              <div className="menu-items">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  
                  return (
                    <button
                      key={item.id}
                      className="menu-item"
                      onClick={() => handleMenuItemClick(item.id)}
                    >
                      <IconComponent className="icon icon--menu" />
                      <span>{item.label}</span>
                      <HiChevronRight className="icon icon--chevron" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Logout Section */}
          <div className="menu-section">
            <div className="menu-items">
              <button
                className="menu-item logout"
                onClick={() => handleMenuItemClick('logout')}
              >
                <HiLogout className="icon icon--menu" />
                <span>Abmelden</span>
                <HiChevronRight className="icon icon--chevron" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardProfile;