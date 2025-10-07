import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as ExercisesService from '../services/exercises.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, languageId, authorId } = req.query as Record<string, string | undefined>;
    const page = parsePagination(req.query);
    const { skip, limit } = toMongoPagination(page);

    const result = await ExercisesService.list({
      q,
      languageId,
      authorId,
      skip,
      limit,
    });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const exercise = await ExercisesService.getById(req.params.id);
    return res.json(exercise);
  } catch (err) {
    return next(err);
  }
}
