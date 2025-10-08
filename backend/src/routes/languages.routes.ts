import { Router } from 'express';
import * as LanguagesController from '../controllers/languages.controller';
import { auth } from '../middlewares/auth';

const router = Router();

/**
 * Catálogo de linguagens
 * - listagem pública
 * - CRUD administrativo (ex.: ADMIN)
 */
router.get('/', LanguagesController.list);
router.get('/:id', LanguagesController.getById);

router.post('/', auth({ roles: ['ADMIN'] }), LanguagesController.create);
router.patch('/:id', auth({ roles: ['ADMIN'] }), LanguagesController.update);
router.delete('/:id', auth({ roles: ['ADMIN'] }), LanguagesController.remove);

export default router;