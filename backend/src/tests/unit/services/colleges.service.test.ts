// comando de teste para esse arquivo: npm test -- src/tests/unit/services/colleges.service.test.ts --verbose

import * as collegesService from '@/services/colleges.service';
import College from '@/models/College.model';
import { ConflictError, NotFoundError } from '@/utils/httpErrors';

jest.mock('@/models/College.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

/*

Funcao                      Cenarios cobertos
listExerciseStats           Sucesso e erro
getUserStats                Usuario com e sem estatisticas
getUserScoreboard           Retorno created e solved

*/

describe('colleges.service', () => {
  const mockCollegeId = '65abc123456789abcdef012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // teste da funcao list()
  describe('list', () => {
    it('deve retornar lista paginada e total', async () => {
      const mockColleges = [
        { _id: '1', name: 'USP', acronym: 'USP', city: 'São Paulo', state: 'SP' },
        { _id: '2', name: 'UFRJ', acronym: 'UFRJ', city: 'Rio de Janeiro', state: 'RJ' },
      ];

      (College.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(mockColleges),
      });
      (College.countDocuments as jest.Mock).mockResolvedValueOnce(2);

      const result = await collegesService.list({ skip: 0, limit: 10 });

      expect(result.total).toBe(2);
      expect(result.items).toEqual([
        {
          id: '1',
          name: 'USP',
          acronym: 'USP',
          city: 'São Paulo',
          state: 'SP',
        },
        {
          id: '2',
          name: 'UFRJ',
          acronym: 'UFRJ',
          city: 'Rio de Janeiro',
          state: 'RJ',
        },
      ]);
    });
  });

  // teste do getById()
  describe('getById', () => {
    it('deve retornar college se existir', async () => {
      const mockCollege = {
        _id: mockCollegeId,
        name: 'PUC Minas',
        acronym: 'PUC',
        city: 'Belo Horizonte',
        state: 'MG',
      };

      (College.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockCollege),
      });

      const result = await collegesService.getById(mockCollegeId);

      expect(result).toEqual({
        id: mockCollegeId,
        name: 'PUC Minas',
        acronym: 'PUC',
        city: 'Belo Horizonte',
        state: 'MG',
      });
    });

    it('deve lançar NotFoundError se não existir', async () => {
      (College.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(collegesService.getById('999')).rejects.toThrow(NotFoundError);
    });
  });

  // teste do create()
  describe('create', () => {
    it('deve criar college se não existir', async () => {
      const input = { name: 'UFSC', acronym: 'UFSC', city: 'Florianópolis', state: 'SC' };
      const mockDoc = {
        toObject: jest.fn().mockReturnValue({
          _id: 'abc123',
          ...input,
        }),
      };

      (College.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });
      (College.create as jest.Mock).mockResolvedValueOnce(mockDoc);

      const result = await collegesService.create(input);

      expect(College.create).toHaveBeenCalledWith(input);
      expect(result).toEqual({
        id: 'abc123',
        ...input,
      });
    });

    it('deve lançar ConflictError se já existir', async () => {
      (College.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ _id: '1', name: 'UFSC' }),
      });

      await expect(collegesService.create({ name: 'UFSC' })).rejects.toThrow(ConflictError);
      expect(College.create).not.toHaveBeenCalled();
    });
  });

  // teste do update()
  describe('update', () => {
    it('deve atualizar college existente', async () => {
      const payload = { city: 'Curitiba' };
      const mockCollege = {
        _id: mockCollegeId,
        name: 'UTFPR',
        acronym: 'UTFPR',
        city: 'Curitiba',
        state: 'PR',
      };

      (College.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockCollege),
      });

      const result = await collegesService.update(mockCollegeId, payload);

      expect(result).toEqual({
        id: mockCollegeId,
        name: 'UTFPR',
        acronym: 'UTFPR',
        city: 'Curitiba',
        state: 'PR',
      });
    });

    it('deve lançar NotFoundError se não existir', async () => {
      (College.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(collegesService.update('999', {})).rejects.toThrow(NotFoundError);
    });
  });

  // teste do remove()
  describe('remove', () => {
    it('deve chamar findByIdAndDelete', async () => {
      (College.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

      await collegesService.remove(mockCollegeId);

      expect(College.findByIdAndDelete).toHaveBeenCalledWith(mockCollegeId);
    });
  });
});