import { registerApp } from '../../lib/app-registry';
import App from './TwelveWeekApp';

registerApp({ 
  id: 'twelve-week', 
  name: '12WY Strategy', 
  icon: 'CalendarCheck', 
  version: '0.1.1',
  description: '12 Week Year execution framework.',
  component: App 
});
