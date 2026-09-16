import type { LifeWheelDomain } from '../stores/fw-para.store';

export interface JerrySquad {
  id: string;
  name: string;
  standard: string;
  focus: string;
}

export const JERRY_SQUADS: Record<LifeWheelDomain, JerrySquad> = {
  business: { id: 'J01', name: 'J01 Prime', standard: 'E-Myth SYSTEMIZE', focus: 'Responsibility & Delegation' },
  finance: { id: 'J03', name: 'J03 Nexus', standard: 'FIP Standard', focus: 'Wealth & Assets' },
  habitat: { id: 'J03', name: 'J03 Nexus', standard: 'FIP Standard', focus: 'Environment & Tooling' },
  health: { id: 'J02', name: 'J02 Bio', standard: 'Vitalité & Nutrition', focus: 'Physical Performance' },
  cognition: { id: 'J02', name: 'J02 Bio', standard: 'Vitalité & Nutrition', focus: 'Mental Clarity' },
  relations: { id: 'J04', name: 'J04 Solarpunk', standard: 'Sunday Uplink', focus: 'Connection & Empathy' },
  creativity: { id: 'J04', name: 'J04 Solarpunk', standard: 'Sunday Uplink', focus: 'Expression & Art' },
  impact: { id: 'J04', name: 'J04 Solarpunk', standard: 'Sunday Uplink', focus: 'Legacy & Contribution' },
};
