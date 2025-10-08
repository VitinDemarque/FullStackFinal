import College from '../models/College.model';
import { ConflictError, NotFoundError } from '../utils/httpErrors';

export interface Paging { skip: number; limit: number; }

export async function list({ skip, limit }: Paging) {
  const [items, total] = await Promise.all([
    College.find({}).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    College.countDocuments({})
  ]);
  return { items: items.map(sanitize), total };
}

export async function getById(id: string) {
  const c = await College.findById(id).lean();
  if (!c) throw new NotFoundError('College not found');
  return sanitize(c);
}

export async function create(input: { name: string; acronym?: string; city?: string; state?: string }) {
  const exists = await College.findOne({ name: input.name }).lean();
  if (exists) throw new ConflictError('College already exists');
  const c = await College.create(input);
  return sanitize(c.toObject());
}

export async function update(id: string, payload: Partial<any>) {
  const c = await College.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
  if (!c) throw new NotFoundError('College not found');
  return sanitize(c);
}

export async function remove(id: string) {
  await College.findByIdAndDelete(id);
}

function sanitize(c: any) {
  return {
    id: String(c._id),
    name: c.name,
    acronym: c.acronym ?? null,
    city: c.city ?? null,
    state: c.state ?? null
  };
}