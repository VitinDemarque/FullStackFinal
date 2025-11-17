import { Router } from 'express';
import { auth } from '../middlewares/auth';
import * as AttemptsController from '../controllers/attempts.controller';

const router = Router();

router.get('/:exerciseId', auth(), AttemptsController.getMine);
router.post('/', auth(), AttemptsController.upsert);
router.delete('/:exerciseId', auth(), AttemptsController.remove);

export default router;

