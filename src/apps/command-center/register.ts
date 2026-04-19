import { registerApp } from '../../lib/app-registry';
import App from './CommandCenter';

registerApp({ 
  id: 'command-center', 
  name: 'Command Center', 
  icon: 'LayoutDashboard', 
  version: '0.1.1',
  description: 'Main Hub for A Space OS',
  component: App 
});
