import { Router } from 'express';
import * as SeasonsController from '../controllers/seasons.controller';
import { auth } from '../middlewares/auth';

const router = Router();

/**
 * Temporadas (para ranking por temporada)
 * - leitura pública
 * - CRUD por ADMIN
 */
router.get('/', SeasonsController.list);
router.get('/:id', SeasonsController.getById);

router.post('/', auth({ roles: ['ADMIN'] }), SeasonsController.create);
router.patch('/:id', auth({ roles: ['ADMIN'] }), SeasonsController.update);
router.delete('/:id', auth({ roles: ['ADMIN'] }), SeasonsController.remove);

/**
 * Ativar/desativar temporada
 */
router.post('/:id/activate', auth({ roles: ['ADMIN'] }), SeasonsController.activate);
router.post('/:id/deactivate', auth({ roles: ['ADMIN'] }), SeasonsController.deactivate);

export default router;