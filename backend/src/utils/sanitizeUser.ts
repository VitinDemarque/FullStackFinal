import { IUser } from '../models/User.model';

export function sanitizeUser(user: Partial<IUser> | any) {
  if (!user) return null;

  return {
    id: String(user._id ?? user.id ?? ''),
    name: user.name ?? null,
    email: user.email ?? null,
    handle: user.handle ?? null,
    role: user.role ?? 'USER',
    collegeId: user.collegeId ? String(user.collegeId) : null,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null,
    level: user.level ?? null,
    xpTotal: user.xpTotal ?? null,
  };
}