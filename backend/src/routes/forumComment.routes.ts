import { Router } from 'express'
import * as ForumCommentController from '../controllers/forumComment.controller'
import { auth } from '../middlewares/auth'

const router = Router()

// Listar comentários por tópico
router.get('/topic/:topicId', ForumCommentController.listarPorTopico)

// Obter comentário por ID
router.get('/:id', ForumCommentController.obterPorId)

// Criar comentário (autenticado)
router.post('/topic/:topicId', auth(), ForumCommentController.criar)

// Atualizar comentário (autenticado)
router.patch('/:id', auth(), ForumCommentController.atualizar)

// Excluir comentário (autenticado)
router.delete('/:id', auth(), ForumCommentController.excluir)

export default router