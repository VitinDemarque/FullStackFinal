import { Router } from 'express';
import * as CollegesController from '../controllers/colleges.controller';
import { auth } from '../middlewares/auth';

const router = Router();

/**
 * Faculdades (para ranking por faculdade)
 * - leitura pública
 * - CRUD por ADMIN
 */
router.get('/', CollegesController.list);
router.get('/:id', CollegesController.getById);

// Permitir que qualquer usuário autenticado crie faculdades
router.post('/', auth(), CollegesController.create);
router.patch('/:id', auth({ roles: ['ADMIN'] }), CollegesController.update);
router.delete('/:id', auth({ roles: ['ADMIN'] }), CollegesController.remove);

export default router;