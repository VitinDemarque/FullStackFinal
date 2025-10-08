import { Router } from 'express';
import * as StatsController from '../controllers/stats.controller';
import { auth } from '../middlewares/auth';

const router = Router();

/**
 * Estatísticas agregadas
 * - ExerciseStat (pública)
 * - UserStat (requer auth para dados sensíveis do próprio user)
 */
router.get('/exercises', StatsController.listExerciseStats);          // ?exerciseId=...
router.get('/users/:userId', auth(), StatsController.getUserStats);   // scoreboard do perfil

export default router;