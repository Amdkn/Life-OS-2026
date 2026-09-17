export interface WeeklyUplinkSnapshot {
  id: string;
  week: number;
  score: number | null; // null represents an empty week
  promotedAssets: string[];
  archivedProjects: string[];
  timestamp: number;
}
