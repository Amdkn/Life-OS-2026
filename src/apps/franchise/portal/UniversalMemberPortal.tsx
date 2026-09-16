import React from 'react';
import { UserProfile } from '../../../types/profile';
import { getThemeForFranchise } from './themes';
import { ParentPortal } from './components/ParentPortal';
import { AdherentPortal } from './components/AdherentPortal';
import { ClientPortal } from './components/ClientPortal';

export interface UniversalMemberPortalProps {
  franchise: any;
  profile: UserProfile;
}

export const UniversalMemberPortal: React.FC<UniversalMemberPortalProps> = ({ franchise, profile }) => {
  const theme = getThemeForFranchise(franchise.id);

  const renderProfileContent = () => {
    switch (franchise.id) {
      case 'abc_childcare':
        return <ParentPortal profile={profile} />;
      case 'rilcot':
        return <AdherentPortal profile={profile} />;
      case 'marina_cleaning':
        return <ClientPortal profile={profile} />;
      case 'alikaly_holding':
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Portail - {profile.displayName}</h2>
            <div className="empty-state text-gray-500 italic">
              Bienvenue sur votre espace.
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="universal-member-portal min-h-screen flex flex-col"
      style={{
        fontFamily: theme.fontFamily,
        backgroundColor: '#F3F4F6' // Light gray background
      }}
      data-testid={`portal-${franchise.id}`}
    >
      <header
        className="portal-header p-4 shadow flex items-center justify-between"
        style={{ backgroundColor: theme.primaryColor, color: '#fff' }}
      >
        <div className="flex items-center space-x-4">
          <img
            src={theme.logoUrl}
            alt={`Logo ${franchise.id}`}
            className="h-10 w-10 object-contain bg-white rounded-full p-1"
            onError={(e) => {
              // Fallback if logo fails to load (e.g. testing environments without static assets)
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ccc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12">Logo</text></svg>';
            }}
          />
          <h1 className="text-xl font-bold">Portail Membre</h1>
        </div>
        <div className="flex items-center space-x-4">
           {/* Can display some quick actions or secondary color accents here */}
           <span className="text-sm">Connecté en tant que {profile.displayName}</span>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div
          className="content-wrapper rounded-lg shadow-md bg-white border-t-4"
          style={{ borderTopColor: theme.secondaryColor }}
        >
          {renderProfileContent()}
        </div>
      </main>
    </div>
  );
};