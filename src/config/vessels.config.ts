import { VesselConfig } from '../types/frameworks';

export const vesselConfigs: VesselConfig[] = [
  {
    id: 'FW01',
    frameworkName: 'Ikigai',
    vesselName: 'Orville',
    crew: [
      { id: 'a2-orville', name: 'USS Orville', role: 'Framework Manager', layer: 'A2' },
      { id: 'orville-crew-1', name: 'A SOURCER', role: 'Unknown', layer: 'A2' }
    ]
  },
  {
    id: 'FW02',
    frameworkName: 'Life Wheel',
    vesselName: 'Discovery',
    crew: [
      { id: 'a2-discovery', name: 'USS Discovery', role: 'Framework Manager', layer: 'A2' },
      { id: 'zora', name: 'Zora', role: 'AI Assistant', layer: 'A2' }
    ]
  },
  {
    id: 'FW03',
    frameworkName: 'PARA',
    vesselName: 'Enterprise',
    crew: [
      { id: 'a2-enterprise', name: 'USS Enterprise', role: 'Framework Manager', layer: 'A2' },
      { id: 'a3-picard', name: 'Jean-Luc Picard', role: 'Diplomacy/Logic', layer: 'A3' },
      { id: 'a3-data', name: 'Data', role: 'Computation', layer: 'A3' }
    ]
  },
  {
    id: 'FW04',
    frameworkName: '12WY',
    vesselName: 'SNW',
    crew: [
      { id: 'snw-manager', name: 'USS SNW', role: 'Framework Manager', layer: 'A2' },
      { id: 'snw-crew-1', name: 'A SOURCER', role: 'Unknown', layer: 'A2' }
    ]
  },
  {
    id: 'FW05',
    frameworkName: 'GTD',
    vesselName: 'Cerritos',
    crew: [
      { id: 'cerritos-mariner', name: 'Mariner', role: 'Capture', layer: 'A2' },
      { id: 'cerritos-boimler', name: 'Boimler', role: 'Clarify', layer: 'A2' },
      { id: 'cerritos-rutherford', name: 'Rutherford', role: 'Organize', layer: 'A2' },
      { id: 'cerritos-tendi', name: 'Tendi', role: 'Review', layer: 'A2' },
      { id: 'cerritos-freeman', name: 'Freeman', role: 'Engage', layer: 'A2' }
    ]
  },
  {
    id: 'FW06',
    frameworkName: 'DEAL',
    vesselName: 'Protostar',
    crew: [
      { id: 'protostar-rok-tahk', name: 'Rok-Tahk', role: 'Eliminate', layer: 'A2' },
      { id: 'protostar-zero', name: 'Zero', role: 'Automate', layer: 'A2' },
      { id: 'protostar-gwyn', name: 'Gwyn', role: 'Delegate/Liberate', layer: 'A2' },
      { id: 'protostar-janeway', name: 'Holo-Janeway', role: 'Define', layer: 'A2' }
    ]
  }
];
