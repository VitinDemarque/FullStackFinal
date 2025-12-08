import { Schema, model, models, Types } from 'mongoose';
import crypto from 'crypto';

export interface IRefreshToken {
  _id: Types.ObjectId;
  tokenHash: string; // Hash do refresh token (SHA-256) para segurança
  userId: Types.ObjectId;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Gera um hash SHA-256 do token para armazenar de forma segura
 */
export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    tokenHash: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// TTL index para auto-delete de tokens expirados (MongoDB remove automaticamente após expiresAt)
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Índice composto para buscas eficientes
RefreshTokenSchema.index({ userId: 1, expiresAt: 1 });

export default models.RefreshToken || model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

