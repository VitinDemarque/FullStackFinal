// comando de teste para esse arquivo: npm test -- src/tests/unit/utils/bcrypt.test.ts --verbose

import bcrypt from 'bcrypt';
import { hashPassword, comparePassword } from '@/utils/bcrypt';

jest.mock('bcrypt');

describe('bcrypt utils', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve chamar bcrypt.hash com senha e SALT_ROUNDS e retornar hash', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');

    const result = await hashPassword('senha123');

    expect(bcrypt.hash).toHaveBeenCalledWith('senha123', expect.any(Number));
    expect(result).toBe('hashed123');
  });

  it('deve chamar bcrypt.compare com senha e hash e retornar booleano', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await comparePassword('senha123', 'hashABC');

    expect(bcrypt.compare).toHaveBeenCalledWith('senha123', 'hashABC');
    expect(result).toBe(true);
  });
});