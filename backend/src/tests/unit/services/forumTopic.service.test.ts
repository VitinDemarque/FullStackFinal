// comando de teste para esse arquivo: npm test -- src/tests/unit/services/forumTopic.service.test.ts --verbose

import { Types } from 'mongoose'
import * as forumTopicService from '../../../services/forumTopic.service'
import ForumTopic from '../../../models/ForumTopic.model'
import Forum from '../../../models/Forum.model'
import ForumComment from '../../../models/ForumComment.model'
import { BadRequestError, NotFoundError } from '../../../utils/httpErrors'

jest.mock('../../../models/ForumTopic.model')
jest.mock('../../../models/Forum.model')
jest.mock('../../../models/ForumComment.model')
jest.mock('../../../utils/pagination', () => ({
  parsePagination: jest.fn(() => ({ page: 1, limit: 10 })),
  toMongoPagination: jest.fn(() => ({ skip: 0, limit: 10 })),
}))

describe('forumTopic.service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockForum = {
    _id: new Types.ObjectId('507f191e810c19729de860aa'),
    donoUsuarioId: '507f191e810c19729de860a1',
    moderadores: [{ usuarioId: '507f191e810c19729de860a2' }],
    membros: [{ usuarioId: '507f191e810c19729de860a3' }],
    statusPrivacidade: 'PUBLICO',
  }

  const mockTopico = {
    _id: new Types.ObjectId('507f191e810c19729de860bb'),
    forumId: new Types.ObjectId('507f191e810c19729de860aa'),
    autorUsuarioId: new Types.ObjectId('507f191e810c19729de860a1'),
    titulo: 'Título',
    conteudo: 'Conteúdo',
    palavrasChave: ['tag1'],
  }

  describe('listarPorForum', () => {
    it('deve listar tópicos por fórum', async () => {
      (ForumTopic.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([mockTopico]),
      })
      const result = await forumTopicService.listarPorForum('507f191e810c19729de860aa', {});
      expect(result).toHaveLength(1);
      expect(result[0].titulo).toBe('Título');
    })

    it('deve lançar erro se forumId for inválido', async () => {
      await expect(forumTopicService.listarPorForum('abc', {})).rejects.toThrow(BadRequestError);
    })
  })

  describe('obterPorId', () => {
    it('deve retornar tópico válido', async () => {
      (ForumTopic.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTopico),
      })
      const result = await forumTopicService.obterPorId('507f191e810c19729de860bb');
      expect(result._id).toEqual(mockTopico._id);
    })

    it('deve lançar erro se id for inválido', async () => {
      await expect(forumTopicService.obterPorId('xyz')).rejects.toThrow(BadRequestError);
    })

    it('deve lançar erro se não encontrado', async () => {
      (ForumTopic.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      })
      await expect(forumTopicService.obterPorId('507f191e810c19729de860bb')).rejects.toThrow(NotFoundError);
    })
  })

  describe('contarPorForum', () => {
    it('deve retornar total de tópicos', async () => {
      (ForumTopic.countDocuments as jest.Mock).mockResolvedValue(5);
      const result = await forumTopicService.contarPorForum('507f191e810c19729de860aa');
      expect(result.total).toBe(5);
    })

    it('deve lançar erro se forumId for inválido', async () => {
      await expect(forumTopicService.contarPorForum('inv')).rejects.toThrow(BadRequestError);
    })
  })

  describe('criar', () => {
    it('deve criar tópico com sucesso', async () => {
      (Forum.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockForum),
      });
      (ForumTopic.create as jest.Mock).mockResolvedValue({
        toObject: () => mockTopico,
      });
      const result = await forumTopicService.criar('507f191e810c19729de860aa', '507f191e810c19729de860a1', {
        titulo: 'Novo',
        conteudo: 'Texto',
        palavrasChave: ['x'],
      });
      expect(result.titulo).toBe('Título');
    })

    it('deve lançar erro se faltar título ou conteúdo', async () => {
      await expect(
        forumTopicService.criar('507f191e810c19729de860aa', '507f191e810c19729de860a1', {
          titulo: '',
          conteudo: '',
        }),
      ).rejects.toThrow(BadRequestError);
    });

    it('deve lançar erro se fórum não encontrado', async () => {
      (Forum.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      await expect(
        forumTopicService.criar('507f191e810c19729de860aa', '507f191e810c19729de860a1', {
          titulo: 'T',
          conteudo: 'C',
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it('deve lançar erro se fórum for privado e usuário não participante', async () => {
      const forumPrivado = { ...mockForum, statusPrivacidade: 'PRIVADO', membros: [], moderadores: [] };
      (Forum.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(forumPrivado),
      });
      await expect(
        forumTopicService.criar('507f191e810c19729de860aa', '507f191e810c19729de860a9', {
          titulo: 'T',
          conteudo: 'C',
        }),
      ).rejects.toThrow(BadRequestError);
    })
  })

  describe('atualizar', () => {
    it('deve atualizar tópico se for autor', async () => {
      (ForumTopic.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTopico),
      });
      (Forum.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockForum),
      });
      (ForumTopic.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({ ...mockTopico, titulo: 'Editado' }),
      });

      const result = await forumTopicService.atualizar('507f191e810c19729de860bb', '507f191e810c19729de860a1', {
        titulo: 'Editado',
      });
      expect(result.titulo).toBe('Editado');
    })

    it('deve lançar erro se não for autor, dono ou moderador', async () => {
      (ForumTopic.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTopico),
      });
      (Forum.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockForum),
      });
      await expect(
        forumTopicService.atualizar('507f191e810c19729de860bb', '507f191e810c19729de860a9', { titulo: 'Edição' }),
      ).rejects.toThrow(BadRequestError);
    })

    it('deve lançar erro se nenhum campo válido informado', async () => {
      (ForumTopic.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTopico),
      });
      (Forum.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockForum),
      });
      await expect(
        forumTopicService.atualizar('507f191e810c19729de860bb', '507f191e810c19729de860a1', {}),
      ).rejects.toThrow(BadRequestError);
    })
  })

  describe('excluir', () => {
    it('deve excluir tópico com sucesso', async () => {
      (ForumTopic.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTopico),
      });
      (Forum.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockForum),
      });
      (ForumTopic.findByIdAndDelete as jest.Mock).mockResolvedValue({});
      (ForumComment.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      const result = await forumTopicService.excluir('507f191e810c19729de860bb', '507f191e810c19729de860a1')
      expect(result.mensagem).toMatch(/sucesso/i);
    })

    it('deve lançar erro se não for autor, dono ou moderador', async () => {
      (ForumTopic.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockTopico),
      });
      (Forum.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockForum),
      });
      await expect(
        forumTopicService.excluir('507f191e810c19729de860bb', '507f191e810c19729de860a9'),
      ).rejects.toThrow(BadRequestError);
    })

    it('deve lançar erro se tópico não encontrado', async () => {
      (ForumTopic.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });
      await expect(
        forumTopicService.excluir('507f191e810c19729de860bb', '507f191e810c19729de860a1'),
      ).rejects.toThrow(NotFoundError);
    })
  })
})