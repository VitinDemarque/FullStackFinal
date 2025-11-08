import { Types } from 'mongoose';
import crypto from 'crypto';
import { ForbiddenError, NotFoundError, BadRequestError } from '../utils/httpErrors';

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

  // Para cada grupo, buscar a contagem de membros
  const itemsWithMembers = await Promise.all(
    items.map(async (group) => {
      const memberCount = await GroupMember.countDocuments({
        groupId: group._id
      });
      
      return {
        ...sanitize(group),
        memberCount
      };
    })
  );

  return { items: itemsWithMembers, total };
}

export async function listMyGroups(userId: string, { skip, limit }: Paging) {
  // Buscar todos os grupos que o usuário é membro (via GroupMember)
  const memberships = await GroupMember.find({
    userId: new Types.ObjectId(userId)
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean<IGroupMember[]>();

  const groupIds = memberships.map(m => m.groupId);

  // Buscar os grupos correspondentes
  const groups = await Group.find({
    _id: { $in: groupIds }
  })
    .sort({ createdAt: -1 })
    .lean<IGroup[]>();

  // Criar um mapa para manter a ordem e incluir informações de membership
  const groupMap = new Map();
  groups.forEach(group => {
    const membership = memberships.find(m => String(m.groupId) === String(group._id));
    groupMap.set(String(group._id), {
      group,
      membership
    });
  });

  // Ordenar pela ordem dos memberships (mais recente primeiro)
  const orderedGroups = memberships
    .map(m => groupMap.get(String(m.groupId)))
    .filter(Boolean);

  // Para cada grupo, buscar a contagem de membros
  const itemsWithMembers = await Promise.all(
    orderedGroups.map(async ({ group, membership }) => {
      const memberCount = await GroupMember.countDocuments({
        groupId: group._id
      });
      
      return {
        ...sanitize(group),
        memberCount,
        role: membership.role,
        joinedAt: membership.joinedAt
      };
    })
  );

  // Contar total de grupos do usuário
  const total = await GroupMember.countDocuments({
    userId: new Types.ObjectId(userId)
  });

  return { items: itemsWithMembers, total };
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
  await assertModeratorOrOwner(requestUserId, id);

  if (payload.name !== undefined) g.name = payload.name;
  if (payload.description !== undefined) g.description = payload.description;
  if (payload.visibility !== undefined) g.visibility = payload.visibility;

  await g.save();
  return sanitize(g.toObject() as IGroup);
}

export async function remove(requestUserId: string, id: string) {
  const g = await Group.findById(id);
  if (!g) return; // idempotente
  await assertModeratorOrOwner(requestUserId, id);

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
  console.log('🔍 [BACKEND] listExercisesForGroup called');
  console.log('🔍 [BACKEND] requestUserId:', requestUserId);
  console.log('🔍 [BACKEND] groupId:', groupId);
  
  // 1. Validar se o usuário é membro
  const membership = await GroupMember.findOne({
      groupId: new Types.ObjectId(groupId),
      userId: new Types.ObjectId(requestUserId)
  }).lean();

  console.log('🔍 [BACKEND] Membership found:', membership);

  if (!membership) {
      // Verificar se o grupo existe antes de dar 403 (para não vazar informação)
      const group = await Group.findById(groupId).lean<IGroup | null>();
      console.log('🔍 [BACKEND] Group found:', group);
      if (!group) throw new NotFoundError('Group not found');
      
      throw new ForbiddenError('You must be a member of this group to view its exercises');
  }

  // 2. Buscar exercícios do grupo
  const where = {
      groupId: new Types.ObjectId(groupId)
  };

  console.log('🔍 [BACKEND] MongoDB query where:', where);

  const [items, total] = await Promise.all([
      Exercise.find(where)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean<IExercise[]>(),
      Exercise.countDocuments(where)
  ]);

  console.log('🔍 [BACKEND] Found exercises:', items);
  console.log('🔍 [BACKEND] Total count:', total);

  return {
      items: items.map(sanitizeExerciseLite),
      total
  };
}

export async function generateInviteLink(requestUserId: string, groupId: string) {
  const g = await Group.findById(groupId).lean<IGroup | null>();
  if (!g) throw new NotFoundError('Group not found');

  await assertModeratorOrOwner(requestUserId, groupId);

  // Se já houver token ativo, reutiliza
  if (g.tokenConvite && g.tokenConviteExpiraEm && g.tokenConviteExpiraEm > new Date()) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return { 
      link: `${frontendUrl}/grupos/${groupId}/entrar?token=${g.tokenConvite}`,
      expiresAt: g.tokenConviteExpiraEm
    };
  }

  // Gera novo token e define validade (7 dias)
  const token = crypto.randomBytes(16).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await Group.findByIdAndUpdate(groupId, {
    $set: { tokenConvite: token, tokenConviteExpiraEm: expiresAt }
  });

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const link = `${frontendUrl}/grupos/${groupId}/entrar?token=${token}`;
  
  return { link, expiresAt };
}

export async function joinByToken(userId: string, groupId: string, token: string) {
  const g = await Group.findById(groupId).lean<IGroup | null>();
  if (!g) throw new NotFoundError('Group not found');

  if (g.visibility === 'PRIVATE' && (!g.tokenConvite || g.tokenConvite !== token)) {
    throw new BadRequestError('Invalid token or private group without valid invite');
  }

  if (g.tokenConviteExpiraEm && g.tokenConviteExpiraEm < new Date()) {
    throw new BadRequestError('Invite token expired');
  }

  // Verifica se já é membro
  const exists = await GroupMember.findOne({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(userId)
  }).lean<IGroupMember | null>();

  if (exists) {
    throw new BadRequestError('User is already a member of this group');
  }

  // Adiciona como membro
  await GroupMember.create({
    groupId: new Types.ObjectId(groupId),
    userId: new Types.ObjectId(userId),
    role: 'MEMBER'
  });

  return { joined: true };
}