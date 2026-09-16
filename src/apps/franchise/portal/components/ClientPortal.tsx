import React from 'react';
import { UserProfile } from '../../../../types/profile';

interface ClientPortalProps {
  profile: UserProfile;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ profile }) => {
  return (
    <div className="client-portal-container p-6">
      <h2 className="text-2xl font-bold mb-4">Espace Client - {profile.displayName}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-4 border rounded shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Demandes d'intervention</h3>
          <div className="empty-state text-gray-500 italic">
            Aucune demande d'intervention en cours.
          </div>
        </div>

        <div className="card p-4 border rounded shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Validation de fin de chantier</h3>
          <div className="empty-state text-gray-500 italic">
            Aucun chantier en attente de validation.
          </div>
        </div>
      </div>
    </div>
  );
};