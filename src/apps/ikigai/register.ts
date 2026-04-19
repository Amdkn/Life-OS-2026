import { registerApp } from '../../lib/app-registry';
import App from './IkigaiApp';

registerApp({ 
  id: 'ikigai', 
  name: 'Ikigai Protocol', 
  icon: 'Compass', 
  version: '0.1.1',
  description: 'Life purpose and alignment framework.',
  component: App 
});
