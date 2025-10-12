jest.mock('../../../models/Language.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

import * as languageService from '@/services/languages.service';
import Language from '@/models/Language.model';
import { ConflictError, NotFoundError } from '@/utils/httpErrors';

/*

  O que este teste cobre:
  
    Função	                    Cenários	       
      list                        Retorno de items + total
      getById                     Sucesso e NotFound
      create                      Sucesso e conflito
      update                      Sucesso e notFound
      remove                      Execucao simples
      
*/

describe('languages.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testa do list()
  describe('list', () => {
    it('deve listar linguagens com total', async () => {
      const mockItems = [
        { _id: '1', name: 'JavaScript', slug: 'js' },
        { _id: '2', name: 'Python', slug: 'py' },
      ];

      (Language.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(mockItems),
      });
      (Language.countDocuments as jest.Mock).mockResolvedValueOnce(2);

      const result = await languageService.list({ skip: 0, limit: 10 });

      expect(result.total).toBe(2);
      expect(result.items[0].name).toBe('JavaScript');
      expect(Language.find).toHaveBeenCalled();
    });
  });

  // Testa do getById()
  describe('getById', () => {
    it('deve retornar linguagem se existir', async () => {
      const mockDoc = { _id: '1', name: 'C++', slug: 'cpp' };
      (Language.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockDoc),
      });

      const result = await languageService.getById('1');
      expect(result.id).toBe('1');
      expect(result.name).toBe('C++');
    });

    it('deve lançar NotFoundError se não existir', async () => {
      (Language.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(languageService.getById('404')).rejects.toThrow(NotFoundError);
    });
  });

  // Testa do create()
  describe('create', () => {
    it('deve criar nova linguagem se não existir conflito', async () => {
      (Language.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });
      const mockDoc = {
        _id: '1',
        name: 'Go',
        slug: 'go',
        toObject: jest.fn().mockReturnValue({ _id: '1', name: 'Go', slug: 'go' }),
      };
      (Language.create as jest.Mock).mockResolvedValueOnce(mockDoc);

      const result = await languageService.create({ name: 'Go', slug: 'go' });

      expect(Language.create).toHaveBeenCalledWith({ name: 'Go', slug: 'go' });
      expect(result.name).toBe('Go');
    });

    it('deve lançar ConflictError se nome ou slug já existir', async () => {
      (Language.findOne as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ _id: 'x', name: 'Go', slug: 'go' }),
      });

      await expect(languageService.create({ name: 'Go', slug: 'go' })).rejects.toThrow(ConflictError);
    });
  });

  // Testa do update()
  describe('update', () => {
    it('deve atualizar linguagem existente', async () => {
      const mockDoc = { _id: '1', name: 'GoLang', slug: 'go' };
      (Language.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockDoc),
      });

      const result = await languageService.update('1', { name: 'GoLang' });
      expect(result.name).toBe('GoLang');
    });

    it('deve lançar NotFoundError se não encontrar', async () => {
      (Language.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(languageService.update('404', { name: 'Rust' })).rejects.toThrow(NotFoundError);
    });
  });

  // Testa do remove()
  describe('remove', () => {
    it('deve chamar findByIdAndDelete', async () => {
      (Language.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({});
      await languageService.remove('1');
      expect(Language.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});