import { ConflictError, NotFoundError } from '../utils/httpErrors';
import Language from '../models/Language.model';

export interface Paging { skip: number; limit: number; }

export async function list({ skip, limit }: Paging) {
  const [items, total] = await Promise.all([
    Language.find({}).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Language.countDocuments({})
  ]);
  return { items: items.map(sanitize), total };
}

export async function getById(id: string) {
  const doc = await Language.findById(id).lean();
  if (!doc) throw new NotFoundError('Language not found');
  return sanitize(doc);
}

export async function create(input: { name: string; slug: string }) {
  const exists = await Language.findOne({ $or: [{ name: input.name }, { slug: input.slug }] }).lean();
  if (exists) throw new ConflictError('Language name or slug already exists');
  const doc = await Language.create({ name: input.name, slug: input.slug });
  return sanitize(doc.toObject());
}

export async function update(id: string, payload: Partial<any>) {
  const doc = await Language.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
  if (!doc) throw new NotFoundError('Language not found');
  return sanitize(doc);
}

export async function remove(id: string) {
  await Language.findByIdAndDelete(id);
}

function sanitize(l: any) {
  return { id: String(l._id), name: l.name, slug: l.slug };
}