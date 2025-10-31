import { Types } from 'mongoose';
import Forum, { IForum } from '../models/Forum.model';
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

// Pesquisar fóruns por nome, assunto ou palavras-chave
export async function pesquisar(termo: string, query: any) {
  const paginacao = parsePagination(query, { page: 1, limit: 10 }, 50);
  const { skip, limit } = toMongoPagination(paginacao);

  const foruns = await Forum.find({
    $or: [
      { nome: new RegExp(termo, 'i') },
      { assunto: new RegExp(termo, 'i') },
      { palavrasChave: { $in: [new RegExp(termo, 'i')] } }
    ]
  })
    .skip(skip)
    .limit(limit)
    .lean<IForum[]>();

  return foruns;
}

// Obter um fórum pelo ID
export async function obterPorId(id: string) {
  const forum = await Forum.findById(id).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum não encontrado');
  return forum;
}

// Criar um novo fórum
export async function criar(usuarioId: string, payload: Partial<IForum>) {
  if (!payload.nome || !payload.assunto) throw new BadRequestError('Nome e assunto são obrigatórios');

  const novoForum = await Forum.create({
    ...payload,
    donoUsuarioId: new Types.ObjectId(usuarioId),
    moderadores: [{ usuarioId: new Types.ObjectId(usuarioId), desde: new Date(), aprovado: true }]
  });

  return novoForum.toObject();
}

// Atualizar informações de um fórum, com a regra de negocio implementada
export async function atualizar(id: string, usuarioId: string, payload: Partial<IForum>) {
  const forum = await Forum.findById(id).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum não encontrado');

  const seDono = String(forum.donoUsuarioId) === usuarioId;
  const seModerador = forum.moderadores?.some(m => String(m.usuarioId) === usuarioId);

  if (!seDono && !seModerador) {
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
        usuarioAutorId: usuarioId,
        aprovado: seDono, // se o dono fez, já é aprovado
        data: new Date(),
      },
    },
  });

  return atualizado;
}

// Excluir um fórum (após confirmações)
export async function excluir(id: string, usuarioId: string) {
  const forum = await Forum.findById(id).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Fórum não encontrado');

  const seDono = String(forum.donoUsuarioId) === usuarioId;
  const seModerador = forum.moderadores?.some((m) => String(m.usuarioId) === usuarioId);

  if (!seDono && !seModerador) {
    throw new BadRequestError('Somente o dono ou moderadores podem solicitar exclusão.');
  }

  const votos = forum.votosExclusao ?? [];
  const jaVotou = votos.some((v) => String(v.usuarioId) === usuarioId);

  if (jaVotou) {
    throw new BadRequestError('Este usuário já registrou voto para exclusão.');
  }

  votos.push({ usuarioId: new Types.ObjectId(usuarioId), data: new Date() });

  // 🔹 Corrigido: não contar o dono duas vezes
  const moderadoresValidos = (forum.moderadores || []).filter(
    (m) => String(m.usuarioId) !== String(forum.donoUsuarioId)
  );

  const totalVotantes = 1 + moderadoresValidos.length; // dono + moderadores (sem duplicar dono)
  const totalVotos = votos.length;
  const todosConcordaram = totalVotos >= totalVotantes;

  if (todosConcordaram) {
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