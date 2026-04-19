import { registerApp } from '../../lib/app-registry';
import App from './DealApp';

registerApp({ 
  id: 'deal', 
  name: 'DEAL Framework', 
  icon: 'Unlock', 
  version: '0.1.1',
  description: 'Deal and negotiation protocol.',
  component: App 
});
