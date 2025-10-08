import { Request, Response, NextFunction } from 'express';
import * as SeasonsService from '../services/seasons.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parsePagination(req.query, { page: 1, limit: 50 }, 100);
    const { skip, limit } = toMongoPagination(page);
    const result = await SeasonsService.list({ skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const season = await SeasonsService.getById(req.params.id);
    return res.json(season);
  } catch (err) {
    return next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, startDate, endDate } = req.body ?? {};
    if (!name || !startDate || !endDate) throw new BadRequestError('name, startDate and endDate are required');
    const created = await SeasonsService.create({ name, startDate, endDate });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body ?? {};
    const updated = await SeasonsService.update(req.params.id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await SeasonsService.remove(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export async function activate(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await SeasonsService.activate(req.params.id);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await SeasonsService.deactivate(req.params.id);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}