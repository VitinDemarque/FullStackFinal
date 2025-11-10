import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as UsersService from '../services/users.service';
import * as StatsService from '../services/stats.service';
import * as BadgesService from '../services/badges.service';
import UserTitle from '../models/UserTitle.model';
import Title from '../models/Title.model';
import Badge from '../models/Badge.model';
import User from '../models/User.model';
import UserStat from '../models/UserStat.model';
import { BadRequestError, NotFoundError } from '../utils/httpErrors';
import { parsePagination, toMongoPagination } from '../utils/pagination';
import { saveDataUrlAvatar } from '../utils/avatar';

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new NotFoundError('User not in token');
    const user = await UsersService.getById(req.user.user_id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

export async function updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new NotFoundError('User not in token');
    const payload = req.body ?? {};
    const updated = await UsersService.updateById(req.user.user_id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function changeMyPassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new NotFoundError('User not in token');
    const { currentPassword, newPassword } = req.body ?? {};
    if (!currentPassword || !newPassword) {
      throw new BadRequestError('Missing required fields: currentPassword, newPassword');
    }
    await UsersService.changePassword(req.user.user_id, currentPassword, newPassword);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export async function deleteMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new NotFoundError('User not in token');
    await UsersService.removeById(req.user.user_id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid user ID format');
    }
    const user = await UsersService.getById(id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

export async function updateById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const payload = req.body ?? {};
    const updated = await UsersService.updateById(id, payload);
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function getPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid user ID format');
    }
    const page = parsePagination(req.query, { page: 1, limit: 20 }, 100);
    const { skip, limit } = toMongoPagination(page);

    const profile = await UsersService.getPublicProfile({
      userId: id,
      skip,
      limit,
    });

    return res.json(profile);
  } catch (err) {
    return next(err);
  }
}

export async function getProfileScoreboard(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid user ID format');
    }
    const scoreboard = await StatsService.getUserScoreboard(id);
    return res.json(scoreboard);
  } catch (err) {
    return next(err);
  }
}

export async function getUserBadges(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid user ID format');
    }
    const badges = await BadgesService.getUserBadges(id);
    return res.json(badges);
  } catch (err) {
    return next(err);
  }
}

export async function getUserTitles(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid user ID format');
    }

    const titles = await UserTitle.find({ userId: new Types.ObjectId(id) })
      .populate({ path: 'titleId', select: { name: 1, description: 1, minLevel: 1, minXp: 1 } })
      .lean();

    return res.json(
      (titles ?? []).map((ut: any) => ({
        _id: String(ut._id),
        title: ut.titleId,
        awardedAt: ut.awardedAt,
        active: ut.active,
      }))
    );
  } catch (err) {
    return next(err);
  }
}

export async function uploadMyAvatar(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.user_id) throw new NotFoundError('User not in token');
    const { dataUrl } = req.body ?? {};
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      throw new BadRequestError('Invalid or missing dataUrl image');
    }
    // Validate image size (<= 5MB)
    const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
      throw new BadRequestError('Invalid image data URL');
    }
    const base64 = match[2];
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length > 5 * 1024 * 1024) {
      throw new BadRequestError('Imagem muito grande (máx 5MB)');
    }
    const avatarUrl = saveDataUrlAvatar(req.user.user_id, dataUrl);
    const updated = await UsersService.updateById(req.user.user_id, { avatarUrl });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

// Verifica e concede conquistas normais (baseadas em estatísticas do site/app)
export async function checkAndAwardBadges(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Invalid user ID format');
    }

    // Carrega usuário e estatísticas
    const [user, stats] = await Promise.all([
      User.findById(id).lean(),
      UserStat.findOne({ userId: new Types.ObjectId(id) }).lean()
    ]);

    if (!user) throw new NotFoundError('User not found');

    const xpTotal = Number(user.xpTotal ?? 0);
    const level = Number(user.level ?? 0);
    const solved = Number(stats?.exercisesSolvedCount ?? 0);
    const created = Number(stats?.exercisesCreatedCount ?? 0);

    // Busca badges normais com regras
    const ruleBadges = await Badge.find({ isTriumphant: { $ne: true }, ruleCode: { $ne: null } }).lean();

    const awardedNow: any[] = [];

    for (const b of ruleBadges) {
      const rule = String(b.ruleCode);
      let meets = false;

      // Formatos suportados: EXERCISES_SOLVED_AT_LEAST_N, EXERCISES_CREATED_AT_LEAST_N, XP_TOTAL_AT_LEAST_N, LEVEL_AT_LEAST_N
      const solvedMatch = rule.match(/^EXERCISES_SOLVED_AT_LEAST_(\d+)$/);
      const createdMatch = rule.match(/^EXERCISES_CREATED_AT_LEAST_(\d+)$/);
      const xpMatch = rule.match(/^XP_TOTAL_AT_LEAST_(\d+)$/);
      const levelMatch = rule.match(/^LEVEL_AT_LEAST_(\d+)$/);

      if (solvedMatch) {
        meets = solved >= Number(solvedMatch[1]);
      } else if (createdMatch) {
        meets = created >= Number(createdMatch[1]);
      } else if (xpMatch) {
        meets = xpTotal >= Number(xpMatch[1]);
      } else if (levelMatch) {
        meets = level >= Number(levelMatch[1]);
      }

      if (meets) {
        await BadgesService.grantToUser(id, String(b._id), 'statsCheck');
        awardedNow.push(b);
      }
    }

    return res.json(awardedNow);
  } catch (err) {
    return next(err);
  }
}