import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as StatsService from '../services/stats.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function listExerciseStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { exerciseId } = req.query as Record<string, string | undefined>;
    const page = parsePagination(req.query, { page: 1, limit: 50 }, 100);
    const { skip, limit } = toMongoPagination(page);

    const result = await StatsService.listExerciseStats({ exerciseId, skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getUserStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    if (!userId) throw new BadRequestError('userId param is required');
    const result = await StatsService.getUserStats(userId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getPublicStats(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await StatsService.getPublicStats();
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}