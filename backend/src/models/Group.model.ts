import { Schema, model, models, Types } from 'mongoose';

export type GroupVisibility = 'PUBLIC' | 'PRIVATE';

export interface IGroup {
  _id: Types.ObjectId;
  ownerUserId: Types.ObjectId;
  name: string;
  description?: string | null;
  visibility: GroupVisibility;
  createdAt?: Date;
  updatedAt?: Date;
}

const GroupSchema = new Schema<IGroup>(
  {
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    visibility: { type: String, enum: ['PUBLIC', 'PRIVATE'], default: 'PUBLIC', index: true }
  },
  { timestamps: true }
);

export default models.Group || model<IGroup>('Group', GroupSchema);