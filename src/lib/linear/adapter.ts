import { LinearStatus, LinearTeam, LinearIssuePayload } from './types';
import type { Project, LifeWheelDomain } from '../../stores/fw-para.store';
import type { WyTactic } from '../../stores/fw-12wy.store';

export function mapParaStatusToLinear(status: Project['status']): LinearStatus {
  switch (status) {
    case 'active':
      return 'In Progress';
    case 'paused':
      return 'Review';
    case 'completed':
      return 'Done';
    case 'archived':
      return 'Canceled';
    default:
      return 'Todo';
  }
}

export function mapWyStatusToLinear(status: WyTactic['status']): LinearStatus {
  switch (status) {
    case 'pending':
      return 'Todo';
    case 'completed':
      return 'Done';
    case 'failed':
      return 'Canceled';
    default:
      return 'Todo';
  }
}

export function mapLinearStatusToPara(status: LinearStatus): Project['status'] {
  switch (status) {
    case 'Todo':
      return 'paused'; // or keep as active with 0 progress? Let's map Todo -> active, In Progress -> active
    case 'In Progress':
      return 'active';
    case 'Review':
      return 'paused';
    case 'Done':
      return 'completed';
    case 'Canceled':
      return 'archived';
    default:
      return 'active';
  }
}

export function mapLinearStatusToWy(status: LinearStatus): WyTactic['status'] {
  switch (status) {
    case 'Todo':
    case 'In Progress':
    case 'Review':
      return 'pending';
    case 'Done':
      return 'completed';
    case 'Canceled':
      return 'failed';
    default:
      return 'pending';
  }
}

export function mapDomainToLinearTeam(domain: LifeWheelDomain): LinearTeam {
  const keyMap: Record<LifeWheelDomain, string> = {
    business: 'BUS',
    finance: 'FIN',
    health: 'HLT',
    cognition: 'COG',
    creativity: 'CRE',
    habitat: 'HAB',
    relations: 'REL',
    impact: 'IMP'
  };

  return {
    id: `team-${domain}`,
    name: domain.charAt(0).toUpperCase() + domain.slice(1),
    key: keyMap[domain] || domain.substring(0, 3).toUpperCase()
  };
}

// Since a Linear Team conceptually maps to a Domain in this system,
// a PARA Project maps to an Epic or Project in Linear, but often we just need to get the team ID
// based on the PARA project's domain.
export function mapParaProjectToLinearTeam(project: Project): LinearTeam {
  return mapDomainToLinearTeam(project.domain);
}

export function mapScoreCardTaskToLinearIssue(task: { id: string, title: string, status: string, label: string }): LinearIssuePayload {
  let linearStatus: LinearStatus = 'Todo';
  if (task.status === 'in-progress') linearStatus = 'In Progress';
  if (task.status === 'review') linearStatus = 'Review';
  if (task.status === 'done') linearStatus = 'Done';

  const teamId = `team-${task.label.toLowerCase()}`;

  return {
    title: task.title,
    teamId: teamId,
    // we would normally use stateId, but sending string representation for now in mapping
    _mappedFromId: task.id,
    _mappedFromType: 'scorecard-task'
  };
}

export function mapParaProjectToLinearIssue(project: Project): LinearIssuePayload {
  const team = mapParaProjectToLinearTeam(project);

  return {
    title: project.title,
    teamId: team.id,
    _mappedFromId: project.id,
    _mappedFromType: 'para-project',
  };
}

export function mapWyTacticToLinearIssue(tactic: WyTactic, domain: LifeWheelDomain = 'business'): LinearIssuePayload {
  const team = mapDomainToLinearTeam(domain);

  return {
    title: tactic.title || 'Untitled Tactic',
    description: `Week ${tactic.week} tactic for goal ${tactic.goalId}`,
    teamId: team.id,
    _mappedFromId: tactic.id,
    _mappedFromType: 'wy-tactic'
  };
}
