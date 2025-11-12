import { Schema, model, models, Types } from 'mongoose';

export interface IUserStat {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  exercisesCreatedCount: number;
  exercisesSolvedCount: number;
  lastLoginAt?: Date | null;
  loginStreakCurrent?: number;
  loginStreakMax?: number;
  lastUpdatedAt?: Date | null;
}

const UserStatSchema = new Schema<IUserStat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    exercisesCreatedCount: { type: Number, default: 0, min: 0 },
    exercisesSolvedCount: { type: Number, default: 0, min: 0 },
    lastLoginAt: { type: Date, default: null },
    loginStreakCurrent: { type: Number, default: 0, min: 0 },
    loginStreakMax: { type: Number, default: 0, min: 0 },
    lastUpdatedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default models.UserStat || model<IUserStat>('UserStat', UserStatSchema);