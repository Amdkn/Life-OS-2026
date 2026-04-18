import { registerApp } from '../../lib/app-registry';
import { SettingsApp } from './SettingsApp';
import { Settings as SettingsIcon } from 'lucide-react';

registerApp({
  id: 'settings',
  name: 'Settings',
  icon: 'Settings',
  version: '0.3.1',
  description: 'Manage OS appearance, identity, AI fleet and security.',
  component: SettingsApp,
  category: 'system',
} as any);
