import { Router } from 'express';
import * as LeaderboardsController from '../controllers/leaderboards.controller';

/**
 * Rankings:
 * - Geral
 * - Por linguagem
 * - Por temporada
 * - Por faculdade
 */
const router = Router();

router.get('/general', LeaderboardsController.getGeneralLeaderboard);
/**
 * /by-language?languageId=...&page=1&limit=50
 */
router.get('/by-language', LeaderboardsController.getByLanguage);
/**
 * /by-season?seasonId=...&page=1&limit=50
 */
router.get('/by-season', LeaderboardsController.getBySeason);
/**
 * /by-college?collegeId=...&page=1&limit=50
 */
router.get('/by-college', LeaderboardsController.getByCollege);

export default router;