import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as ForumService from '../services/forum.service';

// Buscar foruns publicos
export async function listarPublicos(req: Request, res: Response, next: NextFunction) {
  try {
    const foruns = await ForumService.listarPublicos(req.query);
    return res.json(foruns);
  } catch (err) {
    return next(err);
  }
}

// Buscar fóruns aleatórios (para exibir na página inicial)
export async function listarAleatorios(req: Request, res: Response, next: NextFunction) {
  try {
    const foruns = await ForumService.listarAleatoriosPublicos(5);
    return res.json(foruns);
  } catch (err) {
    return next(err);
  }
}

// Buscar forum por pesquisa nome ou palavra-chave
export async function pesquisar(req: Request, res: Response, next: NextFunction) {
  try {
    const { termo } = req.query as { termo?: string };
    if (!termo) return res.status(400).json({ mensagem: 'Parâmetro "termo" é obrigatório.' });
    const resultado = await ForumService.pesquisar(termo, req.query);
    return res.json(resultado);
  } catch (err) {
    return next(err);
  }
}

// Buscar forum por ID
export async function obterPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const forum = await ForumService.obterPorId(id);
    return res.json(forum);
  } catch (err) {
    return next(err);
  }
}

// Criar forum
export async function criar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    const forum = await ForumService.criar(req.user.user_id, req.body);
    return res.status(201).json(forum);
  } catch (err) {
    return next(err);
  }
}

// Atualizar forum
export async function atualizar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    const { id } = req.params;
    const atualizado = await ForumService.atualizar(id, req.user.user_id, req.body);
    return res.json(atualizado);
  } catch (err) {
    return next(err);
  }
}

// Excluir forum
export async function excluir(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    const { id } = req.params;
    const deletado = await ForumService.excluir(id, req.user.user_id);
    return res.json(deletado);
  } catch (err) {
    return next(err);
  }
}