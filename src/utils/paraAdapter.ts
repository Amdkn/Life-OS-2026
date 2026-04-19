import { Project, LifeWheelDomain } from '../stores/fw-para.store';
import { ParaItem } from '../stores/ld01.store';
import { LDId } from '../lib/ld-router';

// Helper pour mapper ld01 vers le domaine "business" as LifeWheelDomain
export const LD_TO_DOMAIN: Record<LDId, LifeWheelDomain> = {
  ld01: 'business', ld02: 'finance', ld03: 'health', ld04: 'cognition',
  ld05: 'relations', ld06: 'habitat', ld07: 'creativity', ld08: 'impact'
};

export const DOMAIN_TO_LD: Record<string, LDId> = {
  business: 'ld01', finance: 'ld02', health: 'ld03', cognition: 'ld04',
  relations: 'ld05', habitat: 'ld06', creativity: 'ld07', impact: 'ld08'
};

export function projectToParaItem(project: Project): ParaItem {
  return {
    id: project.id,
    title: project.title,
    description: '', // Géré séparément si besoin ou stocké dans metadata
    status: project.status as ParaItem['status'],
    updatedAt: project.updatedAt || Date.now(),
    pillars: project.pillars,
    resources: project.resources,
    progress: project.progress,
    domain: project.domain,
    archivedAt: project.archivedAt,
    // V0.4.7+ Fields
    ...({
      pillarsContent: project.pillarsContent,
      linkedResources: project.linkedResources,
      ikigaiVisionId: project.ikigaiVisionId,
      wheelAmbitionId: project.wheelAmbitionId,
      twelveWeekGoalId: project.twelveWeekGoalId
    } as any)
  };
}

export function paraItemToProject(item: ParaItem, ldId?: LDId): Project {
  // Fallback sûr si les champs V0.4 sont manquants (anciens items)
  return {
    id: item.id,
    title: item.title,
    status: (item.status === 'on-hold' ? 'paused' : item.status) as Project['status'],
    domain: (item.domain as LifeWheelDomain) || (ldId ? LD_TO_DOMAIN[ldId] : 'business'),
    pillars: item.pillars || [],
    resources: item.resources || [],
    progress: item.progress || 0,
    archivedAt: item.archivedAt,
    updatedAt: item.updatedAt,
    // Extra fields from IDB
    pillarsContent: (item as any).pillarsContent,
    linkedResources: (item as any).linkedResources,
    ikigaiVisionId: (item as any).ikigaiVisionId,
    wheelAmbitionId: (item as any).wheelAmbitionId,
    twelveWeekGoalId: (item as any).twelveWeekGoalId
  };
}
