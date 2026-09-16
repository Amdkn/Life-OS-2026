export type CronFrequency = 'Heartbeat 15m' | 'Circadien 24h' | 'Revue Hebdo W13';

export interface CronJob {
  id: string;
  title: string;
  type: 'system' | 'agent' | 'task' | 'life';
  frequency: CronFrequency;
  day: number; // 0-6
  time: number; // 0-23
  color: string;
  isActive: boolean;
  lastPulse?: number;
}
