export type VpRole =
  | 'growth_superman'
  | 'sales_martian'
  | 'product_flash'
  | 'ops_batman'
  | 'it_cyborg'
  | 'finance_wonderwoman'
  | 'people_greenlantern'
  | 'legal_aquaman';

export interface DomainHealthStatus {
  score: number; // 0-100
  activeBlockers: string[];
  leadIndicators: string[];
  lagIndicators: string[];
}

export interface VpCouncilDecision {
  id: string;
  timestamp: number;
  weekPriorities: string[];
  arbitrationDetails: string;
  approvedBy: VpRole[];
}
