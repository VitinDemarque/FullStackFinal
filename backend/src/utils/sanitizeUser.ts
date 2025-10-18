import { IUser } from '@/models/User.model';

export function sanitizeUser(user: IUser) {
  if (!user) return null;

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    handle: user.handle,
    role: user.role ?? 'USER',
    collegeId: user.collegeId ? String(user.collegeId) : null,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null,
    level: user.level ?? null,
    xpTotal: user.xpTotal ?? null,
  };
}
