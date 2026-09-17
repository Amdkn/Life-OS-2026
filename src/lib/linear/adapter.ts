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
    cycleId: tactic.cycleId,
    _mappedFromId: tactic.id,
    _mappedFromType: 'wy-tactic'
  };
}

export function mapLinearTeamToDomain(team: LinearTeam | { id: string }): LifeWheelDomain | undefined {
  if (team.id.startsWith('team-')) {
    const domainPart = team.id.substring(5) as LifeWheelDomain;
    const validDomains: LifeWheelDomain[] = ['business', 'finance', 'health', 'cognition', 'creativity', 'habitat', 'relations', 'impact'];
    if (validDomains.includes(domainPart)) {
      return domainPart;
    }
  }
  return undefined;
}

export function mapLinearIssueToParaProject(issue: { id: string, title: string, status: LinearStatus, teamId: string }): Partial<Project> {
  const domain = mapLinearTeamToDomain({ id: issue.teamId });
  return {
    id: issue.id,
    title: issue.title,
    status: mapLinearStatusToPara(issue.status),
    domain: domain,
  };
}

export function mapLinearIssueToWyTactic(issue: { id: string, title: string, status: LinearStatus, cycleId?: string }): Partial<WyTactic> {
  return {
    id: issue.id,
    title: issue.title,
    status: mapLinearStatusToWy(issue.status),
    cycleId: issue.cycleId,
  };
}

export function mapLinearIssueToScoreCardTask(issue: { id: string, title: string, status: LinearStatus, teamId: string }) {
  let scStatus = 'todo';
  if (issue.status === 'In Progress') scStatus = 'in-progress';
  if (issue.status === 'Review') scStatus = 'review';
  if (issue.status === 'Done') scStatus = 'done';

  let label = 'OTHER';
  const domain = mapLinearTeamToDomain({ id: issue.teamId });
  if (domain) {
    label = domain.toUpperCase();
  }

  return {
    id: issue.id,
    title: issue.title,
    status: scStatus,
    label: label
  };
}
