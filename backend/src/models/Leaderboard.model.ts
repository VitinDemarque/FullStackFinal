import { Schema, model, models, Types } from 'mongoose';

export type LeaderboardType = 'GENERAL' | 'BY_LANGUAGE' | 'BY_SEASON' | 'BY_COLLEGE';

export interface ILeaderboard {
  _id: Types.ObjectId;
  type: LeaderboardType;
  seasonId?: Types.ObjectId | null;
  languageId?: Types.ObjectId | null;
  collegeId?: Types.ObjectId | null;
  name: string;
  snapshotAt: Date;       // quando este ranking foi "gerado" (snapshot)
  createdAt?: Date;
  updatedAt?: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>(
  {
    type: {
      type: String,
      enum: ['GENERAL', 'BY_LANGUAGE', 'BY_SEASON', 'BY_COLLEGE'],
      required: true,
      index: true
    },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', default: null, index: true },
    languageId: { type: Schema.Types.ObjectId, ref: 'Language', default: null, index: true },
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', default: null, index: true },
    name: { type: String, required: true, trim: true },
    snapshotAt: { type: Date, required: true, default: () => new Date() }
  },
  { timestamps: true }
);

/**
 * Regra de consistência das dimensões por tipo:
 * - GENERAL: todas NULL
 * - BY_LANGUAGE: languageId obrigatório; seasonId/collegeId NULL
 * - BY_SEASON: seasonId obrigatório; languageId/collegeId NULL
 * - BY_COLLEGE: collegeId obrigatório; seasonId/languageId NULL
 */
LeaderboardSchema.pre('validate', function (next) {
  const t = this.type;
  const hasSeason = !!this.seasonId;
  const hasLang = !!this.languageId;
  const hasCollege = !!this.collegeId;

  let ok = false;
  switch (t) {
    case 'GENERAL':
      ok = !hasSeason && !hasLang && !hasCollege;
      break;
    case 'BY_LANGUAGE':
      ok = hasLang && !hasSeason && !hasCollege;
      break;
    case 'BY_SEASON':
      ok = hasSeason && !hasLang && !hasCollege;
      break;
    case 'BY_COLLEGE':
      ok = hasCollege && !hasSeason && !hasLang;
      break;
  }
  if (!ok) {
    return next(
      new Error(
        `Invalid dimension combination for type=${t}. ` +
          `GENERAL: none; BY_LANGUAGE: languageId; BY_SEASON: seasonId; BY_COLLEGE: collegeId.`
      )
    );
  }
  return next();
});

// Índice útil para evitar duplicar snapshots iguais por dimensão (opcional)
LeaderboardSchema.index(
  { type: 1, seasonId: 1, languageId: 1, collegeId: 1, snapshotAt: 1 },
  { name: 'idx_leaderboard_dim_snapshot' }
);

export default models.Leaderboard || model<ILeaderboard>('Leaderboard', LeaderboardSchema);