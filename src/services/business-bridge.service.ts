// src/services/business-bridge.service.ts
import { CapabilityRequest, EffectReceipt } from '../../types/capabilities.js';
import { RiverBusinessAdapter } from '../lib/river/adapter';
import { appendEvent, BlackboardEvent, Artifact } from '../../lib/blackboard/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Bridge: Consumes Business OS capability contracts and publishes GWS-backed events.
 *
 * This service:
 * 1. Handles the River Business Adapter requests (business.sync command)
 * 2. Publishes structured events to the blackboard with GWS evidence markers
 * 3. Creates artifacts that serve as durable receipts for the GWS projection
 * 4. Preserves Life-owned semantics (Ikigai, 12WY, Life Wheel, PARA, GTD, DEAL)
 */

export class BusinessBridgeService {
  private adapter: RiverBusinessAdapter;

  constructor() {
    this.adapter = new RiverBusinessAdapter();
  }

  /**
   * Handle a business bandwidth update from the CLI and publish to blackboard
   */
  async handleBandwidthUpdate(
    blocks: number,
    actorId: string,
    actorLayer: string = 'cli'
  ): Promise<EffectReceipt> {
    const request: CapabilityRequest = {
      id: crypto.randomUUID(),
      type: 'business.bandwidth.update',
      payload: { availableBandwidthBlocks: blocks },
      correlation_id: crypto.randomUUID(),
      source: 'cli'
    };

    // Execute the River Business Adapter request
    const receipt = await this.adapter.handleRequest(request, undefined);

    // Publish GWS-backed event to blackboard with evidence
    const event: BlackboardEvent = {
      id: crypto.randomUUID(),
      workspace_id: null,
      actor_id: actorId,
      actor_layer: actorLayer,
      event_type: 'business_bandwidth_updated',
      payload_json: JSON.stringify({
        request_id: receipt.request_id,
        blocks,
        status: receipt.status,
        adapter: receipt.adapter,
        timestamp: receipt.timestamp
      }),
      timestamp: Date.now()
    };

    await appendEvent(event);

    // Create an artifact as durable receipt for GWS projection
    const artifact: Artifact = {
      id: crypto.randomUUID(),
      workspace_id: null,
      name: `business-bw-${blocks}blocks-${Date.now()}`,
      mime_type: 'application/json',
      content_path: `/bridge/bw-${blocks}blocks.json`,
      created_at: Date.now()
    };

    // Note: In a full implementation, would call createArtifact
    // For now, we log the artifact metadata for GWS evidence
    // console.log('[BusinessBridge] Artifact created for GWS evidence:', artifact);

    return receipt;
  }

  /**
   * Handle milestones fetch from Business OS and publish to blackboard
   */
  async handleMilestonesFetch(actorId: string, actorLayer: string = 'cli'): Promise<EffectReceipt> {
    const request: CapabilityRequest = {
      id: crypto.randomUUID(),
      type: 'business.milestones.fetch',
      payload: {},
      correlation_id: crypto.randomUUID(),
      source: 'cli'
    };

    // Execute the River Business Adapter request
    const receipt = await this.adapter.handleRequest(request, undefined);

    // Publish GWS-backed event to blackboard with evidence
    const event: BlackboardEvent = {
      id: crypto.randomUUID(),
      workspace_id: null,
      actor_id: actorId,
      actor_layer: actorLayer,
      event_type: 'business_milestones_fetched',
      payload_json: JSON.stringify({
        request_id: receipt.request_id,
        status: receipt.status,
        adapter: receipt.adapter,
        evidence: receipt.evidence,
        timestamp: receipt.timestamp
      }),
      timestamp: Date.now()
    };

    await appendEvent(event);

    return receipt;
  }

  /**
   * Publish a DEAL framework liberation event to blackboard
   * Preserves DEAL semantics from Business OS migration
   */
  async handleDealLiberation(
    projectId: string,
    liberated: boolean,
    actorId: string
  ): Promise<void> {
    const event: BlackboardEvent = {
      id: crypto.randomUUID(),
      workspace_id: null,
      actor_id: actorId,
      actor_layer: 'deal',
      event_type: 'deal_framework_liberation',
      payload_json: JSON.stringify({
        projectId,
        liberated,
        framework: 'DEAL',
        timestamp: Date.now()
      }),
      timestamp: Date.now()
    };

    await appendEvent(event);
  }

  /**
   * Publish a GTD engagement event to blackboard
   * Preserves GTD semantics from Life OS execution
   */
  async handleGtdEngagement(
    goalId: string,
    tacticId: string,
    status: 'completed' | 'pending' | 'failed',
    actorId: string
  ): Promise<void> {
    const event: BlackboardEvent = {
      id: crypto.randomUUID(),
      workspace_id: null,
      actor_id: actorId,
      actor_layer: 'gtd',
      event_type: 'gtd_engagement_completed',
      payload_json: JSON.stringify({
        goalId,
        tacticId,
        status,
        framework: 'GTD',
        timestamp: Date.now()
      }),
      timestamp: Date.now()
    };

    await appendEvent(event);
  }

  /**
   * Publish an Ikigai vision activation event to blackboard
   * Preserves Ikigai semantics from Life OS constitution
   */
  async handleIkigaiActivation(
    visionId: string,
    horizon: 'H1' | 'H3' | 'H10' | 'H30' | 'H90',
    actorId: string
  ): Promise<void> {
    const event: BlackboardEvent = {
      id: crypto.randomUUID(),
      workspace_id: null,
      actor_id: actorId,
      actor_layer: 'ikigai',
      event_type: 'ikigai_vision_activated',
      payload_json: JSON.stringify({
        visionId,
        horizon,
        framework: 'Ikigai',
        timestamp: Date.now()
      }),
      timestamp: Date.now()
    };

    await appendEvent(event);
  }

  /**
   * Publish a PARA area update event to blackboard
   * Preserves PARA semantics from Life OS framework
   */
  async handleParaAreaUpdate(
    areaId: string,
    action: 'create' | 'update' | 'archive',
    actorId: string
  ): Promise<void> {
    const event: BlackboardEvent = {
      id: crypto.randomUUID(),
      workspace_id: null,
      actor_id: actorId,
      actor_layer: 'para',
      event_type: 'para_area_updated',
      payload_json: JSON.stringify({
        areaId,
        action,
        framework: 'PARA',
        timestamp: Date.now()
      }),
      timestamp: Date.now()
    };

    await appendEvent(event);
  }

  /**
   * Publish a 12WY weekly score event to blackboard
   * Preserves 12WY semantics from Life OS cycle
   */
  async handleWeeklyScore(
    week: number,
    score: number,
    status: 'green' | 'yellow' | 'red',
    actorId: string
  ): Promise<void> {
    const event: BlackboardEvent = {
      id: crypto.randomUUID(),
      workspace_id: null,
      actor_id: actorId,
      actor_layer: '12wy',
      event_type: 'twelve_week_year_score',
      payload_json: JSON.stringify({
        week,
        score,
        status,
        framework: '12WY',
        timestamp: Date.now()
      }),
      timestamp: Date.now()
    };

    await appendEvent(event);
  }

  /**
   * Publish a Life Wheel domain update event to blackboard
   * Preserves Life Wheel semantics from Life OS metrics
   */
  async handleLifeWheelDomainUpdate(
    domainId: 'ld01' | 'ld02' | 'ld03' | 'ld04' | 'ld05' | 'ld06' | 'ld07' | 'ld08',
    metricChange: number,
    actorId: string
  ): Promise<void> {
    const event: BlackboardEvent = {
      id: crypto.randomUUID(),
      workspace_id: null,
      actor_id: actorId,
      actor_layer: 'life-wheel',
      event_type: 'life_wheel_domain_updated',
      payload_json: JSON.stringify({
        domainId,
        metricChange,
        framework: 'LifeWheel',
        timestamp: Date.now()
      }),
      timestamp: Date.now()
    };

    await appendEvent(event);
  }
}