import { Types } from 'mongoose';
import { NotFoundError } from '../utils/httpErrors';
import Submission, { ISubmission } from '../models/Submission.model';
import Exercise from '../models/Exercise.model';
import User from '../models/User.model';

/**
 * Interface para uma entrada no ranking
 */
export interface RankingEntry {
  position: number;              // Posição no ranking (1, 2, 3...)
  userId: string;                // ID do usuário
  userName?: string;             // Nome do usuário (se populado)
  submissionId: string;          // ID da submissão
  finalScore: number;            // Score final (testes + bônus)
  complexityScore: number;       // Score de complexidade
  timeSpentMs: number;           // Tempo gasto
  testScore: number;             // Score dos testes
  bonusPoints: number;           // Pontos de bônus
  createdAt: Date;               // Data da submissão
}

/**
 * Interface para resultado do ranking
 */
export interface RankingResult {
  exerciseId: string;
  totalEntries: number;
  entries: RankingEntry[];
}

/**
 * Calcula o ranking de um exercício
 * 
 * Ordenação:
 * 1. Score final (DESC) - maior é melhor
 * 2. Score de complexidade (DESC) - maior é melhor (desempate)
 * 3. Tempo gasto (ASC) - menor é melhor (desempate final)
 * 
 * @param exerciseId - ID do exercício
 * @param limit - Limite de resultados (padrão: 100)
 * @param populateUser - Se deve popular dados do usuário (padrão: false)
 * @returns Ranking do exercício
 */
export async function getExerciseRanking(
  exerciseId: string,
  limit: number = 100,
  populateUser: boolean = false
): Promise<RankingResult> {
  const exercise = await Exercise.findById(exerciseId).lean();
  if (!exercise) {
    throw new NotFoundError('Exercise not found');
  }

  const submissions = await Submission.find({
    exerciseId: new Types.ObjectId(exerciseId),
    status: 'ACCEPTED',
    finalScore: { $ne: null }
  })
    .sort({
      finalScore: -1,
      complexityScore: -1,
      timeSpentMs: 1
    })
    .limit(limit)
    .lean<ISubmission[]>();

  const entries: RankingEntry[] = submissions.map((submission, index) => ({
    position: index + 1,
    userId: String(submission.userId),
    submissionId: String(submission._id),
    finalScore: submission.finalScore ?? submission.score ?? 0,
    complexityScore: submission.complexityScore ?? 0,
    timeSpentMs: submission.timeSpentMs ?? 0,
    testScore: submission.testScore ?? submission.score ?? 0,
    bonusPoints: submission.bonusPoints ?? 0,
    createdAt: submission.createdAt ?? new Date()
  }));

  if (populateUser && entries.length > 0) {
    const userIds = entries.map(e => new Types.ObjectId(e.userId));
    const users = await User.find({ _id: { $in: userIds } })
      .select('name')
      .lean();

    const userMap = new Map(users.map(u => [String(u._id), u.name]));
    
    entries.forEach(entry => {
      entry.userName = userMap.get(entry.userId);
    });
  }

  return {
    exerciseId,
    totalEntries: entries.length,
    entries
  };
}

/**
 * Obtém a posição de um usuário específico no ranking
 * 
 * @param exerciseId - ID do exercício
 * @param userId - ID do usuário
 * @returns Posição no ranking (0 se não encontrado)
 */
export async function getUserRankingPosition(
  exerciseId: string,
  userId: string
): Promise<number> {
  const userSubmission = await Submission.findOne({
    exerciseId: new Types.ObjectId(exerciseId),
    userId: new Types.ObjectId(userId),
    status: 'ACCEPTED',
    finalScore: { $ne: null }
  })
    .select('finalScore complexityScore timeSpentMs')
    .lean<ISubmission | null>();

  if (!userSubmission) {
    return 0;
  }

  const userFinalScore = userSubmission.finalScore ?? userSubmission.score ?? 0;
  const userComplexityScore = userSubmission.complexityScore ?? 0;
  const userTimeSpentMs = userSubmission.timeSpentMs ?? 0;

  const aheadCount = await Submission.countDocuments({
    exerciseId: new Types.ObjectId(exerciseId),
    status: 'ACCEPTED',
    finalScore: { $ne: null },
    $or: [
      { finalScore: { $gt: userFinalScore } },
      {
        finalScore: userFinalScore,
        complexityScore: { $gt: userComplexityScore }
      },
      {
        finalScore: userFinalScore,
        complexityScore: userComplexityScore,
        timeSpentMs: { $lt: userTimeSpentMs }
      }
    ]
  });

  return aheadCount + 1;
}

/**
 * Atualiza o badge de alta pontuação baseado no ranking
 * 
 * @param exerciseId - ID do exercício
 */
export async function updateHighScoreBadge(exerciseId: string): Promise<void> {
  const exercise = await Exercise.findById(exerciseId).lean();
  if (!exercise) {
    return;
  }

  const highScoreBadgeId = (exercise as any).highScoreBadgeId;
  if (!highScoreBadgeId) {
    return;
  }

  const topSubmission = await Submission.findOne({
    exerciseId: new Types.ObjectId(exerciseId),
    status: 'ACCEPTED',
    finalScore: { $ne: null }
  })
    .sort({
      finalScore: -1,
      complexityScore: -1,
      timeSpentMs: 1
    })
    .lean<ISubmission | null>();

  if (!topSubmission) {
    return;
  }

  const currentWinnerId = (exercise as any).highScoreWinnerUserId 
    ? String((exercise as any).highScoreWinnerUserId) 
    : null;
  const newWinnerId = String(topSubmission.userId);

  if (currentWinnerId !== newWinnerId) {
    const { grantToUser, revokeFromUser } = await import('./badges.service');
    const rarity = (exercise as any).badgeRarity || 'COMMON';

    if (currentWinnerId) {
      await revokeFromUser(currentWinnerId, String(highScoreBadgeId));
    }

    await grantToUser(newWinnerId, String(highScoreBadgeId), `exerciseHighScore:${rarity}`);

    await Exercise.updateOne(
      { _id: new Types.ObjectId(exerciseId) },
      {
        $set: {
          highScoreAwarded: true,
          highScoreWinnerUserId: new Types.ObjectId(newWinnerId),
          highScoreWinnerSubmissionId: new Types.ObjectId(topSubmission._id),
          highScoreWinnerScore: topSubmission.finalScore ?? topSubmission.score ?? 0,
          highScoreWinnerTime: topSubmission.timeSpentMs ?? 0,
          highScoreAwardedAt: new Date()
        }
      }
    );
  }
}

