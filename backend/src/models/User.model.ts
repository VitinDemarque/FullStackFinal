import { Schema, model, models, Types } from 'mongoose';

export type UserRole = 'USER' | 'ADMIN';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  handle: string;
  email: string;
  passwordHash: string;
  collegeId?: Types.ObjectId | null;
  level: number;
  xpTotal: number;
  avatarUrl?: string | null;
  bio?: string | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    handle: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', default: null },
    level: { type: Number, default: 1, min: 1 },
    xpTotal: { type: Number, default: 0, min: 0 },
    avatarUrl: { type: String, default: null },
    bio: { type: String, default: null },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER', index: true }
  },
  { timestamps: true }
);

export default models.User || model<IUser>('User', UserSchema);
