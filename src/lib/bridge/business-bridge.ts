// Types matching the backend API
export interface LifeToBusinessPayload {
  availableBandwidthBlocks: number;
}

export interface BusinessToLifeResponse {
  cashflowMilestones: any[];
  deadlines: any[];
  status: 'disconnected' | 'connected';
}

const API_BASE_URL = 'http://localhost:3001/api/bridge';

/**
 * Envoie la bande passante disponible à Business OS
 */
export async function sendBandwidthToBusiness(availableBandwidthBlocks: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/life-to-business`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ availableBandwidthBlocks })
    });

    if (!response.ok) {
      console.warn('[Bridge] Echec de la transmission à Business OS', response.statusText);
      return false;
    }

    return true;
  } catch (err) {
    console.warn('[Bridge] Erreur réseau lors de la communication avec Business OS', err);
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
      console.warn('[Bridge] Echec de la récupération des jalons de Business OS', response.statusText);
      return null;
    }

    const data: BusinessToLifeResponse = await response.json();
    return data;
  } catch (err) {
    console.warn('[Bridge] Erreur réseau lors de la communication avec Business OS', err);
    return null;
  }
}
