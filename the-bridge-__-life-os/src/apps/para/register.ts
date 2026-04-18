import { registerApp } from '../../lib/app-registry';
import App from './ParaApp';

registerApp({ 
  id: 'para', 
  name: 'PARA Business', 
  icon: 'FolderKanban', 
  version: '0.1.1',
  description: 'P.A.R.A. organization system for business and life.',
  component: App 
});
