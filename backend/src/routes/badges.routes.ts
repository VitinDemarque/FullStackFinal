import { Router } from 'express';
import * as BadgesController from '../controllers/badges.controller';

const router = Router();

router.get('/', BadgesController.list);
router.get('/:id', BadgesController.getById);

export default router;

