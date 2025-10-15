import { Schema, model, models, Types } from 'mongoose';

export type ForumPrivacy = 'PUBLICO' | 'PRIVADO';

export interface IForum {
  _id: Types.ObjectId;
  name: string;
  keywords: string[];
  subject: string;
  description: string;
  privacyStatus: ForumPrivacy;
  ownerUserId: Types.ObjectId;
  moderators: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ForumSchema = new Schema<IForum>(
  {
    name: { type: String, required: true, trim: true },
    keywords: [{ type: String, trim: true, index: true }],
    subject: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    privacyStatus: { type: String, enum: ['PUBLICO', 'PRIVADA'], default: 'PUBLICO' },
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export default models.Forum || model<IForum>('Forum', ForumSchema);