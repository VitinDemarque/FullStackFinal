import { Request, Response, NextFunction } from 'express';
import * as BadgesService from '../services/badges.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parsePagination(req.query, { page: 1, limit: 100 }, 200);
        const { skip, limit } = toMongoPagination(page);
        const result = await BadgesService.list({ skip, limit });
        return res.json(result);
    } catch (err) {
        return next(err);
    }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const badge = await BadgesService.getById(req.params.id);
    return res.json(badge);
  } catch (err) {
    return next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, iconUrl, ruleCode, isTriumphant, linkedExerciseId } = req.body ?? {};
    if (!name || typeof name !== 'string') {
      throw new BadRequestError('Badge name is required');
    }
    const payload: any = {
      name,
      description: description ?? undefined,
      iconUrl: iconUrl ?? undefined,
      ruleCode: ruleCode ?? undefined,
      isTriumphant: Boolean(isTriumphant ?? false),
      linkedExerciseId: linkedExerciseId || undefined
    };
    const created = await BadgesService.create(payload);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const payload = req.body ?? {};
    const updated = await BadgesService.update(id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await BadgesService.remove(id);
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}

