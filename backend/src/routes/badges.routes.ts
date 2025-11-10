import { Router } from 'express';
import * as BadgesController from '../controllers/badges.controller';
import { auth } from '../middlewares/auth';

const router = Router();

router.get('/', BadgesController.list);
router.get('/:id', BadgesController.getById);

// Admin-only management routes
router.post('/', auth({ roles: ['ADMIN'] }), BadgesController.create);
router.patch('/:id', auth({ roles: ['ADMIN'] }), BadgesController.update);
router.delete('/:id', auth({ roles: ['ADMIN'] }), BadgesController.remove);

export default router;

