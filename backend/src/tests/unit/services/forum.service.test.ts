// comando de teste para esse arquivo: npm test -- src/tests/unit/services/forum.service.test.ts --verbose

import * as forumService from '@/services/forum.service';
import Forum, { IForum } from '@/models/Forum.model';
import { NotFoundError, BadRequestError } from '@/utils/httpErrors';
import { Types } from 'mongoose';

// Mocks dos Models
jest.mock('@/models/Forum.model', () => ({
    find: jest.fn(),
    aggregate: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

// Mock do Types.ObjectId
jest.spyOn(Types, 'ObjectId').mockImplementation((id?: any) => {
    return { toString: () => (id ? id.toString() : '000000000000000000000000') } as any;
});

describe('forum.service', () => {
    const usuarioId = 'u123';
    const forumId = 'f123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('listarPublicos', () => {
        it('deve listar fóruns públicos ativos', async () => {
            const mockForuns = [{ _id: forumId, nome: 'Fórum Teste', privacidade: 'PUBLICO', status: 'ATIVO' }];
            (Forum.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockForuns),
            });

            const result = await forumService.listarPublicos({});
            expect(result).toEqual(mockForuns);
        });
    });

    describe('listarAleatoriosPublicos', () => {
        it('deve retornar fóruns aleatórios públicos', async () => {
            const mockForuns = [{ _id: forumId, nome: 'Fórum Aleatório' }];
            (Forum.aggregate as jest.Mock).mockResolvedValue(mockForuns);

            const result = await forumService.listarAleatoriosPublicos(3);
            expect(result).toEqual(mockForuns);
        });
    });

    describe('pesquisar', () => {
        it('deve pesquisar fóruns por termo', async () => {
            const mockForuns = [{ _id: forumId, nome: 'Busca Fórum' }];
            (Forum.find as jest.Mock).mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockForuns),
            });

            const result = await forumService.pesquisar('Busca', {});
            expect(result).toEqual(mockForuns);
        });
    });

    describe('obterPorId', () => {
        it('deve retornar fórum existente', async () => {
            const mockForum = { _id: forumId, nome: 'Fórum Existente' };
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockForum) });

            const result = await forumService.obterPorId(forumId);
            expect(result).toEqual(mockForum);
        });

        it('deve lançar NotFoundError se não encontrado', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

            await expect(forumService.obterPorId('404')).rejects.toThrow(NotFoundError);
        });
    });

    describe('criar', () => {
        it('deve criar fórum com sucesso', async () => {
            const payload = { nome: 'Novo Fórum', assunto: 'Assunto' };
            const mockForum = { ...payload, donoUsuarioId: usuarioId, toObject: jest.fn().mockReturnValue(payload) };
            (Forum.create as jest.Mock).mockResolvedValue(mockForum);

            const result = await forumService.criar(usuarioId, payload);
            expect(Forum.create).toHaveBeenCalled();
            expect(result).toEqual(payload);
        });

        it('deve lançar BadRequestError se faltar nome ou assunto', async () => {
            await expect(forumService.criar(usuarioId, { nome: 'Fórum' })).rejects.toThrow(BadRequestError);
            await expect(forumService.criar(usuarioId, { assunto: 'Assunto' })).rejects.toThrow(BadRequestError);
        });
    });

    describe('atualizar', () => {
        const mockForumBase = {
            _id: forumId,
            donoUsuarioId: usuarioId,
            moderadores: [{ usuarioId, aprovado: true }],
        } as unknown as IForum;

        it('deve atualizar fórum se for dono', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockForumBase) });
            (Forum.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({ ...mockForumBase, nome: 'Atualizado' }),
            });

            const result = await forumService.atualizar(forumId, usuarioId, { nome: 'Atualizado' });
            expect(result.nome).toBe('Atualizado');
        });

        it('deve atualizar fórum se for moderador (mudança pendente)', async () => {
            const moderadorId = 'mod123';
            const mockForumMod = {
                _id: forumId,
                donoUsuarioId: 'outro',
                moderadores: [{ usuarioId: moderadorId, aprovado: true }],
            } as unknown as IForum;

            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockForumMod) });
            (Forum.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({ ...mockForumMod, nome: 'Atualizado Mod' }),
            });

            const result = await forumService.atualizar(forumId, moderadorId, { nome: 'Atualizado Mod' });
            expect(result.nome).toBe('Atualizado Mod');
        });

        it('deve lançar NotFoundError se não existir', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
            await expect(forumService.atualizar(forumId, usuarioId, { nome: 'Teste' })).rejects.toThrow(NotFoundError);
        });

        it('deve lançar erro se não for dono nem moderador', async () => {
            const mockForum = { _id: forumId, donoUsuarioId: 'outro', moderadores: [] } as unknown as IForum;
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockForum) });

            await expect(forumService.atualizar(forumId, usuarioId, { nome: 'Teste' })).rejects.toThrow(BadRequestError);
        });

        it('deve lançar erro se nenhum campo válido for informado', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockForumBase) });
            await expect(forumService.atualizar(forumId, usuarioId, {})).rejects.toThrow(BadRequestError);
        });
    });

    describe('excluir', () => {
        const mockForum = {
            _id: forumId,
            donoUsuarioId: usuarioId,
            moderadores: [],
            votosExclusao: [],
            status: 'ATIVO',
        } as unknown as IForum;

        it('deve excluir imediatamente se todos votaram', async () => {
            const forumVotos = {
                ...mockForum,
                votosExclusao: [{ usuarioId: 'outroUsuario', data: new Date() }] // outro usuário
            };
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(forumVotos) });
            (Forum.findByIdAndDelete as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(forumVotos),
            });

            const result = await forumService.excluir(forumId, usuarioId);
            expect(result.mensagem).toMatch(/excluído com sucesso/);
        });

        it('deve marcar exclusão como pendente', async () => {
            const usuarioModerador = 'mod123';
            const forumPendente = {
                ...mockForum,
                donoUsuarioId: 'outro',
                moderadores: [{ usuarioId: usuarioModerador, aprovado: true }],
                votosExclusao: [],
                status: 'ATIVO',
            };

            // findById retorna o fórum
            (Forum.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(forumPendente),
            });

            // findByIdAndUpdate não precisa retornar nada específico
            (Forum.findByIdAndUpdate as jest.Mock).mockResolvedValue(forumPendente);

            // usuário que vai votar
            const result = await forumService.excluir(forumId, usuarioModerador);

            expect(result.pendente).toBe(true);
            expect(result.mensagem).toMatch(/Exclusão pendente/);
        });

        it('deve lançar erro se usuário já votou', async () => {
            const forumJaVotou = { ...mockForum, votosExclusao: [{ usuarioId }] };
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(forumJaVotou) });
            await expect(forumService.excluir(forumId, usuarioId)).rejects.toThrow(BadRequestError);
        });

        it('deve lançar erro se não for dono nem moderador', async () => {
            const forumOutro = { ...mockForum, donoUsuarioId: 'outro', moderadores: [] };
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(forumOutro) });
            await expect(forumService.excluir(forumId, usuarioId)).rejects.toThrow(BadRequestError);
        });

        it('deve lançar NotFoundError se fórum não existir', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
            await expect(forumService.excluir(forumId, usuarioId)).rejects.toThrow(NotFoundError);
        });
    });
});