import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as UsersService from '../services/users.service';
import * as StatsService from '../services/stats.service';
import { BadRequestError, NotFoundError } from '../utils/httpErrors';
import { parsePagination, toMongoPagination } from '../utils/pagination';

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new NotFoundError('User not in token');
    const user = await UsersService.getById(req.user.user_id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

export async function updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new NotFoundError('User not in token');
    const payload = req.body ?? {};
    const updated = await UsersService.updateById(req.user.user_id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await UsersService.getById(id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}