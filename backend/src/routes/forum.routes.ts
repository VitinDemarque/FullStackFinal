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

// Listar participantes (público)
router.get('/:id/participantes', ForumController.listarParticipantes)



// Participar de um fórum
router.post('/:id/participar', auth(), ForumController.participar)

// Sair do fórum (autenticado)
router.post('/:id/sair', auth(), ForumController.sair)

// Criar novo fórum
router.post('/', auth(), ForumController.criar)

// Atualizar fórum
router.patch('/:id', auth(), ForumController.atualizar)

// Excluir fórum
router.delete('/:id', auth(), ForumController.excluir)



// Listar moderadores do forum
router.get('/:id/moderadores', ForumController.listarModeradores)

// Adicionar moderador
router.post('/:id/moderadores', auth(), ForumController.adicionarModerador)

// Remover moderador
router.delete('/:id/moderadores/:userId', auth(), ForumController.removerModerador)

// Transferir dono (autenticado, dono)
router.post('/:id/transferir-dono', auth(), ForumController.transferirDono)



// Gerar link de compartilhamento (dono/moderador)
router.get('/:id/compartilhar', auth(), ForumController.compartilhar)

// Entrar via link/token público
router.post('/:id/entrar-por-token', auth(), ForumController.entrarPorToken)

export default router