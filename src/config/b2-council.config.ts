import { VpRole } from '../types/b2-council';

export interface VpManagerConfig {
  role: VpRole;
  displayName: string;
  domainDescription: string;
}

export const VP_COUNCIL_ROSTER: Record<VpRole, VpManagerConfig> = {
  growth_superman: {
    role: 'growth_superman',
    displayName: 'Growth Superman',
    domainDescription: 'Marketing, Acquisition, and Growth strategies.',
  },
  sales_martian: {
    role: 'sales_martian',
    displayName: 'Sales Martian',
    domainDescription: 'Sales, Revenue generation, and Client relationships.',
  },
  product_flash: {
    role: 'product_flash',
    displayName: 'Product Flash',
    domainDescription: 'Product vision, roadmap, and delivery.',
  },
  ops_batman: {
    role: 'ops_batman',
    displayName: 'Ops Batman',
    domainDescription: 'Operations, Logistics, and Execution.',
  },
  it_cyborg: {
    role: 'it_cyborg',
    displayName: 'IT Cyborg',
    domainDescription: 'Technology, Infrastructure, and Security.',
  },
  finance_wonderwoman: {
    role: 'finance_wonderwoman',
    displayName: 'Finance Wonderwoman',
    domainDescription: 'Finance, Budgeting, and Resource allocation.',
  },
  people_greenlantern: {
    role: 'people_greenlantern',
    displayName: 'People Greenlantern',
    domainDescription: 'HR, Talent acquisition, and Team culture.',
  },
  legal_aquaman: {
    role: 'legal_aquaman',
    displayName: 'Legal Aquaman',
    domainDescription: 'Legal compliance, Risk management, and Contracts.',
  },
};
