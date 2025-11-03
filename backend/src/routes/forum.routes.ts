import { Router } from 'express'
import * as ForumController from '../controllers/forum.controller'
import { auth } from '../middlewares/auth'

const router = Router()

// Listar fóruns públicos
router.get('/foruns', ForumController.listarPublicos)

// Listar fóruns aleatórios (exibição na home)
router.get('/aleatorios', ForumController.listarAleatorios)

// Pesquisar fóruns
router.get('/pesquisar', ForumController.pesquisar)

// Listar fóruns em que o usuário participa
router.get('/meus', auth(), ForumController.listarMeus)

// Obter fórum por ID
router.get('/:id', ForumController.obterPorId)

// Participar de um fórum
router.post('/:id/participar', auth(), ForumController.participar)

// Criar novo fórum
router.post('/', auth(), ForumController.criar)

// Atualizar fórum
router.patch('/:id', auth(), ForumController.atualizar)

// Excluir fórum
router.delete('/:id', auth(), ForumController.excluir)

export default router