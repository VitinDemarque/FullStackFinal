import { Request, Response, NextFunction } from 'express';
import * as LeaderboardsService from '../services/leaderboards.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function getGeneralLeaderboard(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parsePagination(req.query, { page: 1, limit: 50 }, 100);
    const { skip, limit } = toMongoPagination(page);
    const result = await LeaderboardsService.general({ skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getByLanguage(req: Request, res: Response, next: NextFunction) {
  try {
    const { languageId } = req.query as Record<string, string | undefined>;
    if (!languageId) throw new BadRequestError('languageId is required');
    const page = parsePagination(req.query, { page: 1, limit: 50 }, 100);
    const { skip, limit } = toMongoPagination(page);
    const result = await LeaderboardsService.byLanguage(languageId, { skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getBySeason(req: Request, res: Response, next: NextFunction) {
  try {
    const { seasonId } = req.query as Record<string, string | undefined>;
    if (!seasonId) throw new BadRequestError('seasonId is required');
    const page = parsePagination(req.query, { page: 1, limit: 50 }, 100);
    const { skip, limit } = toMongoPagination(page);
    const result = await LeaderboardsService.bySeason(seasonId, { skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getByCollege(req: Request, res: Response, next: NextFunction) {
  try {
    const { collegeId } = req.query as Record<string, string | undefined>;
    if (!collegeId) throw new BadRequestError('collegeId is required');
    const page = parsePagination(req.query, { page: 1, limit: 50 }, 100);
    const { skip, limit } = toMongoPagination(page);
    const result = await LeaderboardsService.byCollege(collegeId, { skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getByGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const { groupId } = req.query as Record<string, string | undefined>;
    if (!groupId) throw new BadRequestError('groupId is required');
    const page = parsePagination(req.query, { page: 1, limit: 50 }, 100);
    const { skip, limit } = toMongoPagination(page);
    const result = await LeaderboardsService.byGroup(groupId, { skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getByExercise(req: Request, res: Response, next: NextFunction) {
  try {
    const { exerciseId } = req.query as Record<string, string | undefined>;
    if (!exerciseId) throw new BadRequestError('exerciseId is required');
    const page = parsePagination(req.query, { page: 1, limit: 50 }, 100);
    const { skip, limit } = toMongoPagination(page);
    const result = await LeaderboardsService.byExercise(exerciseId, { skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}