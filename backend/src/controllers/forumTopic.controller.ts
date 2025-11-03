import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../middlewares/auth'
import * as TopicService from '../services/forumTopic.service'

// Listar tópicos de um fórum (público)
export async function listarPorForum(req: Request, res: Response, next: NextFunction) {
  try {
    const { forumId } = req.params
    const topicos = await TopicService.listarPorForum(forumId, req.query)
    return res.json(topicos)
  } catch (err) {
    return next(err)
  }
}

// Obter tópico por ID (público)
export async function obterPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const topico = await TopicService.obterPorId(id)
    return res.json(topico)
  } catch (err) {
    return next(err)
  }
}

// Criar tópico (autenticado)
export async function criar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { forumId } = req.params
    const userId = req.user?.user_id
    if (!userId) return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const criado = await TopicService.criar(forumId, userId, req.body)
    return res.status(201).json(criado)
  } catch (err) {
    return next(err)
  }
}

// Atualizar tópico (autor/dono/moderador)
export async function atualizar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const userId = req.user?.user_id
    if (!userId) return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const atualizado = await TopicService.atualizar(id, userId, req.body)
    return res.json(atualizado)
  } catch (err) {
    return next(err)
  }
}

// Excluir tópico (autor/dono/moderador)
export async function excluir(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const userId = req.user?.user_id
    if (!userId) return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const resp = await TopicService.excluir(id, userId)
    return res.json(resp)
  } catch (err) {
    return next(err)
  }
}