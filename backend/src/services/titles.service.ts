import Title from '../models/Title.model';
import UserTitle from '../models/UserTitle.model';
import { NotFoundError } from '../utils/httpErrors';
import { Types } from 'mongoose';

export interface Paging { skip: number; limit: number; }

export async function list({ skip, limit }: Paging) {
  const [items, total] = await Promise.all([
    Title.find({}).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Title.countDocuments({})
  ]);
  return { items, total };
}

export async function getById(id: string) {
  const t = await Title.findById(id).lean();
  if (!t) throw new NotFoundError('Title not found');
  return t;
}

export async function create(input: { name: string; description?: string; minLevel?: number; minXp?: number }) {
  const t = await Title.create(input);
  return t.toObject();
}

export async function update(id: string, payload: Partial<any>) {
  const t = await Title.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
  if (!t) throw new NotFoundError('Title not found');
  return t;
}

export async function remove(id: string) {
  await Title.findByIdAndDelete(id);
}

export async function grantToUser(userId: string, titleId: string, active = false) {
  await UserTitle.updateOne(
    { userId: new Types.ObjectId(userId), titleId: new Types.ObjectId(titleId) },
    { $set: { active, awardedAt: new Date() } },
    { upsert: true }
  );
}

export async function setActive(userId: string, titleId: string, active: boolean) {
  await UserTitle.updateOne(
    { userId: new Types.ObjectId(userId), titleId: new Types.ObjectId(titleId) },
    { $set: { active } }
  );
}