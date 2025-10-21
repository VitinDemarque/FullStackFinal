import { FilterQuery, Types } from 'mongoose';
import { ForbiddenError, NotFoundError } from '../utils/httpErrors';

// Models
import Exercise from '../models/Exercise.model';
import Language from '../models/Language.model';
import UserStat from '../models/UserStat.model';
import GroupMember from '../models/GroupMember.model';
import Group from '../models/Group.model';

export interface ListExercisesInput {
  q?: string;
  languageId?: string;
  authorId?: string;
  skip: number;
  limit: number;
  requestUserId?: string;
}

export async function list(input: Partial<ListExercisesInput>) {
  const { q, languageId, authorId, skip = 0, limit = 20, requestUserId } = input;

  let where: FilterQuery<any> = { status: 'PUBLISHED' };
  if (q) where.title = { $regex: q, $options: 'i' };
  if (languageId) where.languageId = new Types.ObjectId(languageId);
  if (authorId) where.authorUserId = new Types.ObjectId(authorId);
  // listagem pública apenas exercícios públicos

  const baseFilters: FilterQuery<any> = { ...where };
  
  if (requestUserId) {
    const userGroups = await GroupMember.find(
        { userId: new Types.ObjectId(requestUserId) },
        { groupId: 1 }
    ).lean();
    const userGroupIds = userGroups.map(m => m.groupId);

    // Lógica: Mostrar exercícios ONDE (é público) OU (o groupId está na lista de grupos do usuário)
    where = {
        ...baseFilters,
        $or: [
            { isPublic: true },
            { groupId: { $in: userGroupIds } }
        ]
    };
  } else {
    where = {
        ...baseFilters,
        isPublic: true
    };
  }

  const [items, total] = await Promise.all([
    Exercise.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Exercise.countDocuments(where)
  ]);

  return {
    items: items.map(sanitize),
    total
  };
}

export async function getById(id: string, requestUserId?: string) {
  const ex = (await Exercise.findById(id).lean()) as any;
  if (!ex) throw new NotFoundError('Exercise not found');

  // 1. Se for público E publicado, todos podem ver
  if (ex.isPublic && ex.status === 'PUBLISHED') {
    return sanitize(ex);
  }

  if (requestUserId) {
    // 2. Se for o autor, pode ver (mesmo DRAFT)
    if (String(ex.authorUserId) === requestUserId) {
      return sanitize(ex);
    }

    // 3. Se pertencer a um grupo, verificar se o usuário é membro
    if (ex.groupId) {
      const isMember = await GroupMember.findOne({
          groupId: ex.groupId,
          userId: new Types.ObjectId(requestUserId)
      }).lean();

      // Se for membro E estiver publicado, pode ver
      if (isMember && ex.status === 'PUBLISHED') {
          return sanitize(ex);
      }
    }
  }

  throw new NotFoundError('Exercise not found');
}

export async function create(userId: string, payload: Partial<any>) {
  // valida linguagem
  if (payload.languageId) {
    const lang = await Language.findById(payload.languageId).lean();
    if (!lang) throw new NotFoundError('Language not found');
  }

  let exerciseGroupId: Types.ObjectId | undefined = undefined;
  let exerciseIsPublic: boolean = Boolean(payload.isPublic ?? true); // Padrão

  // --- Lógica de Grupo ---
  if (payload.groupId) {
    const groupIdStr = String(payload.groupId);
    
    // 1. Validar se o grupo existe
    const group = await Group.findById(groupIdStr).lean();
    if (!group) throw new NotFoundError('Group not found');

    // 2. Validar se o usuário é membro (ou dono/mod)
    const membership = await GroupMember.findOne({
        groupId: new Types.ObjectId(groupIdStr),
        userId: new Types.ObjectId(userId)
    }).lean();

    if (!membership) {
        throw new ForbiddenError('You must be a member of the group to create an exercise for it');
    }

    // 3. Se é para um grupo, forçar a ser privado
    exerciseGroupId = new Types.ObjectId(groupIdStr);
    exerciseIsPublic = false; 
  }

  const doc = await Exercise.create({
    authorUserId: new Types.ObjectId(userId),
    languageId: payload.languageId ? new Types.ObjectId(payload.languageId) : undefined,
    groupId: exerciseGroupId, // <-- USAR
    title: payload.title ?? 'Untitled',
    description: payload.description ?? '',
    difficulty: Number(payload.difficulty ?? 1),
    baseXp: Number(payload.baseXp ?? 100),
    isPublic: exerciseIsPublic, // <-- USAR
    codeTemplate: String(payload.codeTemplate ?? '// start coding...'),
    status: payload.status ?? 'DRAFT'
  });

  // Atualiza contador de criados (lógica existente)
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

  // REGRA: Se tentar tornar público um exercício de grupo, remova o link do grupo.
  if (isPublic && ex.groupId) {
    ex.groupId = null;
  }
  
  ex.isPublic = !!isPublic;
  await ex.save();
  return sanitize(ex.toObject());
}

function sanitize(e: any) {
  return {
    id: String(e._id),
    authorUserId: String(e.authorUserId),
    languageId: e.languageId ? String(e.languageId) : null,
    groupId: e.groupId ? String(e.groupId) : null,
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


