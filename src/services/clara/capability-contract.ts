export interface ClaraContract<TInput, TOutput> {
  id: string;
  name: string;
  description: string;
  inputSchema: unknown;
  outputSchema: unknown;
  acceptanceCriteria: string[];
  holdoutScenarios: string[];
}
