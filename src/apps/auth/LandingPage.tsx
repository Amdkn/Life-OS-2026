/** A'Space OS V1.0 — Sovereign Entry (Landing Page) */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export const LandingPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, signIn, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      // Toast integration point
      console.error('Auth failure:', err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black overflow-hidden font-mono text-green-400">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="z-10 w-full max-w-md p-8 rounded-2xl border border-green-500/20 bg-black/40 backdrop-blur-2xl shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tighter text-white mb-2">A'SPACE OS</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-green-500/60 font-bold">Initiative ALPHA — Sovereign Bridge</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-green-500/40 ml-1">Stellar Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-green-500/20 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 transition-all text-white"
              placeholder="admiral@fleet.hq"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-green-500/40 ml-1">Access Code</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-green-500/20 rounded-xl px-4 py-3 focus:outline-none focus:border-green-400 transition-all text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[10px] text-red-400 text-center uppercase font-bold"
              >
                ⚠️ Alert: {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? 'Initializing...' : (isLogin ? 'Enter The Bridge' : 'Commission Vessel')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] uppercase text-green-500/40 hover:text-green-400 transition-colors font-bold tracking-widest underline underline-offset-4"
          >
            {isLogin ? "No vessel assigned? Request Commission" : "Already Commissioned? Return to Bridge"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
