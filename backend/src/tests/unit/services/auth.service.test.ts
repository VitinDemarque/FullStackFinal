import { signup } from '@/services/auth.service';
import User from '@/models/User.model';
import College from '@/models/College.model';
import { hashPassword } from '@/utils/bcrypt';
import { signToken } from '@/utils/jwt';
import { ConflictError, NotFoundError } from '@/utils/httpErrors';

// Mock das dependências
jest.mock('@/models/User.model');
jest.mock('@/models/College.model');
jest.mock('@/utils/bcrypt');
jest.mock('@/utils/jwt');

describe('auth.service - signup', () => {
  const mockUserData = {
    name: 'João',
    email: 'joao@email.com',
    password: '123456',
    handle: 'joaoteste',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um novo usuário com sucesso', async () => {
    // 1. Nenhum usuário existente
    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // email
      .mockResolvedValueOnce(null); // handle

    // 2. College válido
    (College.findById as jest.Mock).mockResolvedValueOnce({ _id: '123', name: 'USP' });

    // 3. Hash e criação do user
    (hashPassword as jest.Mock).mockResolvedValueOnce('hashedPassword');
    (User.create as jest.Mock).mockResolvedValueOnce({
      _id: 'user123',
      email: mockUserData.email,
      handle: mockUserData.handle,
      role: 'USER',
      collegeId: '123',
    });

    // 4. JWTs
    (signToken as jest.Mock)
      .mockReturnValueOnce('accessToken')
      .mockReturnValueOnce('refreshToken');

    const result = await signup({ ...mockUserData, collegeId: '123' });

    expect(User.findOne).toHaveBeenCalledTimes(2);
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
    (User.findOne as jest.Mock).mockResolvedValueOnce({ id: '1' });

    await expect(signup(mockUserData)).rejects.toThrow(ConflictError);
  });

  it('deve lançar erro se o handle já estiver em uso', async () => {
    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: '1' });

    await expect(signup(mockUserData)).rejects.toThrow(ConflictError);
  });

  it('deve lançar erro se a collegeId for inválida', async () => {
    (User.findOne as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    (College.findById as jest.Mock).mockResolvedValueOnce(null);

    await expect(signup({ ...mockUserData, collegeId: '999' }))
      .rejects.toThrow(NotFoundError);
  });
});
