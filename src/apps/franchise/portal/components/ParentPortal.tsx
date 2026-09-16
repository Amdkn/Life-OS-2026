import React from 'react';
import { UserProfile } from '../../../../types/profile';

interface ParentPortalProps {
  profile: UserProfile;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ profile }) => {
  return (
    <div className="parent-portal-container p-6">
      <h2 className="text-2xl font-bold mb-4">Espace Parent - {profile.displayName}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4 border rounded shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Présences</h3>
          <div className="empty-state text-gray-500 italic">
            Aucune donnée de présence disponible.
          </div>
        </div>

        <div className="card p-4 border rounded shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Alertes</h3>
          <div className="empty-state text-gray-500 italic">
            Aucune alerte récente.
          </div>
        </div>

        <div className="card p-4 border rounded shadow-sm bg-white">
          <h3 className="text-xl font-semibold mb-2">Factures</h3>
          <div className="empty-state text-gray-500 italic">
            Aucune facture disponible.
          </div>
        </div>
      </div>
    </div>
  );
};