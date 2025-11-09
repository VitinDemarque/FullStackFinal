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

    const authReq = req as AuthenticatedRequest;
    const requestUserId = authReq.user?.user_id;

    const result = await ExercisesService.list({
      q,
      languageId,
      authorId,
      skip,
      limit,
      requestUserId
    });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const requestUserId = authReq.user?.user_id;

    const exercise = await ExercisesService.getById(req.params.id, requestUserId);
    return res.json(exercise);
  } catch (err) {
    return next(err);
  }
}

export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const payload = req.body ?? {};
    const created = await ExercisesService.create(req.user.user_id, payload);
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
    const updated = await ExercisesService.update(req.user.user_id, id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { id } = req.params;
    await ExercisesService.remove(req.user.user_id, id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export async function publish(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const updated = await ExercisesService.publish(req.user.user_id, req.params.id);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function unpublish(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const updated = await ExercisesService.unpublish(req.user.user_id, req.params.id);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function setVisibility(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { isPublic } = req.body ?? {};
    if (typeof isPublic !== 'boolean') {
      throw new BadRequestError('isPublic must be boolean');
    }
    const updated = await ExercisesService.setVisibility(req.user.user_id, req.params.id, isPublic);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function listMine(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const page = parsePagination(req.query);
    const { skip, limit } = toMongoPagination(page);
    const result = await ExercisesService.listByAuthor(req.user.user_id, skip, limit);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function listCommunity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { q, languageId } = req.query as Record<string, string | undefined>;
    const page = parsePagination(req.query);
    const { skip, limit } = toMongoPagination(page);
    
    const result = await ExercisesService.listCommunity({
      q,
      languageId,
      skip,
      limit,
      requestUserId: req.user.user_id
    });
    
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getByCode(req: Request, res: Response, next: NextFunction) {
  try {
    const authReq = req as AuthenticatedRequest;
    const requestUserId = authReq.user?.user_id;

    const exercise = await ExercisesService.getByPublicCode(req.params.code, requestUserId);
    return res.json(exercise);
  } catch (err) {
    return next(err);
  }
}