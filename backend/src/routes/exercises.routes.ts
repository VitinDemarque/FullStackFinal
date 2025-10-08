import { Router } from 'express';
import * as ExercisesController from '../controllers/exercises.controller';
import { auth, requireOwnership } from '../middlewares/auth';

const router = Router();

/**
 * Listagem pública / busca
 */
router.get('/', ExercisesController.list);               // ?q=&languageId=&authorId=&page=&limit=
router.get('/:id', ExercisesController.getById);

/**
 * Ações do autor
 */
router.post('/', auth(), ExercisesController.create);    // cria com codeTemplate e isPublic
router.patch('/:id', auth(), ExercisesController.update); // valida ownership dentro do controller (ou usar requireOwnership com /users/:id)
router.delete('/:id', auth(), ExercisesController.remove);

/**
 * Publicar / alterar visibilidade
 */
router.post('/:id/publish', auth(), ExercisesController.publish);
router.post('/:id/unpublish', auth(), ExercisesController.unpublish);
router.post('/:id/visibility', auth(), ExercisesController.setVisibility); // body: { isPublic: boolean }

/**
 * Exercícios do usuário logado
 */
router.get('/me/mine', auth(), ExercisesController.listMine);

export default router;