import { Schema, model, models, Types } from 'mongoose';

export interface IExerciseStat {
  _id: Types.ObjectId;
  exerciseId: Types.ObjectId;
  solvesCount: number;
  avgScore?: number | null;
  lastSolveAt?: Date | null;
}

const ExerciseStatSchema = new Schema<IExerciseStat>(
  {
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true, unique: true, index: true },
    solvesCount: { type: Number, default: 0, min: 0 },
    avgScore: { type: Number, default: null },
    lastSolveAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default models.ExerciseStat || model<IExerciseStat>('ExerciseStat', ExerciseStatSchema);