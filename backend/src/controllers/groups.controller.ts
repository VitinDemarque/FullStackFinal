import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as GroupsService from '../services/groups.service';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { BadRequestError } from '../utils/httpErrors';

export async function listPublic(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parsePagination(req.query);
    const { skip, limit } = toMongoPagination(page);
    const result = await GroupsService.listPublic({ skip, limit });
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid group ID format');
    }
    const group = await GroupsService.getById(id);
    return res.json(group);
  } catch (err) {
    return next(err);
  }
}

export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const payload = req.body ?? {};
    const created = await GroupsService.create(req.user.user_id, payload);
    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
}

export async function update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid group ID format');
    }
    const payload = req.body ?? {};
    const updated = await GroupsService.update(req.user.user_id, id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid group ID format');
    }
    await GroupsService.remove(req.user.user_id, id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export async function join(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid group ID format');
    }
    const result = await GroupsService.join(req.user.user_id, id);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function leave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid group ID format');
    }
    const result = await GroupsService.leave(req.user.user_id, id);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function addMember(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { id, userId } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid group ID format');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID format');
    }
    const result = await GroupsService.addMember(req.user.user_id, id, userId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function removeMember(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { id, userId } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid group ID format');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID format');
    }
    const result = await GroupsService.removeMember(req.user.user_id, id, userId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function setMemberRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new BadRequestError('Missing user id');
    const { id, userId } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid group ID format');
    }
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID format');
    }
    const { role } = req.body ?? {};
    const result = await GroupsService.setMemberRole(req.user.user_id, id, userId, role);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function listExercises(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
      if (!req.user?.user_id) throw new BadRequestError('Missing user id');
      
      const { id: groupId } = req.params;
      if (!Types.ObjectId.isValid(groupId)) {
        throw new BadRequestError('Invalid group ID format');
      }
      
      const page = parsePagination(req.query);
      const { skip, limit } = toMongoPagination(page);

      const result = await GroupsService.listExercisesForGroup(
          req.user.user_id, 
          groupId, 
          { skip, limit }
      );
      
      return res.json(result);
  } catch (err) {
      return next(err);
  }
}