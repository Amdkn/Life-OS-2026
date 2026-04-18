import { registerApp } from '../../lib/app-registry';
import App from './GtdApp';

registerApp({ 
  id: 'gtd', 
  name: 'GTD System', 
  icon: 'CheckSquare', 
  version: '0.1.1',
  description: 'Getting Things Done productivity tool.',
  component: App 
});
