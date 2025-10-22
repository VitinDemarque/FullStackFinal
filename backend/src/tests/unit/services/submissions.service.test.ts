// comando de teste para esse arquivo: npm test -- src/tests/unit/services/submissions.service.test.ts --verbose

import { Types } from 'mongoose';
import * as submissionsService from '@/services/submissions.service';
import Submission from '@/models/Submission.model';
import Exercise from '@/models/Exercise.model';
import Season from '@/models/Season.model';
import User from '@/models/User.model';
import LevelRule from '@/models/LevelRule.model';
import UserStat from '@/models/UserStat.model';
import ExerciseStat from '@/models/ExerciseStat.model';
import { calculateXp } from '@/services/xp-rules/calculator';
import { NotFoundError, BadRequestError } from '@/utils/httpErrors';

jest.mock('@/models/Submission.model');
jest.mock('@/models/Exercise.model');
jest.mock('@/models/Season.model');
jest.mock('@/models/User.model');
jest.mock('@/models/LevelRule.model');
jest.mock('@/models/UserStat.model');
jest.mock('@/models/ExerciseStat.model');
jest.mock('@/services/xp-rules/calculator');

describe('submissions.service', () => {
  const mockUserId = new Types.ObjectId().toString();
  const mockExerciseId = new Types.ObjectId().toString();
  const mockSeasonId = new Types.ObjectId().toString();

  const mockExercise = {
    _id: mockExerciseId,
    status: 'PUBLISHED',
    baseXp: 100,
    difficulty: 2,
  };

  const mockSeason = {
    _id: mockSeasonId,
    isActive: true,
    startDate: new Date(Date.now() - 1000),
    endDate: new Date(Date.now() + 1000),
  };

  const mockSubmission = {
    _id: new Types.ObjectId(),
    userId: mockUserId,
    exerciseId: mockExerciseId,
    seasonId: mockSeasonId,
    status: 'ACCEPTED',
    score: 80,
    timeSpentMs: 1000,
    xpAwarded: 150,
    createdAt: new Date(),
    toObject: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE
  describe('create', () => {
    it('deve criar uma submission corretamente e creditar XP', async () => {
      (Exercise.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockExercise),
      });
      (Season.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSeason),
      });
      (calculateXp as jest.Mock).mockReturnValue(150);
      (Submission.create as jest.Mock).mockResolvedValue(mockSubmission);
      (User.findById as jest.Mock).mockResolvedValue({ xpTotal: 0, save: jest.fn() });
      (LevelRule.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([
          { level: 1, minXp: 0 },
          { level: 2, minXp: 100 },
        ]),
      });
      (UserStat.updateOne as jest.Mock).mockResolvedValue({});
      (ExerciseStat.updateOne as jest.Mock).mockResolvedValue({});

      const result = await submissionsService.create({
        userId: mockUserId,
        exerciseId: mockExerciseId,
        score: 80,
        timeSpentMs: 1000,
        code: 'console.log("hello")',
      });

      expect(result).toMatchObject({
        userId: mockUserId,
        exerciseId: mockExerciseId,
        status: 'ACCEPTED',
        score: 80,
        xpAwarded: 150,
      });

      expect(Submission.create).toHaveBeenCalled();
      expect(UserStat.updateOne).toHaveBeenCalled();
      expect(ExerciseStat.updateOne).toHaveBeenCalled();
    });

    it('deve lançar NotFoundError se o exercício não existir', async () => {
      (Exercise.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        submissionsService.create({ userId: mockUserId, exerciseId: mockExerciseId })
      ).rejects.toThrow(NotFoundError);
    });

    it('deve lançar BadRequestError se o exercício não estiver publicado', async () => {
      (Exercise.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({ ...mockExercise, status: 'DRAFT' }),
      });

      await expect(
        submissionsService.create({ userId: mockUserId, exerciseId: mockExerciseId })
      ).rejects.toThrow(BadRequestError);
    });

    it('deve criar submission mesmo sem temporada ativa', async () => {
      (Exercise.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockExercise),
      });
      (Season.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      (calculateXp as jest.Mock).mockReturnValue(100);
      (Submission.create as jest.Mock).mockResolvedValue(mockSubmission);
      (User.findById as jest.Mock).mockResolvedValue({ xpTotal: 0, save: jest.fn() });
      (LevelRule.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ level: 1, minXp: 0 }]),
      });
      (UserStat.updateOne as jest.Mock).mockResolvedValue({});
      (ExerciseStat.updateOne as jest.Mock).mockResolvedValue({});

      const result = await submissionsService.create({
        userId: mockUserId,
        exerciseId: mockExerciseId,
        score: 90,
      });

      expect(result.seasonId).toBe(mockSeasonId);
    });

    it('não deve creditar XP se a submissão for rejeitada (score < 60)', async () => {
      (Exercise.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockExercise),
      });
      (Season.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSeason),
      });
      (calculateXp as jest.Mock).mockReturnValue(50);
      (Submission.create as jest.Mock).mockResolvedValue({
        ...mockSubmission,
        status: 'REJECTED',
        score: 30,
      });
      const mockUser = { xpTotal: 0, save: jest.fn() };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (LevelRule.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ level: 1, minXp: 0 }]),
      });
      (UserStat.updateOne as jest.Mock).mockResolvedValue({});
      (ExerciseStat.updateOne as jest.Mock).mockResolvedValue({});

      await submissionsService.create({
        userId: mockUserId,
        exerciseId: mockExerciseId,
        score: 30,
      });

      expect(User.findById).not.toHaveBeenCalled();
    });

    it('deve continuar mesmo se updateOne falhar', async () => {
      (Exercise.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockExercise),
      });
      (Season.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSeason),
      });
      (calculateXp as jest.Mock).mockReturnValue(120);
      (Submission.create as jest.Mock).mockResolvedValue(mockSubmission);
      (User.findById as jest.Mock).mockResolvedValue({ xpTotal: 0, save: jest.fn() });
      (LevelRule.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([{ level: 1, minXp: 0 }]),
      });
      (UserStat.updateOne as jest.Mock).mockRejectedValue(new Error('fail'));
      (ExerciseStat.updateOne as jest.Mock).mockRejectedValue(new Error('fail'));

      await expect(
        submissionsService.create({
          userId: mockUserId,
          exerciseId: mockExerciseId,
          score: 80,
        })
      ).resolves.not.toThrow();
    });
  });

  // LIST BY USER / EXERCISE
  describe('listByUser', () => {
    it('deve retornar a lista de submissões do usuário', async () => {
      (Submission.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockSubmission]),
      });
      (Submission.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await submissionsService.listByUser(mockUserId, { skip: 0, limit: 10 });
      expect(result.total).toBe(1);
    });

    it('deve retornar lista vazia se não houver submissões', async () => {
      (Submission.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });
      (Submission.countDocuments as jest.Mock).mockResolvedValue(0);

      const result = await submissionsService.listByUser(mockUserId, { skip: 0, limit: 10 });
      expect(result.items).toHaveLength(0);
    });
  });

  describe('listByExercise', () => {
    it('deve retornar submissões do exercício', async () => {
      (Submission.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockSubmission]),
      });
      (Submission.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await submissionsService.listByExercise(mockExerciseId, { skip: 0, limit: 10 });
      expect(result.total).toBe(1);
    });

    it('deve retornar lista vazia se nenhuma submissão encontrada', async () => {
      (Submission.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([]),
      });
      (Submission.countDocuments as jest.Mock).mockResolvedValue(0);

      const result = await submissionsService.listByExercise(mockExerciseId, { skip: 0, limit: 10 });
      expect(result.items).toHaveLength(0);
    });
  });

  // GET BY ID
  describe('getById', () => {
    it('deve retornar submission por ID', async () => {
      (Submission.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSubmission),
      });

      const result = await submissionsService.getById(mockSubmission._id.toString());
      expect(result.id).toBe(mockSubmission._id.toString());
    });

    it('deve lançar NotFoundError se submission não existir', async () => {
      (Submission.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(submissionsService.getById(mockSubmission._id.toString())).rejects.toThrow(
        NotFoundError
      );
    });
  });
});
