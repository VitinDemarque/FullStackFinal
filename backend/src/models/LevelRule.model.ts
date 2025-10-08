import { Schema, model, models } from 'mongoose';

export interface ILevelRule {
  level: number;
  minXp: number;
}

const LevelRuleSchema = new Schema<ILevelRule>(
  {
    level: { type: Number, required: true, unique: true, index: true, min: 1 },
    minXp: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default models.LevelRule || model<ILevelRule>('LevelRule', LevelRuleSchema);