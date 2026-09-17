export type LinearStatus = 'Todo' | 'In Progress' | 'Review' | 'Done' | 'Canceled';

export interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export interface LinearIssue {
  id: string;
  title: string;
  description?: string;
  status: LinearStatus;
  teamId: string;
  projectId?: string;
  cycleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LinearIssuePayload {
  title: string;
  description?: string;
  teamId: string;
  stateId?: string;
  projectId?: string;
  cycleId?: string;
  // Custom fields we might want to sync
  _mappedFromId?: string;
  _mappedFromType?: 'para-project' | 'wy-tactic' | 'scorecard-task';
}

export interface SyncResult {
  success: boolean;
  issue?: LinearIssue;
  queued?: boolean;
  error?: string;
}
