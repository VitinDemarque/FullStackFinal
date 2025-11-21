import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as RankingService from '../services/ranking.service';
import { BadRequestError } from '../utils/httpErrors';

/**
 * GET /ranking/exercise/:exerciseId
 * Obtém o ranking de um exercício
 */
export async function getExerciseRanking(req: Request, res: Response, next: NextFunction) {
  try {
    const { exerciseId } = req.params;
    const { limit, populateUser } = req.query;

    if (!exerciseId) {
      throw new BadRequestError('Exercise ID is required');
    }

    const limitNum = limit ? parseInt(String(limit), 10) : 100;
    const shouldPopulateUser = populateUser === 'true' || populateUser === '1';

    // Validar limite
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 500) {
      throw new BadRequestError('Limit must be between 1 and 500');
    }

    const ranking = await RankingService.getExerciseRanking(
      exerciseId,
      limitNum,
      shouldPopulateUser
    );

    return res.json(ranking);
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /ranking/exercise/:exerciseId/position/:userId
 * Obtém a posição de um usuário específico no ranking de um exercício
 */
export async function getUserPosition(req: Request, res: Response, next: NextFunction) {
  try {
    const { exerciseId, userId } = req.params;

    if (!exerciseId) {
      throw new BadRequestError('Exercise ID is required');
    }

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const position = await RankingService.getUserRankingPosition(exerciseId, userId);

    return res.json({
      exerciseId,
      userId,
      position,
      hasSubmission: position > 0
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /ranking/exercise/:exerciseId/my-position
 * Obtém a posição do usuário autenticado no ranking de um exercício
 */
export async function getMyPosition(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) {
      throw new BadRequestError('User not authenticated');
    }

    const { exerciseId } = req.params;

    if (!exerciseId) {
      throw new BadRequestError('Exercise ID is required');
    }

    const position = await RankingService.getUserRankingPosition(
      exerciseId,
      req.user.user_id
    );

    return res.json({
      exerciseId,
      userId: req.user.user_id,
      position,
      hasSubmission: position > 0
    });
  } catch (err) {
    return next(err);
  }
}

