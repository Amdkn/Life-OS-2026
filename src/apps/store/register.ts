import { registerApp } from '../../lib/app-registry';
import App from './AppStore';

registerApp({ 
  id: 'store', 
  name: 'App Store', 
  icon: 'ShoppingBag', 
  version: '0.1.1',
  description: 'OS Marketplace for new modules.',
  component: App 
});
