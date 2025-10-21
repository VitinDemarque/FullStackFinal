// comando de teste para esse arquivo: npm test -- src/tests/unit/services/user.service.test.ts --verbose

import * as userService from '@/services/users.service';
import User from '@/models/User.model';
import Exercise from '@/models/Exercise.model';
import UserBadge from '@/models/UserBadge.model';
import UserTitle from '@/models/UserTitle.model';
import UserStat from '@/models/UserStat.model';
import { NotFoundError } from '@/utils/httpErrors';
import { Types } from 'mongoose';

// Mock de todos os models
jest.mock('@/models/User.model');
jest.mock('@/models/Exercise.model');
jest.mock('@/models/UserBadge.model');
jest.mock('@/models/UserTitle.model');
jest.mock('@/models/UserStat.model');

/*
  O que o teste cobre:
    Função	                 Cenários
    getById	                 Retorno normal + NotFoundError
    updateById	             Atualização bem-sucedida + erro de não encontrado + remoção de passwordHash
    getPublicProfile         Montagem completa de perfil (user, exercises, badges, titles, scoreboard) + erro de user inexistente
*/

describe('users.service', () => {
  const mockUserId = '64b7f1a2c2e6f8e4f8f9a9b9';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('deve retornar o usuário sanitizado se encontrado', async () => {
      const mockUser = {
        _id: mockUserId,
        name: 'João',
        email: 'joao@email.com',
        handle: 'joaoteste',
        xpTotal: 100,
        level: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (User.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockUser),
      });

      const result = await userService.getById(mockUserId);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(result).toHaveProperty('id', mockUserId);
      expect(result).toHaveProperty('name', 'João');
    });

    it('deve lançar NotFoundError se o usuário não existir', async () => {
      (User.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(userService.getById('999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateById', () => {
    it('deve atualizar e retornar o usuário', async () => {
      const mockUpdated = { _id: mockUserId, name: 'Novo Nome', email: 'novo@email.com' };

      (User.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockUpdated),
      });

      const result = await userService.updateById(mockUserId, { name: 'Novo Nome' });

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({ name: 'Novo Nome', updatedAt: expect.any(Date) }),
        expect.objectContaining({ new: true, runValidators: true })
      );
      expect(result.name).toBe('Novo Nome');
    });

    it('deve lançar erro se o usuário não for encontrado', async () => {
      (User.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(userService.updateById('999', { name: 'Nada' })).rejects.toThrow(NotFoundError);
    });

    it('não deve permitir atualizar passwordHash', async () => {
      (User.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ _id: mockUserId }),
      });

      await userService.updateById(mockUserId, { passwordHash: 'hack' } as any);

      const updateArg = (User.findByIdAndUpdate as jest.Mock).mock.calls[0][1];
      expect(updateArg.passwordHash).toBeUndefined();
    });
  });

  describe('getPublicProfile', () => {
    beforeEach(() => {
      // Evita erro com new Types.ObjectId()
      jest.spyOn(Types, 'ObjectId').mockImplementation((id) => id as any);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('deve retornar o perfil público completo', async () => {
      const mockUser = { _id: mockUserId, name: 'João', handle: 'joaoteste', xpTotal: 100, level: 1 };
      const mockExercises = [
        { _id: 'ex1', title: 'Exercício 1', difficulty: 'easy', isPublic: true, status: 'PUBLISHED', createdAt: new Date() },
      ];
      const mockBadges = [
        { badgeId: { _id: 'b1', name: 'Badge XP', iconUrl: 'icon.png' }, awardedAt: new Date() },
      ];
      const mockTitles = [
        { titleId: { _id: 't1', name: 'Mestre' }, awardedAt: new Date() },
      ];
      const mockStat = { exercisesCreatedCount: 10, exercisesSolvedCount: 5 };

      // Mocks encadeados
      (User.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockUser),
      });

      (Exercise.find as any).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(mockExercises),
      });
      (Exercise.countDocuments as jest.Mock).mockResolvedValueOnce(1);

      (UserBadge.find as any).mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(mockBadges),
      });
      (UserTitle.find as any).mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(mockTitles),
      });
      (UserStat.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockStat),
      });

      const result = await userService.getPublicProfile({ userId: mockUserId, skip: 0, limit: 10 });

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(result.user).toHaveProperty('id', mockUserId);
      expect(result.exercises.items.length).toBe(1);
      expect(result.badges[0].name).toBe('Badge XP');
      expect(result.titles[0].name).toBe('Mestre');
      expect(result.scoreboard).toEqual({ created: 10, solved: 5 });
    });

    it('deve lançar NotFoundError se o usuário não existir', async () => {
      (User.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(userService.getPublicProfile({ userId: '999', skip: 0, limit: 10 })).rejects.toThrow(NotFoundError);
    });
  });

  describe('users.service - additional coverage', () => {
    const mockUserId = '64b7f1a2c2e6f8e4f8f9a9b9';

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(Types, 'ObjectId').mockImplementation((id) => id as any);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('sanitize optional fields', () => {
      it('deve definir avatarUrl, bio, collegeId e role corretamente quando ausentes', async () => {
        const mockUser = {
          _id: mockUserId,
          name: 'João',
          email: 'joao@email.com',
          handle: 'joaoteste',
          level: 1,
          xpTotal: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        (User.findById as jest.Mock).mockReturnValueOnce({
          lean: jest.fn().mockResolvedValueOnce(mockUser),
        });

        const result = await userService.getById(mockUserId);

        expect(result.avatarUrl).toBeNull();
        expect(result.bio).toBeNull();
        expect(result.collegeId).toBeNull();
        expect(result.role).toBe('USER');
      });
    });

    describe('updateById with empty or undefined payload', () => {
      it('deve atualizar updatedAt mesmo com payload vazio', async () => {
        (User.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
          lean: jest.fn().mockResolvedValueOnce({ _id: mockUserId }),
        });

        await userService.updateById(mockUserId, {});

        const updateArg = (User.findByIdAndUpdate as jest.Mock).mock.calls[0][1];
        expect(updateArg).toHaveProperty('updatedAt');
      });

      it('deve atualizar updatedAt mesmo com payload undefined', async () => {
        (User.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
          lean: jest.fn().mockResolvedValueOnce({ _id: mockUserId }),
        });

        await userService.updateById(mockUserId, undefined as any);

        const updateArg = (User.findByIdAndUpdate as jest.Mock).mock.calls[0][1];
        expect(updateArg).toHaveProperty('updatedAt');
      });
    });

    describe('getPublicProfile - empty arrays and null scoreboard', () => {
      it('deve retornar arrays vazios e scoreboard zerado quando não há dados', async () => {
        const mockUser = { _id: mockUserId, name: 'João', handle: 'joaoteste', level: 1, xpTotal: 50 };

        (User.findById as jest.Mock).mockReturnValueOnce({
          lean: jest.fn().mockResolvedValueOnce(mockUser),
        });

        (Exercise.find as any).mockReturnValueOnce({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValueOnce([]),
        });
        (Exercise.countDocuments as jest.Mock).mockResolvedValueOnce(0);

        (UserBadge.find as any).mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValueOnce([]),
        });

        (UserTitle.find as any).mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValueOnce([]),
        });

        (UserStat.findOne as jest.Mock).mockReturnValueOnce({
          lean: jest.fn().mockResolvedValueOnce(null),
        });

        const result = await userService.getPublicProfile({ userId: mockUserId, skip: 0, limit: 10 });

        expect(result.exercises.items).toHaveLength(0);
        expect(result.exercises.total).toBe(0);
        expect(result.badges).toHaveLength(0);
        expect(result.titles).toHaveLength(0);
        expect(result.scoreboard).toEqual({ created: 0, solved: 0 });
      });
    });

    describe('getPublicProfile - badges/titles as ObjectId only', () => {
      it('deve lidar com badgeId e titleId sendo apenas ObjectId', async () => {
        const mockUser = { _id: mockUserId, name: 'João', handle: 'joaoteste', level: 1, xpTotal: 50 };
        const objectIdBadge = 'b123';
        const objectIdTitle = 't123';

        (User.findById as jest.Mock).mockReturnValueOnce({
          lean: jest.fn().mockResolvedValueOnce(mockUser),
        });

        (Exercise.find as any).mockReturnValueOnce({
          sort: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValueOnce([]),
        });
        (Exercise.countDocuments as jest.Mock).mockResolvedValueOnce(0);

        (UserBadge.find as any).mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValueOnce([{ badgeId: objectIdBadge, awardedAt: new Date() }]),
        });

        (UserTitle.find as any).mockReturnValueOnce({
          populate: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValueOnce([{ titleId: objectIdTitle, awardedAt: new Date() }]),
        });

        (UserStat.findOne as jest.Mock).mockReturnValueOnce({
          lean: jest.fn().mockResolvedValueOnce(null),
        });

        const result = await userService.getPublicProfile({ userId: mockUserId, skip: 0, limit: 10 });

        expect(result.badges[0].id).toBe(objectIdBadge);
        expect(result.badges[0].name).toBeUndefined();
        expect(result.titles[0].id).toBe(objectIdTitle);
        expect(result.titles[0].name).toBeUndefined();
      });
    });
  });
});