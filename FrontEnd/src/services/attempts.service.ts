import { apiRequest } from './api';

export type ChallengeAttemptStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface ChallengeAttempt {
  id: string;
  userId: string;
  exerciseId: string;
  code: string;
  timeSpentMs: number;
  status: ChallengeAttemptStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertAttemptRequest {
  exerciseId: string;
  code?: string;
  timeSpentMs?: number;
  status?: ChallengeAttemptStatus;
}

const attemptsService = {
  async getCurrent(exerciseId: string): Promise<ChallengeAttempt | null> {
    return apiRequest<ChallengeAttempt | null>('GET', `/attempts/${exerciseId}`);
  },

  async saveAttempt(payload: UpsertAttemptRequest): Promise<ChallengeAttempt | null> {
    return apiRequest<ChallengeAttempt | null>('POST', '/attempts', payload);
  },

  async deleteAttempt(exerciseId: string): Promise<void> {
    await apiRequest<void>('DELETE', `/attempts/${exerciseId}`);
  },
};

export default attemptsService;

