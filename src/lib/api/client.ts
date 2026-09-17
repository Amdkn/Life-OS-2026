import { z } from 'zod';

const API_BASE_URL = 'http://127.0.0.1:3001/api/bridge';

export const LifeToBusinessPayloadSchema = z.object({
  availableBandwidthBlocks: z.number().min(0)
});

export type LifeToBusinessPayload = z.infer<typeof LifeToBusinessPayloadSchema>;

export const BusinessToLifeResponseSchema = z.object({
  cashflowMilestones: z.array(z.any()),
  deadlines: z.array(z.any()),
  status: z.union([z.literal('disconnected'), z.literal('connected')])
});

export type BusinessToLifeResponse = z.infer<typeof BusinessToLifeResponseSchema>;

/**
 * Envoie la bande passante disponible à Business OS via le harnais local
 */
export async function sendBandwidthToBusiness(payload: LifeToBusinessPayload): Promise<boolean> {
  try {
    const validatedPayload = LifeToBusinessPayloadSchema.parse(payload);

    const response = await fetch(`${API_BASE_URL}/life-to-business`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validatedPayload)
    });

    if (!response.ok) {
      console.warn('[API Client] Echec de la transmission à Business OS', response.statusText);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[API Client] Erreur lors de la communication avec Business OS', err);
    return false;
  }
}

/**
 * Récupère les jalons et deadlines depuis Business OS
 */
export async function fetchBusinessMilestones(): Promise<BusinessToLifeResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/business-to-life`);

    if (!response.ok) {
      console.warn('[API Client] Echec de la récupération des jalons de Business OS', response.statusText);
      return null;
    }

    const data = await response.json();

    // Validate output with Zod
    const validatedData = BusinessToLifeResponseSchema.parse(data);
    return validatedData;
  } catch (err) {
    console.warn('[API Client] Erreur lors de la communication avec Business OS', err);
    return null;
  }
}
