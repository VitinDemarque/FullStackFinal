import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth.service';
import { BadRequestError } from '../utils/httpErrors';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, handle, collegeId } = req.body ?? {};
    if (!name || !email || !password || !handle) {
      throw new BadRequestError('Missing required fields: name, email, password, handle');
    }

    const result = await AuthService.signup({ name, email, password, handle, collegeId });
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      throw new BadRequestError('Missing required fields: email, password');
    }
    const result = await AuthService.login({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}
