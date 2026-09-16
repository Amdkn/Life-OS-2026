import { FranchiseId, FranchiseInstance, B1Config, ActiveModules } from '../../types/franchise';

const mockConfigs: Record<FranchiseId, B1Config> = {
  abc_childcare: { northStar: '1Y/3Y/10Y', commandCycles: '12WY Cycles de commandement' },
  rilcot: { northStar: '1Y/3Y/10Y', commandCycles: '12WY Cycles de commandement' },
  alikaly_holding: { northStar: '1Y/3Y/10Y', commandCycles: '12WY Cycles de commandement' },
  marina_cleaning: { northStar: '1Y/3Y/10Y', commandCycles: '12WY Cycles de commandement' },
};

const mockModules: Record<FranchiseId, ActiveModules[]> = {
  abc_childcare: ['billing', 'member_portal'],
  rilcot: ['field_ops', 'billing'],
  alikaly_holding: ['holding_ledger', 'member_portal'],
  marina_cleaning: ['field_ops', 'billing', 'member_portal'],
};

export class FranchiseFactory {
  static createInstance(id: FranchiseId): FranchiseInstance {
    return {
      id,
      b1Config: mockConfigs[id] || {},
      activeModules: mockModules[id] || [],
    };
  }
}
