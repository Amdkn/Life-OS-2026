import { registerApp } from '../../../lib/app-registry';
import UniversalMemberPortalApp from './UniversalMemberPortalApp';

registerApp({
  id: 'universal-portal',
  name: 'Universal Portal',
  icon: 'Globe',
  version: '1.0.0',
  description: 'Universal Member Portal pour franchises',
  component: UniversalMemberPortalApp
});
