import * as levelService from '@/services/levels.service';
import LevelRule from '@/models/LevelRule.model';
import { NotFoundError } from '@/utils/httpErrors';

/*

  O que este teste cobre:
  
    Função	           Cenários	       
      list              retorna lista e total
      getByLevel        retorno valido ou notFound
      upsert            Update e insert
      remove            remove pelo nivel

*/

// Mock do modelo Mongoose
jest.mock('../../../models/LevelRule.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
}));

describe('levels.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Dados simulados
  const mockDocs = [
    { level: 1, minXp: 0 },
    { level: 2, minXp: 100 },
    { level: 3, minXp: 300 },
  ];


  // Teste do list
  describe('list', () => {
    it('deve retornar lista de levels e total', async () => {
      // mock encadeado: find().sort().skip().limit().lean()
      (LevelRule.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockDocs),
      });
      (LevelRule.countDocuments as jest.Mock).mockResolvedValue(3);

      const result = await levelService.list({ skip: 0, limit: 10 });

      expect(LevelRule.find).toHaveBeenCalledWith({});
      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(3);
    });
  });

  // Teste do getByLevel
  describe('getByLevel', () => {
    it('deve retornar a regra do nível se existir', async () => {
      (LevelRule.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({ level: 2, minXp: 100 }),
      });

      const result = await levelService.getByLevel(2);

      expect(LevelRule.findOne).toHaveBeenCalledWith({ level: 2 });
      expect(result).toEqual({ level: 2, minXp: 100 });
    });

    it('deve lançar NotFoundError se o nível não existir', async () => {
      (LevelRule.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(levelService.getByLevel(999)).rejects.toThrow(NotFoundError);
    });
  });

  // Test do upsert
  describe('upsert', () => {
    it('deve criar ou atualizar um LevelRule', async () => {
      const updated = { level: 5, minXp: 500 };
      (LevelRule.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(updated),
      });

      const result = await levelService.upsert(5, 500);

      expect(LevelRule.findOneAndUpdate).toHaveBeenCalledWith(
        { level: 5 },
        { $set: { minXp: 500 } },
        { new: true, upsert: true }
      );
      expect(result).toEqual(updated);
    });
  });

  // Test do remove
  describe('remove', () => {
    it('deve remover um LevelRule pelo nível', async () => {
      (LevelRule.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      await levelService.remove(2);

      expect(LevelRule.deleteOne).toHaveBeenCalledWith({ level: 2 });
    });
  });
});
