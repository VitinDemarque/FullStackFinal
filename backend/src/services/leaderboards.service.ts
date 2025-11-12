import { PipelineStage, Types } from 'mongoose';
import Submission from '../models/Submission.model';
import User from '../models/User.model';
import { BadRequestError } from '../utils/httpErrors';

export interface Paging { skip: number; limit: number; }

/**
 * Ranking geral: baseado no xpTotal dos usuários
 */
export async function general({ skip, limit }: Paging) {
  const users = await User.find({})
    .select('_id name handle collegeId xpTotal level avatarUrl')
    .sort({ xpTotal: -1, level: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return users.map((user: any, idx: number) => ({
    position: skip + idx + 1,
    userId: String(user._id),
    name: user.name,
    handle: user.handle,
    avatarUrl: user.avatarUrl ?? null,
    collegeId: user.collegeId ? String(user.collegeId) : null,
    points: user.xpTotal,
    xpTotal: user.xpTotal
  }));
}

/** Ranking por linguagem */
export async function byLanguage(languageId: string, { skip, limit }: Paging) {
  if (!languageId) throw new BadRequestError('languageId required');

  const pipeline: PipelineStage[] = [
    { $match: { status: 'ACCEPTED' } },
    { $lookup: { from: 'exercises', localField: 'exerciseId', foreignField: '_id', as: 'ex' } },
    { $unwind: '$ex' },
    { $match: { 'ex.languageId': new Types.ObjectId(languageId) } },
    { $group: { _id: '$userId', points: { $sum: '$xpAwarded' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$_id', points: 1, xpTotal: '$user.xpTotal', name: '$user.name', handle: '$user.handle', collegeId: '$user.collegeId', avatarUrl: '$user.avatarUrl' } },
    { $sort: { points: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const rows = await Submission.aggregate(pipeline);
  return rows.map((r: any, idx: any) => ({
    position: skip + idx + 1,
    userId: String(r.userId),
    name: r.name,
    handle: r.handle,
    avatarUrl: r.avatarUrl ?? null,
    collegeId: r.collegeId ? String(r.collegeId) : null,
    points: r.points,
    xpTotal: r.xpTotal
  }));
}

/** Ranking por grupo */
export async function byGroup(groupId: string, { skip, limit }: Paging) {
  if (!groupId) throw new BadRequestError('groupId required');

  const pipeline: PipelineStage[] = [
    { $match: { status: 'ACCEPTED' } },
    { $lookup: { from: 'exercises', localField: 'exerciseId', foreignField: '_id', as: 'ex' } },
    { $unwind: '$ex' },
    { $match: { 'ex.groupId': new Types.ObjectId(groupId) } },
    { $group: { _id: '$userId', points: { $sum: '$xpAwarded' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$_id', points: 1, xpTotal: '$user.xpTotal', name: '$user.name', handle: '$user.handle', collegeId: '$user.collegeId', avatarUrl: '$user.avatarUrl' } },
    { $sort: { points: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const rows = await Submission.aggregate(pipeline);
  return rows.map((r: any, idx: any) => ({
    position: skip + idx + 1,
    userId: String(r.userId),
    name: r.name,
    handle: r.handle,
    avatarUrl: r.avatarUrl ?? null,
    collegeId: r.collegeId ? String(r.collegeId) : null,
    points: r.points,
    xpTotal: r.xpTotal
  }));
}

/** Ranking por temporada */
export async function bySeason(seasonId: string, { skip, limit }: Paging) {
  if (!seasonId) throw new BadRequestError('seasonId required');

  const pipeline: PipelineStage[] = [
    { $match: { status: 'ACCEPTED', seasonId: new Types.ObjectId(seasonId) } },
    { $group: { _id: '$userId', points: { $sum: '$xpAwarded' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$_id', points: 1, xpTotal: '$user.xpTotal', name: '$user.name', handle: '$user.handle', collegeId: '$user.collegeId', avatarUrl: '$user.avatarUrl' } },
    { $sort: { points: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const rows = await Submission.aggregate(pipeline);
  return rows.map((r: any, idx: any) => ({
    position: skip + idx + 1,
    userId: String(r.userId),
    name: r.name,
    handle: r.handle,
    avatarUrl: r.avatarUrl ?? null,
    collegeId: r.collegeId ? String(r.collegeId) : null,
    points: r.points,
    xpTotal: r.xpTotal
  }));
}

/** Ranking por faculdade */
export async function byCollege(collegeId: string, { skip, limit }: Paging) {
  if (!collegeId) throw new BadRequestError('collegeId required');

  const pipeline: PipelineStage[] = [
    { $match: { status: 'ACCEPTED' } },
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $match: { 'user.collegeId': new Types.ObjectId(collegeId) } },
    { $group: { _id: '$userId', points: { $sum: '$xpAwarded' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user2' } },
    { $unwind: '$user2' },
    { $project: { _id: 0, userId: '$_id', points: 1, xpTotal: '$user2.xpTotal', name: '$user2.name', handle: '$user2.handle', collegeId: '$user2.collegeId', avatarUrl: '$user2.avatarUrl' } },
    { $sort: { points: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const rows = await Submission.aggregate(pipeline);
  return rows.map((r: any, idx: any) => ({
    position: skip + idx + 1,
    userId: String(r.userId),
    name: r.name,
    handle: r.handle,
    avatarUrl: r.avatarUrl ?? null,
    collegeId: r.collegeId ? String(r.collegeId) : null,
    points: r.points,
    xpTotal: r.xpTotal
  }));
}

/** Ranking por exercício (desafio) */
export async function byExercise(exerciseId: string, { skip, limit }: Paging) {
  if (!exerciseId) throw new BadRequestError('exerciseId required');

  const pipeline: PipelineStage[] = [
    { $match: { status: 'ACCEPTED', exerciseId: new Types.ObjectId(exerciseId) } },
    { $group: { _id: '$userId', points: { $sum: '$xpAwarded' } } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, userId: '$_id', points: 1, xpTotal: '$user.xpTotal', name: '$user.name', handle: '$user.handle', collegeId: '$user.collegeId', avatarUrl: '$user.avatarUrl' } },
    { $sort: { points: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const rows = await Submission.aggregate(pipeline);
  return rows.map((r: any, idx: any) => ({
    position: skip + idx + 1,
    userId: String(r.userId),
    name: r.name,
    handle: r.handle,
    avatarUrl: r.avatarUrl ?? null,
    collegeId: r.collegeId ? String(r.collegeId) : null,
    points: r.points,
    xpTotal: r.xpTotal
  }));
}