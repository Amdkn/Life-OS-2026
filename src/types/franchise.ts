export type FranchiseId = 'abc_childcare' | 'rilcot' | 'alikaly_holding' | 'marina_cleaning';
export type ActiveModules = 'billing' | 'member_portal' | 'field_ops' | 'holding_ledger';

export interface B1Config {
  northStar: {
    '1Y': string | null;
    '3Y': string | null;
    '10Y': string | null;
  };
  commandCycles: string[];
}

export interface B2GateMatrix {
  [gateName: string]: {
    requiredApprovals: number;
    metricsThresholds: Record<string, number>;
  };
}

export interface BaseFranchiseInstance {
  b1Config: B1Config;
  activeModules: ActiveModules[];
  b2Gates: B2GateMatrix;
}

export interface AbcChildcareInstance extends BaseFranchiseInstance {
  id: 'abc_childcare';
}

export interface RilcotInstance extends BaseFranchiseInstance {
  id: 'rilcot';
}

export interface AlikalyHoldingInstance extends BaseFranchiseInstance {
  id: 'alikaly_holding';
}

export interface MarinaCleaningInstance extends BaseFranchiseInstance {
  id: 'marina_cleaning';
}

export type FranchiseInstance =
  | AbcChildcareInstance
  | RilcotInstance
  | AlikalyHoldingInstance
  | MarinaCleaningInstance;
