import { Types } from 'mongoose';
import ExerciseStat, { IExerciseStat } from '../models/ExerciseStat.model';
import UserStat, { IUserStat } from '../models/UserStat.model';
import Submission from '../models/Submission.model'; // (mantido se usar em futuras agregações)
import Exercise, { IExercise } from '../models/Exercise.model';
import Forum from '../models/forum.model';

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

  return {
    userId,
    exercisesCreatedCount: stats?.exercisesCreatedCount ?? 0,
    exercisesSolvedCount: stats?.exercisesSolvedCount ?? 0,
    languagesUsed: languagesUsed.length,
    publishedChallenges,
    forumsCreated,
    lastUpdatedAt: stats?.lastUpdatedAt ?? null
  };
}

/** Scoreboard simples (atalho) */
export async function getUserScoreboard(userId: string) {
  const stats = await getUserStats(userId);
  return {
    created: stats.exercisesCreatedCount,
    solved: stats.exercisesSolvedCount
  };
}
