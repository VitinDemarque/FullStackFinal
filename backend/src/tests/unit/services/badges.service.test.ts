import * as badgesService from '@/services/badges.service';
import Badge from '@/models/Badge.model';
import UserBadge from '@/models/UserBadge.model';
import { NotFoundError } from '@/utils/httpErrors';
import { Types } from 'mongoose';

jest.mock('@/models/Badge.model');
jest.mock('@/models/UserBadge.model');

/*

  O que este teste cobre:
  
    Função	           Cenários
    list	           Retorna lista e total
    getById	           Badge existente / NotFoundError
    create	           Criação com valores opcionais omitidos
    update	           Atualização com sucesso / NotFoundError
    remove	           Chama findByIdAndDelete
    grantToUser	       Upsert com source fornecido / source nulo 

*/

describe('badges.service', () => {
  const mockBadgeId = '64b7f1a2c2e6f8e4f8f9a9b9';
  const mockUserId = '64b7f1a2c2e6f8e4f8f9aaa';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Types, 'ObjectId').mockImplementation((id) => id as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('list', () => {
    it('deve retornar a lista de badges com total', async () => {
      const mockBadges = [{ _id: 'b1', name: 'Badge 1' }];

      (Badge.find as any).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(mockBadges),
      });
      (Badge.countDocuments as jest.Mock).mockResolvedValueOnce(1);

      const result = await badgesService.list({ skip: 0, limit: 10 });

      expect(result.items).toEqual(mockBadges);
      expect(result.total).toBe(1);
    });
  });

  describe('getById', () => {
    it('deve retornar badge se existir', async () => {
      const mockBadge = { _id: mockBadgeId, name: 'XP Badge' };
      (Badge.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockBadge),
      });

      const result = await badgesService.getById(mockBadgeId);
      expect(result).toEqual(mockBadge);
    });

    it('deve lançar NotFoundError se não existir', async () => {
      (Badge.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(badgesService.getById('999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('deve criar badge com valores padrão quando opcionais não fornecidos', async () => {
      const input = { name: 'Novo Badge' };
      const mockDoc = { toObject: jest.fn().mockReturnValue({ _id: 'b1', ...input, description: '', iconUrl: null, ruleCode: null }) };
      (Badge.create as jest.Mock).mockResolvedValueOnce(mockDoc);

      const result = await badgesService.create(input);
      expect(Badge.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Novo Badge',
        description: '',
        iconUrl: null,
        ruleCode: null,
      }));
      expect(result).toHaveProperty('name', 'Novo Badge');
    });
  });

  describe('update', () => {
    it('deve atualizar badge existente', async () => {
      const payload = { description: 'Atualizado' };
      const mockBadge = { _id: mockBadgeId, name: 'XP Badge', description: 'Atualizado' };

      (Badge.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockBadge),
      });

      const result = await badgesService.update(mockBadgeId, payload);
      expect(result).toEqual(mockBadge);
    });

    it('deve lançar NotFoundError se não existir', async () => {
      (Badge.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(badgesService.update('999', { name: 'Nada' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('remove', () => {
    it('deve chamar findByIdAndDelete', async () => {
      (Badge.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);
      await badgesService.remove(mockBadgeId);
      expect(Badge.findByIdAndDelete).toHaveBeenCalledWith(mockBadgeId);
    });
  });

  describe('grantToUser', () => {
    it('deve chamar updateOne com upsert', async () => {
      (UserBadge.updateOne as jest.Mock).mockResolvedValueOnce(null);

      await badgesService.grantToUser(mockUserId, mockBadgeId, 'sourceXYZ');

      expect(UserBadge.updateOne).toHaveBeenCalledWith(
        { userId: mockUserId, badgeId: mockBadgeId },
        { $setOnInsert: { awardedAt: expect.any(Date) }, $set: { source: 'sourceXYZ' } },
        { upsert: true }
      );
    });

    it('deve setar source como null se não fornecido', async () => {
      (UserBadge.updateOne as jest.Mock).mockResolvedValueOnce(null);

      await badgesService.grantToUser(mockUserId, mockBadgeId);

      expect(UserBadge.updateOne).toHaveBeenCalledWith(
        { userId: mockUserId, badgeId: mockBadgeId },
        { $setOnInsert: { awardedAt: expect.any(Date) }, $set: { source: null } },
        { upsert: true }
      );
    });
  });
});