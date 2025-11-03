import { Types } from 'mongoose'
import ForumTopic, { IForumTopic } from '../models/ForumTopic.model'
import Forum, { IForum, IModerador, IMembro } from '../models/Forum.model'
import ForumComment from '../models/ForumComment.model'
import { BadRequestError, NotFoundError } from '../utils/httpErrors'
import { parsePagination, toMongoPagination } from '../utils/pagination'

export interface CriarTopicoPayload {
  titulo: string
  conteudo: string
  palavrasChave?: string[]
}

export interface AtualizarTopicoPayload {
  titulo?: string
  conteudo?: string
  palavrasChave?: string[]
  status?: 'ABERTO' | 'FECHADO' | 'ARQUIVADO'
  fixado?: boolean
}

export async function listarPorForum(forumId: string, query: any) {
  if (!Types.ObjectId.isValid(forumId)) throw new BadRequestError('forumId inválido')

  const pag = parsePagination(query, { page: 1, limit: 10 }, 50)
  const { skip, limit } = toMongoPagination(pag)

  const topicos = await ForumTopic.find({ forumId: new Types.ObjectId(forumId) })
    .sort({ fixado: -1, ultimaAtividade: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IForumTopic[]>()

  return topicos
}

export async function obterPorId(id: string) {
  if (!Types.ObjectId.isValid(id)) throw new BadRequestError('id inválido')
  const topico = await ForumTopic.findById(id).lean<IForumTopic | null>()
  if (!topico) throw new NotFoundError('Tópico não encontrado')
  return topico
}

export async function criar(forumId: string, usuarioId: string, payload: CriarTopicoPayload) {
  if (!payload.titulo || !payload.conteudo) {
    throw new BadRequestError('Título e conteúdo são obrigatórios')
  }
  const forum = await Forum.findById(forumId).lean<IForum | null>()
  if (!forum) throw new NotFoundError('Fórum não encontrado')
  const forumTyped = forum as IForum

  // Opcional: validação de participação (dono, moderador ou membro)
  const isParticipante =
    String(forumTyped.donoUsuarioId) === usuarioId ||
    forumTyped.moderadores?.some((m: IModerador) => String(m.usuarioId) === usuarioId) ||
    forumTyped.membros?.some((m: IMembro) => String(m.usuarioId) === usuarioId)

  if (!isParticipante && forum.statusPrivacidade === 'PRIVADO') {
    throw new BadRequestError('Apenas participantes podem criar tópicos em fóruns privados')
  }

  const novo = await ForumTopic.create({
    forumId: new Types.ObjectId(forumId),
    titulo: payload.titulo,
    conteudo: payload.conteudo,
    palavrasChave: payload.palavrasChave || [],
    autorUsuarioId: new Types.ObjectId(usuarioId),
  })

  return novo.toObject()
}

export async function atualizar(id: string, usuarioId: string, payload: AtualizarTopicoPayload) {
  const topico = await ForumTopic.findById(id).lean<IForumTopic | null>()
  if (!topico) throw new NotFoundError('Tópico não encontrado')

  const forum = await Forum.findById(topico.forumId).lean<IForum | null>()
  if (!forum) throw new NotFoundError('Fórum não encontrado')
  const forumTyped2 = forum as IForum

  const isAutor = String(topico.autorUsuarioId) === usuarioId
  const isDono = String(forumTyped2.donoUsuarioId) === usuarioId
  const isModerador = forumTyped2.moderadores?.some((m: IModerador) => String(m.usuarioId) === usuarioId)

  if (!isAutor && !isDono && !isModerador) {
    throw new BadRequestError('Sem permissão para editar este tópico')
  }

  const camposPermitidos: (keyof AtualizarTopicoPayload)[] = [
    'titulo',
    'conteudo',
    'palavrasChave',
    'status',
    'fixado',
  ]
  const atualizacoes: Partial<AtualizarTopicoPayload> & { atualizadoEm?: Date } = {}
  for (const campo of camposPermitidos) {
    if (payload[campo] !== undefined) (atualizacoes as any)[campo] = payload[campo]
  }
  if (Object.keys(atualizacoes).length === 0) {
    throw new BadRequestError('Nenhum campo válido para atualização foi informado')
  }
  atualizacoes.atualizadoEm = new Date()

  const atualizado = await ForumTopic.findByIdAndUpdate(id, atualizacoes, {
    new: true,
    runValidators: true,
  }).lean<IForumTopic | null>()
  if (!atualizado) throw new NotFoundError('Tópico não encontrado')
  return atualizado
}

export async function excluir(id: string, usuarioId: string) {
  const topico = await ForumTopic.findById(id).lean<IForumTopic | null>()
  if (!topico) throw new NotFoundError('Tópico não encontrado')

  const forum = await Forum.findById(topico.forumId).lean<IForum | null>()
  if (!forum) throw new NotFoundError('Fórum não encontrado')
  const forumTyped2 = forum as IForum

  const isAutor = String(topico.autorUsuarioId) === usuarioId
  const isDono = String(forumTyped2.donoUsuarioId) === usuarioId
  const isModerador = forumTyped2.moderadores?.some((m: IModerador) => String(m.usuarioId) === usuarioId)

  if (!isAutor && !isDono && !isModerador) {
    throw new BadRequestError('Sem permissão para excluir este tópico')
  }

  await ForumTopic.findByIdAndDelete(id)
  // Remover comentários associados (simples)
  await ForumComment.deleteMany({ topicId: new Types.ObjectId(id) })

  return { mensagem: 'Tópico excluído com sucesso' }
}