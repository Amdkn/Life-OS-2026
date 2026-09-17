import React, { useState, useEffect } from 'react';
import { AlertCircle, CreditCard, DollarSign, Activity } from 'lucide-react';

export default function HoldingTreasuryEngineView() {
  const [error, setError] = useState<string | null>('Backend connection required. Treasury engine isolated on server.');
  const [isConnected, setIsConnected] = useState(false);

  // Per PRD-073 requirements:
  // "sans connexion réelle, l'UI affiche un état vide/erreur explicite — jamais des chiffres de démonstration ni de télémetrie fictive"

  useEffect(() => {
    // In a real environment, we'd fetch from our local API proxy.
    // Here we enforce the explicit error state since we have no real backend running.
    setIsConnected(false);
    setError('Service Treasury indisponible. Backend connexion requise pour la vue Holding.');
  }, []);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-full bg-slate-900 rounded-lg border border-red-900/50">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Erreur de Connexion au Moteur de Trésorerie</h2>
        <p className="text-slate-400 text-center max-w-md">
          {error}
        </p>
        <p className="text-slate-500 text-sm mt-4 text-center max-w-sm">
          Pour des raisons de sécurité et d'isolation multi-tenant, les opérations financières ne sont pas exécutées dans le navigateur.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 rounded-lg text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-green-400" />
        Holding Treasury Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Activity className="w-4 h-4" />
            <span>Marge Nette (Consolidée)</span>
          </div>
          <div className="text-2xl font-bold">--</div>
        </div>

        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <CreditCard className="w-4 h-4" />
            <span>Encaissements Récents</span>
          </div>
          <div className="text-2xl font-bold">--</div>
        </div>

        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Alertes de Seuil</span>
          </div>
          <div className="text-2xl font-bold">--</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <h3 className="text-lg font-semibold mb-4">Ventilation Automatique (Grand Livre)</h3>
        <p className="text-slate-400 text-sm">Chargement des entrées du grand livre...</p>
      </div>
    </div>
  );
}
