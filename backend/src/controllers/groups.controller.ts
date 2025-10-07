import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as GroupsService from '../services/groups.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parsePagination(req.query);
    const { skip, limit } = toMongoPagination(page);
    const result = await GroupsService.listPublic({ skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const group = await GroupsService.getById(req.params.id);
    return res.json(group);
  } catch (err) {
    return next(err);
  }
}
