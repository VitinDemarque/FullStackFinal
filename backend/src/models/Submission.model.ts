import { Schema, model, models, Types } from 'mongoose';

export type SubmissionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ISubmission {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  exerciseId: Types.ObjectId;
  seasonId?: Types.ObjectId | null;
  status: SubmissionStatus;
  score: number;          // 0..100
  timeSpentMs?: number;   // duração em ms
  xpAwarded: number;
  code?: string | null;
  createdAt?: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true, index: true },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', default: null, index: true },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], required: true, index: true },
    score: { type: Number, default: 0, min: 0, max: 100 },
    timeSpentMs: { type: Number, default: 0, min: 0 },
    xpAwarded: { type: Number, default: 0, min: 0 },
    code: { type: String, default: null }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.Submission || model<ISubmission>('Submission', SubmissionSchema);