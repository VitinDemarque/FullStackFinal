// comando de teste para esse arquivo: npm test -- src/tests/unit/services/leaderboards.service.test.ts --verbose

import * as leaderboardService from '@/services/leaderboards.service';
import Submission from '@/models/Submission.model';
import { BadRequestError } from '@/utils/httpErrors';

jest.mock('../../../models/Submission.model', () => ({
  aggregate: jest.fn(),
}));
jest.mock('../../../models/Exercise.model', () => ({}));
jest.mock('../../../models/User.model', () => ({}));

/*

  O que este teste cobre:
  
    Função	                   Cenários	       
      general                    Retorno com posicao e compos corretos
      byLanguage                 Ranking e erro
      bySeason                   Ranking e erro
      byCollege                  Ranking e erro
      
*/

describe('leaderboards.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRows = [
    {
      userId: 'u1',
      name: 'Alice',
      handle: 'alice01',
      collegeId: 'c1',
      points: 100,
      xpTotal: 200,
    },
    {
      userId: 'u2',
      name: 'Bob',
      handle: 'bob02',
      collegeId: null,
      points: 80,
      xpTotal: 150,
    },
  ];

  // Testa do general()
  describe('general', () => {
    it('deve retornar ranking geral com posições', async () => {
      (Submission.aggregate as jest.Mock).mockResolvedValueOnce(mockRows);

      const result = await leaderboardService.general({ skip: 0, limit: 10 });

      expect(Submission.aggregate).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        position: 1,
        name: 'Alice',
        points: 100,
      });
    });
  });

  // Testa do byLanguage()
  describe('byLanguage', () => {
    it('deve lançar erro se languageId não for informado', async () => {
      await expect(
        leaderboardService.byLanguage('', { skip: 0, limit: 10 })
      ).rejects.toThrow(BadRequestError);
    });

    it('deve retornar ranking por linguagem', async () => {
      (Submission.aggregate as jest.Mock).mockResolvedValueOnce(mockRows);

      const result = await leaderboardService.byLanguage('lang123', { skip: 0, limit: 10 });

      expect(Submission.aggregate).toHaveBeenCalledTimes(1);
      expect(result[1]).toMatchObject({
        position: 2,
        name: 'Bob',
        collegeId: null,
      });
    });
  });

  // Testa do bySeason()
  describe('bySeason', () => {
    it('deve lançar erro se seasonId não for informado', async () => {
      await expect(
        leaderboardService.bySeason('', { skip: 0, limit: 10 })
      ).rejects.toThrow(BadRequestError);
    });

    it('deve retornar ranking por temporada', async () => {
      (Submission.aggregate as jest.Mock).mockResolvedValueOnce(mockRows);

      const result = await leaderboardService.bySeason('season123', { skip: 0, limit: 10 });

      expect(Submission.aggregate).toHaveBeenCalledTimes(1);
      expect(result[0].userId).toBe('u1');
    });
  });

  // Testa do byCollege()
  describe('byCollege', () => {
    it('deve lançar erro se collegeId não for informado', async () => {
      await expect(
        leaderboardService.byCollege('', { skip: 0, limit: 10 })
      ).rejects.toThrow(BadRequestError);
    });

    it('deve retornar ranking por faculdade', async () => {
      (Submission.aggregate as jest.Mock).mockResolvedValueOnce(mockRows);

      const result = await leaderboardService.byCollege('college123', { skip: 0, limit: 10 });

      expect(Submission.aggregate).toHaveBeenCalledTimes(1);
      expect(result[0]).toMatchObject({
        name: 'Alice',
        points: 100,
        position: 1,
      });
    });
  });
});
