const PROXY_URL = 'http://localhost:3002/api/jules';

export interface JulesSession {
    id: string;
    status: string;
    url?: string;
    [key: string]: any;
}

export interface JulesQuota {
    max: number;
    remaining: number | null; // null represents "unknown"
}

export interface ListSessionsResponse {
    sessions: JulesSession[];
    quota?: JulesQuota;
}

export interface CreateSessionOptions {
    autoCreatePr?: boolean;
    requirePlanApproval?: boolean;
    prompt?: string;
    [key: string]: any;
}

export class JulesApiClient {
    private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${PROXY_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {}),
            },
        });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (e) {
                // Ignore parse errors for error responses
            }
            throw new Error(errorMessage);
        }

        return response.json();
    }

    static async createSession(options: CreateSessionOptions): Promise<JulesSession> {
        return this.request<JulesSession>('/sessions', {
            method: 'POST',
            body: JSON.stringify(options),
        });
    }

    static async listSessions(): Promise<ListSessionsResponse> {
        return this.request<ListSessionsResponse>('/sessions', {
            method: 'GET',
        });
    }

    static async approvePlan(sessionId: string): Promise<{ status: string }> {
        return this.request<{ status: string }>(`/sessions/${sessionId}/approve`, {
            method: 'POST',
        });
    }

    static async sendMessage(sessionId: string, message: string): Promise<{ id: string, status: string }> {
        return this.request<{ id: string, status: string }>(`/sessions/${sessionId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    }
}
