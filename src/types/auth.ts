// src/types/auth.ts
export interface ASpaceSession {
  userId: string;
  email: string;
  accessToken: string;
  expiresAt: number;
  isAdmiral: boolean;
}

export interface AuthState {
  session: ASpaceSession | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContract {
  getCurrentUserId(): Promise<string | null>;
  isSessionValid(): boolean;
  onSessionChange(cb: (s: ASpaceSession | null) => void): () => void;
}
