import { Schema, model, models, Types } from 'mongoose';

export interface IUserTitle {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  titleId: Types.ObjectId;
  awardedAt?: Date;
  active: boolean;
}

const UserTitleSchema = new Schema<IUserTitle>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    titleId: { type: Schema.Types.ObjectId, ref: 'Title', required: true, index: true },
    awardedAt: { type: Date, default: () => new Date() },
    active: { type: Boolean, default: false }
  },
  { timestamps: true }
);

UserTitleSchema.index({ userId: 1, titleId: 1 }, { unique: true });

export default models.UserTitle || model<IUserTitle>('UserTitle', UserTitleSchema);
