export type FranchiseId = 'abc_childcare' | 'rilcot' | 'alikaly_holding' | 'marina_cleaning';
export type ActiveModules = 'billing' | 'member_portal' | 'field_ops' | 'holding_ledger';

export interface B1Config {
  northStar?: string;
  commandCycles?: string;
  [key: string]: any;
}

export interface FranchiseInstance {
  id: FranchiseId;
  b1Config: B1Config;
  activeModules: ActiveModules[];
}
