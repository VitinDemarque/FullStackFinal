import { Schema, model, models, Types } from 'mongoose';

export type ExerciseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// Interface para um teste do exercício
export interface ITest {
  input: string;           // Entrada do teste (obrigatório)
  expectedOutput: string;  // Saída esperada (obrigatório)
  description?: string;    // Descrição opcional do teste
}

export interface IExercise {
  _id: Types.ObjectId;
  authorUserId: Types.ObjectId;
  languageId?: Types.ObjectId | null;
  title: string;
  subject?: string;
  description?: string;
  groupId?: Types.ObjectId | null;
  difficulty: number;     // 1..5
  baseXp: number;         // base para cálculo de XP
  isPublic: boolean;
  codeTemplate: string;   // código pré-pronto
  publicCode?: string;    // código público amigável (ex.: #ASFS0001)
  status: ExerciseStatus;
  triumphantBadgeId?: Types.ObjectId | null;  // badge concedido ao concluir
  badgeRarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'; // raridade visual e multiplicador de XP
  highScoreBadgeId?: Types.ObjectId | null; // badge especial para alta pontuação
  highScoreThreshold?: number; // porcentagem mínima de score p/ alta pontuação (0..100)
  highScoreAwarded?: boolean; // se já foi concedido ao vencedor
  highScoreWinnerUserId?: Types.ObjectId | null;
  highScoreWinnerSubmissionId?: Types.ObjectId | null;
  highScoreWinnerScore?: number | null;
  highScoreWinnerTime?: number | null; // em ms
  highScoreAwardedAt?: Date | null;
  tests?: ITest[];         // Array de testes do exercício (mínimo 3 para publicação)
  createdAt?: Date;
  updatedAt?: Date;
}

const ExerciseSchema = new Schema<IExercise>(
  {
    authorUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    languageId: { type: Schema.Types.ObjectId, ref: 'Language', default: null, index: true },
    title: { type: String, required: true, trim: true },
    subject: { type: String, default: '' },
    description: { type: String, default: '' },
    difficulty: { type: Number, default: 1, min: 1, max: 5, index: true },
    groupId: { type: Schema.Types.ObjectId, ref: 'Group', default: null, index: true },
    baseXp: { type: Number, default: 100, min: 0 },
    isPublic: { type: Boolean, default: true, index: true },
    codeTemplate: { type: String, required: true, default: '// start coding...' },
    publicCode: { type: String, unique: true, index: true },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT', index: true },
    triumphantBadgeId: { type: Schema.Types.ObjectId, ref: 'Badge', default: null, index: true },
    badgeRarity: { type: String, enum: ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'], default: 'COMMON' },
    highScoreBadgeId: { type: Schema.Types.ObjectId, ref: 'Badge', default: null },
    highScoreThreshold: { type: Number, default: 90, min: 0, max: 100 },
    highScoreAwarded: { type: Boolean, default: false, index: true },
    highScoreWinnerUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    highScoreWinnerSubmissionId: { type: Schema.Types.ObjectId, ref: 'Submission', default: null },
    highScoreWinnerScore: { type: Number, default: null },
    highScoreWinnerTime: { type: Number, default: null },
    highScoreAwardedAt: { type: Date, default: null },
    tests: [{
      input: { type: String, required: true, maxlength: 10000 },
      expectedOutput: { type: String, required: true, maxlength: 10000 },
      description: { type: String, default: '', maxlength: 500 }
    }]
  },
  { timestamps: true }
);

export default models.Exercise || model<IExercise>('Exercise', ExerciseSchema);