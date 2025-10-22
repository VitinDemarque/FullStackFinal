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

export interface CreateSubmissionInput {
  userId: string;
  exerciseId: string;
  code?: string;
  score?: number;
  timeSpentMs?: number;
}

export async function create(input: CreateSubmissionInput) {
  const { userId, exerciseId, code, score, timeSpentMs } = input;

  // TIPAGEM EXPLÍCITA:
  const exercise = await Exercise.findById(exerciseId).lean<IExercise | null>();
  if (!exercise) throw new NotFoundError('Exercise not found');
  if (exercise.status !== 'PUBLISHED') throw new BadRequestError('Exercise not published');

  // temporada ativa (se houver)
  const now = new Date();
  const season = await Season.findOne({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).lean<ISeason | null>();

  // status pela nota (exemplo)
  const numericScore = Number(score ?? 0);
  const status: ISubmission['status'] = numericScore >= 60 ? 'ACCEPTED' : 'REJECTED';

  // XP pelo motor centralizado
  const xpAwarded = calculateXp({
    baseXp: exercise.baseXp ?? 100,
    difficulty: exercise.difficulty ?? 1,
    score: numericScore,
    timeSpentMs: Number(timeSpentMs ?? 0)
  });

  const created = await Submission.create({
    userId: new Types.ObjectId(userId),
    exerciseId: new Types.ObjectId(exerciseId),
    seasonId: season ? new Types.ObjectId(season._id) : undefined,
    status,
    score: numericScore,
    timeSpentMs: Number(timeSpentMs ?? 0),
    xpAwarded,
    code: code ?? null
  });

  // se aceito, credita XP e recalcula nível
  if (status === 'ACCEPTED') {
    await creditXpAndLevelUp(userId, xpAwarded);
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
    ).catch(err => console.warn('Falha em UserStat:', err)),

    ExerciseStat.updateOne(
      { exerciseId: new Types.ObjectId(exerciseId) },
      {
        $inc: { solvesCount: 1 },
        $setOnInsert: { exerciseId: new Types.ObjectId(exerciseId) },
        $set: { lastSolveAt: new Date() },
      },
      { upsert: true }
    ).catch(err => console.warn('Falha em ExerciseStat:', err)),
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

async function creditXpAndLevelUp(userId: string, xp: number) {
  const user = await User.findById(userId); // mantemos como Document p/ .save()
  if (!user) return;

  user.xpTotal = (user.xpTotal ?? 0) + Number(xp);

  // regras de nível (tipadas)
  const rules = await LevelRule.find().sort({ level: 1 }).lean<ILevelRule[]>();
  let newLevel = 1;
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
    score: s.score,
    timeSpentMs: s.timeSpentMs ?? 0,
    xpAwarded: s.xpAwarded,
    createdAt: s.createdAt
  };
}