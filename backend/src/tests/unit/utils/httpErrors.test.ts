// comando de teste para esse arquivo: npm test -- src/tests/unit/utils/httpErrors.test.ts

import {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    UnprocessableEntityError
} from '@/utils/httpErrors';

describe('httpErrors utils', () => {
    it('AppError deve armazenar message, statusCode e details corretamente', () => {
        const err = new AppError('Algo deu errado', 500, { info: 'extra' });
        expect(err.message).toBe('Algo deu errado');
        expect(err.statusCode).toBe(500);
        expect(err.details).toEqual({ info: 'extra' });
    });

    it('BadRequestError deve ter status 400 e mensagem padrão', () => {
        const err = new BadRequestError();
        expect(err).toBeInstanceOf(AppError);
        expect(err.message).toBe('Bad Request');
        expect(err.statusCode).toBe(400);
    });

    it('UnauthorizedError deve ter status 401 e mensagem padrão', () => {
        const err = new UnauthorizedError();
        expect(err.message).toBe('Unauthorized');
        expect(err.statusCode).toBe(401);
    });

    it('ForbiddenError deve ter status 403 e mensagem padrão', () => {
        const err = new ForbiddenError();
        expect(err.message).toBe('Forbidden');
        expect(err.statusCode).toBe(403);
    });

    it('NotFoundError deve ter status 404 e mensagem padrão', () => {
        const err = new NotFoundError();
        expect(err.message).toBe('Not Found');
        expect(err.statusCode).toBe(404);
    });

    it('ConflictError deve ter status 409 e mensagem padrão', () => {
        const err = new ConflictError();
        expect(err.message).toBe('Conflict');
        expect(err.statusCode).toBe(409);
    });

    it('UnprocessableEntityError deve ter status 422 e mensagem padrão', () => {
        const err = new UnprocessableEntityError();
        expect(err.message).toBe('Unprocessable Entity');
        expect(err.statusCode).toBe(422);
    });

    it('todas as classes devem aceitar mensagens e detalhes personalizados', () => {
        const customErr = new BadRequestError('Erro customizado', { code: 123 });
        expect(customErr.message).toBe('Erro customizado');
        expect(customErr.details).toEqual({ code: 123 });
    });
});