/*

Funcao                  Cobertura
  list                    Retorna lista e o total
  getById                 Encontra e lanca erro
  create                  Cria com datas validas
  update                  Atualiza e valida as datas
  remove                  Remove
  activate                Ativa ou lança erro
  deactivate              Desativa ou lanca erro

*/

import * as seasonService from '@/services/seasons.service';
import Season from '@/models/Season.model';
import { BadRequestError, NotFoundError } from '@/utils/httpErrors';

// Mock do modelo Mongoose
jest.mock('../../../models/Season.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  create: jest.fn(),
}));

// Teste do seasons.service
describe('seasons.service', () => {
  beforeEach(() => jest.clearAllMocks());

  const mockSeason = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Temporada 1',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    isActive: false,
    toObject: jest.fn().mockReturnThis(),
  };

  // Teste do list
  describe('list', () => {
    it('deve retornar lista de seasons e total', async () => {
      (Season.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockSeason]),
      });
      (Season.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await seasonService.list({ skip: 0, limit: 10 });

      expect(Season.find).toHaveBeenCalledWith({});
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.items[0]).toMatchObject({
        id: String(mockSeason._id),
        name: 'Temporada 1',
        isActive: false,
      });
    });
  });

  // Test do getById
  describe('getById', () => {
    it('deve retornar uma season existente', async () => {
      (Season.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSeason),
      });

      const result = await seasonService.getById('507f1f77bcf86cd799439011');

      expect(Season.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result.name).toBe('Temporada 1');
    });

    it('deve lançar NotFoundError se a season não existir', async () => {
      (Season.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(seasonService.getById('invalido')).rejects.toThrow(NotFoundError);
    });
  });

  // Test do create
  describe('create', () => {
    it('deve criar uma season válida', async () => {
      (Season.create as jest.Mock).mockResolvedValue(mockSeason);

      const result = await seasonService.create({
        name: 'Temporada Teste',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
      });

      expect(Season.create).toHaveBeenCalledWith({
        name: 'Temporada Teste',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        isActive: false,
      });
      expect(result.name).toBe('Temporada 1');
    });

    it('deve lançar BadRequestError se as datas forem inválidas', async () => {
      await expect(
        seasonService.create({
          name: 'Erro',
          startDate: 'data invalida',
          endDate: '2025-12-31',
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('deve lançar BadRequestError se endDate for anterior ao startDate', async () => {
      await expect(
        seasonService.create({
          name: 'Erro',
          startDate: '2025-12-31',
          endDate: '2025-01-01',
        })
      ).rejects.toThrow(BadRequestError);
    });
  });

  // Test do update
  describe('update', () => {
    it('deve atualizar uma season existente', async () => {
      (Season.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockSeason),
      });

      const result = await seasonService.update('507f1f77bcf86cd799439011', {
        name: 'Atualizada',
      });

      expect(Season.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { name: 'Atualizada' },
        { new: true, runValidators: true }
      );
      expect(result.name).toBe('Temporada 1');
    });

    it('deve lançar NotFoundError se não encontrar a season', async () => {
      (Season.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        seasonService.update('naoExiste', { name: 'Erro' })
      ).rejects.toThrow(NotFoundError);
    });

    it('deve lançar BadRequestError se datas forem inválidas', async () => {
      await expect(
        seasonService.update('1', { startDate: 'data errada' })
      ).rejects.toThrow(BadRequestError);
    });

    it('deve lançar BadRequestError se endDate < startDate', async () => {
      await expect(
        seasonService.update('1', {
          startDate: '2025-12-31',
          endDate: '2025-01-01',
        })
      ).rejects.toThrow(BadRequestError);
    });
  });

  // Test do remove
  describe('remove', () => {
    it('deve remover uma season pelo ID', async () => {
      (Season.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      await seasonService.remove('507f1f77bcf86cd799439011');

      expect(Season.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  // Test do activate
  describe('activate', () => {
    it('deve ativar uma season existente', async () => {
      const mockDoc = {
        ...mockSeason,
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnThis(),
      };
      (Season.findById as jest.Mock).mockResolvedValue(mockDoc);

      const result = await seasonService.activate('507f1f77bcf86cd799439011');

      expect(mockDoc.isActive).toBe(true);
      expect(mockDoc.save).toHaveBeenCalled();
      expect(result.isActive).toBe(true);
    });

    it('deve lançar NotFoundError se a season não existir', async () => {
      (Season.findById as jest.Mock).mockResolvedValue(null);

      await expect(seasonService.activate('naoExiste')).rejects.toThrow(NotFoundError);
    });
  });

  // Test do deactivate
  describe('deactivate', () => {
    it('deve desativar uma season existente', async () => {
      const mockDoc = {
        ...mockSeason,
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnThis(),
      };
      (Season.findById as jest.Mock).mockResolvedValue(mockDoc);

      const result = await seasonService.deactivate('507f1f77bcf86cd799439011');

      expect(mockDoc.isActive).toBe(false);
      expect(mockDoc.save).toHaveBeenCalled();
      expect(result.isActive).toBe(false);
    });

    it('deve lançar NotFoundError se a season não existir', async () => {
      (Season.findById as jest.Mock).mockResolvedValue(null);

      await expect(seasonService.deactivate('naoExiste')).rejects.toThrow(NotFoundError);
    });
  });
});