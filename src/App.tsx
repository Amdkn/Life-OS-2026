// src/App.tsx
import { useEffect, useState } from 'react';
import { useAuthStore } from './stores/auth.store';
import { useProfileStore } from './stores/profile.store';
import { LandingPage } from './apps/auth/LandingPage';
import { FirstLaunch } from './apps/auth/FirstLaunch';
import { MigrationScreen } from './apps/auth/MigrationScreen';
import { Desktop } from './components/Desktop';
import { OmniCaptureModal } from './components/OmniCaptureModal';
import { useThemeApply } from './hooks/useThemeApply';
import { ldDBs } from './lib/idb';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';

export default function App() {
  const { session, loading: authLoading, initialize } = useAuthStore();
  const { profile, loading: profileLoading, fetchProfile } = useProfileStore();
  const [showMigration, setShowMigration] = useState<boolean | null>(null); // null = check pending
  useThemeApply();

  useEffect(() => { initialize(); }, [initialize]);

  useEffect(() => {
    if (session?.userId) fetchProfile(session.userId);
  }, [session?.userId, fetchProfile]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        console.log('Admiral signed out. Wiping local bridge cache...');
        await Promise.all(Object.values(ldDBs).map(db => db.wipe()));
        window.location.reload();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Vérifier si migration nécessaire au premier vrai login (pas pendant FirstLaunch)
  useEffect(() => {
    if (session && profile && profile.settings.first_launch === false) {
      import('./services/migration.service').then(({ checkMigrationNeeded }) => {
        checkMigrationNeeded().then((needed) => {
          setShowMigration(needed);
        });
      });
    }
  }, [session, profile]);

  if (authLoading || (session && profileLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-green-400 font-mono">
        <span className="animate-pulse tracking-widest text-xs uppercase">INITIALIZING STELLAR BRIDGE...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="landing" exit={{ opacity: 0 }} className="h-full w-full">
          <LandingPage />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (profile?.settings?.first_launch !== false) {
    return (
      <FirstLaunch
        onComplete={() => useProfileStore.getState().markFirstLaunchComplete()}
      />
    );
  }

  // Gate migration — avant le Desktop, après FirstLaunch
  if (showMigration === true) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="migration" exit={{ opacity: 0 }} className="h-full w-full">
          <MigrationScreen
            onComplete={() => setShowMigration(false)}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // showMigration === null → check en cours → afficher le splash habituel
  if (showMigration === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-green-400 font-mono">
        <span className="animate-pulse tracking-widest text-xs uppercase">CHECKING MEMORY INTEGRITY...</span>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="desktop" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="h-full w-full"
      >
        <Desktop />
        <OmniCaptureModal />
      </motion.div>
    </AnimatePresence>
  );
}
