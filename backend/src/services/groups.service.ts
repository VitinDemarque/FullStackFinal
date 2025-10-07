import { Types } from 'mongoose';
import { ForbiddenError, NotFoundError } from '../utils/httpErrors';

import Group, { IGroup } from '../models/Group.model';
import GroupMember, { IGroupMember } from '../models/GroupMember.model';

export interface Paging { skip: number; limit: number; }

export async function listPublic({ skip, limit }: Paging) {
  // Tipamos explicitamente o retorno do lean como array de IGroup
  const [items, total] = await Promise.all([
    Group.find({ visibility: 'PUBLIC' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IGroup[]>(),
    Group.countDocuments({ visibility: 'PUBLIC' })
  ]);

  return { items: items.map(sanitize), total };
}

export async function getById(id: string) {
  // Doc único (ou null)
  const group = await Group.findById(id).lean<IGroup | null>();
  if (!group) throw new NotFoundError('Group not found');

  const members = await GroupMember
    .find({ groupId: new Types.ObjectId(id) })
    .lean<IGroupMember[]>();

  return {
    ...sanitize(group),
    members: members.map((m) => ({
      userId: String(m.userId),
      role: m.role,
      joinedAt: m.joinedAt
    }))
  };
}

export async function create(ownerUserId: string, payload: Partial<IGroup>) {
  const g = await Group.create({
    ownerUserId: new Types.ObjectId(ownerUserId),
    name: payload.name ?? 'New Group',
    description: payload.description ?? '',
    visibility: payload.visibility ?? 'PUBLIC'
  });

  await GroupMember.create({
    groupId: g._id,
    userId: new Types.ObjectId(ownerUserId),
    role: 'MODERATOR'
  });

  return sanitize(g.toObject() as IGroup);
}

export async function update(requestUserId: string, id: string, payload: Partial<IGroup>) {
  const g = await Group.findById(id);
  if (!g) throw new NotFoundError('Group not found');
  if (String(g.ownerUserId) !== requestUserId) {
    throw new ForbiddenError('Only owner can update group');
  }

  if (payload.name !== undefined) g.name = payload.name;
  if (payload.description !== undefined) g.description = payload.description;
  if (payload.visibility !== undefined) g.visibility = payload.visibility;

  await g.save();
  return sanitize(g.toObject() as IGroup);
}

export async function remove(requestUserId: string, id: string) {
  const g = await Group.findById(id);
  if (!g) return; // idempotente
  if (String(g.ownerUserId) !== requestUserId) {
    throw new ForbiddenError('Only owner can delete group');
  }

  await Promise.all([
    GroupMember.deleteMany({ groupId: g._id }),
    g.deleteOne()
  ]);
}