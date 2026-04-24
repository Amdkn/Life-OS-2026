// src/apps/auth/MigrationScreen.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMigrationGuard } from '../../hooks/useMigrationGuard';

interface MigrationScreenProps {
  onComplete: () => void;
}

export const MigrationScreen: React.FC<MigrationScreenProps> = ({ onComplete }) => {
  const { status, result, validation, error, check, run } = useMigrationGuard();

  useEffect(() => {
    check().then((needed) => {
      if (needed) run();
      else onComplete(); // Pas de migration nécessaire → Desktop direct
    });
  }, [check, run, onComplete]);

  useEffect(() => {
    if (status === 'complete') {
      const t = setTimeout(() => {
        // Success Toast Simulation
        if (result) {
          console.log(`MÉMOIRE RESTAURÉE — ${result.totalRowsMigrated} enregistrements récupérés`);
        }
        onComplete();
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [status, result, onComplete]);

  return (
    <div className="flex h-screen items-center justify-center bg-black font-mono overflow-hidden">

      {/* Halo ambiant — plus intense que le boot normal (moment critique) */}
      <motion.div
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500 rounded-full filter blur-[200px] opacity-8" />
      </motion.div>

      <div className="relative max-w-lg w-full px-8 z-10">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-green-600/40 text-[10px] tracking-[0.35em] mb-2 uppercase">
            A'Space OS ◈ Protocole de Restauration
          </p>
          <h2 className="text-green-400 text-xl font-bold tracking-tight">
            SYNCHRONISATION DE LA MÉMOIRE
          </h2>
          <p className="text-green-700/50 text-[11px] mt-1 tracking-wider">
            Récupération des données de navigation V0.9 → V1.0
          </p>
        </motion.div>

        {/* Statut courant */}
        <div className="mb-8">
          <StatusLine status={status} />
        </div>

        {/* Résultats si disponibles */}
        <AnimatePresence>
          {result && status === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border border-green-500/15 rounded-xl p-4 bg-green-500/5 mb-6"
            >
              <p className="text-green-400 font-bold text-sm mb-3">
                ✦ MÉMOIRE RESTAURÉE
              </p>
              <div className="space-y-1 text-[11px] text-green-700/60 font-mono">
                <p>Enregistrements récupérés : <span className="text-green-500">{result.totalRowsMigrated}</span></p>
                <p>Modules synchronisés : <span className="text-green-500">{result.tablesUpdated}/16</span></p>
                <p>Durée : <span className="text-green-500">{result.durationMs}ms</span></p>
              </div>
              <p className="text-green-600/40 text-[10px] mt-3 tracking-widest uppercase">
                Redirection vers le pont de commandement...
              </p>
            </motion.div>
          )}

          {status === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-red-500/20 rounded-xl p-4 bg-red-500/5 mb-6"
            >
              <p className="text-red-400/80 font-bold text-sm mb-2">
                ⚠ ERREUR DE SYNCHRONISATION
              </p>
              <p className="text-red-400/60 text-xs mb-4 font-mono">{error}</p>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => run()}
                className="w-full py-2.5 rounded-lg border border-green-500/25 bg-green-500/10 text-green-400 text-[10px] tracking-widest hover:bg-green-500/20 transition-all"
              >
                RELANCER LE PROTOCOLE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation post-migration */}
        {validation && (
          <div className="text-[10px] text-green-800/50 mt-4 font-mono">
            {validation.message}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Composant StatusLine — affiche l'état courant ───────────────────────────

const STATUS_LABELS: Record<string, string> = {
  idle:        '◈ Initialisation...',
  checking:    '◈ Détection des données orphelines...',
  needed:      '◈ Données de navigation détectées — lancement migration...',
  running:     '◈ SYNCHRONISATION EN COURS...',
  validating:  '◈ Vérification de l\'intégrité...',
  complete:    '✦ Synchronisation terminée.',
  failed:      '⚠ Erreur de synchronisation.',
  'not-needed':'✦ Aucune migration nécessaire.',
};

function StatusLine({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? '◈ ...';
  const isActive = status === 'running' || status === 'checking' || status === 'validating';

  return (
    <div className="flex items-center gap-3">
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"
        />
      )}
      {!isActive && <div className="w-2 h-2 rounded-full bg-green-600/40 flex-shrink-0" />}
      <motion.p
        key={status}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        className={`text-sm font-mono ${
          status === 'complete' ? 'text-green-300 font-bold' :
          status === 'failed'   ? 'text-red-400/80' :
          isActive              ? 'text-green-400' :
          'text-green-700/60'
        }`}
      >
        {label}
      </motion.p>
    </div>
  );
}
