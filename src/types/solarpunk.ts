export interface SolarpunkVisionContext {
  horizon_sens: string; // e.g., H1, H3, H10
  cadence_operationnelle: string; // e.g., weekly, cycle
  quarter_intent: string;
}

export interface QuarterIntent {
  title: string;
  source: string;
  status: string;
  result: string;
  indicatorResult: string;
  indicatorAction: string;
}
