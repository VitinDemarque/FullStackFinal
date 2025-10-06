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

