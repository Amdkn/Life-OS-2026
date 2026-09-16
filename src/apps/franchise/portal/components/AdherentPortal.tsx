import React from 'react';
import { UserProfile } from '../../../../types/profile';

interface AdherentPortalProps {
  profile: UserProfile;
}

export const AdherentPortal: React.FC<AdherentPortalProps> = ({ profile }) => {
  return (
    <div className="adherent-portal-container p-6">
      <h2 className="text-2xl font-bold mb-4">Espace Adhérent - {profile.displayName}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4 border rounded shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Votes en cours</h3>
          <div className="empty-state text-gray-500 italic">
            Aucun vote ouvert pour le moment.
          </div>
        </div>

        <div className="card p-4 border rounded shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Documents partagés</h3>
          <div className="empty-state text-gray-500 italic">
            Aucun document partagé.
          </div>
        </div>

        <div className="card p-4 border rounded shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Agenda Communauté</h3>
          <div className="empty-state text-gray-500 italic">
            Aucun événement prévu.
          </div>
        </div>
      </div>
    </div>
  );
};