import { Types } from 'mongoose';
import ExerciseStat, { IExerciseStat } from '../models/ExerciseStat.model';
import UserStat, { IUserStat } from '../models/UserStat.model';
import Submission from '../models/Submission.model'; // (mantido se usar em futuras agregações)
import Exercise, { IExercise } from '../models/Exercise.model';
import Forum from '../models/Forum.model';
import ForumComment from '../models/ForumComment.model';
import ForumTopic from '../models/ForumTopic.model';
import Group from '../models/Group.model';
import GroupMember from '../models/GroupMember.model';
import { ISubmission } from '../models/Submission.model';

export interface ListExerciseStatsInput {
  exerciseId?: string;
  skip: number;
  limit: number;
}

export async function listExerciseStats({ exerciseId, skip, limit }: ListExerciseStatsInput) {
  const where: Record<string, any> = {};
  if (exerciseId) where.exerciseId = new Types.ObjectId(exerciseId);

  // TIPAGEM explícita nos lean()
  const [items, total] = await Promise.all([
    ExerciseStat.find(where)
      .sort({ lastSolveAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IExerciseStat[]>(),
    ExerciseStat.countDocuments(where)
  ]);

  // Enriquecer com título do exercício (opcional)
  const ids = items.map(i => i.exerciseId);
  const exMap = new Map<string, Pick<IExercise, '_id' | 'title'>>();
  if (ids.length) {
    const exs = await Exercise.find({ _id: { $in: ids } })
      .select({ title: 1 }) // otimiza
      .lean<IExercise[]>();

    exs.forEach(e => exMap.set(String(e._id), { _id: e._id, title: e.title }));
  }

  return {
    items: items.map(i => ({
      exerciseId: String(i.exerciseId),
      solvesCount: i.solvesCount ?? 0,
      avgScore: i.avgScore ?? null,
      lastSolveAt: i.lastSolveAt ?? null,
      exercise: exMap.has(String(i.exerciseId))
        ? { id: String(i.exerciseId), title: exMap.get(String(i.exerciseId))!.title }
        : null
    })),
    total
  };
}

export async function getUserStats(userId: string) {
  // TIPAGEM explícita no lean()
  const stats = await UserStat.findOne({ userId: new Types.ObjectId(userId) }).lean<IUserStat | null>();

  // Buscar linguagens únicas usadas pelo usuário em suas submissões
  const languagesUsed = await Submission.distinct('languageId', { 
    userId: new Types.ObjectId(userId) 
  });

  // Contar desafios existentes (ativos no banco) criados pelo usuário
  const createdChallenges = await Exercise.countDocuments({
    authorUserId: new Types.ObjectId(userId)
  });

  // Contar desafios publicados pelo usuário
  const publishedChallenges = await Exercise.countDocuments({
    authorUserId: new Types.ObjectId(userId),
    status: 'PUBLISHED'
  });

  // Contar fóruns criados pelo usuário
  const forumsCreated = await Forum.countDocuments({
    donoUsuarioId: new Types.ObjectId(userId),
    status: { $ne: 'EXCLUIDO' }
  });

  // Contar comentários do fórum feitos pelo usuário (exceto excluídos)
  const forumCommentsCount = await ForumComment.countDocuments({
    autorUsuarioId: new Types.ObjectId(userId),
    status: { $ne: 'EXCLUIDO' }
  });

  // Contar tópicos do fórum criados pelo usuário
  const forumTopicsCount = await ForumTopic.countDocuments({
    autorUsuarioId: new Types.ObjectId(userId)
  });

  // Contar grupos criados pelo usuário
  const groupsCreatedCount = await Group.countDocuments({
    ownerUserId: new Types.ObjectId(userId)
  });

  // Contar grupos em que o usuário entrou (membro ou moderador)
  const groupsJoinedCount = await GroupMember.countDocuments({
    userId: new Types.ObjectId(userId)
  });

  return {
    userId,
    exercisesCreatedCount: createdChallenges,
    exercisesSolvedCount: stats?.exercisesSolvedCount ?? 0,
    languagesUsed: languagesUsed.length,
    publishedChallenges,
    forumsCreated,
    forumCommentsCount,
    forumTopicsCount,
    groupsCreatedCount,
    groupsJoinedCount,
    loginStreakCurrent: stats?.loginStreakCurrent ?? 0,
    loginStreakMax: stats?.loginStreakMax ?? 0,
    lastLoginAt: stats?.lastLoginAt ?? null,
    lastUpdatedAt: stats?.lastUpdatedAt ?? null
  };
}

/** Scoreboard simples (atalho) */
export async function getUserScoreboard(userId: string) {
  const stats = await getUserStats(userId);
  return {
    created: stats.exercisesCreatedCount,
    solved: stats.exercisesSolvedCount,
    forumComments: stats.forumCommentsCount,
    forumTopics: stats.forumTopicsCount,
    forumsCreated: stats.forumsCreated,
    groupsCreated: stats.groupsCreatedCount,
    groupsJoined: stats.groupsJoinedCount,
    loginStreak: stats.loginStreakCurrent
  };
}

/** Atualiza streak de login do usuário (considera dias consecutivos) */
export async function updateLoginStreak(userId: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Obtém estatísticas ou cria documento
  let stat = await UserStat.findOne({ userId: new Types.ObjectId(userId) }).lean<IUserStat | null>();

  if (!stat) {
    await UserStat.create({
      userId: new Types.ObjectId(userId),
      exercisesCreatedCount: 0,
      exercisesSolvedCount: 0,
      lastLoginAt: today,
      loginStreakCurrent: 1,
      loginStreakMax: 1
    } as any);
    stat = await UserStat.findOne({ userId: new Types.ObjectId(userId) }).lean<IUserStat | null>();
  }

  const last = stat?.lastLoginAt ? new Date(stat.lastLoginAt) : null;

  // Se já contou hoje, retorna sem alterar
  if (last && last.getFullYear() === today.getFullYear() && last.getMonth() === today.getMonth() && last.getDate() === today.getDate()) {
    return {
      loginStreakCurrent: stat.loginStreakCurrent ?? 1,
      loginStreakMax: stat.loginStreakMax ?? stat.loginStreakCurrent ?? 1,
      lastLoginAt: stat.lastLoginAt ?? today
    };
  }

  // Calcula diferença de dias inteiros
  let newStreak = Number(stat?.loginStreakCurrent ?? 0);
  if (!last) {
    newStreak = 1;
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = last.getFullYear() === yesterday.getFullYear() && last.getMonth() === yesterday.getMonth() && last.getDate() === yesterday.getDate();
    newStreak = isYesterday ? (newStreak + 1) : 1;
  }

  const newMax = Math.max(Number(stat?.loginStreakMax ?? 0), newStreak);

  await UserStat.updateOne(
    { userId: new Types.ObjectId(userId) },
    { $set: { lastLoginAt: today, loginStreakCurrent: newStreak, loginStreakMax: newMax, lastUpdatedAt: new Date() } },
    { upsert: true }
  );

  return { loginStreakCurrent: newStreak, loginStreakMax: newMax, lastLoginAt: today };
}

/** Verifica missão: 3 desafios concluídos (ACEITOS) em menos de 24 horas */
export async function checkThreeSolvedIn24h(userId: string) {
  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - 24 * 60 * 60 * 1000);

  // Conta exercícios únicos aceitos na janela de 24h
  const uniqueExercises = await Submission.distinct('exerciseId', {
    userId: new Types.ObjectId(userId),
    status: 'ACCEPTED',
    createdAt: { $gte: windowStart, $lte: windowEnd }
  });

  const solvedLast24h = (uniqueExercises ?? []).length;
  const achieved = solvedLast24h >= 3;

  return { solvedLast24h, achieved, windowStart, windowEnd };
}

/** Verifica missão: concluir desafio ACEITO em menos de 1 minuto */
export async function checkSolveUnderOneMinute(userId: string) {
  const thresholdMs = 60_000;
  const filter = {
    userId: new Types.ObjectId(userId),
    status: 'ACCEPTED',
    timeSpentMs: { $gt: 0, $lte: thresholdMs }
  };

  const count = await Submission.countDocuments(filter);
  const fastest = await Submission.find(filter)
    .sort({ timeSpentMs: 1, createdAt: -1 })
    .limit(1)
    .lean<ISubmission[]>();

  const achieved = count >= 1;
  return { achieved, count, fastestMs: fastest?.[0]?.timeSpentMs ?? null, thresholdMs };
}

/** Verifica missão: concluir desafio ACEITO com pontuação perfeita (100) */
export async function checkPerfectScore(userId: string) {
  const filter = {
    userId: new Types.ObjectId(userId),
    status: 'ACCEPTED',
    score: 100
  };

  const count = await Submission.countDocuments(filter);
  const latest = await Submission.find(filter)
    .sort({ createdAt: -1 })
    .limit(1)
    .lean<ISubmission[]>();

  const achieved = count >= 1;
  return { achieved, count, latestAt: latest?.[0]?.createdAt ?? null };
}
