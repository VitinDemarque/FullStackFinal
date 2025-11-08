import { apiRequest } from './api'

type Paginated<T> = {
  items: T[];
  total: number;
};

export type Submission = {
  id: string;
  exerciseId: string;
  userId: string;
  createdAt: string;
};

const submissionsService = {
  async countByExercise(exerciseId: string): Promise<number> {
    const data = await apiRequest<Paginated<Submission>>(
      'GET',
      `/submissions/exercise/${exerciseId}`,
      undefined,
      { params: { page: 1, limit: 1 } }
    )
    return data?.total ?? (Array.isArray(data?.items) ? data.items.length : 0)
  },
}

export default submissionsService