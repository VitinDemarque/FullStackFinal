import jwt, { SignOptions } from 'jsonwebtoken';

const {
  JWT_SECRET = 'change-me',
  JWT_EXPIRES_IN = '1d',
} = process.env;

/**
 * Payload mínimo que colocamos no token.
 * Expanda conforme sua regra: role, collegeId, etc.
 */
export interface UserTokenPayload {
  user_id: string;
  email: string;
  role?: string;
  collegeId?: string;
  [key: string]: unknown;
}

export interface VerifyResult<T = UserTokenPayload> {
  valid: boolean;
  expired: boolean;
  decoded?: T;
  error?: Error;
}

export function signToken(
  payload: UserTokenPayload,
  options: SignOptions = {}
): string {
  const opts: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'], ...options };
  return jwt.sign(payload, JWT_SECRET, opts);
}

export function verifyToken<T = UserTokenPayload>(token: string): VerifyResult<T> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as T;
    return { valid: true, expired: false, decoded };
  } catch (err: any) {
    const expired = err?.name === 'TokenExpiredError';
    return { valid: false, expired, error: err };
  }
}

/**
 * Extrai o token de um header Authorization: Bearer <token>
 */
export function getBearerToken(headerValue?: string | string[] | undefined): string | null {
  if (!headerValue) return null;
  const value = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  const [scheme, token] = value.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) return null;
  return token.trim();
}
