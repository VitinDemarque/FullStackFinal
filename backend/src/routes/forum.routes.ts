import { Router } from 'express';
import * as ForumController from '../controllers/forum.controller';
import { auth } from '../middlewares/auth';

const router = Router();

// Get foruns publicos
router.get('/foruns', ForumController.listarPublicos);

// Get forum aleatorio (para exibir na página inicial)
router.get('/aleatorios', ForumController.listarAleatorios);

// Get foruns por pesquisa
router.get('/pesquisar', ForumController.pesquisar);

// Get forum por ID
router.get('/:id', ForumController.obterPorId);

// Criação de fórum
router.post('/', auth(), ForumController.criar);

// Atualizar forum
router.patch('/:id', auth(), ForumController.atualizar);

// Deletar forum
router.delete('/:id', auth(), ForumController.excluir);

export default router;