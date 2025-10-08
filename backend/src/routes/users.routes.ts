import { Router } from 'express';
import * as UsersController from '../controllers/users.controller';
import { auth, requireOwnership } from '../middlewares/auth';

const router = Router();

/**
 * Perfil do usuário
 */
router.get('/me', auth(), UsersController.getMe);
router.patch('/me', auth(), UsersController.updateMe);

/**
 * Recursos por ID (admin ou dono)
 */
router.get('/:id', auth(), UsersController.getById);
router.patch('/:id', auth(), requireOwnership('id'), UsersController.updateById);

/**
 * Exibir perfil público (exercícios públicos, badges, títulos, nível)
 */
router.get('/:id/profile', UsersController.getPublicProfile);

/**
 * Scoreboard do perfil (contadores de criados/concluídos)
 */
router.get('/:id/scoreboard', UsersController.getProfileScoreboard);

export default router;
