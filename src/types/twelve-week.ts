export type MeaningHorizon = 'H1' | 'H3' | 'H10' | 'H25' | 'H30' | 'H90';
export type OperationalCadence = 'weekly' | 'cycle';

export interface SolarpunkVisionContext {
  horizon_sens: MeaningHorizon;
  cadence_operationnelle: OperationalCadence;
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
