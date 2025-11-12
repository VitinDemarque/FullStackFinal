import { Request, Response, NextFunction } from 'express';
import * as CollegesService from '../services/colleges.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parsePagination(req.query, { page: 1, limit: 100 }, 200);
    const { skip, limit } = toMongoPagination(page);
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const result = await CollegesService.list({ skip, limit }, q);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const college = await CollegesService.getById(req.params.id);
    return res.json(college);
  } catch (err) {
    return next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, acronym, city, state } = req.body ?? {};
    if (!name) throw new BadRequestError('name is required');
    const created = await CollegesService.create({ name, acronym, city, state });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body ?? {};
    const updated = await CollegesService.update(req.params.id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await CollegesService.remove(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}