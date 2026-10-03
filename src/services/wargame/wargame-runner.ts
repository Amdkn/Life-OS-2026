export interface WargameScenario {
  reconReadOnly: boolean;
  expectedObservation: string;
  likelyFailureAndSignal: string;
  counterMove: string;
  forkTrigger: string;
  unresolvedReconNeeded: string[];
  abortConditions: string[];
  verification: string;
  redTeam: string;
}

export class WargameRunner {
  evaluate(scenario: WargameScenario): { ok: boolean, reason?: string } {
    if (scenario.abortConditions.length > 0) {
      return { ok: false, reason: 'Abort conditions present' };
    }
    if (scenario.unresolvedReconNeeded.length > 0) {
      return { ok: false, reason: 'Unresolved recon needed' };
    }
    return { ok: true };
  }
}
