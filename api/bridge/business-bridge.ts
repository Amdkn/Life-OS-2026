import { Router, Request, Response } from 'express';

export const businessBridgeRouter = Router();

// Types for the payload exchanged
export interface LifeToBusinessPayload {
  availableBandwidthBlocks: number;
}

export interface BusinessToLifeResponse {
  cashflowMilestones: any[];
  deadlines: any[];
  status: 'disconnected' | 'connected';
}

/**
 * POST /api/bridge/life-to-business
 * Transmission de la capacité de bande passante (Strategic Time Blocks disponibles).
 */
businessBridgeRouter.post('/life-to-business', (req: Request, res: Response) => {
  const payload = req.body as Partial<LifeToBusinessPayload>;

  if (typeof payload.availableBandwidthBlocks !== 'number') {
    res.status(400).json({ error: 'availableBandwidthBlocks is required and must be a number' });
    return;
  }

  // En l'absence de Business OS branché, on accuse réception sans effet secondaire
  res.status(200).json({ success: true, received: payload.availableBandwidthBlocks });
});

/**
 * GET /api/bridge/business-to-life
 * Réception des jalons critiques de cash-flow et deadlines clients pour alimenter W1-W12.
 */
businessBridgeRouter.get('/business-to-life', (req: Request, res: Response) => {
  // Conformément aux consignes: "aucun jalon cash-flow fabrique si la source Business OS n'est pas branchée (retourner vide explicite)"
  const response: BusinessToLifeResponse = {
    cashflowMilestones: [],
    deadlines: [],
    status: 'disconnected'
  };

  res.status(200).json(response);
});
