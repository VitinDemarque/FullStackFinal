import { Router } from 'express';
import * as SubmissionsController from '../controllers/submissions.controller';
import { auth } from '../middlewares/auth';

const router = Router();

/**
 * Resolver exercício / criar submissão
 */
router.post('/', auth(), SubmissionsController.create); // body: { exerciseId, code?, score?, timeSpentMs? }

/**
 * Minhas submissões (histórico)
 */
router.get('/me', auth(), SubmissionsController.listMySubmissions);

/**
 * Submissões por exercício (pública ou restrita conforme regra)
 */
router.get('/exercise/:exerciseId', auth(), SubmissionsController.listByExercise);

/**
 * Submissão específica
 */
router.get('/:id', auth(), SubmissionsController.getById);

export default router;