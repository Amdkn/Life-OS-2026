/** Toast notification system — auto-dismissing slide-in toasts */
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useShellStore, type Toast as ToastType } from '../stores/shell.store';

const TOAST_DURATION = 5000; // auto-dismiss after 5 seconds

/** Icon per toast type */
const typeIcons: Record<ToastType['type'], typeof Info> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

/** Color classes per toast type */
const typeColors: Record<ToastType['type'], string> = {
  info: 'border-blue-500/30 text-blue-400',
  success: 'border-emerald-500/30 text-emerald-400',
  warning: 'border-amber-500/30 text-amber-400',
  error: 'border-red-500/30 text-red-400',
};

export function ToastContainer() {
  const toasts = useShellStore(s => s.toasts);
  const dismissToast = useShellStore(s => s.dismissToast);

  return (
    <div className="fixed top-12 right-4 z-[4000] flex flex-col gap-2 pointer-events-none">
      {toasts.slice(-5).map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  );
}

/* ═══ Single Toast ═══ */

interface ToastItemProps {
  toast: ToastType;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  /* Auto-dismiss after TOAST_DURATION */
  useEffect(() => {
    const timer = setTimeout(onDismiss, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const Icon = typeIcons[toast.type];

  return (
    <div className={`pointer-events-auto flex items-start gap-4 p-4 rounded-2xl glass border bg-black/60 shadow-2xl animate-in slide-in-from-right-4 duration-300 ${typeColors[toast.type]}`}>
      <div className="shrink-0 mt-0.5">
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0 pr-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1">{toast.source || 'Kernel'}</div>
        <div className="text-xs font-medium text-[var(--theme-text)]/90 leading-relaxed">{toast.message}</div>
      </div>

      <button 
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/5 text-[var(--theme-text)]/20 hover:text-[var(--theme-text)] transition-all"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

