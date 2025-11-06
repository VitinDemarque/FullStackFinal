import { Request, Response, NextFunction } from 'express';
import * as BadgesService from '../services/badges.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';

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

