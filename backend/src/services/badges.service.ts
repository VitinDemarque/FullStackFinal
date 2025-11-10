import Badge from '../models/Badge.model';
import Exercise from '../models/Exercise.model';
import UserBadge from '../models/UserBadge.model';
import { NotFoundError } from '../utils/httpErrors';
import { Types } from 'mongoose';

export interface Paging { skip: number; limit: number; }

export async function list({ skip, limit }: Paging) {
  const [items, total] = await Promise.all([
    Badge.find({}).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Badge.countDocuments({})
  ]);
  return { items, total };
}

export async function getById(id: string) {
  const b = await Badge.findById(id).lean();
  if (!b) throw new NotFoundError('Badge not found');
  return b;
}

export async function create(input: { name: string; description?: string; iconUrl?: string; ruleCode?: string }) {
  const b = await Badge.create({
    name: input.name,
    description: input.description ?? '',
    iconUrl: input.iconUrl ?? null,
    ruleCode: input.ruleCode ?? null
  });
  return b.toObject();
}

export async function update(id: string, payload: Partial<any>) {
  const b = await Badge.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
  if (!b) throw new NotFoundError('Badge not found');
  return b;
}

export async function remove(id: string) {
  await Badge.findByIdAndDelete(id);
}

export async function grantToUser(userId: string, badgeId: string, source?: string) {
  await UserBadge.updateOne(
    { userId: new Types.ObjectId(userId), badgeId: new Types.ObjectId(badgeId) },
    { $setOnInsert: { awardedAt: new Date() }, $set: { source: source ?? null } },
    { upsert: true }
  );
}

export async function revokeFromUser(userId: string, badgeId: string) {
  await UserBadge.deleteOne({ userId: new Types.ObjectId(userId), badgeId: new Types.ObjectId(badgeId) });
}

export async function getUserBadges(userId: string) {
  const userBadges = await UserBadge.find({ userId: new Types.ObjectId(userId) })
    .populate('badgeId')
    .lean();

  return userBadges.map((ub: any) => ({
    _id: ub._id,
    badge: ub.badgeId,
    awardedAt: ub.awardedAt,
    source: ub.source
  }));
}

// Concede badges triunfantes vinculados a um exercício concluído
export async function grantTriumphantBadgesForExerciseCompletion(userId: string, exerciseId: string) {
  // primeiro tenta pelo campo direto do exercício (configuração do admin)
  const ex = await Exercise.findById(exerciseId).lean();
  let rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' = 'COMMON';
  if (ex && ex.badgeRarity) rarity = ex.badgeRarity as any;

  if (ex && ex.triumphantBadgeId) {
    await grantToUser(userId, String(ex.triumphantBadgeId), `exerciseComplete:${rarity}`);
    return;
  }

  // fallback: badges com linkedExerciseId
  const triumphantBadges = await Badge.find({
    isTriumphant: true,
    linkedExerciseId: new Types.ObjectId(exerciseId)
  }).lean();

  for (const b of triumphantBadges) {
    await grantToUser(userId, String(b._id), `exerciseComplete:${rarity}`);
  }
}