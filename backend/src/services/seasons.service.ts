import Season from '../models/Season.model';
import { BadRequestError, NotFoundError } from '../utils/httpErrors';

export interface Paging { skip: number; limit: number; }

export async function list({ skip, limit }: Paging) {
  const [items, total] = await Promise.all([
    Season.find({}).sort({ startDate: -1 }).skip(skip).limit(limit).lean(),
    Season.countDocuments({})
  ]);
  return { items: items.map(sanitize), total };
}

export async function getById(id: string) {
  const s = await Season.findById(id).lean();
  if (!s) throw new NotFoundError('Season not found');
  return sanitize(s);
}

export async function create(input: { name: string; startDate: string; endDate: string }) {
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  if (isNaN(+start) || isNaN(+end) || end < start) throw new BadRequestError('Invalid dates');
  const s = await Season.create({ name: input.name, startDate: start, endDate: end, isActive: false });
  return sanitize(s.toObject());
}

export async function update(id: string, payload: Partial<any>) {
  if (payload.startDate || payload.endDate) {
    const start = payload.startDate ? new Date(payload.startDate) : undefined;
    const end = payload.endDate ? new Date(payload.endDate) : undefined;
    if ((start && isNaN(+start)) || (end && isNaN(+end))) throw new BadRequestError('Invalid dates');
    if (start && end && end < start) throw new BadRequestError('endDate must be after startDate');
  }

  const s = await Season.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
  if (!s) throw new NotFoundError('Season not found');
  return sanitize(s);
}

export async function remove(id: string) {
  await Season.findByIdAndDelete(id);
}

export async function activate(id: string) {
  const s = await Season.findById(id);
  if (!s) throw new NotFoundError('Season not found');
  s.isActive = true;
  await s.save();
  return sanitize(s.toObject());
}

export async function deactivate(id: string) {
  const s = await Season.findById(id);
  if (!s) throw new NotFoundError('Season not found');
  s.isActive = false;
  await s.save();
  return sanitize(s.toObject());
}

function sanitize(s: any) {
  return {
    id: String(s._id),
    name: s.name,
    startDate: s.startDate,
    endDate: s.endDate,
    isActive: !!s.isActive
  };
}