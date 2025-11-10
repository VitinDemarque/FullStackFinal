import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../middlewares/auth'
import * as ForumService from '../services/forum.service'
import { NotFoundError, BadRequestError } from '../utils/httpErrors'
import { isDono } from '../utils/forumAuth'

// Buscar fóruns públicos
export async function listarPublicos(req: Request, res: Response, next: NextFunction) {
  try {
    const foruns = await ForumService.listarPublicos(req.query)
    return res.json(foruns)
  } catch (err) {
    return next(err)
  }
}

// Buscar fóruns aleatórios (para exibir na página inicial)
export async function listarAleatorios(req: Request, res: Response, next: NextFunction) {
  try {
    const foruns = await ForumService.listarAleatoriosPublicos(5)
    return res.json(foruns)
  } catch (err) {
    return next(err)
  }
}

// Pesquisar fóruns por nome, assunto ou palavra-chave
export async function pesquisar(req: Request, res: Response, next: NextFunction) {
  try {
    const { termo } = req.query as { termo?: string }
    if (!termo)
      return res.status(400).json({ mensagem: 'Parâmetro "termo" é obrigatório.' })

    const resultado = await ForumService.pesquisar(termo, req.query)
    return res.json(resultado)
  } catch (err) {
    return next(err)
  }
}

// Buscar fórum por ID
export async function obterPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const forum = await ForumService.obterPorId(id)
    return res.json(forum)
  } catch (err) {
    return next(err)
  }
}

// Buscar fórum pelo ID do desafio (exerciseId)
export async function obterPorExerciseId(req: Request, res: Response, next: NextFunction) {
  try {
    const { exerciseId } = req.params
    if (!exerciseId)
      return res.status(400).json({ mensagem: 'Parâmetro "exerciseId" é obrigatório.' })

    const forum = await ForumService.obterPorExerciseId(exerciseId)
    return res.json(forum)
  } catch (err) {
    return next(err)
  }
}

// Listar fóruns em que o usuário participa
export async function listarMeus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new NotFoundError('Usuário não encontrado no token')
    const foruns = await ForumService.listarMeus(req.user.user_id)
    return res.json(foruns)
  } catch (err) {
    return next(err)
  }
}

// Participar de um fórum
export async function participar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const userId = req.user?.user_id

    if (!id) throw new BadRequestError('ID do fórum não informado.')
    if (!userId) throw new BadRequestError('Usuário não autenticado.')

    const forumAtualizado = await ForumService.participar(id, userId)
    return res.status(200).json(forumAtualizado)
  } catch (err) {
    return next(err)
  }
}

// Criar fórum
export async function criar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id)
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const forum = await ForumService.criar(req.user.user_id, req.body)
    return res.status(201).json(forum)
  } catch (err) {
    return next(err)
  }
}

// Atualizar fórum
export async function atualizar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id)
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const { id } = req.params
    const atualizado = await ForumService.atualizar(
      id,
      req.user.user_id,
      req.body,
      req.user.role === 'ADMIN' ? 'ADMIN' : 'USER'
    )
    return res.json(atualizado)
  } catch (err) {
    return next(err)
  }
}

// Excluir fórum
export async function excluir(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id)
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const { id } = req.params
    const deletado = await ForumService.excluir(
      id,
      req.user.user_id,
      req.user.role === 'ADMIN' ? 'ADMIN' : 'USER'
    )
    return res.json(deletado)
  } catch (err) {
    return next(err)
  }
}

// Listar participantes (dono, moderadores, membros)
export async function listarParticipantes(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const participantes = await ForumService.listarParticipantes(id)
    return res.json(participantes)
  } catch (err) {
    return next(err)
  }
}

// Sair do fórum (membro/moderador)
export async function sair(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id)
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const { id } = req.params
    const atualizado = await ForumService.sair(id, req.user.user_id)
    return res.json(atualizado)
  } catch (err) {
    return next(err)
  }
}

// Transferir propriedade do fórum
export async function transferirDono(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id)
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const { id } = req.params
    const { novoDonoUsuarioId } = req.body as { novoDonoUsuarioId?: string }
    if (!novoDonoUsuarioId) return res.status(400).json({ mensagem: 'novoDonoUsuarioId é obrigatório.' })

    const atualizado = await ForumService.transferirDono(id, req.user.user_id, novoDonoUsuarioId)
    return res.json(atualizado)
  } catch (err) {
    return next(err)
  }
}

// Listar moderadores do forum
export async function listarModeradores(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const moderadores = await ForumService.listarModeradores(id)

    return res.json(moderadores)
  } catch (err) {
    return next(err);
  }
}

// Adicionar moderadores
export async function adicionarModerador(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ mensagem: 'Usuario não autenticado.' })
    }

    const { id } = req.params
    const { userId } = req.body as { userId?: string }

    if (!userId) {
      return res.status(400).json({ mensagem: 'O campo "userId" é obrigatorio.' })
    }

    const forum = await ForumService.obterPorId(id)

    if (!isDono(forum, req.user.user_id)) {
      return res.status(403).json({
        mensagem: 'Apenas o dono do fórum pode adicionar moderadores.',
      })
    }

    const ehMembro = forum.membros?.some(
      (m) => String(m.usuarioId) === userId
    )

    if (!ehMembro) {
      return res.status(400).json({
        mensagem: 'O usuário precisa ser membro do fórum antes de ser promovido a moderador.',
      })
    }

    const atualizado = await ForumService.adicionarModerador(id, req.user.user_id, userId)
    return res.status(200).json(atualizado)
  } catch (err) {
    return next(err)
  }
}

// Remover moderador
export async function removerModerador(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) {
      return res.status(401).json({ mensagem: 'Usuario não autenticado.' })
    }

    const { id, userId } = req.params

    const atualizado = await ForumService.removerModerador(id, req.user.user_id, userId)
    return res.status(200).json(atualizado)
  } catch (err) {
    return next(err)
  }
}

// Gerar link público de compartilhamento
export async function compartilhar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id)
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const { id } = req.params
    const resultado = await ForumService.gerarLinkCompartilhamento(id, req.user.user_id)
    return res.json(resultado)
  } catch (err) {
    return next(err)
  }
}

// Entrar no fórum via token de convite
export async function entrarPorToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id)
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' })

    const { id } = req.params
    const { token } = req.body as { token?: string }

    if (!token)
      return res.status(400).json({ mensagem: 'Token de convite é obrigatório.' })

    const resultado = await ForumService.entrarPorToken(id, req.user.user_id, token)
    return res.json(resultado)
  } catch (err) {
    return next(err)
  }
}