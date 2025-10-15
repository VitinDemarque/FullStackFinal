import { Types } from 'mongoose';
import Forum, { IForum } from '../models/forum.model';
import { NotFoundError, BadRequestError } from '../utils/httpErrors';

export interface CreateForumInput {
  name: string;
  keywords: string[];
  subject: string;
  description: string;
  privacyStatus: 'PUBLIC' | 'PRIVATE';
}

export async function getAll() {
  // TODO: Buscar fóruns públicos (aleatórios ou ordenados)
  return await Forum.find({ privacyStatus: 'PUBLIC' }).lean<IForum[]>();
}

export async function search(query: string) {
  // TODO: Implementar busca por nome e palavras-chave
  return await Forum.find({
    $or: [
      { name: new RegExp(query, 'i') },
      { subject: new RegExp(query, 'i') },
      { keywords: { $in: [new RegExp(query, 'i')] } }
    ]
  }).lean<IForum[]>();
}

export async function getById(id: string) {
  const forum = await Forum.findById(id).lean<IForum | null>();
  if (!forum) throw new NotFoundError('Forum not found');
  return forum;
}

export async function create(userId: string, payload: CreateForumInput) {
  // TODO: Criar fórum e registrar dono
  const created = await Forum.create({
    ...payload,
    ownerUserId: new Types.ObjectId(userId),
    moderators: [new Types.ObjectId(userId)]
  });
  return created.toObject();
}

export async function update(forumId: string, userId: string, payload: Partial<IForum>) {
  // TODO: Validar permissões (dono/moderador)
  const updated = await Forum.findByIdAndUpdate(forumId, payload, { new: true, runValidators: true }).lean<IForum | null>();
  if (!updated) throw new NotFoundError('Forum not found');
  return updated;
}

export async function remove(forumId: string, userId: string) {
  // TODO: Verificar permissões e confirmações de moderação
  const deleted = await Forum.findByIdAndDelete(forumId).lean<IForum | null>();
  if (!deleted) throw new NotFoundError('Forum not found');
  return deleted;
}