import { Router } from 'express';
import * as RankingController from '../controllers/ranking.controller';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/exercise/:exerciseId', RankingController.getExerciseRanking);
router.get('/exercise/:exerciseId/position/:userId', RankingController.getUserPosition);
router.get('/exercise/:exerciseId/my-position', auth(), RankingController.getMyPosition);

export default router;

