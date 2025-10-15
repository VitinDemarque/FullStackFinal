import { Router } from 'express';
import * as ForumController from '../controllers/forum.controller';
import { auth } from '../middlewares/auth';

const router = Router();

// Get todos os foruns
router.get('/', ForumController.getAll);

// Get foruns por pesquisa
router.get('/search', ForumController.search);

// Get forum por ID
router.get('/:id', ForumController.getById);

// Criação de fórum
router.post('/', auth(), ForumController.create);

// Atualizar forum
router.patch('/:id', auth(), ForumController.update);

// Deletar forum
router.delete('/:id', auth(), ForumController.remove);

export default router;