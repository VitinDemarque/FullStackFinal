import { Router } from 'express';
import * as UsersController from '../controllers/users.controller';
import { auth, requireOwnership } from '../middlewares/auth';

const router = Router();

// Perfil do usuário
router.get('/me', auth(), UsersController.getMe);
router.patch('/me', auth(), UsersController.updateMe);
router.post('/me/avatar', auth(), UsersController.uploadMyAvatar);
router.post('/me/password', auth(), UsersController.changeMyPassword);
// Atualiza/contabiliza streak de login do usuário autenticado
router.post('/me/login-streak/ping', auth(), UsersController.pingLoginStreak);
// Missão: 3 desafios concluídos em menos de 24 horas
router.post('/me/missions/three-solves-24h/check', auth(), UsersController.checkMissionThreeSolves24h);
// Missões de tempo e perfeição
router.post('/me/missions/solve-under-1m/check', auth(), UsersController.checkMissionSolveUnderOneMinute);
router.post('/me/missions/perfect-score/check', auth(), UsersController.checkMissionPerfectScore);
router.delete('/me', auth(), UsersController.deleteMe);

// Rotas específicas por ID (devem vir antes da rota genérica /:id)
// Exibir perfil público (exercícios públicos, badges, títulos, nível)
router.get('/:id/profile', UsersController.getPublicProfile);

// Scoreboard do perfil (contadores de criados/concluídos)
router.get('/:id/scoreboard', UsersController.getProfileScoreboard);

// Badges do usuário
router.get('/:id/badges', UsersController.getUserBadges);
router.post('/:id/badges/check', UsersController.checkAndAwardBadges);

// Titles do usuário
router.get('/:id/titles', UsersController.getUserTitles);

// Recursos por ID (admin ou dono) - deve vir por último
router.get('/:id', auth(), UsersController.getById);
router.patch('/:id', auth(), requireOwnership('id'), UsersController.updateById);

export default router;