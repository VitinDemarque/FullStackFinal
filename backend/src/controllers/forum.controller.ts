import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as ForumService from '../services/forum.service';


// Buscar todos os foruns
export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const forums = await ForumService.getAll();
    return res.json(forums);
  } catch (err) {
    return next(err);
  }
}

// Buscar forum por pesquisa nome ou palavra-chave
export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query as { q?: string };
    if (!q) return res.status(400).json({ message: 'Erro ao pesquisar' });
    const results = await ForumService.search(q);
    return res.json(results);
  } catch (err) {
    return next(err);
  }
}

// Buscar forum por ID
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const forum = await ForumService.getById(id);
    return res.json(forum);
  } catch (err) {
    return next(err);
  }
}

// Criar forum
export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) return res.status(401).json({ message: 'Unauthorized' });
    const forum = await ForumService.create(req.user.user_id, req.body);
    return res.status(201).json(forum);
  } catch (err) {
    return next(err);
  }
}

// Atualizar forum
export async function update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const updated = await ForumService.update(id, req.user.user_id, req.body);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

// Deletar forum
export async function remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) return res.status(401).json({ message: 'Unauthorized' });
    const { id } = req.params;
    const deleted = await ForumService.remove(id, req.user.user_id);
    return res.json(deleted);
  } catch (err) {
    return next(err);
  }
}