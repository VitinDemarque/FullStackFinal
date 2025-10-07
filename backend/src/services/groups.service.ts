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
