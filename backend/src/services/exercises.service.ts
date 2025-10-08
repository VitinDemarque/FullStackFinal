import { FilterQuery, Types } from 'mongoose';
import { ForbiddenError, NotFoundError } from '../utils/httpErrors';

// Models
import Exercise from '../models/Exercise.model';
import Language from '../models/Language.model';
import UserStat from '../models/UserStat.model';

export interface ListExercisesInput {
  q?: string;
  languageId?: string;
  authorId?: string;
  skip: number;
  limit: number;
}

export async function list(input: Partial<ListExercisesInput>) {
  const { q, languageId, authorId, skip = 0, limit = 20 } = input;

  const where: FilterQuery<any> = { status: 'PUBLISHED' };
  if (q) where.title = { $regex: q, $options: 'i' };
  if (languageId) where.languageId = new Types.ObjectId(languageId);
  if (authorId) where.authorUserId = new Types.ObjectId(authorId);
  // listagem pública apenas exercícios públicos
  where.isPublic = true;

  const [items, total] = await Promise.all([
    Exercise.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Exercise.countDocuments(where)
  ]);

  return {
    items: items.map(sanitize),
    total
  };
}

export async function getById(id: string) {
  const ex = await Exercise.findById(id).lean();
  if (!ex) throw new NotFoundError('Exercise not found');
  // se não público e não publicado, regra de acesso será feita no controller/service com userId quando necessário
  return sanitize(ex);
}

export async function create(userId: string, payload: Partial<any>) {
  // valida linguagem
  if (payload.languageId) {
    const lang = await Language.findById(payload.languageId).lean();
    if (!lang) throw new NotFoundError('Language not found');
  }

  const doc = await Exercise.create({
    authorUserId: new Types.ObjectId(userId),
    languageId: payload.languageId ? new Types.ObjectId(payload.languageId) : undefined,
    title: payload.title ?? 'Untitled',
    description: payload.description ?? '',
    difficulty: Number(payload.difficulty ?? 1),
    baseXp: Number(payload.baseXp ?? 100),
    isPublic: Boolean(payload.isPublic ?? true),
    codeTemplate: String(payload.codeTemplate ?? '// start coding...'),
    status: payload.status ?? 'DRAFT'
  });

  // Atualiza contador de criados
  await UserStat.updateOne(
    { userId: new Types.ObjectId(userId) },
    { $inc: { exercisesCreatedCount: 1 }, $setOnInsert: { userId: new Types.ObjectId(userId) } },
    { upsert: true }
  );

  return sanitize(doc);
}

export async function update(userId: string, id: string, payload: Partial<any>) {
  const ex = await Exercise.findById(id);
  if (!ex) throw new NotFoundError('Exercise not found');
  if (String(ex.authorUserId) !== userId) throw new ForbiddenError('Only author can update');

  if (payload.languageId) {
    const lang = await Language.findById(payload.languageId).lean();
    if (!lang) throw new NotFoundError('Language not found');
    ex.languageId = new Types.ObjectId(payload.languageId);
  }

  if (payload.title !== undefined) ex.title = payload.title;
  if (payload.description !== undefined) ex.description = payload.description;
  if (payload.difficulty !== undefined) ex.difficulty = Number(payload.difficulty);
  if (payload.baseXp !== undefined) ex.baseXp = Number(payload.baseXp);
  if (payload.codeTemplate !== undefined) ex.codeTemplate = String(payload.codeTemplate);
  if (payload.status !== undefined) ex.status = payload.status;

  await ex.save();
  return sanitize(ex.toObject());
}

export async function remove(userId: string, id: string) {
  const ex = await Exercise.findById(id);
  if (!ex) return; // idempotente
  if (String(ex.authorUserId) !== userId) throw new ForbiddenError('Only author can delete');
  await ex.deleteOne();
}

export async function publish(userId: string, id: string) {
  const ex = await Exercise.findById(id);
  if (!ex) throw new NotFoundError('Exercise not found');
  if (String(ex.authorUserId) !== userId) throw new ForbiddenError('Only author can publish');
  ex.status = 'PUBLISHED';
  await ex.save();
  return sanitize(ex.toObject());
}

export async function unpublish(userId: string, id: string) {
  const ex = await Exercise.findById(id);
  if (!ex) throw new NotFoundError('Exercise not found');
  if (String(ex.authorUserId) !== userId) throw new ForbiddenError('Only author can unpublish');
  ex.status = 'DRAFT';
  await ex.save();
  return sanitize(ex.toObject());
}

export async function setVisibility(userId: string, id: string, isPublic: boolean) {
  const ex = await Exercise.findById(id);
  if (!ex) throw new NotFoundError('Exercise not found');
  if (String(ex.authorUserId) !== userId) throw new ForbiddenError('Only author can change visibility');
  ex.isPublic = !!isPublic;
  await ex.save();
  return sanitize(ex.toObject());
}

function sanitize(e: any) {
  return {
    id: String(e._id),
    authorUserId: String(e.authorUserId),
    languageId: e.languageId ? String(e.languageId) : null,
    title: e.title,
    description: e.description,
    difficulty: e.difficulty,
    baseXp: e.baseXp,
    isPublic: !!e.isPublic,
    codeTemplate: e.codeTemplate,
    status: e.status,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt
  };
}


