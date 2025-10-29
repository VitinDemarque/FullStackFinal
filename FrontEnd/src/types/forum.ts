export type StatusPrivacidade = 'PUBLICO' | 'PRIVADO';

export interface Forum {
  _id: string
  titulo: string
  descricao: string
  autorId: string
  categoria?: string
  tags?: string[]
  criadoEm: string
  atualizadoEm: string
  visibilidade: 'PUBLICO' | 'PRIVADO'
  curtidas?: number
  respostas?: number
  votosExclusao?: string[]
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}