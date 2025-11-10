import { Types } from 'mongoose';
import Forum, { IForum } from '../models/Forum.model';
import ForumTopic, { IForumTopic } from '../models/ForumTopic.model'
import ForumComment from '../models/ForumComment.model'
import Exercise from '../models/Exercise.model';
import { NotFoundError, BadRequestError } from '../utils/httpErrors';
import { parsePagination, toMongoPagination } from '../utils/pagination';

// Buscar fóruns públicos paginado
export async function listarPublicos(query: any) {
  const paginacao = parsePagination(query, { page: 1, limit: 10 }, 50)
  const { skip, limit } = toMongoPagination(paginacao)

  const foruns = await Forum.find({ statusPrivacidade: 'PUBLICO', status: 'ATIVO' })
    .sort({ ultimaAtividade: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IForum[]>()

  return foruns
}

// Buscar fóruns aleatórios (para exibir na página inicial)
export async function listarAleatoriosPublicos(qtd = 5) {
  const foruns = await Forum.aggregate([
    { $match: { statusPrivacidade: 'PUBLICO', status: 'ATIVO' } },
    { $sample: { size: qtd } },
  ])
  return foruns
}

// Pesquisar fóruns por nome, assunto ou palavras-chave e titulo dos topicos
export async function pesquisar(termo: string, query: any) {
  const paginacao = parsePagination(query, { page: 1, limit: 10 }, 50);
  const { skip, limit } = toMongoPagination(paginacao);

  if (!termo?.trim()) {
    return []
  }

  const regex = new RegExp(termo, 'i')

  const foruns = await Forum.find({
    $or: [
      { nome: regex },
      { assunto: regex },
      { descricao: regex },
      { palavrasChave: { $in: [regex] } }
    ],
    status: 'ATIVO'
  })
    .skip(skip)
    .limit(limit)
    .lean<IForum[]>();

  const mapResultados = new Map<string, { forum: IForum; match: 'forum' | 'topico' | 'ambos' }>()

  for (const forum of foruns) {
    mapResultados.set(String(forum._id), { forum, match: 'forum' })
  }

  const topicos = await ForumTopic.find({ titulo: regex })
    .select('forumId titulo')
    .lean()

  const forumIdsDosTopicos = [...new Set(topicos.map(t => String(t.forumId)))]

  if (forumIdsDosTopicos.length > 0) {
    const forumsComTopicos = await Forum.find({
      _id: { $in: forumIdsDosTopicos.map(id => new Types.ObjectId(id)) },
      status: 'ATIVO'
    })
      .lean<IForum[]>()

    for (const forum of forumsComTopicos) {
      const id = String(forum._id)
      if (mapResultados.has(id)) {
        mapResultados.set(id, { forum, match: 'ambos' })
      } else {
        mapResultados.set(id, { forum, match: 'topico' })
      }
    }
  }

  // Retornar resultados em formato amigável
  return Array.from(mapResultados.values()).map(({ forum, match }) => ({
    ...forum,
    match
  }))
}

// Obter um fórum pelo ID
export async function obterPorId(id: string) {
  const forum = await Forum.findById(id).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum não encontrado');
  return forum;
}

// Obter um fórum pelo ID do exercício (challenge)
export async function obterPorExerciseId(exerciseId: string) {
  const forum = await Forum.findOne({ exerciseId: new Types.ObjectId(exerciseId) }).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum para este desafio não foi encontrado');
  return forum;
}

// Listar fóruns em que o usuário participa
export async function listarMeus(userId: string) {
  const objectId = new Types.ObjectId(userId);

  // Busca por dono, moderador ou membro (se existir futuramente)
  const foruns = await Forum.find({
    $or: [
      { donoUsuarioId: objectId },
      { 'moderadores.usuarioId': objectId },
      { 'membros.usuarioId': objectId }, // opcional, se existir
    ],
    status: { $ne: 'EXCLUIDO' },
  }).lean();

  return foruns;
}

// Entrar como membro em um fórum público
export async function participar(forumId: string, usuarioId: string) {
  const forum = await Forum.findById(forumId).lean<IForum | null>()
  if (!forum) throw new NotFoundError('Fórum não encontrado')

  if (forum.statusPrivacidade === 'PRIVADO') {
    throw new BadRequestError('Não é possível participar de um fórum privado sem convite.')
  }

  const jaEhMembro =
    forum.membros?.some((m) => String(m.usuarioId) === usuarioId) ||
    forum.moderadores?.some((m) => String(m.usuarioId) === usuarioId) ||
    String(forum.donoUsuarioId) === usuarioId

  if (jaEhMembro) {
    throw new BadRequestError('Usuário já participa deste fórum.')
  }

  const atualizado = await Forum.findByIdAndUpdate(
    forumId,
    {
      $push: { membros: { usuarioId: new Types.ObjectId(usuarioId), desde: new Date() } },
      $set: { atualizadoEm: new Date(), ultimaAtividade: new Date() },
    },
    { new: true }
  ).lean<IForum | null>()

  if (!atualizado) throw new NotFoundError('Erro ao ingressar no fórum.')

  return atualizado
}

// Criar um novo fórum
export async function criar(usuarioId: string, payload: Partial<IForum>) {
  if (!payload.nome || !payload.assunto) throw new BadRequestError('Nome e assunto são obrigatórios');
  // Permitir passar exerciseCode (código público) como alternativa ao exerciseId
  if (!payload.exerciseId && (payload as any).exerciseCode) {
    const byCode = await Exercise.findOne({ publicCode: (payload as any).exerciseCode }).lean();
    if (!byCode) throw new BadRequestError('Desafio não encontrado pelo código público.');
    (payload as any).exerciseId = byCode._id as any;
  }

  if (!payload.exerciseId) throw new BadRequestError('O ID do desafio (exerciseId) é obrigatório.');

  // Validar existência do exercício
  const exercise = await Exercise.findById(payload.exerciseId).lean();
  if (!exercise) throw new BadRequestError('Desafio não encontrado.');

  // Apenas permitir fóruns para desafios públicos e publicados, quando não é do próprio usuário
  if (!(exercise.isPublic && exercise.status === 'PUBLISHED')) {
    throw new BadRequestError('Só é possível criar fórum para desafios públicos e publicados');
  }

  // Garantir fórum único por exercício
  const jaExiste = await Forum.findOne({ exerciseId: exercise._id }).lean();
  if (jaExiste) throw new BadRequestError('Já existe um fórum para este desafio.');

  const novoForum = await Forum.create({
    ...payload,
    donoUsuarioId: new Types.ObjectId(usuarioId),
    moderadores: [{ usuarioId: new Types.ObjectId(usuarioId), desde: new Date(), aprovado: true }]
  });

  return novoForum.toObject();
}

// Atualizar informações de um fórum, com a regra de negocio implementada
export async function atualizar(
  id: string,
  usuarioId: string,
  payload: Partial<IForum>,
  requesterRole?: 'ADMIN' | 'USER'
) {
  const forum = await Forum.findById(id).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum não encontrado');

  const seDono = String(forum.donoUsuarioId) === usuarioId;
  const seModerador = forum.moderadores?.some(m => String(m.usuarioId) === usuarioId);
  const isAdmin = requesterRole === 'ADMIN';

  if (!seDono && !seModerador && !isAdmin) {
    throw new BadRequestError('Apenas o dono ou moderadores podem alterar este fórum.');
  }

  // Se for moderador, criar registro de mudança pendente de aprovação
  const camposPermitidos = ['nome', 'assunto', 'palavrasChave', 'descricao'];
  const atualizacoes: any = {};

  for (const campo of camposPermitidos) {
    if (payload[campo as keyof IForum] !== undefined) {
      atualizacoes[campo] = payload[campo as keyof IForum];
    }
  }

  if (Object.keys(atualizacoes).length === 0) {
    throw new BadRequestError('Nenhum campo válido para atualização foi informado.');
  }

  // Dono pode atualizar diretamente
  const atualizado = await Forum.findByIdAndUpdate(
    id,
    { ...atualizacoes, atualizadoEm: new Date() },
    { new: true, runValidators: true }
  ).lean<IForum | null>();

  if (!atualizado) throw new NotFoundError('Fórum não encontrado');

  // Registrar a mudança no histórico (mesmo que feita diretamente)
  await Forum.findByIdAndUpdate(id, {
    $push: {
      mudancas: {
        camposAlterados: Object.keys(atualizacoes),
        usuarioAlteracaoId: new Types.ObjectId(usuarioId),
        usuarioValidacaoId: (seDono || isAdmin) ? new Types.ObjectId(usuarioId) : null,
        data: new Date(),
        tipo: 'EDICAO',
      },
    },
  });

  return atualizado;
}

// Excluir um fórum (após confirmações)
export async function excluir(id: string, usuarioId: string, requesterRole?: 'ADMIN' | 'USER') {
  const forum = await Forum.findById(id).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum não encontrado');

  const seDono = String(forum.donoUsuarioId) === usuarioId;
  const seModerador = forum.moderadores?.some((m) => String(m.usuarioId) === usuarioId);
  const isAdmin = requesterRole === 'ADMIN';

  if (!seDono && !seModerador && !isAdmin) {
    throw new BadRequestError('Somente o dono ou moderadores podem solicitar exclusão.');
  }

  const votos = forum.votosExclusao ?? [];
  const jaVotou = votos.some((v) => String(v.usuarioId) === usuarioId);

  if (jaVotou) {
    throw new BadRequestError('Este usuário já registrou voto para exclusão.');
  }

  votos.push({ usuarioId: new Types.ObjectId(usuarioId), data: new Date() });

  const moderadoresValidos = (forum.moderadores || []).filter(
    (m) => String(m.usuarioId) !== String(forum.donoUsuarioId)
  );

  const totalVotantes = 1 + moderadoresValidos.length; // dono + moderadores (sem duplicar dono)
  const totalVotos = votos.length;
  let todosConcordaram = totalVotos >= totalVotantes;
  if (isAdmin) {
    // Admin tem poder para executar exclusão imediata
    todosConcordaram = true;
  }

  if (todosConcordaram) {
    // Exclusão em cascata: remover tópicos e comentários associados ao fórum
    await ForumComment.deleteMany({ forumId: new Types.ObjectId(id) })
    await ForumTopic.deleteMany({ forumId: new Types.ObjectId(id) })

    const deletado = await Forum.findByIdAndDelete(id);
    if (!deletado) throw new NotFoundError('Fórum não encontrado');
    return { mensagem: 'Fórum excluído com sucesso.', forum: deletado };
  }

  // Caso ainda faltem confirmações
  await Forum.findByIdAndUpdate(id, {
    $set: { status: 'PENDENTE_EXCLUSAO', votosExclusao: votos },
  });

  return {
    mensagem: `Exclusão pendente — ${totalVotos}/${totalVotantes} confirmações registradas.`,
    pendente: true,
  };
}

// Listar participantes (dono, moderadores e membros)
export async function listarParticipantes(forumId: string) {
  const forum = await Forum.findById(forumId).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum não encontrado');

  const totalModeradores = forum.moderadores?.length || 0;
  const totalMembros = forum.membros?.length || 0;
  const flags = {
    totalModeradores,
    totalMembros,
    possuiOutrosModeradores: totalModeradores > 1 || (totalModeradores === 1 && String(forum.moderadores?.[0]?.usuarioId) !== String(forum.donoUsuarioId)),
    donoEhUnicoModerador: (totalModeradores === 0) || (totalModeradores === 1 && String(forum.moderadores?.[0]?.usuarioId) === String(forum.donoUsuarioId)),
  };

  return {
    donoUsuarioId: forum.donoUsuarioId,
    moderadores: forum.moderadores || [],
    membros: forum.membros || [],
    flags,
  };
}

// Sair do fórum (membro/moderador). Dono não pode sair — deve transferir ou excluir.
export async function sair(forumId: string, usuarioId: string) {
  const forum = await Forum.findById(forumId).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum não encontrado');

  if (String(forum.donoUsuarioId) === usuarioId) {
    throw new BadRequestError('O dono não pode sair do fórum. Transfira a propriedade ou exclua o fórum.');
  }

  const ehModerador = forum.moderadores?.some((m) => String(m.usuarioId) === usuarioId);
  const ehMembro = forum.membros?.some((m) => String(m.usuarioId) === usuarioId);

  if (!ehModerador && !ehMembro) {
    throw new BadRequestError('Usuário não participa deste fórum.');
  }

  const update: any = { $set: { atualizadoEm: new Date() } };
  if (ehModerador) update.$pull = { ...(update.$pull || {}), moderadores: { usuarioId: new Types.ObjectId(usuarioId) } };
  if (ehMembro) update.$pull = { ...(update.$pull || {}), membros: { usuarioId: new Types.ObjectId(usuarioId) } };

  const atualizado = await Forum.findByIdAndUpdate(forumId, update, { new: true }).lean<IForum | null>();
  if (!atualizado) throw new NotFoundError('Fórum não encontrado');
  return atualizado;
}

// Transferir propriedade do fórum para um moderador
export async function transferirDono(forumId: string, donoAtualId: string, novoDonoUsuarioId: string) {
  const forum = await Forum.findById(forumId).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum não encontrado');

  if (String(forum.donoUsuarioId) !== donoAtualId) {
    throw new BadRequestError('Apenas o dono atual pode transferir a propriedade.');
  }

  const ehModeradorDestino = forum.moderadores?.some((m) => String(m.usuarioId) === novoDonoUsuarioId);
  if (!ehModeradorDestino) {
    throw new BadRequestError('O novo dono precisa ser um moderador do fórum.');
  }

  // Atualizações: novo dono assume; antigo dono vira moderador (se já não for)
  const updates: any = {
    $set: { donoUsuarioId: new Types.ObjectId(novoDonoUsuarioId), atualizadoEm: new Date() },
    $pull: { moderadores: { usuarioId: new Types.ObjectId(novoDonoUsuarioId) } },
  };

  const antigoDonoJaModerador = forum.moderadores?.some((m) => String(m.usuarioId) === donoAtualId);
  if (!antigoDonoJaModerador) {
    updates.$push = { moderadores: { usuarioId: new Types.ObjectId(donoAtualId), desde: new Date(), aprovado: true } };
  }

  const atualizado = await Forum.findByIdAndUpdate(forumId, updates, { new: true }).lean<IForum | null>();
  if (!atualizado) throw new NotFoundError('Fórum não encontrado');

  // Registrar mudança de transferência
  await Forum.findByIdAndUpdate(forumId, {
    $push: {
      mudancas: {
        camposAlterados: ['donoUsuarioId'],
        usuarioAlteracaoId: new Types.ObjectId(donoAtualId),
        usuarioValidacaoId: new Types.ObjectId(donoAtualId),
        data: new Date(),
        tipo: 'TRANSFERENCIA',
      },
    },
  });

  return atualizado;
}

import crypto from 'crypto'

// Gerar ou obter link de compartilhamento
export async function gerarLinkCompartilhamento(forumId: string, usuarioId: string) {
  const forum = await Forum.findById(forumId).lean<IForum | null>()
  if (!forum) throw new NotFoundError('Fórum não encontrado')

  const ehDono = String(forum.donoUsuarioId) === usuarioId
  const ehModerador = forum.moderadores?.some(m => String(m.usuarioId) === usuarioId)

  if (!ehDono && !ehModerador) {
    throw new BadRequestError('Apenas o dono ou moderadores podem gerar links de convite.')
  }

  // Se já houver token ativo, reutiliza
  if (forum.tokenConvite && forum.tokenConviteExpiraEm && forum.tokenConviteExpiraEm > new Date()) {
    return { link: `${process.env.FRONTEND_URL}/forum/entrar?token=${forum.tokenConvite}` }
  }

  // Gera novo token e define validade (7 dias, por exemplo)
  const token = crypto.randomBytes(16).toString('hex')
  const expiraEm = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await Forum.findByIdAndUpdate(forumId, {
    $set: { tokenConvite: token, tokenConviteExpiraEm: expiraEm },
  })

  const link = `${process.env.FRONTEND_URL}/forum/entrar?token=${token}`
  return { link, expiraEm }
}

// Entrar no fórum via token
export async function entrarPorToken(forumId: string, usuarioId: string, token: string) {
  const forum = await Forum.findById(forumId).lean<IForum | null>()
  if (!forum) throw new NotFoundError('Fórum não encontrado')

  if (forum.statusPrivacidade === 'PRIVADO' && (!forum.tokenConvite || forum.tokenConvite !== token)) {
    throw new BadRequestError('Token inválido ou fórum privado sem convite válido.')
  }

  if (forum.tokenConviteExpiraEm && forum.tokenConviteExpiraEm < new Date()) {
    throw new BadRequestError('Token de convite expirado.')
  }

  const jaEhMembro =
    String(forum.donoUsuarioId) === usuarioId ||
    forum.moderadores?.some(m => String(m.usuarioId) === usuarioId) ||
    forum.membros?.some(m => String(m.usuarioId) === usuarioId)

  if (jaEhMembro) {
    throw new BadRequestError('Usuário já participa deste fórum.')
  }

  const atualizado = await Forum.findByIdAndUpdate(
    forumId,
    {
      $push: { membros: { usuarioId: new Types.ObjectId(usuarioId), desde: new Date() } },
      $set: { atualizadoEm: new Date(), ultimaAtividade: new Date() },
    },
    { new: true }
  ).lean<IForum | null>()

  if (!atualizado) throw new NotFoundError('Erro ao ingressar no fórum.')

  return atualizado
}

// Listar moderadores do forum
export async function listarModeradores(forumId: string) {
  const forum = await Forum.findById(forumId).lean<IForum | null>()

  if (!forum) {
    throw new NotFoundError('Forum não encontrado.')
  }

  return forum.moderadores || []
}

// Adicionar novo moderador
export async function adicionarModerador(forumId: string, donoId: string, novoModeradorId: string) {
  const forum = await Forum.findById(forumId).lean<IForum | null>()
  if (!forum) {
    throw new NotFoundError('Forum não encontrado.')
  }

  if (String(forum.donoUsuarioId) !== donoId) {
    throw new BadRequestError('Apenas o dono do fórum pode adicionar moderadores.')
  }

  const ehMembro = forum.membros?.some(
    (m) => String(m.usuarioId) === novoModeradorId
  )
  if (!ehMembro) {
    throw new BadRequestError('O usuario deve ser membro do forum antes de ser promovido a moderador.')
  }

  const jaEhModerador = forum.moderadores?.some(
    (m) => String(m.usuarioId) === novoModeradorId
  )
  if (jaEhModerador) {
    throw new BadRequestError('Usuario já é moderador deste forum.')
  }

  const update: any = {
    $push: {
      moderadores: {
        usuarioId: new Types.ObjectId(novoModeradorId),
        desde: new Date(),
        aprovado: true,
      },
    },
  }

  if (ehMembro) {
    update.$pull = {
      membro: {
        usuarioId: new Types.ObjectId(novoModeradorId)
      }
    }
  }

  const atualizado = await Forum.findByIdAndUpdate(forumId, update, { new: true }).lean<IForum | null>()
  if (!atualizado) {
    throw new NotFoundError('Erro ao adicionar o novo moderador.')
  }

  return atualizado
}

// Remover moderador
export async function removerModerador(forumId: string, donoId: string, moderadorId: string) {
  const forum = await Forum.findById(forumId).lean<IForum | null>()
  if (!forum) {
    throw new NotFoundError('Forum não encontrado.')
  }

  if (String(forum.donoUsuarioId) !== donoId) {
    throw new BadRequestError('Apenas o dono do forum pode remover moderadores.')
  }

  const ehModerador = forum.moderadores?.some(
    (m) => String(m.usuarioId) === moderadorId
  )
  if (!ehModerador) {
    throw new BadRequestError('Usuario informado não é um moderador.')
  }

  if (String(forum.donoUsuarioId) === moderadorId) {
    throw new BadRequestError('O dono não pode ser removido dos moderadores.')
  }

  const atualizado = await Forum.findByIdAndUpdate(
    forumId,
    {
      $pull: { moderadores: { usuarioId: new Types.ObjectId(moderadorId) } },
      $set: { atualizadoEm: new Date() },
    },
    { new: true }
  ).lean<IForum | null>()

  if (!atualizado) {
    throw new NotFoundError('Erro ao remover o moderador.')
  }

  return atualizado
}