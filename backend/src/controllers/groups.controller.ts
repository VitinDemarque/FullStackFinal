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

export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const payload = req.body ?? {};
    const created = await GroupsService.create(req.user.user_id, payload);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { id } = req.params;
    const payload = req.body ?? {};
    const updated = await GroupsService.update(req.user.user_id, id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    await GroupsService.remove(req.user.user_id, req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}
