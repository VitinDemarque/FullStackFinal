// comando de teste para esse arquivo: npm test -- src/tests/unit/services/exercises.service.test.ts --verbose

// Imports após mocks
import * as exercisesService from '@/services/exercises.service';
import Exercise from '@/models/Exercise.model';
import Language from '@/models/Language.model';
import UserStat from '@/models/UserStat.model';
import { ForbiddenError, NotFoundError } from '@/utils/httpErrors';
import { Types } from 'mongoose';

// Mock dos Models
jest.mock('@/models/Exercise.model', () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));
jest.mock('@/models/Language.model', () => ({
  findById: jest.fn(),
}));
jest.mock('@/models/UserStat.model', () => ({
  updateOne: jest.fn(),
}));

const mockExercise = {
  _id: 'ex1',
  title: 'Exercício Teste',
  authorUserId: 'user123',
  difficulty: 'easy',
  isPublic: true,
  status: 'PUBLISHED',
  createdAt: new Date(),
};

/*

  O que este teste cobre:
  
    Função	           Cenários
      list	               Filtros e paginação
      getById	             Com e sem resultados
      create	             validar a linguagem e atualizar estatisticas
      update	             sucesso, não sucesso, não autorizado e linguagem invalida
      remove	             com diferentes cenarios
      publish, 
      unpublish,           com casos de sucesso e erro
      setVisibility	       

*/

jest.spyOn(Types, 'ObjectId').mockImplementation((id?: any) => id as unknown as any);

describe('exercises.service', () => {
  const userId = 'u123';
  const exId = 'e123';
  const langId = 'l123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Verificando a funcao list
  describe('list', () => {
    it('deve listar exercícios com filtros aplicados', async () => {
      const mockExercises = [
        {
          _id: '1',
          authorUserId: 'u1',
          languageId: 'l1',
          title: 'Hello World',
          description: '',
          difficulty: 1,
          baseXp: 100,
          isPublic: true,
          codeTemplate: '// code',
          status: 'PUBLISHED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (Exercise.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce(mockExercises),
      });
      (Exercise.countDocuments as jest.Mock).mockResolvedValueOnce(1);

      const result = await exercisesService.list({
        q: 'hello',
        languageId: 'l1',
        authorId: 'u1',
        skip: 0,
        limit: 10,
      });

      expect(result.total).toBe(1);
      expect(result.items[0]).toMatchObject({
        id: '1',
        title: 'Hello World',
        status: 'PUBLISHED',
      });
    });
  });

  // Verificando a funcao getById
  describe('exercises.service - getById', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('deve retornar exercício se encontrado', async () => {
      (Exercise.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(mockExercise),
      });

      // Use exercisesService.getById
      const result = await exercisesService.getById('ex1');

      expect(Exercise.findById).toHaveBeenCalledWith('ex1');
      expect(result).toHaveProperty('id', 'ex1');
      expect(result.title).toBe('Exercício Teste');
    });

    it('deve lançar NotFoundError se não encontrado', async () => {
      (Exercise.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(exercisesService.getById('nao-existe')).rejects.toThrow(NotFoundError);
    });
  });

  // Verificando a funcao create
  describe('create', () => {
    it('deve criar exercício e atualizar estatísticas', async () => {
      (Language.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ _id: langId }),
      });

      const mockDoc = {
        _id: exId,
        authorUserId: userId,
        languageId: langId,
        title: 'Test',
        toObject: jest.fn().mockReturnValue({
          _id: exId,
          authorUserId: userId,
          languageId: langId,
          title: 'Test',
        }),
      };

      (Exercise.create as jest.Mock).mockResolvedValueOnce(mockDoc);
      (UserStat.updateOne as jest.Mock).mockResolvedValueOnce({});

      const result = await exercisesService.create(userId, { languageId: langId, title: 'Test' });

      expect(Language.findById).toHaveBeenCalledWith(langId);
      expect(Exercise.create).toHaveBeenCalled();
      expect(UserStat.updateOne).toHaveBeenCalled();
      expect(result.id).toBe(exId);
    });

    it('deve lançar erro se linguagem não existir', async () => {
      (Language.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        exercisesService.create(userId, { languageId: langId })
      ).rejects.toThrow(NotFoundError);
    });
  });

  // Verificando a funcao update
  describe('update', () => {
    it('deve atualizar exercício se for autor', async () => {
      const mockEx: any = {
        _id: exId,
        authorUserId: userId,
        status: 'DRAFT',
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue({ _id: exId, authorUserId: userId, title: 'Updated' }),
      };

      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockEx);

      const result = await exercisesService.update(userId, exId, { title: 'Updated' });

      expect(mockEx.save).toHaveBeenCalled();
      expect(result.title).toBe('Updated');
    });

    it('deve lançar NotFoundError se não existir', async () => {
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(null);

      await expect(exercisesService.update(userId, '404', {})).rejects.toThrow(NotFoundError);
    });

    it('deve lançar ForbiddenError se não for autor', async () => {
      const mockEx: any = { _id: exId, authorUserId: 'outra' };
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockEx);

      await expect(exercisesService.update(userId, exId, {})).rejects.toThrow(ForbiddenError);
    });

    it('deve lançar erro se languageId inválida', async () => {
      const mockEx: any = {
        _id: exId,
        authorUserId: userId,
        save: jest.fn(),
        toObject: jest.fn().mockReturnValue({}),
      };
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockEx);
      (Language.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        exercisesService.update(userId, exId, { languageId: 'xyz' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  // Verificando a funcao remove
  describe('remove', () => {
    it('deve deletar se for autor', async () => {
      const mockEx: any = { authorUserId: userId, deleteOne: jest.fn() };
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockEx);

      await exercisesService.remove(userId, exId);

      expect(mockEx.deleteOne).toHaveBeenCalled();
    });

    it('deve ser idempotente se não encontrado', async () => {
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(null);
      await expect(exercisesService.remove(userId, '404')).resolves.not.toThrow();
    });

    it('deve lançar ForbiddenError se outro autor', async () => {
      const mockEx: any = { authorUserId: 'outra' };
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockEx);

      await expect(exercisesService.remove(userId, exId)).rejects.toThrow(ForbiddenError);
    });
  });

  // Verificando as funcoes  publish, unpublish, setVisibility
  describe('publish / unpublish / setVisibility', () => {
    const mockExBase = (authorId: string): any => ({
      _id: exId,
      authorUserId: authorId,
      status: 'DRAFT',
      isPublic: true,
      save: jest.fn(),
      toObject: jest.fn().mockReturnValue({ _id: exId, authorUserId: authorId }),
    });

    it('publish deve publicar exercício', async () => {
      const mockEx = mockExBase(userId);
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockEx);

      const result = await exercisesService.publish(userId, exId);
      expect(mockEx.status).toBe('PUBLISHED');
      expect(result.id).toBe(exId);
    });

    it('publish deve lançar erro se não for autor', async () => {
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockExBase('outra'));
      await expect(exercisesService.publish(userId, exId)).rejects.toThrow(ForbiddenError);
    });

    it('unpublish deve alterar para DRAFT', async () => {
      const mockEx = mockExBase(userId);
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockEx);
      const result = await exercisesService.unpublish(userId, exId);
      expect(mockEx.status).toBe('DRAFT');
      expect(result.id).toBe(exId);
    });

    it('setVisibility deve mudar visibilidade', async () => {
      const mockEx = mockExBase(userId);
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockEx);
      const result = await exercisesService.setVisibility(userId, exId, false);
      expect(mockEx.isPublic).toBe(false);
      expect(result.id).toBe(exId);
    });

    it('setVisibility deve lançar ForbiddenError se não for autor', async () => {
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(mockExBase('outra'));
      await expect(exercisesService.setVisibility(userId, exId, true)).rejects.toThrow(ForbiddenError);
    });
  });

  describe('cenários adicionais para cobertura total', () => {
    beforeEach(() => jest.clearAllMocks());

    it('list deve retornar lista vazia se nenhum exercício for encontrado', async () => {
      (Exercise.find as jest.Mock).mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValueOnce([]),
      });
      (Exercise.countDocuments as jest.Mock).mockResolvedValueOnce(0);

      const result = await exercisesService.list({});
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('getById deve tratar exercício com campos inesperados', async () => {
      const mockExercise = {
        _id: 'e1',
        title: 'Estranho',
        isPublic: true, // precisa ser true
        status: 'PUBLISHED', // precisa ser publicado
        // campos inesperados ou ausentes
        authorUserId: undefined,
        nonsenseField: 999,
      };

      (Exercise.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValue(mockExercise),
      });

      const result = await exercisesService.getById('e1', 'anyUserId');

      expect(result).toBeDefined();
      expect(result).toHaveProperty('title', 'Estranho');
      expect(result).not.toHaveProperty('nonsenseField');
    });


    it('create deve lançar erro se falhar ao criar exercício', async () => {
      (Language.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ _id: 'lang' }),
      });
      (Exercise.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

      await expect(
        exercisesService.create('user', { languageId: 'lang' })
      ).rejects.toThrow('DB error');
    });

    it('create deve lançar erro se UserStat.updateOne falhar', async () => {
      (Language.findById as jest.Mock).mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce({ _id: 'lang' }),
      });
      const mockDoc = {
        _id: 'e1',
        authorUserId: 'user',
        toObject: jest.fn().mockReturnValue({ _id: 'e1', authorUserId: 'user' }),
      };
      (Exercise.create as jest.Mock).mockResolvedValueOnce(mockDoc);
      (UserStat.updateOne as jest.Mock).mockRejectedValueOnce(new Error('stat fail'));

      await expect(
        exercisesService.create('user', { languageId: 'lang' })
      ).rejects.toThrow('stat fail');
    });

    it('publish deve lançar NotFoundError se exercício não encontrado', async () => {
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(null);
      await expect(exercisesService.publish('user', 'none')).rejects.toThrow(NotFoundError);
    });

    it('unpublish deve lançar NotFoundError se exercício não encontrado', async () => {
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(null);
      await expect(exercisesService.unpublish('user', 'none')).rejects.toThrow(NotFoundError);
    });

    it('setVisibility deve lançar NotFoundError se exercício não encontrado', async () => {
      (Exercise.findById as jest.Mock).mockResolvedValueOnce(null);
      await expect(exercisesService.setVisibility('user', 'none', true)).rejects.toThrow(NotFoundError);
    });
  });
});