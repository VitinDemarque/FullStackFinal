import { Schema, model, models, Types } from 'mongoose';

export type ExerciseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface IExercise {
  _id: Types.ObjectId;
  authorUserId: Types.ObjectId;
  languageId?: Types.ObjectId | null;
  title: string;
  description?: string;
  difficulty: number;     // 1..5
  baseXp: number;         // base para cálculo de XP
  isPublic: boolean;
  codeTemplate: string;   // código pré-pronto
  status: ExerciseStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const ExerciseSchema = new Schema<IExercise>(
  {
    authorUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    languageId: { type: Schema.Types.ObjectId, ref: 'Language', default: null, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    difficulty: { type: Number, default: 1, min: 1, max: 5, index: true },
    baseXp: { type: Number, default: 100, min: 0 },
    isPublic: { type: Boolean, default: true, index: true },
    codeTemplate: { type: String, required: true, default: '// start coding...' },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT', index: true }
  },
  { timestamps: true }
);

export default models.Exercise || model<IExercise>('Exercise', ExerciseSchema);
