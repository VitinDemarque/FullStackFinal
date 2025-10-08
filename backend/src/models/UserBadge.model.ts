import { Schema, model, models, Types } from 'mongoose';

export interface IUserBadge {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  badgeId: Types.ObjectId;
  awardedAt?: Date;
  source?: string | null;
}

const UserBadgeSchema = new Schema<IUserBadge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    badgeId: { type: Schema.Types.ObjectId, ref: 'Badge', required: true, index: true },
    awardedAt: { type: Date, default: () => new Date() },
    source: { type: String, default: null }
  },
  { timestamps: true }
);

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export default models.UserBadge || model<IUserBadge>('UserBadge', UserBadgeSchema);