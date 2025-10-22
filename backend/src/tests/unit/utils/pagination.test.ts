// comando de teste para esse arquivo: npm test -- src/tests/unit/utils/pagination.test.ts

import {
  parsePagination,
  toMongoPagination,
  buildPaginatedResult,
  PaginationQuery,
  PaginatedResult,
} from '@/utils/pagination';

describe('pagination utils', () => {
  describe('parsePagination', () => {
    it('deve retornar valores padrão se query vazia', () => {
      expect(parsePagination({})).toEqual({ page: 1, limit: 20 });
    });

    it('deve usar valores da query se válidos', () => {
      expect(parsePagination({ page: 3, limit: 50 })).toEqual({ page: 3, limit: 50 });
    });

    it('deve corrigir valores inválidos ou negativos', () => {
      expect(parsePagination({ page: -1, limit: 'abc' })).toEqual({ page: 1, limit: 20 });
    });

    it('deve limitar limit ao máximo', () => {
      expect(parsePagination({ page: 2, limit: 999 }, {}, 100)).toEqual({ page: 2, limit: 100 });
    });

    it('deve aceitar defaults personalizados', () => {
      expect(parsePagination({}, { page: 5, limit: 30 })).toEqual({ page: 5, limit: 30 });
    });

    it('deve arredondar números decimais para baixo', () => {
      expect(parsePagination({ page: 2.7, limit: 25.9 })).toEqual({ page: 2, limit: 25 });
    });
  });

  describe('toMongoPagination', () => {
    it('deve calcular skip e manter limit', () => {
      const query: PaginationQuery = { page: 3, limit: 20 };
      expect(toMongoPagination(query)).toEqual({ skip: 40, limit: 20 });
    });

    it('deve funcionar com page=1', () => {
      const query: PaginationQuery = { page: 1, limit: 10 };
      expect(toMongoPagination(query)).toEqual({ skip: 0, limit: 10 });
    });
  });

  describe('buildPaginatedResult', () => {
    const items = [1, 2, 3, 4, 5];

    it('deve montar resultado paginado corretamente', () => {
      const result: PaginatedResult<number> = buildPaginatedResult(items, 50, { page: 2, limit: 5 });
      expect(result.items).toEqual(items);
      expect(result.meta).toEqual({
        page: 2,
        limit: 5,
        total: 50,
        totalPages: 10,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('deve garantir pelo menos 1 totalPage', () => {
      const result = buildPaginatedResult(items, 0, { page: 1, limit: 5 });
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNext).toBe(false);
      expect(result.meta.hasPrev).toBe(false);
    });

    it('deve ajustar hasNext e hasPrev corretamente', () => {
      const result1 = buildPaginatedResult(items, 10, { page: 1, limit: 5 });
      expect(result1.meta.hasNext).toBe(true);
      expect(result1.meta.hasPrev).toBe(false);

      const result2 = buildPaginatedResult(items, 10, { page: 2, limit: 5 });
      expect(result2.meta.hasNext).toBe(false);
      expect(result2.meta.hasPrev).toBe(true);
    });
  });
});