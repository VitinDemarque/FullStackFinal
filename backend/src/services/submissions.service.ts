import { Types } from 'mongoose';
import { BadRequestError, NotFoundError } from '../utils/httpErrors';

// Models + tipos
import Submission, { ISubmission } from '../models/Submission.model';
import Exercise, { IExercise } from '../models/Exercise.model';
import Season, { ISeason } from '../models/Season.model';
import User from '../models/User.model';
import LevelRule, { ILevelRule } from '../models/LevelRule.model';
import UserStat from '../models/UserStat.model';
import ExerciseStat from '../models/ExerciseStat.model';

// Regras de XP
import { calculateXp } from './xp-rules/calculator';
import { grantTriumphantBadgesForExerciseCompletion } from './badges.service';
import * as AttemptsService from './attempts.service';

// Serviços de validação e análise
import { validateTests } from './testValidation.service';
import { analyzeComplexityComplete } from './complexityAnalysis.service';
import { updateHighScoreBadge } from './ranking.service';

export interface CreateSubmissionInput {
  userId: string;
  exerciseId: string;
  code?: string;
  score?: number;
  timeSpentMs?: number;
}

export async function create(input: CreateSubmissionInput) {
  const { userId, exerciseId, code, score, timeSpentMs } = input;

  // Verificar se o usuário já completou este exercício
  const existingAccepted = await Submission.findOne({
    userId: new Types.ObjectId(userId),
    exerciseId: new Types.ObjectId(exerciseId),
    status: 'ACCEPTED'
  }).lean();

  if (existingAccepted) {
    throw new BadRequestError('Este desafio já foi concluído. Não é possível refazê-lo.');
  }

  // TIPAGEM EXPLÍCITA:
  const exercise = await Exercise.findById(exerciseId).lean<IExercise | null>();
  if (!exercise) throw new NotFoundError('Exercise not found');
  if (exercise.status !== 'PUBLISHED') throw new BadRequestError('Exercise not published');

  // Validar que exercício tem testes
  if (!exercise.tests || exercise.tests.length < 2) {
    throw new BadRequestError('Exercício deve ter pelo menos 2 testes para validação');
  }

  // temporada ativa (se houver)
  const now = new Date();
  const season = await Season.findOne({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).lean<ISeason | null>();

  let testResults: any[] = [];
  let testScore = 0;
  let complexityScore = 0;
  let complexityMetrics: any = null;
  let bonusPoints = 0;
  let finalScore = 0;

  if (code) {
    const testValidation = await validateTests(exerciseId, code);
    testResults = testValidation.testResults;
    testScore = testValidation.testScore;

    let languageSlug = 'java';
    if (exercise.languageId) {
      const Language = (await import('../models/Language.model')).default;
      const language = await Language.findById(exercise.languageId).lean();
      if (language) {
        languageSlug = language.slug.toLowerCase();
      }
    }
    
    const complexityAnalysis = analyzeComplexityComplete(code, languageSlug);
    complexityScore = complexityAnalysis.complexityScore;
    complexityMetrics = complexityAnalysis.metrics;
    bonusPoints = complexityAnalysis.bonusPoints;
    finalScore = Math.min(100, testScore + bonusPoints);
  } else {
    finalScore = Number(score ?? 0);
    testScore = finalScore;
  }

  const status: ISubmission['status'] = finalScore >= 60 ? 'ACCEPTED' : 'REJECTED';
  const xpAwarded = calculateXp({
    baseXp: exercise.baseXp ?? 100,
    difficulty: exercise.difficulty ?? 1,
    score: finalScore,
    timeSpentMs: Number(timeSpentMs ?? 0)
  });
  const rarityMultiplierMap: Record<string, number> = {
    COMMON: 1,
    RARE: 1.1,
    EPIC: 1.25,
    LEGENDARY: 1.5
  };
  const rarityMult = rarityMultiplierMap[(exercise as any).badgeRarity || 'COMMON'] || 1;
  const finalXpAwarded = Math.round(xpAwarded * rarityMult);

  const created = await Submission.create({
    userId: new Types.ObjectId(userId),
    exerciseId: new Types.ObjectId(exerciseId),
    seasonId: season ? new Types.ObjectId(season._id) : undefined,
    status,
    score: finalScore, // Mantido para compatibilidade, mas agora usa finalScore
    timeSpentMs: Number(timeSpentMs ?? 0),
    xpAwarded: finalXpAwarded,
    code: code ?? null,
    // Novos campos para sistema de testes e complexidade
    testResults: testResults.length > 0 ? testResults : undefined,
    testScore: testScore,
    complexityScore: complexityScore,
    complexityMetrics: complexityMetrics,
    bonusPoints: bonusPoints,
    finalScore: finalScore
  });

  // se aceito, credita XP e recalcula nível
  if (status === 'ACCEPTED') {
    await creditXpAndLevelUp(userId, finalXpAwarded);
    // Conquista triunfante: concede emblemas vinculados ao exercício
    await grantTriumphantBadgesForExerciseCompletion(userId, exerciseId);
    await AttemptsService.deleteAttempt(userId, exerciseId).catch(() => {});

    // Atualizar ranking e badge de alta pontuação
    // Usa a função centralizada do ranking service que compara:
    // 1. Score final (maior é melhor)
    // 2. Score de complexidade (maior é melhor - desempate)
    // 3. Tempo gasto (menor é melhor - desempate final)
    await updateHighScoreBadge(exerciseId).catch(() => {
      // Silently fail - ranking update is not critical
    });
  }

  // estatísticas
  Promise.all([
    UserStat.updateOne(
      { userId: new Types.ObjectId(userId) },
      {
        $inc: { exercisesSolvedCount: status === 'ACCEPTED' ? 1 : 0 },
        $setOnInsert: { userId: new Types.ObjectId(userId) },
        $set: { lastUpdatedAt: new Date() },
      },
      { upsert: true }
    ).catch(() => {
      // Silently fail - stats update is not critical
    }),

    ExerciseStat.updateOne(
      { exerciseId: new Types.ObjectId(exerciseId) },
      {
        $inc: { solvesCount: 1 },
        $setOnInsert: { exerciseId: new Types.ObjectId(exerciseId) },
        $set: { lastSolveAt: new Date() },
      },
      { upsert: true }
    ).catch(() => {
      // Silently fail - stats update is not critical
    }),
  ]);

  return sanitize(created.toObject() as ISubmission);
}

export async function listByUser(userId: string, paging: { skip: number; limit: number }) {
  const [items, total] = await Promise.all([
    Submission.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(paging.skip)
      .limit(paging.limit)
      .lean<ISubmission[]>(),
    Submission.countDocuments({ userId: new Types.ObjectId(userId) })
  ]);

  return { items: items.map(sanitize), total };
}

export async function listByExercise(exerciseId: string, paging: { skip: number; limit: number }) {
  const [items, total] = await Promise.all([
    Submission.find({ exerciseId: new Types.ObjectId(exerciseId) })
      .sort({ createdAt: -1 })
      .skip(paging.skip)
      .limit(paging.limit)
      .lean<ISubmission[]>(),
    Submission.countDocuments({ exerciseId: new Types.ObjectId(exerciseId) })
  ]);

  return { items: items.map(sanitize), total };
}

export async function getById(id: string) {
  const s = await Submission.findById(id).lean<ISubmission | null>();
  if (!s) throw new NotFoundError('Submission not found');
  return sanitize(s);
}

export async function listCompletedExerciseIds(userId: string) {
  const ids = await Submission.distinct('exerciseId', {
    userId: new Types.ObjectId(userId),
    status: 'ACCEPTED',
  });
  return ids.map((id) => String(id));
}

async function creditXpAndLevelUp(userId: string, xp: number) {
  const user = await User.findById(userId); // mantemos como Document p/ .save()
  if (!user) return;

  user.xpTotal = (user.xpTotal ?? 0) + Number(xp);

  // regras de nível (tipadas)
  const rules = await LevelRule.find().sort({ level: 1 }).lean<ILevelRule[]>();
  let newLevel = 0;
  for (const r of rules) {
    if (user.xpTotal >= r.minXp) newLevel = r.level;
  }
  user.level = newLevel;
  await user.save();
}

function sanitize(s: ISubmission) {
  return {
    id: String(s._id),
    userId: String(s.userId),
    exerciseId: String(s.exerciseId),
    seasonId: s.seasonId ? String(s.seasonId) : null,
    status: s.status,
    score: s.score, // Mantido para compatibilidade
    timeSpentMs: s.timeSpentMs ?? 0,
    xpAwarded: s.xpAwarded,
    // Novos campos
    testResults: s.testResults,
    testScore: s.testScore,
    complexityScore: s.complexityScore,
    complexityMetrics: s.complexityMetrics,
    bonusPoints: s.bonusPoints,
    finalScore: s.finalScore,
    createdAt: s.createdAt
  };
}