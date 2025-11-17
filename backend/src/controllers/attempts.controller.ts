import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { BadRequestError } from '../utils/httpErrors';
import * as AttemptsService from '../services/attempts.service';

export async function getMine(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { exerciseId } = req.params;
    if (!exerciseId) throw new BadRequestError('exerciseId is required');

    const attempt = await AttemptsService.getAttempt(req.user.user_id, exerciseId);
    return res.json(attempt);
  } catch (err) {
    return next(err);
  }
}

export async function upsert(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { exerciseId, code, timeSpentMs, status } = req.body ?? {};
    if (!exerciseId) throw new BadRequestError('exerciseId is required');

    const attempt = await AttemptsService.upsertAttempt({
      userId: req.user.user_id,
      exerciseId,
      code,
      timeSpentMs,
      status,
    });

    return res.json(attempt);
  } catch (err) {
    return next(err);
  }
}

export async function remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { exerciseId } = req.params;
    if (!exerciseId) throw new BadRequestError('exerciseId is required');

    await AttemptsService.deleteAttempt(req.user.user_id, exerciseId);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

