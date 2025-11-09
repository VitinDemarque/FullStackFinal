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
  excludeMyExercises?: boolean;
}

export interface ListCommunityExercisesInput {
  q?: string;
  languageId?: string;
  skip: number;
  limit: number;
  requestUserId: string;
}

export async function list(input: Partial<ListExercisesInput>) {
  const { q, languageId, authorId, skip = 0, limit = 20, requestUserId, excludeMyExercises = false } = input;

  let where: FilterQuery<any> = {};
  if (q) where.title = { $regex: q, $options: 'i' };
  if (languageId) where.languageId = new Types.ObjectId(languageId);
  if (authorId) where.authorUserId = new Types.ObjectId(authorId);

  const baseFilters: FilterQuery<any> = { ...where };
  
  if (requestUserId) {
    const userGroups = await GroupMember.find(
        { userId: new Types.ObjectId(requestUserId) },
        { groupId: 1 }
    ).lean();
    const userGroupIds = userGroups.map(m => m.groupId);

    where = {
        ...baseFilters,
        $or: [
            { 
              status: 'PUBLISHED',
              isPublic: true 
            },
            { 
              groupId: { $in: userGroupIds },

            }
        ]
    };

    if (excludeMyExercises) {
      where.authorUserId = { $ne: new Types.ObjectId(requestUserId) };
    }
  } else {
    where = {
        ...baseFilters,
        isPublic: true,
        status: 'PUBLISHED' 
    };
  }

  const [items, total] = await Promise.all([
    Exercise.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Exercise.countDocuments(where)
  ]);

  const itemsSanitized = await Promise.all(items.map(ensurePublicCodeAndSanitize));

  return {
    items: itemsSanitized,
    total
  };
}

export async function listByAuthor(authorId: string, skip = 0, limit = 20) {
  const where: FilterQuery<any> = { authorUserId: new Types.ObjectId(authorId) };

  const [items, total] = await Promise.all([
    Exercise.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Exercise.countDocuments(where)
  ]);

  const itemsSanitized = await Promise.all(items.map(ensurePublicCodeAndSanitize));

  return {
    items: itemsSanitized,
    total
  };
}

export async function getById(id: string, requestUserId?: string) {
  const ex = (await Exercise.findById(id).lean()) as any;
  if (!ex) throw new NotFoundError('Exercise not found');

  if (ex.isPublic && ex.status === 'PUBLISHED') {
    return ensurePublicCodeAndSanitize(ex);
  }

  if (requestUserId) {
    if (String(ex.authorUserId) === requestUserId) {
      return sanitize(ex);
    }

    if (ex.groupId) {
      const isMember = await GroupMember.findOne({
          groupId: ex.groupId,
          userId: new Types.ObjectId(requestUserId)
      }).lean();

      if (isMember && ex.status === 'PUBLISHED') {
          return ensurePublicCodeAndSanitize(ex);
      }
    }
  }

  throw new NotFoundError('Exercise not found');
}

export async function create(userId: string, payload: Partial<any>) {
  if (payload.languageId) {
    const lang = await Language.findById(payload.languageId).lean();
    if (!lang) throw new NotFoundError('Language not found');
  }

  let exerciseGroupId: Types.ObjectId | null = null;
  let exerciseIsPublic: boolean = Boolean(payload.isPublic ?? true);

  if (payload.groupId) {
    const groupIdStr = String(payload.groupId);
    
    const group = await Group.findById(groupIdStr).lean();
    if (!group) throw new NotFoundError('Group not found');

    const membership = await GroupMember.findOne({
        groupId: new Types.ObjectId(groupIdStr),
        userId: new Types.ObjectId(userId)
    }).lean();

    if (!membership) {
        throw new ForbiddenError('You must be a member of the group to create an exercise for it');
    }

    exerciseGroupId = new Types.ObjectId(groupIdStr);
    exerciseIsPublic = false; 
  }

  const doc = await Exercise.create({
    authorUserId: new Types.ObjectId(userId),
    languageId: payload.languageId ? new Types.ObjectId(payload.languageId) : undefined,
    groupId: exerciseGroupId,
    title: payload.title ?? 'Untitled',
    subject: payload.subject ?? '',
    description: payload.description ?? '',
    difficulty: Number(payload.difficulty ?? 1),
    baseXp: Number(payload.baseXp ?? 100),
    isPublic: exerciseIsPublic,
    codeTemplate: String(payload.codeTemplate ?? '// start coding...'),
    publicCode: await generatePublicCode(),
    status: payload.status ?? (exerciseIsPublic ? 'PUBLISHED' : 'DRAFT')
  });

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
  if (payload.subject !== undefined) ex.subject = payload.subject;
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
  if (!ex) return;
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

  if (isPublic && ex.groupId) {
    ex.groupId = null;
  }
  
  ex.isPublic = !!isPublic;
  await ex.save();
  return sanitize(ex.toObject());
}

export async function listCommunity(input: Partial<ListCommunityExercisesInput>) {
  const { q, languageId, skip = 0, limit = 20, requestUserId } = input;

  let where: FilterQuery<any> = {};
  
  // Buscar apenas exercícios públicos e publicados, excluindo os do próprio usuário
  where = {
    status: 'PUBLISHED',
    isPublic: true,
    authorUserId: { $ne: new Types.ObjectId(requestUserId) }
  };
  
  if (q) where.title = { $regex: q, $options: 'i' };
  if (languageId) where.languageId = new Types.ObjectId(languageId);

  const [items, total] = await Promise.all([
    Exercise.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Exercise.countDocuments(where)
  ]);

  const itemsSanitized = await Promise.all(items.map(ensurePublicCodeAndSanitize));

  return {
    items: itemsSanitized,
    total
  };
}

function sanitize(e: any) {
  return {
    id: String(e._id),
    authorUserId: String(e.authorUserId),
    languageId: e.languageId ? String(e.languageId) : null,
    groupId: e.groupId ? String(e.groupId) : null,
    title: e.title,
    subject: e.subject,
    description: e.description,
    difficulty: e.difficulty,
    baseXp: e.baseXp,
    isPublic: !!e.isPublic,
    codeTemplate: e.codeTemplate,
    publicCode: e.publicCode || null,
    status: e.status,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt
  };
}

async function generatePublicCode(): Promise<string> {
  const letters = () => Array.from({ length: 4 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
  const numbers = () => String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  for (let i = 0; i < 10; i++) {
    const code = `#${letters()}${numbers()}`;
    const exists = await Exercise.findOne({ publicCode: code }).lean();
    if (!exists) return code;
  }
  // Fallback with timestamp to avoid rare collisions
  const fallback = `#EX${Date.now().toString().slice(-8)}`;
  return fallback;
}

export async function getByPublicCode(publicCode: string, requestUserId?: string) {
  const ex = (await Exercise.findOne({ publicCode }).lean()) as any;
  if (!ex) throw new NotFoundError('Exercise not found');

  if (ex.isPublic && ex.status === 'PUBLISHED') {
    return sanitize(ex);
  }

  if (requestUserId) {
    if (String(ex.authorUserId) === requestUserId) {
      return sanitize(ex);
    }

    if (ex.groupId) {
      const isMember = await GroupMember.findOne({
          groupId: ex.groupId,
          userId: new Types.ObjectId(requestUserId)
      }).lean();

      if (isMember && ex.status === 'PUBLISHED') {
          return sanitize(ex);
      }
    }
  }

  throw new NotFoundError('Exercise not found');
}

async function ensurePublicCodeAndSanitize(e: any) {
  if (!e.publicCode) {
    const code = await generatePublicCode();
    await Exercise.updateOne({ _id: e._id }, { $set: { publicCode: code } });
    e.publicCode = code;
  }
  return sanitize(e);
}