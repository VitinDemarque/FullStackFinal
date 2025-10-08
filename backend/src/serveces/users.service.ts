import { Types } from 'mongoose';
import { NotFoundError } from '../utils/httpErrors';

// Models + tipos
import User, { IUser } from '../models/User.model';
import Exercise, { IExercise } from '../models/Exercise.model';
import UserBadge, { IUserBadge } from '../models/UserBadge.model';
import UserTitle, { IUserTitle } from '../models/UserTitle.model';
import UserStat, { IUserStat } from '../models/UserStat.model';

export async function getById(id: string) {
    const user = await User.findById(id).lean<IUser | null>();
    if (!user) throw new NotFoundError('User not found');
    return sanitize(user);
}

export async function updateById(id: string, payload: Partial<IUser>) {
    // bloqueia alterações sensíveis se necessário: passwordHash, email verificado, etc.
    const updates: Record<string, any> = { ...payload, updatedAt: new Date() };
    delete updates.passwordHash; // trocas de senha via fluxo próprio

    const doc = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean<IUser | null>();
    if (!doc) throw new NotFoundError('User not found');
    return sanitize(doc);
}

export interface PublicProfileInput {
    userId: string;
    skip: number;
    limit: number;
}

/** Tipos auxiliares para docs populados com lean() */
type BadgeLite = { _id: Types.ObjectId; name: string; iconUrl?: string | null };
type TitleLite = { _id: Types.ObjectId; name: string };

interface IUserBadgePopulated extends Omit<IUserBadge, 'badgeId'> {
    badgeId: Types.ObjectId | BadgeLite;
}
interface IUserTitlePopulated extends Omit<IUserTitle, 'titleId'> {
    titleId: Types.ObjectId | TitleLite;
}

/**
 * Perfil público: dados básicos + badges + titles + exercises públicos
 */
export async function getPublicProfile({ userId, skip, limit }: PublicProfileInput) {
    const user = await User.findById(userId).lean<IUser | null>();
    if (!user) throw new NotFoundError('User not found');

    const [exercises, totalEx] = await Promise.all([
        Exercise.find({
            authorUserId: new Types.ObjectId(userId),
            isPublic: true,
            status: 'PUBLISHED'
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean<IExercise[]>(),
        Exercise.countDocuments({
            authorUserId: new Types.ObjectId(userId),
            isPublic: true,
            status: 'PUBLISHED'
        })
    ]);

    const [badges, titles, scoreboard] = await Promise.all([
        UserBadge.find({ userId: new Types.ObjectId(userId) })
            .populate({ path: 'badgeId', select: { name: 1, iconUrl: 1 } })
            .lean<IUserBadgePopulated[]>(),
        UserTitle.find({ userId: new Types.ObjectId(userId), active: true })
            .populate({ path: 'titleId', select: { name: 1 } })
            .lean<IUserTitlePopulated[]>(),
        UserStat.findOne({ userId: new Types.ObjectId(userId) }).lean<IUserStat | null>()
    ]);

    return {
        user: sanitize(user),
        badges: (badges ?? []).map((b) => {
            const bid = b.badgeId as Types.ObjectId | BadgeLite;
            const isObj = typeof bid === 'object' && bid !== null && '_id' in bid;
            return {
                id: String(isObj ? (bid as BadgeLite)._id : bid),
                name: isObj ? (bid as BadgeLite).name : undefined,
                iconUrl: isObj ? (bid as BadgeLite).iconUrl ?? null : null,
                awardedAt: b.awardedAt
            };
        }),
        titles: (titles ?? []).map((t) => {
            const tid = t.titleId as Types.ObjectId | TitleLite;
            const isObj = typeof tid === 'object' && tid !== null && '_id' in tid;
            return {
                id: String(isObj ? (tid as TitleLite)._id : tid),
                name: isObj ? (tid as TitleLite).name : undefined,
                awardedAt: t.awardedAt
            };
        }),
        scoreboard: {
            created: scoreboard?.exercisesCreatedCount ?? 0,
            solved: scoreboard?.exercisesSolvedCount ?? 0
        },
        exercises: {
            items: exercises.map(sanitizeExerciseLite),
            total: totalEx
        }
    };
}

function sanitize(u: IUser) {
    return {
        id: String(u._id),
        name: u.name,
        email: u.email,
        handle: u.handle,
        collegeId: u.collegeId ? String(u.collegeId) : null,
        level: u.level,
        xpTotal: u.xpTotal,
        avatarUrl: u.avatarUrl ?? null,
        bio: u.bio ?? null,
        role: u.role ?? 'USER',
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
    };
}

function sanitizeExerciseLite(e: IExercise) {
    return {
        id: String(e._id),
        title: e.title,
        languageId: e.languageId ? String(e.languageId) : null,
        difficulty: e.difficulty,
        isPublic: !!e.isPublic,
        status: e.status,
        createdAt: e.createdAt
    };
}
