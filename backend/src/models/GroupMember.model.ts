import { Schema, model, models, Types } from 'mongoose';

export type GroupMemberRole = 'MEMBER' | 'MODERATOR';

export interface IGroupMember {
  _id: Types.ObjectId;
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
  role: GroupMemberRole;
  joinedAt?: Date;
}

const GroupMemberSchema = new Schema<IGroupMember>(
  {
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: ['MEMBER', 'MODERATOR'], default: 'MEMBER', index: true },
    joinedAt: { type: Date, default: () => new Date() }
  },
  { timestamps: true }
);

GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

export default models.GroupMember || model<IGroupMember>('GroupMember', GroupMemberSchema);