import { registerApp } from '../../lib/app-registry';
import App from './LifeWheelApp';

registerApp({ 
  id: 'life-wheel', 
  name: 'Life Wheel', 
  icon: 'CircleDot', 
  version: '0.1.1',
  description: 'Balance and metrics visualization.',
  component: App 
});
