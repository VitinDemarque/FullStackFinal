// comando de teste para esse arquivo: npm test -- src/tests/unit/services/forumComment.service.test.ts --verbose

import * as forumCommentService from '@/services/forumComment.service'
import ForumComment from '@/models/ForumComment.model'
import ForumTopic from '@/models/ForumTopic.model'
import Forum from '@/models/Forum.model'
import { BadRequestError, NotFoundError } from '@/utils/httpErrors'

jest.mock('@/models/ForumComment.model', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
}))

jest.mock('@/models/ForumTopic.model', () => ({
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
}))

jest.mock('@/models/Forum.model', () => ({
    findById: jest.fn(),
}))

describe('forumComment.service', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    const validObjectId = '507f191e810c19729de860ea'

    const mockForum = {
        _id: validObjectId,
        donoUsuarioId: validObjectId,
        moderadores: [{ usuarioId: '507f1f77bcf86cd799439011' }],
        membros: [{ usuarioId: '507f1f77bcf86cd799439012' }],
        statusPrivacidade: 'PUBLICO',
    }

    const mockTopic = {
        _id: '507f1f77bcf86cd799439013',
        forumId: validObjectId,
        numComentarios: 2,
    }

    const mockComment = {
        _id: '507f1f77bcf86cd799439014',
        topicId: '507f1f77bcf86cd799439013',
        autorUsuarioId: '507f1f77bcf86cd799439012',
        conteudo: 'comentário teste',
    }

    describe('listarPorTopico', () => {
        it('deve retornar lista de comentários', async () => {
            (ForumComment.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([mockComment]),
            })

            const result = await forumCommentService.listarPorTopico('507f191e810c19729de860ea', { page: 1 })
            expect(result).toHaveLength(1)
            expect(result[0].conteudo).toBe('comentário teste')
        })

        it('deve lançar erro se topicId for inválido', async () => {
            await expect(forumCommentService.listarPorTopico('abc', {})).rejects.toThrow(BadRequestError)
        })
    })

    describe('obterPorId', () => {
        it('deve retornar comentário válido', async () => {
            (ForumComment.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockComment) })
            const result = await forumCommentService.obterPorId('507f191e810c19729de860ea')
            expect(result._id).toBe(mockComment._id)
        })

        it('deve lançar erro se não encontrado', async () => {
            (ForumComment.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(null), })
            await expect(forumCommentService.obterPorId('507f191e810c19729de860ea')).rejects.toThrow(NotFoundError)
        })
    })

    describe('criar', () => {
        it('deve criar comentário com sucesso', async () => {
            (ForumTopic.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockTopic), });
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockForum), });
            (ForumComment.create as jest.Mock).mockResolvedValue({ toObject: () => ({ ...mockComment, conteudo: 'novo comentário' }), });
            (ForumTopic.findByIdAndUpdate as jest.Mock).mockResolvedValue({})

            const result = await forumCommentService.criar(mockTopic._id, mockComment.autorUsuarioId, { conteudo: 'Comentário novo' })
            expect(result.conteudo).toBe('novo comentário')
        })

        it('deve lançar erro se conteúdo faltar', async () => {
            await expect(forumCommentService.criar('t1', 'u3', { conteudo: '' })).rejects.toThrow(BadRequestError)
        })

        it('deve lançar erro se tópico não for encontrado', async () => {
            (ForumTopic.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(null), })
            await expect(forumCommentService.criar('t1', 'u3', { conteudo: 'ok' })).rejects.toThrow(NotFoundError)
        })

        it('deve lançar erro se fórum for privado e usuário não participante', async () => {
            const forumPrivado = { ...mockForum, statusPrivacidade: 'PRIVADO', membros: [] };
            (ForumTopic.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockTopic), });
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(forumPrivado), })

            await expect(forumCommentService.criar('t1', 'u9', { conteudo: 'comentário' })).rejects.toThrow(BadRequestError)
        })
    })

    describe('atualizar', () => {
        it('deve atualizar comentário se for autor', async () => {
            (ForumComment.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockComment), });
            (ForumTopic.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockTopic), });
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockForum), });
            (ForumComment.findByIdAndUpdate as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue({ ...mockComment, conteudo: 'editado' }), })

            const result = await forumCommentService.atualizar(mockComment._id, mockComment.autorUsuarioId, { conteudo: 'editado' })
            expect(result.conteudo).toBe('editado')
        })

        it('deve lançar erro se não tiver permissão', async () => {
            (ForumComment.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockComment) });
            (ForumTopic.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockTopic), });
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockForum), })

            await expect(forumCommentService.atualizar('c1', 'u9', { conteudo: 'edit' })).rejects.toThrow(BadRequestError)
        })
    })

    describe('excluir', () => {
        it('deve excluir comentário se for autor', async () => {
            (ForumComment.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockComment), });
            (ForumTopic.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockTopic), });
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockForum), });
            (ForumComment.findByIdAndDelete as jest.Mock).mockResolvedValue({});
            (ForumTopic.findByIdAndUpdate as jest.Mock).mockResolvedValue({})

            const result = await forumCommentService.excluir(mockComment._id, mockComment.autorUsuarioId)
            expect(result.mensagem).toMatch(/excluído com sucesso/i)
        })

        it('deve lançar erro se comentário não encontrado', async () => {
            (ForumComment.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(null), })
            await expect(forumCommentService.excluir('c1', 'u3')).rejects.toThrow(NotFoundError)
        })
    })
})