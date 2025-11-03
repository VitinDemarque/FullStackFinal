import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../middlewares/auth'
import * as CommentService from '../services/forumComment.service'

// Listar comentários de um tópico (público)
export async function listarPorTopico(req: Request, res: Response, next: NextFunction) {
  try {
    const { topicId } = req.params
    const comentarios = await CommentService.listarPorTopico(topicId, req.query)
    return res.json(comentarios)
  } catch (err) {
    return next(err)
  }
}

// Obter comentário por ID (público)
export async function obterPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const comentario = await CommentService.obterPorId(id)
    return res.json(comentario)
  } catch (err) {
    return next(err)
  }
}

// Criar comentário (autenticado)
export async function criar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { topicId } = req.params
    const userId = req.user?.user_id
    if (!userId) return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const criado = await CommentService.criar(topicId, userId, req.body)
    return res.status(201).json(criado)
  } catch (err) {
    return next(err)
  }
}

// Atualizar comentário (autor/dono/moderador)
export async function atualizar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const userId = req.user?.user_id
    if (!userId) return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const atualizado = await CommentService.atualizar(id, userId, req.body)
    return res.json(atualizado)
  } catch (err) {
    return next(err)
  }
}

// Excluir comentário (autor/dono/moderador)
export async function excluir(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const userId = req.user?.user_id
    if (!userId) return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const resp = await CommentService.excluir(id, userId)
    return res.json(resp)
  } catch (err) {
    return next(err)
  }
}