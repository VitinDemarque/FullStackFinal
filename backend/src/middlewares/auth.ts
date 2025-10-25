import { NextFunction, Request, Response } from 'express';
import { getBearerToken, verifyToken, UserTokenPayload } from '../utils/jwt';
import { ForbiddenError, UnauthorizedError } from '../utils/httpErrors';

export interface AuthenticatedRequest extends Request {
  user?: UserTokenPayload;
}

export interface AuthOptions {
  roles?: string[];
  optional?: boolean;
}

export function auth(options: AuthOptions = {}) {
  const { roles, optional = false } = options;

  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      if (optional) return next();
      return next(new UnauthorizedError('Missing Bearer token'));
    }

    const { valid, expired, decoded, error } = verifyToken<UserTokenPayload>(token);

    if (!valid || !decoded) {
      if (expired) return next(new UnauthorizedError('Token expired'));
      return next(new UnauthorizedError('Invalid token', error));
    }

    req.user = decoded;

    if (roles?.length) {
      const userRole = decoded.role;
      if (!userRole || !roles.includes(userRole)) {
        return next(new ForbiddenError('Insufficient role'));
      }
    }

    return next();
  };
}

export function requireOwnership(paramKey: string = 'id') {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user?.sub) return next(new UnauthorizedError());
    if (req.params?.[paramKey] !== req.user.sub) {
      return next(new ForbiddenError('Operation allowed only to the resource owner'));
    }
    return next();
  };
}