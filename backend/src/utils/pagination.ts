export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Lê query params e normaliza paginação.
 * Aceita page/limit, com valores padrão e limites máximos.
 */
export function parsePagination(
  query: Record<string, unknown>,
  defaults: Partial<PaginationQuery> = { page: 1, limit: 20 },
  maxLimit = 100
): PaginationQuery {
  const rawPage = Number(query.page ?? defaults.page ?? 1);
  const rawLimit = Number(query.limit ?? defaults.limit ?? 20);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  let limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : 20;
  if (limit > maxLimit) limit = maxLimit;

  return { page, limit };
}

/** Converte page/limit em skip/limit para consultas Mongo. */
export function toMongoPagination({ page, limit }: PaginationQuery): { skip: number; limit: number } {
  const skip = (page - 1) * limit;
  return { skip, limit };
}

/** Monta a resposta paginada padronizada. */
export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  { page, limit }: PaginationQuery
): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
