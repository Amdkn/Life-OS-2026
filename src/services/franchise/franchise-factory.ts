import {
  FranchiseId,
  FranchiseInstance,
  B1Config,
  ActiveModules,
  B2GateMatrix
} from '../../types/franchise';

const defaultB1Config: B1Config = {
  northStar: {
    '1Y': null,
    '3Y': null,
    '10Y': null,
  },
  commandCycles: [],
};

const defaultB2Gates: B2GateMatrix = {};

export class FranchiseFactory {
  static createInstance(id: FranchiseId): FranchiseInstance {
    switch (id) {
      case 'abc_childcare':
        return {
          id: 'abc_childcare',
          b1Config: defaultB1Config,
          activeModules: ['billing', 'member_portal'],
          b2Gates: defaultB2Gates,
        };
      case 'rilcot':
        return {
          id: 'rilcot',
          b1Config: defaultB1Config,
          activeModules: ['field_ops', 'billing'],
          b2Gates: defaultB2Gates,
        };
      case 'alikaly_holding':
        return {
          id: 'alikaly_holding',
          b1Config: defaultB1Config,
          activeModules: ['holding_ledger', 'member_portal'],
          b2Gates: defaultB2Gates,
        };
      case 'marina_cleaning':
        return {
          id: 'marina_cleaning',
          b1Config: defaultB1Config,
          activeModules: ['field_ops', 'billing', 'member_portal'],
          b2Gates: defaultB2Gates,
        };
      default: {
        const exhaustiveCheck: never = id;
        throw new Error(`Unknown franchise id: ${exhaustiveCheck}`);
      }
    }
  }
}
