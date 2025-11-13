import { Request, Response } from 'express';
import * as BRUniversitiesService from '../services/brUniversities.service';

export async function search(req: Request, res: Response) {
  const { q, state, city, limit } = req.query;
  const result = BRUniversitiesService.search({
    q: typeof q === 'string' ? q : undefined,
    state: typeof state === 'string' ? state : undefined,
    city: typeof city === 'string' ? city : undefined,
    limit: typeof limit === 'string' ? parseInt(limit, 10) : undefined,
  });
  res.json(result);
}