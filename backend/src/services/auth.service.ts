import { Types } from 'mongoose';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { verifyToken, signToken, UserTokenPayload } from '../utils/jwt';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../utils/httpErrors';
import User, { IUser } from '../models/User.model';
import College from '../models/College.model';
import { sanitizeUser } from '../utils/sanitizeUser';

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  handle: string;
  collegeId?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function signup(input: SignupInput) {
  const { name, email, password, handle, collegeId } = input;

  const existsEmail = await User.findOne({ email }).lean();
  if (existsEmail) throw new ConflictError('Email already in use');

  const existsHandle = await User.findOne({ handle }).lean();
  if (existsHandle) throw new ConflictError('Handle already in use');

  if (collegeId) {
    if (!Types.ObjectId.isValid(collegeId)) {
      throw new BadRequestError('Invalid collegeId format');
    }

    const college = await College.findById(collegeId).lean();
    if (!college) throw new NotFoundError('College not found');
  }

  const passwordHash = await hashPassword(password);
  const doc = await User.create({
    name,
    email,
    handle,
    passwordHash,
    collegeId: collegeId ? new Types.ObjectId(collegeId) : undefined,
    level: 0,
    xpTotal: 0
  });

  const accessToken = signToken({
    user_id: String(doc._id),
    email: doc.email,
    role: doc.role ?? 'USER',
    collegeId: doc.collegeId ? String(doc.collegeId) : undefined
  });

  const refreshToken = signToken({ user_id: String(doc._id), email: doc.email }, { expiresIn: '7d' });
  const userObj = doc.toObject ? doc.toObject() : doc;
  
  return {
    user: sanitizeUser(userObj),
    tokens: { accessToken, refreshToken }
  };
}

export async function login(input: LoginInput) {
  const { email, password } = input;
  const user = await User.findOne({ email }).lean<IUser | null>();
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw new UnauthorizedError('Invalid credentials');

  const accessToken = signToken({
    user_id: String(user._id),
    email: user.email,
    role: user.role ?? 'USER',
    collegeId: user.collegeId ? String(user.collegeId) : undefined
  });

  const refreshToken = signToken({ user_id: String(user._id), email: user.email }, { expiresIn: '7d' });

  return {
    user: sanitizeUser(user),
    tokens: { accessToken, refreshToken }
  };
}

export async function refreshToken(oldRefreshToken: string) {
  if (!oldRefreshToken) throw new BadRequestError('refreshToken is required');

  const result = verifyToken(oldRefreshToken);
  if (!result.valid || !result.decoded) throw new UnauthorizedError('Invalid refresh token');

  const payload = result.decoded;
  const user = await User.findById(payload.user_id).lean<IUser | null>();
  if (!user) throw new UnauthorizedError('User not found');

  const newAccessToken = signToken({
    user_id: user._id.toString(),
    email: user.email,
    role: user.role,
    collegeId: user.collegeId ? user.collegeId.toString() : undefined
  });

  const newRefreshToken = signToken(
    { user_id: user._id.toString(), email: user.email },
    { expiresIn: '7d'}
  );

  return {
    tokens: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  };
}