import React, { Component, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
console.log("🧿 [Boot] main.tsx entry");

import './lib/app-discovery'; // 🧿 ABSOLUTE APEX: Trigger side-effect registration
import { getAllApps } from './lib/app-registry';

console.log("🧿 [Boot] App Discovery triggered");

// 🧿 APEX ROOT INITIALIZATION: Force registry discovery before React mounts
const apps = getAllApps();
console.log("🧿 [Boot] Registry initialized, apps found:", apps.length);

class RootErrorBoundary extends Component<{children: ReactNode}, {error: Error | null, hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { error, hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ROOT CATCH:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#990000', color: '#ffffff', minHeight: '100vh', zIndex: 99999, position: 'relative' }}>
          <h1 style={{ fontSize: '2em', fontWeight: 'bold' }}>SYSTEM KERNEL PANIC</h1>
          <pre style={{ marginTop: '20px', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.5)', padding: '20px' }}>
            {this.state.error?.toString()}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>
);
