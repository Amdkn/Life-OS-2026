import { ClaraContract } from '../clara/capability-contract.js';

export interface RyanFactory<TInput, TOutput> {
  contract: ClaraContract<TInput, TOutput>;
  buildHarness: () => (input: TInput) => Promise<TOutput>;
}
