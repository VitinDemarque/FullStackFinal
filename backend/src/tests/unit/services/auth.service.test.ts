// comando de teste para esse arquivo: npm test -- src/tests/unit/services/auth.service.test.ts --verbose

import { signup, login, refreshToken } from '@/services/auth.service';
import User from '@/models/User.model';
import College from '@/models/College.model';
import { hashPassword, comparePassword } from '@/utils/bcrypt';
import { signToken, verifyToken } from '@/utils/jwt';
import { ConflictError, NotFoundError, UnauthorizedError } from '@/utils/httpErrors';

// Mock das dependências
jest.mock('@/models/User.model');
jest.mock('@/models/College.model');
jest.mock('@/utils/bcrypt');
jest.mock('@/utils/jwt');

// helper para simular .lean()
const mockLean = (returnValue: any) => ({
  lean: jest.fn().mockResolvedValue(returnValue)
});

describe('auth.service', () => {
  const mockUserData = {
    _id: '9999',
    name: 'João',
    email: 'joao@email.com',
    password: '123456',
    handle: 'joaoteste',
    passwordHash: 'hashedPassword',
    role: 'USER',
    collegeId: '507f1f77bcf86cd799439011',
    avatarUrl: null,
    bio: null,
    level: 1,
    xpTotal: 0
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Teste do SIGNUP
  describe('signup', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      (User.findOne as jest.Mock)
        .mockReturnValueOnce(mockLean(null)) // email
        .mockReturnValueOnce(mockLean(null)); // handle
      (College.findById as jest.Mock).mockReturnValueOnce(mockLean({ _id: '123', name: 'USP' }));
      (hashPassword as jest.Mock).mockResolvedValueOnce('hashedPassword');
      (User.create as jest.Mock).mockResolvedValueOnce({
        _id: 'user123',
        email: mockUserData.email,
        handle: mockUserData.handle,
        role: 'USER',
        collegeId: '123',
      });
      (signToken as jest.Mock)
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      const result = await signup({ ...mockUserData, collegeId: '507f1f77bcf86cd799439011' });

      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        email: mockUserData.email,
        handle: mockUserData.handle,
        passwordHash: 'hashedPassword'
      }));
      expect(result).toEqual({
        user: expect.objectContaining({
          email: mockUserData.email,
          handle: mockUserData.handle,
        }),
        tokens: {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      });
    });

    it('deve lançar erro se o email já estiver em uso', async () => {
      (User.findOne as jest.Mock).mockReturnValueOnce(mockLean({ id: '1' }));
      await expect(signup(mockUserData)).rejects.toThrow(ConflictError);
    });

    it('deve lançar erro se o handle já estiver em uso', async () => {
      (User.findOne as jest.Mock)
        .mockReturnValueOnce(mockLean(null))
        .mockReturnValueOnce(mockLean({ id: '1' }));
      await expect(signup(mockUserData)).rejects.toThrow(ConflictError);
    });

    it('deve lançar erro se a collegeId for inválida', async () => {
      (User.findOne as jest.Mock)
        .mockReturnValueOnce(mockLean(null))
        .mockReturnValueOnce(mockLean(null));
      (College.findById as jest.Mock).mockReturnValueOnce(mockLean(null));
      await expect(signup({ ...mockUserData, collegeId: '507f1f77bcf86cd799439099' }))
        .rejects.toThrow(NotFoundError);
    });
  });


  // Mock dos dados para o teste de login
  describe('login', () => {
    const mockUser = {
      _id: 'user123',
      email: mockUserData.email,
      handle: mockUserData.handle,
      passwordHash: 'hashedPassword',
      role: 'USER',
      name: mockUserData.name,
      avatarUrl: null,
      bio: null,
      level: 1,
      xpTotal: 0,
      collegeId: '507f1f77bcf86cd799439011',
    };

    it('deve autenticar com sucesso', async () => {
      // Mocka o retorno do banco (usuário encontrado)
      (User.findOne as jest.Mock).mockReturnValueOnce(mockLean(mockUser));

      // Mocka comparação de senha como verdadeira
      (comparePassword as jest.Mock).mockResolvedValueOnce(true);

      // Mocka geração de tokens
      (signToken as jest.Mock)
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');

      // Executa o login
      const result = await login({ email: mockUserData.email, password: '123456' });

      // Valida resultado
      expect(result).toEqual({
        user: expect.objectContaining({
          email: mockUserData.email,
          handle: mockUserData.handle,
          name: mockUserData.name,
          role: 'USER',
          collegeId: '507f1f77bcf86cd799439011',
        }),
        tokens: {
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        },
      });
    });

    it('deve lançar UnauthorizedError se usuário não existir', async () => {
      (User.findOne as jest.Mock).mockReturnValueOnce(mockLean(null));

      await expect(login({ email: mockUserData.email, password: '123456' }))
        .rejects.toThrow(UnauthorizedError);
    });

    it('deve lançar UnauthorizedError se senha for inválida', async () => {
      (User.findOne as jest.Mock).mockReturnValueOnce(mockLean(mockUser));
      (comparePassword as jest.Mock).mockResolvedValueOnce(false);

      await expect(login({ email: mockUserData.email, password: 'errada' }))
        .rejects.toThrow(UnauthorizedError);
    });
  });

  // Teste REFRESH TOKEN
  describe.skip('refresh', () => {
    it('deve gerar novos tokens com sucesso', async () => {
      (verifyToken as jest.Mock).mockReturnValueOnce({ userId: 'user123' });
      (signToken as jest.Mock)
        .mockReturnValueOnce('novoAccess')
        .mockReturnValueOnce('novoRefresh');
      (User.findById as jest.Mock).mockReturnValueOnce(mockLean({
        _id: 'user123',
        email: 'a@a.com',
        handle: 'a',
      }));

      const result = await refreshToken('tokenAntigo');
      expect(result.tokens.accessToken).toBe('novoAccess');
      expect(result.tokens.refreshToken).toBe('novoRefresh');
    });

    it('deve lançar UnauthorizedError se o token for inválido', async () => {
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('invalid');
      });
      await expect(refreshToken('tokenInvalido')).rejects.toThrow(UnauthorizedError);
    });
  });

  // Teste VERIFY TOKEN
  // Estamos pulando este teste pois ainda nao implementamos o refresh
  describe.skip('verifyToken', () => {
    it('deve retornar dados decodificados quando o token for válido', async () => {
      (verifyToken as jest.Mock).mockReturnValueOnce({ userId: '123' });
      const result = await verifyToken('tokenValido');
      expect(result).toEqual({ userId: '123' });
    });

    it('deve lançar UnauthorizedError se o token for inválido', async () => {
      (verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('invalid');
      });
      await expect(verifyToken('tokenRuim')).rejects.toThrow(UnauthorizedError);
    });
  });
});