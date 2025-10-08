import { Schema, model, models, Types } from 'mongoose';

export interface ILeaderboardEntry {
  _id: Types.ObjectId;
  leaderboardId: Types.ObjectId;
  userId: Types.ObjectId;
  position: number;   // 1..N
  points: number;     // soma (ex.: xpAwarded)
  xp: number;         // xpTotal no momento do snapshot (ou mesmo valor de points se preferir)
  createdAt?: Date;
  updatedAt?: Date;
}

const LeaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    leaderboardId: { type: Schema.Types.ObjectId, ref: 'Leaderboard', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    position: { type: Number, required: true, min: 1, index: true },
    points: { type: Number, required: true, min: 0 },
    xp: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

// uma entrada por usuário em cada leaderboard
LeaderboardEntrySchema.index({ leaderboardId: 1, userId: 1 }, { unique: true, name: 'uq_lb_user' });

// navegação por posição
LeaderboardEntrySchema.index({ leaderboardId: 1, position: 1 }, { name: 'idx_lb_position' });

export default models.LeaderboardEntry || model<ILeaderboardEntry>('LeaderboardEntry', LeaderboardEntrySchema);