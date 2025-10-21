import { Types } from 'mongoose';
import { ForbiddenError, NotFoundError } from '../utils/httpErrors';

import Group, { IGroup } from '../models/Group.model';
import GroupMember, { IGroupMember } from '../models/GroupMember.model';
import Exercise from '../models/Exercise.model';
import { IExercise } from '../models/Exercise.model';

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

export async function join(userId: string, groupId: string) {
  const g = await Group.findById(groupId).lean<IGroup | null>();
  if (!g) throw new NotFoundError('Group not found');

  // se privado, regra: só via addMember por owner/mod
  if (g.visibility === 'PRIVATE') {
    throw new ForbiddenError('Private group: ask a moderator');
  }

  const exists = await GroupMember.findOne({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(userId)
  }).lean<IGroupMember | null>();

  if (exists) return { joined: true };

  await GroupMember.create({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(userId),
    role: 'MEMBER'
  });

  return { joined: true };
}

export async function leave(userId: string, groupId: string) {
  await GroupMember.deleteOne({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(userId)
  });
  return { left: true };
}

export async function addMember(requestUserId: string, groupId: string, targetUserId: string) {
  await assertModeratorOrOwner(requestUserId, groupId);

  const exists = await GroupMember.findOne({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(targetUserId)
  }).lean<IGroupMember | null>();

  if (exists) return { added: true };

  await GroupMember.create({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(targetUserId),
    role: 'MEMBER'
  });

  return { added: true };
}

export async function removeMember(requestUserId: string, groupId: string, targetUserId: string) {
  await assertModeratorOrOwner(requestUserId, groupId);
  await GroupMember.deleteOne({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(targetUserId)
  });
  return { removed: true };
}

export async function setMemberRole(
  requestUserId: string,
  groupId: string,
  targetUserId: string,
  role: 'MEMBER' | 'MODERATOR'
) {
  await assertModeratorOrOwner(requestUserId, groupId);
  await GroupMember.updateOne(
    { groupId: new Types.ObjectId(groupId), userId: new Types.ObjectId(targetUserId) },
    { $set: { role } }
  );
  return { updated: true };
}

async function assertModeratorOrOwner(requestUserId: string, groupId: string) {
  const g = await Group.findById(groupId).lean<IGroup | null>();
  if (!g) throw new NotFoundError('Group not found');

  if (String(g.ownerUserId) === requestUserId) return;

  const member = await GroupMember.findOne({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(requestUserId)
  }).lean<IGroupMember | null>();

  if (!member || member.role !== 'MODERATOR') {
    throw new ForbiddenError('Only owner or moderator can manage members');
  }
}

function sanitize(g: IGroup) {
  return {
    id: String(g._id),
    ownerUserId: String(g.ownerUserId),
    name: g.name,
    description: g.description ?? null,
    visibility: g.visibility,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt
  };
}

function sanitizeExerciseLite(e: IExercise) {
  return {
    id: String(e._id),
    title: e.title,
    languageId: e.languageId ? String(e.languageId) : null,
    difficulty: e.difficulty,
    isPublic: !!e.isPublic,
    status: e.status,
    createdAt: e.createdAt
  };
}

export async function listExercisesForGroup(
    requestUserId: string, 
    groupId: string, 
    { skip, limit }: Paging
) {
    // 1. Validar se o usuário é membro
    const membership = await GroupMember.findOne({
        groupId: new Types.ObjectId(groupId),
        userId: new Types.ObjectId(requestUserId)
    }).lean();

    if (!membership) {
        // Verificar se o grupo existe antes de dar 403 (para não vazar informação)
        const group = await Group.findById(groupId).lean<IGroup | null>();
        if (!group) throw new NotFoundError('Group not found');
        
        throw new ForbiddenError('You must be a member of this group to view its exercises');
    }

    // 2. Buscar exercícios (publicados) do grupo
    const where = {
        groupId: new Types.ObjectId(groupId),
        status: 'PUBLISHED'
    };

    const [items, total] = await Promise.all([
        Exercise.find(where)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean<IExercise[]>(),
        Exercise.countDocuments(where)
    ]);

    return {
        items: items.map(sanitizeExerciseLite),
        total
    };
}