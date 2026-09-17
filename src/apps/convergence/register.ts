import { registerApp } from '../../lib/app-registry';
import App from './ConvergenceCommandCenter';

registerApp({
  id: 'convergence',
  name: 'Convergence Dashboard',
  icon: 'Shield',
  version: '0.1.0',
  description: 'Unified Dashboard for ASpace OS, Linear HQ, and Framework Sync',
  component: App
});
