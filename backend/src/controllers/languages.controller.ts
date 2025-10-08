import { Request, Response, NextFunction } from 'express';
import * as LanguagesService from '../services/languages.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parsePagination(req.query, { page: 1, limit: 100 }, 200);
    const { skip, limit } = toMongoPagination(page);
    const result = await LanguagesService.list({ skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const language = await LanguagesService.getById(req.params.id);
    return res.json(language);
  } catch (err) {
    return next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, slug } = req.body ?? {};
    if (!name || !slug) throw new BadRequestError('name and slug are required');
    const created = await LanguagesService.create({ name, slug });
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.body ?? {};
    const updated = await LanguagesService.update(req.params.id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await LanguagesService.remove(req.params.id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}