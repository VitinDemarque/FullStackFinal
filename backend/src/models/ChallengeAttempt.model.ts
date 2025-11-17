import { Schema, model, models, Types } from 'mongoose';

export type ChallengeAttemptStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface IChallengeAttempt {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  exerciseId: Types.ObjectId;
  code: string;
  timeSpentMs: number;
  status: ChallengeAttemptStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const ChallengeAttemptSchema = new Schema<IChallengeAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true, index: true },
    code: { type: String, default: '' },
    timeSpentMs: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED'],
      default: 'IN_PROGRESS',
      index: true,
    },
  },
  { timestamps: true }
);

ChallengeAttemptSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });

export default models.ChallengeAttempt || model<IChallengeAttempt>('ChallengeAttempt', ChallengeAttemptSchema);

