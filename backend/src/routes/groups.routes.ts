import { Router } from 'express';
import * as GroupsController from '../controllers/groups.controller';
import { auth } from '../middlewares/auth';

const router = Router();

/**
 * CRUD de grupos
 */
router.get('/', GroupsController.listPublic);        // listar públicos
router.get('/:id', auth(), GroupsController.getById);

router.post('/', auth(), GroupsController.create);   // cria grupo (owner = req.user.sub)
router.patch('/:id', auth(), GroupsController.update); // somente owner/moderador
router.delete('/:id', auth(), GroupsController.remove);

/**
 * Membros
 */
router.post('/:id/join', auth(), GroupsController.join);     // entrar em grupo (regras conforme visibilidade)
router.post('/:id/leave', auth(), GroupsController.leave);   // sair

router.post('/:id/members/:userId', auth(), GroupsController.addMember);    // owner/mod
router.delete('/:id/members/:userId', auth(), GroupsController.removeMember); // owner/mod

/**
 * Papéis
 */
router.post('/:id/members/:userId/role', auth(), GroupsController.setMemberRole); // body: { role: 'MEMBER' | 'MODERATOR' }

export default router;