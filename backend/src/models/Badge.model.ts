import { Schema, model, models, Types } from 'mongoose';

export interface IBadge {
  _id: Types.ObjectId;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  ruleCode?: string | null;
}

const BadgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, unique: true, index: true, trim: true },
    description: { type: String, default: null },
    iconUrl: { type: String, default: null },
    ruleCode: { type: String, default: null }
  },
  { timestamps: true }
);

export default models.Badge || model<IBadge>('Badge', BadgeSchema);