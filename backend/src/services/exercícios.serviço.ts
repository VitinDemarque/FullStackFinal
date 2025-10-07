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

