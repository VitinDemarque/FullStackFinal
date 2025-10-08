import LevelRule from '../models/LevelRule.model';
import { NotFoundError } from '../utils/httpErrors';

export interface Paging { skip: number; limit: number; }

export async function list({ skip, limit }: Paging) {
  const [items, total] = await Promise.all([
    LevelRule.find({}).sort({ level: 1 }).skip(skip).limit(limit).lean(),
    LevelRule.countDocuments({})
  ]);
  return { items, total };
}

export async function getByLevel(level: number) {
  const doc = await LevelRule.findOne({ level }).lean();
  if (!doc) throw new NotFoundError('Level rule not found');
  return doc;
}

export async function upsert(level: number, minXp: number) {
  const doc = await LevelRule.findOneAndUpdate(
    { level },
    { $set: { minXp } },
    { new: true, upsert: true }
  ).lean();
  return doc;
}

export async function remove(level: number) {
  await LevelRule.deleteOne({ level });
}