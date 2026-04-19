/** Glassmorphism utility tokens for Tailwind classes */
export const glass = {
  panel: 'glass rounded-2xl',
  card: 'glass-card p-4',
  opaque: 'glass-opaque p-4 rounded-xl',
  button: 'px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:bg-white/20 border border-white/5',
  buttonPrimary: 'px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 active:bg-emerald-500/40',
  input: 'bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50',
  status: {
    online: 'status-dot status-dot-online',
    idle: 'status-dot status-dot-idle',
    offline: 'status-dot status-dot-offline',
  }
};