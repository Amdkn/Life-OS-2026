// src/apps/auth/FirstLaunch.tsx — V1.0
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileStore } from '../../stores/profile.store';

const BOOT_LINES = [
  { text: '◈  Liaison Stellar Bridge établie...', delay: 0 },
  { text: '◈  Chargement des 8 Domaines de Vie...', delay: 550 },
  { text: '◈  USS Discovery — Life Wheel Protocol actif...', delay: 1100 },
  { text: '◈  USS Cerritos — GTD Capture System en ligne...', delay: 1650 },
  { text: '◈  USS Enterprise — PARA Business Framework prêt...', delay: 2200 },
  { text: '◈  USS Orville — Ikigai Protocol calibré...', delay: 2750 },
  { text: '◈  Agent Portal — Flotte Stellaire initialisée...', delay: 3300 },
  { text: '✦  Vaisseau opérationnel.', delay: 3850, highlight: true },
];

interface FirstLaunchProps { onComplete: () => void; }

export const FirstLaunch: React.FC<FirstLaunchProps> = ({ onComplete }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const profile = useProfileStore((s) => s.profile);
  const markComplete = useProfileStore((s) => s.markFirstLaunchComplete);

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleCount((n) => Math.max(n, i + 1)), line.delay)
    );
    const welcomeTimer = setTimeout(() => setShowWelcome(true), 4500);
    const completeTimer = setTimeout(async () => {
      await markComplete();
      onComplete();
    }, 5800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(welcomeTimer);
      clearTimeout(completeTimer);
    };
  }, [markComplete, onComplete]);

  const admiralName = profile?.displayName?.split('@')[0] ?? 'Amiral';

  return (
    <div className="flex h-screen items-center justify-center bg-black font-mono overflow-hidden">
      <motion.div
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500 rounded-full filter blur-[180px] opacity-10" />
      </motion.div>

      <div className="relative max-w-lg w-full px-8 z-10">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          className="text-green-600/40 text-[10px] tracking-[0.35em] mb-8 uppercase"
        >
          A'Space OS ◈ Boot Sequence ◈ V1.0
        </motion.p>

        <div className="space-y-2.5 mb-8">
          {BOOT_LINES.slice(0, visibleCount).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`text-sm ${
                (line as { highlight?: boolean }).highlight
                  ? 'text-green-300 font-bold'
                  : i === visibleCount - 1 ? 'text-green-400' : 'text-green-700/60'
              }`}
            >
              {line.text}
            </motion.p>
          ))}
          {visibleCount < BOOT_LINES.length && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"
            />
          )}
        </div>

        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="border-t border-green-500/15 pt-6"
            >
              <p className="text-green-400 text-lg font-bold tracking-tight mb-1">
                Bienvenue, {admiralName}.
              </p>
              <p className="text-green-700/50 text-[11px] tracking-widest uppercase">
                Votre vaisseau vous attend ◈ Bonne navigation
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
