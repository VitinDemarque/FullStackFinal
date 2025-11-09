import { Router } from 'express';
import * as ExercisesController from '../controllers/exercises.controller';
import { auth } from '../middlewares/auth';

const router = Router();

/**
 * CRUD de exercícios
 */
router.get('/', ExercisesController.list);                    // listar exercícios
router.get('/mine', auth(), ExercisesController.listMine);    // listar meus exercícios
router.get('/community', auth(), ExercisesController.listCommunity);  // listar desafios da comunidade (outros usuários)
router.get('/code/:code', ExercisesController.getByCode);     // buscar por código público
router.get('/:id', ExercisesController.getById);             // buscar por ID

router.post('/', auth(), ExercisesController.create);        // criar exercício
router.patch('/:id', auth(), ExercisesController.update);    // atualizar exercício
router.delete('/:id', auth(), ExercisesController.remove);    // deletar exercício

/**
 * Publicação e visibilidade
 */
router.post('/:id/publish', auth(), ExercisesController.publish);     // publicar exercício
router.post('/:id/unpublish', auth(), ExercisesController.unpublish); // despublicar exercício
router.patch('/:id/visibility', auth(), ExercisesController.setVisibility); // alterar visibilidade

export default router;