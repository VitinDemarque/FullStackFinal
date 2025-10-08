import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as SubmissionsService from '../services/submissions.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { exerciseId, code, score, timeSpentMs } = req.body ?? {};
    if (!exerciseId) throw new BadRequestError('exerciseId is required');

    const created = await SubmissionsService.create({
      userId: req.user.user_id,
      exerciseId,
      code,
      score,
      timeSpentMs,
    });

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function listMySubmissions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const page = parsePagination(req.query);
    const { skip, limit } = toMongoPagination(page);

    const result = await SubmissionsService.listByUser(req.user.user_id, { skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function listByExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { exerciseId } = req.params;
    const page = parsePagination(req.query);
    const { skip, limit } = toMongoPagination(page);

    const result = await SubmissionsService.listByExercise(exerciseId, { skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const submission = await SubmissionsService.getById(req.params.id);
    return res.json(submission);
  } catch (err) {
    return next(err);
  }
}