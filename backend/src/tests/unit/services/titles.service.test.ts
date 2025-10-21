// comando de teste para esse arquivo: npm test -- src/tests/unit/services/titles.service.test.ts --verbose

import { Types } from 'mongoose';
import * as titlesService from '@/services/titles.service';
import Title from '@/models/Title.model';
import UserTitle from '@/models/UserTitle.model';
import { NotFoundError } from '@/utils/httpErrors';

jest.mock('@/models/Title.model');
jest.mock('@/models/UserTitle.model');

interface ITitle {
  _id: string;
  name: string;
  description?: string;
  minLevel?: number;
  minXp?: number;
  toObject?: () => ITitle;
}

describe('titles.service', () => {
  const mockTitleId = new Types.ObjectId().toString();
  const mockUserId = new Types.ObjectId().toString();

  const mockTitle: ITitle = {
    _id: mockTitleId,
    name: 'Champion',
    description: 'Top level title',
    minLevel: 5,
    minXp: 500,
    toObject: jest.fn().mockReturnThis()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('deve retornar lista de titles', async () => {
      (Title.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockTitle])
      });
      (Title.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await titlesService.list({ skip: 0, limit: 10 });

      expect(result.total).toBe(1);
      expect(result.items[0].name).toBe('Champion');
    });
  });

  describe('getById', () => {
    it('deve retornar title por ID', async () => {
      (Title.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTitle as unknown as ITitle)
      });

      const result = (await titlesService.getById(mockTitleId)) as unknown as ITitle;
      expect(result._id).toBe(mockTitleId);
    });

    it('deve lançar NotFoundError se title não existir', async () => {
      (Title.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      await expect(titlesService.getById(mockTitleId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('deve criar um title', async () => {
      const mockCreatedTitle = {
        ...mockTitle,
        toObject: jest.fn().mockReturnValue(mockTitle)
      };

      (Title.create as jest.Mock).mockResolvedValue(mockCreatedTitle);

      const result = await titlesService.create({
        name: 'Champion',
        description: 'Top level title',
        minLevel: 5,
        minXp: 500
      });

      expect(result.name).toBe('Champion');
      expect(Title.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar title existente', async () => {
      (Title.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTitle as unknown as ITitle)
      });

      const result = (await titlesService.update(mockTitleId, { name: 'Legend' })) as unknown as ITitle;
      expect(result._id).toBe(mockTitleId);
      expect(Title.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTitleId,
        { name: 'Legend' },
        { new: true, runValidators: true }
      );
    });

    it('deve lançar NotFoundError se title não existir', async () => {
      (Title.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });

      await expect(titlesService.update(mockTitleId, { name: 'Legend' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('remove', () => {
    it('deve chamar findByIdAndDelete', async () => {
      (Title.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      await titlesService.remove(mockTitleId);
      expect(Title.findByIdAndDelete).toHaveBeenCalledWith(mockTitleId);
    });
  });

  describe('grantToUser', () => {
    it('deve atualizar ou criar UserTitle com upsert', async () => {
      (UserTitle.updateOne as jest.Mock).mockResolvedValue({});

      await titlesService.grantToUser(mockUserId, mockTitleId, true);

      expect(UserTitle.updateOne).toHaveBeenCalledWith(
        { userId: expect.any(Types.ObjectId), titleId: expect.any(Types.ObjectId) },
        { $set: { active: true, awardedAt: expect.any(Date) } },
        { upsert: true }
      );
    });
  });

  describe('setActive', () => {
    it('deve atualizar o status ativo do UserTitle', async () => {
      (UserTitle.updateOne as jest.Mock).mockResolvedValue({});

      await titlesService.setActive(mockUserId, mockTitleId, false);

      expect(UserTitle.updateOne).toHaveBeenCalledWith(
        { userId: expect.any(Types.ObjectId), titleId: expect.any(Types.ObjectId) },
        { $set: { active: false } }
      );
    });
  });
});