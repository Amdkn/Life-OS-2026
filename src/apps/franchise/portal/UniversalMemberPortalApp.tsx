import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../stores/auth.store';
import { useProfileStore } from '../../../stores/profile.store';
import { UniversalMemberPortal } from './UniversalMemberPortal';

const AVAILABLE_FRANCHISES = [
  { id: 'abc_childcare', name: 'ABC Childcare (Parent)' },
  { id: 'rilcot', name: 'RILCOT (Adhérent)' },
  { id: 'marina_cleaning', name: 'Marina Cleaning (Client)' },
  { id: 'alikaly_holding', name: 'Alikaly Holding (Holding)' }
];

export default function UniversalMemberPortalApp() {
  const { session, initialize: initAuth } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();

  const [selectedFranchiseId, setSelectedFranchiseId] = useState(AVAILABLE_FRANCHISES[0].id);

  // Auto-initialize auth & profile if missing
  useEffect(() => {
    if (!session?.userId) {
      initAuth();
    }
  }, [session, initAuth]);

  useEffect(() => {
    if (session?.userId && !profile) {
      fetchProfile(session.userId);
    }
  }, [session, profile, fetchProfile]);

  if (!profile) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100">
        <p className="text-gray-500 italic">Chargement du profil...</p>
      </div>
    );
  }

  const selectedFranchise = AVAILABLE_FRANCHISES.find(f => f.id === selectedFranchiseId) || AVAILABLE_FRANCHISES[0];

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 bg-gray-200 border-b border-gray-300 flex items-center justify-between">
        <span className="font-bold text-gray-700">Sélection de Franchise (Démo) :</span>
        <select
          className="ml-4 p-2 border rounded"
          value={selectedFranchiseId}
          onChange={(e) => setSelectedFranchiseId(e.target.value)}
        >
          {AVAILABLE_FRANCHISES.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-auto">
        <UniversalMemberPortal
          franchise={{ id: selectedFranchise.id, name: selectedFranchise.name }}
          profile={profile}
        />
      </div>
    </div>
  );
}
