import { Router } from 'express';
import * as UsersController from '../controllers/users.controller';
import { auth, requireOwnership } from '../middlewares/auth';

const router = Router();

// Perfil do usuário
router.get('/me', auth(), UsersController.getMe);
router.patch('/me', auth(), UsersController.updateMe);
router.post('/me/password', auth(), UsersController.changeMyPassword);
router.delete('/me', auth(), UsersController.deleteMe);

// Rotas específicas por ID (devem vir antes da rota genérica /:id)
// Exibir perfil público (exercícios públicos, badges, títulos, nível)
router.get('/:id/profile', UsersController.getPublicProfile);

// Scoreboard do perfil (contadores de criados/concluídos)
router.get('/:id/scoreboard', UsersController.getProfileScoreboard);

// Badges do usuário
router.get('/:id/badges', UsersController.getUserBadges);

// Recursos por ID (admin ou dono) - deve vir por último
router.get('/:id', auth(), UsersController.getById);
router.patch('/:id', auth(), requireOwnership('id'), UsersController.updateById);

export default router;