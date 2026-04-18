/** ErrorBoundary — prevents white screens and offers a safe fallback */
import * as React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("A'Space Critical Error:", error, errorInfo);
  }

  public render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-12 text-center bg-[#0a0f0d]/80 backdrop-blur-3xl">
          <div className="w-20 h-20 rounded-[32px] glass border-red-500/30 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--theme-text)] uppercase tracking-[0.3em] font-outfit mb-2">Protocol Failure</h2>
          <p className="text-[var(--theme-text)]/40 max-w-sm mb-8 leading-relaxed">The current interface component has encountered an unrecoverable error in the neural bridge.</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 text-[var(--theme-text)]/60 border border-white/10 hover:bg-white/10 hover:text-[var(--theme-text)] transition-all font-bold uppercase tracking-widest text-xs"
          >
            <RefreshCcw className="w-4 h-4" />
            Restart Core Bridge
          </button>
        </div>
      );
    }

    return children;
  }
}

