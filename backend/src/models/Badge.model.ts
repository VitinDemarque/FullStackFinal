import { Schema, model, models, Types } from 'mongoose';

export interface IBadge {
  _id: Types.ObjectId;
  name: string;
  description?: string | null;
  iconUrl?: string | null;
  ruleCode?: string | null;
  // Conquista triunfante (definida por administrador e ligada a um desafio/evento)
  isTriumphant?: boolean | null;
  linkedExerciseId?: Types.ObjectId | null;
}

const BadgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, unique: true, index: true, trim: true },
    description: { type: String, default: null },
    iconUrl: { type: String, default: null },
    ruleCode: { type: String, default: null },
    isTriumphant: { type: Boolean, default: false, index: true },
    linkedExerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', default: null, index: true }
  },
  { timestamps: true }
);

export default models.Badge || model<IBadge>('Badge', BadgeSchema);