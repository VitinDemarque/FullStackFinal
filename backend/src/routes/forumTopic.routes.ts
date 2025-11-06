import { Router } from 'express'
import * as ForumTopicController from '../controllers/forumTopic.controller'
import { auth } from '../middlewares/auth'

const router = Router()

// Listar tópicos por fórum
router.get('/forum/:forumId', ForumTopicController.listarPorForum)

// Contar tópicos por fórum
router.get('/forum/:forumId/count', ForumTopicController.contarPorForum)

// Obter tópico por ID
router.get('/:id', ForumTopicController.obterPorId)

// Criar tópico (autenticado)
router.post('/forum/:forumId', auth(), ForumTopicController.criar)

// Atualizar tópico (autenticado: autor/dono/moderador)
router.patch('/:id', auth(), ForumTopicController.atualizar)

// Excluir tópico (autenticado: autor/dono/moderador)
router.delete('/:id', auth(), ForumTopicController.excluir)

export default router