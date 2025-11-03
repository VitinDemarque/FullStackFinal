import { Types } from 'mongoose'
import ForumComment, { IForumComment } from '../models/ForumComment.model'
import ForumTopic, { IForumTopic } from '../models/ForumTopic.model'
import Forum, { IForum, IModerador, IMembro } from '../models/Forum.model'
import { BadRequestError, NotFoundError } from '../utils/httpErrors'
import { parsePagination, toMongoPagination } from '../utils/pagination'

export interface CriarComentarioPayload {
  conteudo: string
}

export interface AtualizarComentarioPayload {
  conteudo?: string
  status?: 'ATIVO' | 'EDITADO' | 'EXCLUIDO'
}

export async function listarPorTopico(topicId: string, query: any) {
  if (!Types.ObjectId.isValid(topicId)) throw new BadRequestError('topicId inválido')

  const pag = parsePagination(query, { page: 1, limit: 10 }, 100)
  const { skip, limit } = toMongoPagination(pag)

  const comentarios = await ForumComment.find({ topicId: new Types.ObjectId(topicId) })
    .sort({ criadoEm: 1 })
    .skip(skip)
    .limit(limit)
    .lean<IForumComment[]>()

  return comentarios
}

export async function obterPorId(id: string) {
  if (!Types.ObjectId.isValid(id)) throw new BadRequestError('id inválido')
  const comentario = await ForumComment.findById(id).lean<IForumComment | null>()
  if (!comentario) throw new NotFoundError('Comentário não encontrado')
  return comentario
}

export async function criar(topicId: string, usuarioId: string, payload: CriarComentarioPayload) {
  if (!payload.conteudo) throw new BadRequestError('Conteúdo é obrigatório')
  const topico = await ForumTopic.findById(topicId).lean<IForumTopic | null>()
  if (!topico) throw new NotFoundError('Tópico não encontrado')

  const forum = await Forum.findById(topico.forumId).lean<IForum | null>()
  if (!forum) throw new NotFoundError('Fórum não encontrado')
  const forumTyped = forum as IForum

  const isParticipante =
    String(forumTyped.donoUsuarioId) === usuarioId ||
    forumTyped.moderadores?.some((m: IModerador) => String(m.usuarioId) === usuarioId) ||
    forumTyped.membros?.some((m: IMembro) => String(m.usuarioId) === usuarioId)

  if (!isParticipante && forumTyped.statusPrivacidade === 'PRIVADO') {
    throw new BadRequestError('Apenas participantes podem comentar em fóruns privados')
  }

  const novo = await ForumComment.create({
    forumId: new Types.ObjectId(topico.forumId),
    topicId: new Types.ObjectId(topicId),
    autorUsuarioId: new Types.ObjectId(usuarioId),
    conteudo: payload.conteudo,
  })

  // Atualiza contadores e última atividade do tópico
  await ForumTopic.findByIdAndUpdate(topico._id, {
    $inc: { numComentarios: 1 },
    $set: { ultimaAtividade: new Date() },
  })

  return novo.toObject()
}

export async function atualizar(id: string, usuarioId: string, payload: AtualizarComentarioPayload) {
  const comentario = await ForumComment.findById(id).lean<IForumComment | null>()
  if (!comentario) throw new NotFoundError('Comentário não encontrado')

  const topico = await ForumTopic.findById(comentario.topicId).lean<IForumTopic | null>()
  if (!topico) throw new NotFoundError('Tópico não encontrado')

  const forum = await Forum.findById(topico.forumId).lean<IForum | null>()
  if (!forum) throw new NotFoundError('Fórum não encontrado')
  const forumTyped = forum as IForum

  const isAutor = String(comentario.autorUsuarioId) === usuarioId
  const isDono = String(forumTyped.donoUsuarioId) === usuarioId
  const isModerador = forumTyped.moderadores?.some((m: IModerador) => String(m.usuarioId) === usuarioId)

  if (!isAutor && !isDono && !isModerador) {
    throw new BadRequestError('Sem permissão para editar este comentário')
  }

  const camposPermitidos: (keyof AtualizarComentarioPayload)[] = ['conteudo', 'status']
  const atualizacoes: Partial<AtualizarComentarioPayload> & { atualizadoEm?: Date } = {}
  for (const campo of camposPermitidos) {
    if (payload[campo] !== undefined) (atualizacoes as any)[campo] = payload[campo]
  }
  if (Object.keys(atualizacoes).length === 0) {
    throw new BadRequestError('Nenhum campo válido para atualização foi informado')
  }
  atualizacoes.atualizadoEm = new Date()

  const atualizado = await ForumComment.findByIdAndUpdate(id, atualizacoes, {
    new: true,
    runValidators: true,
  }).lean<IForumComment | null>()
  if (!atualizado) throw new NotFoundError('Comentário não encontrado')
  return atualizado
}

export async function excluir(id: string, usuarioId: string) {
  const comentario = await ForumComment.findById(id).lean<IForumComment | null>()
  if (!comentario) throw new NotFoundError('Comentário não encontrado')

  const topico = await ForumTopic.findById(comentario.topicId).lean<IForumTopic | null>()
  if (!topico) throw new NotFoundError('Tópico não encontrado')

  const forum = await Forum.findById(topico.forumId).lean<IForum | null>()
  if (!forum) throw new NotFoundError('Fórum não encontrado')
  const forumTyped = forum as IForum

  const isAutor = String(comentario.autorUsuarioId) === usuarioId
  const isDono = String(forumTyped.donoUsuarioId) === usuarioId
  const isModerador = forumTyped.moderadores?.some((m: IModerador) => String(m.usuarioId) === usuarioId)

  if (!isAutor && !isDono && !isModerador) {
    throw new BadRequestError('Sem permissão para excluir este comentário')
  }

  await ForumComment.findByIdAndDelete(id)
  // Atualiza contadores e última atividade do tópico
  await ForumTopic.findByIdAndUpdate(topico._id, {
    $inc: { numComentarios: -1 },
    $set: { ultimaAtividade: new Date() },
  })

  return { mensagem: 'Comentário excluído com sucesso' }
}