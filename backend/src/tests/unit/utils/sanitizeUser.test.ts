// comando de teste para esse arquivo: npm test -- src/tests/unit/utils/sanitizeUser.test.ts --verbose

import { sanitizeUser } from '@/utils/sanitizeUser';
import { IUser } from '@/models/User.model';

describe('sanitizeUser', () => {
  it('deve retornar null se o usuário for undefined', () => {
    expect(sanitizeUser(undefined as unknown as IUser)).toBeNull();
  });

  it('deve retornar null se o usuário for null', () => {
    expect(sanitizeUser(null as unknown as IUser)).toBeNull();
  });

  it('deve mapear todos os campos corretamente quando presentes', () => {
    const user: IUser = {
      _id: '123',
      name: 'Alice',
      email: 'alice@example.com',
      handle: 'alice123',
      role: 'ADMIN',
      collegeId: '456',
      avatarUrl: 'avatar.png',
      bio: 'Bio aqui',
      level: 5,
      xpTotal: 1500,
    } as unknown as IUser;

    const sanitized = sanitizeUser(user)!; // non-null assertion

    expect(sanitized).toEqual({
      id: '123',
      name: 'Alice',
      email: 'alice@example.com',
      handle: 'alice123',
      role: 'ADMIN',
      collegeId: '456',
      avatarUrl: 'avatar.png',
      bio: 'Bio aqui',
      level: 5,
      xpTotal: 1500,
    });
  });

  it('deve usar valores padrão para campos ausentes ou undefined', () => {
    const user: IUser = {
      _id: '789',
      name: 'Bob',
      email: 'bob@example.com',
      handle: 'bob123',
      role: undefined,
      collegeId: undefined,
      avatarUrl: undefined,
      bio: undefined,
      level: undefined,
      xpTotal: undefined,
    } as unknown as IUser;

    const sanitized = sanitizeUser(user)!; // non-null assertion

    expect(sanitized).toEqual({
      id: '789',
      name: 'Bob',
      email: 'bob@example.com',
      handle: 'bob123',
      role: 'USER',
      collegeId: null,
      avatarUrl: null,
      bio: null,
      level: null,
      xpTotal: null,
    });
  });

  it('deve converter collegeId e id para string mesmo se forem numbers', () => {
    const user: IUser = {
      _id: 101,
      name: 'Charlie',
      email: 'charlie@example.com',
      handle: 'charlie101',
      collegeId: 202,
    } as unknown as IUser;

    const sanitized = sanitizeUser(user)!; // non-null assertion

    expect(sanitized.id).toBe('101');
    expect(sanitized.collegeId).toBe('202');
  });
});