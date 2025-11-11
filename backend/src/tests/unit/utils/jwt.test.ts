// comando de teste para esse arquivo: npm test -- src/tests/unit/utils/jwt.test.ts --verbose

import jwt from 'jsonwebtoken';
import { signToken, verifyToken, getBearerToken, UserTokenPayload, VerifyResult } from '@/utils/jwt';

jest.mock('jsonwebtoken');

describe('jwt utils', () => {
  const mockPayload: UserTokenPayload = {
    user_id: '123',
    email: 'teste@teste.com',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('signToken', () => {
    it('deve chamar jwt.sign com payload, segredo e opções', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token123');
      const token = signToken(mockPayload);
      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        expect.any(String),
        expect.objectContaining({ expiresIn: expect.any(String) })
      );
      expect(token).toBe('token123');
    });

    it('deve sobrescrever expiresIn se fornecido', () => {
      (jwt.sign as jest.Mock).mockReturnValue('token456');
      const token = signToken(mockPayload, { expiresIn: '2h' });
      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        expect.any(String),
        expect.objectContaining({ expiresIn: '2h' })
      );
      expect(token).toBe('token456');
    });
  });

  describe('verifyToken', () => {
    it('deve retornar objeto válido se jwt.verify passar', () => {
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
      const result: VerifyResult = verifyToken('tokenValido');
      expect(jwt.verify).toHaveBeenCalledWith('tokenValido', expect.any(String));
      expect(result).toEqual({ valid: true, expired: false, decoded: mockPayload });
    });

    it('deve retornar válido=false se jwt.verify lançar erro', () => {
      const error = new Error('invalid token');
      (jwt.verify as jest.Mock).mockImplementation(() => { throw error; });
      const result = verifyToken('tokenInvalido');
      expect(result.valid).toBe(false);
      expect(result.expired).toBe(false);
      expect(result.error).toBe(error);
    });

    it('deve setar expired=true se TokenExpiredError', () => {
      const error: any = new Error('jwt expired');
      error.name = 'TokenExpiredError';
      (jwt.verify as jest.Mock).mockImplementation(() => { throw error; });
      const result = verifyToken('tokenExpirado');
      expect(result.valid).toBe(false);
      expect(result.expired).toBe(true);
      expect(result.error).toBe(error);
    });
  });

  describe('getBearerToken', () => {
    it('deve retornar token válido do header Bearer', () => {
      const token = getBearerToken('Bearer token123');
      expect(token).toBe('token123');
    });

    it('deve retornar token do array', () => {
      const token = getBearerToken(['Bearer tokenABC']);
      expect(token).toBe('tokenABC');
    });

    it('deve retornar null se não houver header', () => {
      expect(getBearerToken(undefined)).toBeNull();
    });

    it('deve retornar null se esquema não for Bearer', () => {
      expect(getBearerToken('Basic token')).toBeNull();
    });

    it('deve retornar null se token estiver ausente', () => {
      expect(getBearerToken('Bearer')).toBeNull();
    });
  });
});