import { registerApp } from '../../lib/app-registry';
import App from './AgentPortalApp';

registerApp({
  id: 'agent-portal',
  name: 'Agent Portal',
  icon: 'Bot',
  version: '0.1.8',
  description: 'Fleet management and task injection hub.',
  component: App
});
