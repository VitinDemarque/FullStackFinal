import College from '../models/College.model';
import { ConflictError, NotFoundError } from '../utils/httpErrors';

export interface Paging { skip: number; limit: number; }

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function list({ skip, limit }: Paging, q?: string) {
  const filter = q && q.trim()
    ? { name: { $regex: escapeRegex(q.trim()), $options: 'i' } }
    : {};

  const [items, total] = await Promise.all([
    College.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    College.countDocuments(filter)
  ]);
  return { items: items.map(sanitize), total };
}

export async function getById(id: string) {
  const c = await College.findById(id).lean();
  if (!c) throw new NotFoundError('College not found');
  return sanitize(c);
}

export async function create(input: { name: string; acronym?: string; city?: string; state?: string }) {
  const normalizedName = (input.name || '').trim();
  // Checagem case-insensitive para evitar duplicados como "USP" vs "usp"
  const exists = await College.findOne({
    name: { $regex: `^${escapeRegex(normalizedName)}$`, $options: 'i' }
  }).lean();
  if (exists) throw new ConflictError('College already exists');
  const c = await College.create({ ...input, name: normalizedName });
  return sanitize(c.toObject());
}

export async function update(id: string, payload: Partial<any>) {
  // Previne duplicidade ao alterar nome (case-insensitive)
  if (payload?.name && typeof payload.name === 'string') {
    const newName = payload.name.trim()
    const exists = await College.findOne({
      name: { $regex: `^${escapeRegex(newName)}$`, $options: 'i' },
      _id: { $ne: id }
    }).lean()
    if (exists) throw new ConflictError('College already exists')
    payload.name = newName
  }
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