// comando de teste para esse arquivo: npm test -- src/tests/unit/services/forum.service.test.ts --verbose

import * as forumService from '@/services/forum.service';
import Forum, { IForum } from '@/models/forum.model';
import ForumTopic from '@/models/ForumTopic.model'
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

jest.mock('@/models/ForumTopic.model', () => ({
    find: jest.fn(),
}))

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
        it('deve pesquisar fóruns com correspondência em nome, assunto, descrição ou palavras-chave', async () => {
            const mockForuns = [
                { _id: 'f1', nome: 'Busca Fórum', assunto: 'Assunto', status: 'ATIVO' },
                { _id: 'f2', nome: 'Outro Fórum', assunto: 'Teste', status: 'ATIVO' },
            ];
            (Forum.find as jest.Mock).mockReturnValueOnce({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockForuns),
            });

            // Nenhum tópico encontrado
            (ForumTopic.find as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([]),
            });

            const result = await forumService.pesquisar('Busca', {})
            expect(result.length).toBe(2)
            expect(result[0]).toHaveProperty('match', 'forum')
        })

        it('deve combinar resultados de fóruns e tópicos relacionados', async () => {
            const mockForuns = [
                { _id: 'f1', nome: 'Fórum com Tópico', assunto: 'Tech', status: 'ATIVO' },
            ];
            const mockTopicos = [
                { forumId: 'f2', titulo: 'Tópico relacionado' },
                { forumId: 'f1', titulo: 'Outro tópico' },
            ];
            const mockForumsComTopicos = [
                { _id: 'f1', nome: 'Fórum com Tópico', status: 'ATIVO' },
                { _id: 'f2', nome: 'Fórum via Tópico', status: 'ATIVO' },
            ];

            // Buscar fóruns que batem com o termo
            (Forum.find as jest.Mock).mockReturnValueOnce({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockForuns),
            });

            // Buscar tópicos pelo título
            (ForumTopic.find as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockTopicos),
            });

            // Buscar fóruns encontrados via tópicos
            (Forum.find as jest.Mock).mockReturnValueOnce({
                lean: jest.fn().mockResolvedValue(mockForumsComTopicos),
            })

            const result = await forumService.pesquisar('Tech', {})

            expect(result).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ _id: 'f1', match: 'ambos' }),
                    expect.objectContaining({ _id: 'f2', match: 'topico' }),
                ])
            )
        })

        it('deve retornar lista vazia se termo for vazio', async () => {
            const result = await forumService.pesquisar('   ', {})
            expect(result).toEqual([])
        })
    })

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
    describe('listarMeus', () => {
        it('deve listar fóruns do usuário', async () => {
            const mockForuns = [{ _id: '1', nome: 'Meu Fórum' }];
            (Forum.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockForuns),
            });

            const result = await forumService.listarMeus('u123');
            expect(result).toEqual(mockForuns);
        });
    });

    describe('listarParticipantes', () => {
        it('deve listar participantes de um fórum', async () => {
            const mockModeradores = [{ usuarioId: 'u1', aprovado: true }];
            const mockMembros = [{ usuarioId: 'u2', aprovado: false }];
            const mockParticipantes = [...mockModeradores, ...mockMembros];

            (Forum.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    donoUsuarioId: 'u0',
                    moderadores: mockModeradores,
                    membros: mockMembros,
                }),
            });

            const result: any = await forumService.listarParticipantes('f1');

            // usamos any para evitar conflito entre tipos de membros e moderadores
            expect([...result.moderadores, ...result.membros]).toEqual(mockParticipantes);
        });
    });

    describe('sair', () => {
        it('deve permitir que o usuário saia do fórum', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    donoUsuarioId: 'u0',
                    membros: [{ usuarioId: 'u123' }],
                    moderadores: [],
                }),
            });

            (Forum.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    membros: [],
                    moderadores: [],
                    atualizadoEm: new Date(),
                }),
            });

            const result: any = await forumService.sair('f1', 'u123');
            expect(result?._id).toBe('f1');
        });
    });

    describe('participar', () => {
        it('deve permitir que usuário participe de fórum público', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    privacidade: 'PUBLICO',
                    membros: [],
                }),
            });

            (Forum.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    membros: [{ usuarioId: 'u1', aprovado: true }],
                }),
            });

            const result: any = await forumService.participar('f1', 'u1');
            expect(result?.membros?.some((m: any) => m.usuarioId === 'u1')).toBe(true);
        });
    });

    describe('transferirDono', () => {
        it('deve transferir propriedade do fórum', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    donoUsuarioId: 'u1',
                    moderadores: [{ usuarioId: 'u2', aprovado: true }],
                }),
            });

            (Forum.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    donoUsuarioId: 'u2',
                }),
            });

            const result: any = await forumService.transferirDono('f1', 'u1', 'u2');
            expect(result?.donoUsuarioId).toBe('u2');
        });
    });

    describe('adicionarModerador', () => {
        it('deve adicionar um moderador ao fórum', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    donoUsuarioId: 'u1',
                    membros: [{ usuarioId: 'u2', aprovado: true }],
                    moderadores: [],
                }),
            });

            (Forum.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    moderadores: [{ usuarioId: 'u2', aprovado: true }],
                }),
            });

            const result: any = await forumService.adicionarModerador('f1', 'u1', 'u2');
            expect(result?.moderadores?.some((m: any) => m.usuarioId === 'u2')).toBe(true);
        });
    });

    describe('removerModerador', () => {
        it('deve remover moderador do fórum', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    donoUsuarioId: 'u1',
                    moderadores: [{ usuarioId: 'u2' }],
                }),
            });

            (Forum.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    moderadores: [],
                }),
            });

            const result: any = await forumService.removerModerador('f1', 'u1', 'u2');
            expect(result?.moderadores?.length).toBe(0);
        });
    });

    describe('gerarLinkCompartilhamento', () => {
        it('deve gerar link de compartilhamento', async () => {
            (Forum.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    _id: 'f1',
                    donoUsuarioId: 'u1',
                    moderadores: [],
                }),
            });

            (Forum.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    link: 'https://forum.com/convite/token123',
                    expiraEm: new Date(),
                }),
            });

            const result: any = await forumService.gerarLinkCompartilhamento('f1', 'u1');
            expect(result?.link).toMatch(/\/forum\/entrar\?token=\w+/);
        });
    });

    describe('entrarPorToken', () => {
        it('deve permitir que o usuário entre via token válido', async () => {
            const mockForum = {
                _id: 'f1',
                privacidade: 'PRIVADO',
                tokensConvite: [{ token: 'token123', criadoEm: new Date() }],
                membros: [],
            };

            (Forum.findById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockForum),
            });

            (Forum.findByIdAndUpdate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    ...mockForum,
                    membros: [{ usuarioId: 'u1', aprovado: true }],
                }),
            });

            const result: any = await forumService.entrarPorToken('f1', 'u1', 'token123');
            expect(result?.membros?.some((m: any) => m.usuarioId === 'u1')).toBe(true);
        });
    });
});