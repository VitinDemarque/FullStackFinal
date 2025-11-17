import { Types } from 'mongoose';
import ChallengeAttempt, {
  IChallengeAttempt,
  ChallengeAttemptStatus,
} from '../models/ChallengeAttempt.model';

export interface UpsertAttemptInput {
  userId: string;
  exerciseId: string;
  code?: string;
  timeSpentMs?: number;
  status?: ChallengeAttemptStatus;
}

export async function upsertAttempt({
  userId,
  exerciseId,
  code,
  timeSpentMs,
  status = 'IN_PROGRESS',
}: UpsertAttemptInput) {
  const attempt = await ChallengeAttempt.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      exerciseId: new Types.ObjectId(exerciseId),
    },
    {
      $set: {
        code: code ?? '',
        timeSpentMs: Number(timeSpentMs ?? 0),
        status,
      },
      $setOnInsert: {
        userId: new Types.ObjectId(userId),
        exerciseId: new Types.ObjectId(exerciseId),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean<IChallengeAttempt>();

  return attempt ? sanitize(attempt) : null;
}

export async function getAttempt(userId: string, exerciseId: string) {
  const attempt = await ChallengeAttempt.findOne({
    userId: new Types.ObjectId(userId),
    exerciseId: new Types.ObjectId(exerciseId),
  }).lean<IChallengeAttempt | null>();

  return attempt ? sanitize(attempt) : null;
}

export async function deleteAttempt(userId: string, exerciseId: string) {
  await ChallengeAttempt.deleteOne({
    userId: new Types.ObjectId(userId),
    exerciseId: new Types.ObjectId(exerciseId),
  });
}

export async function markCompleted(userId: string, exerciseId: string) {
  const attempt = await ChallengeAttempt.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      exerciseId: new Types.ObjectId(exerciseId),
    },
    { $set: { status: 'COMPLETED' } },
    { new: true }
  ).lean<IChallengeAttempt | null>();

  return attempt ? sanitize(attempt) : null;
}

function sanitize(attempt: IChallengeAttempt) {
  return {
    id: String(attempt._id),
    userId: String(attempt.userId),
    exerciseId: String(attempt.exerciseId),
    code: attempt.code ?? '',
    timeSpentMs: Number(attempt.timeSpentMs ?? 0),
    status: attempt.status,
    createdAt: attempt.createdAt,
    updatedAt: attempt.updatedAt,
  };
}

