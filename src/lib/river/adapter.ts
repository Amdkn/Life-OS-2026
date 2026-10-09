import { CapabilityRequest, EffectReceipt } from '../../types/capabilities.js';
import { sendBandwidthToBusiness, fetchBusinessMilestones } from '../api/client.js';

export class RiverBusinessAdapter {
    async handleRequest(request: CapabilityRequest, token?: string): Promise<EffectReceipt> {
        if (request.type === 'business.bandwidth.update') {
            const success = await sendBandwidthToBusiness(request.payload as any, token);
            return {
                request_id: request.id,
                status: success ? 'SUCCESS' : 'FAILED',
                adapter: 'river-business-adapter',
                timestamp: Date.now()
            };
        }

        if (request.type === 'business.milestones.fetch') {
            const data = await fetchBusinessMilestones(token);
            return {
                request_id: request.id,
                status: data ? 'SUCCESS' : 'FAILED',
                adapter: 'river-business-adapter',
                timestamp: Date.now(),
                evidence: data
            };
        }

        return {
            request_id: request.id,
            status: 'UNKNOWN',
            adapter: 'river-business-adapter',
            timestamp: Date.now()
        };
    }
}
