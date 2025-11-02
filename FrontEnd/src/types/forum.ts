export type PrivacidadeForum = 'PUBLICO' | 'PRIVADO';
export type StatusForum = 'ATIVO' | 'PENDENTE_EXCLUSAO' | 'EXCLUIDO';

export interface Moderador {
  usuarioId: string;
  desde: string;
  aprovado: boolean;
}

export interface Mudanca {
  camposAlterados: string[];
  usuarioAlteracaoId?: string;
  usuarioValidacaoId?: string | null;
  data: string;
  tipo: 'EDICAO' | 'PRIVACIDADE' | 'TRANSFERENCIA' | 'EXCLUSAO';
}

export interface VotoExclusao {
  usuarioId: string;
  data: string;
  decisao?: boolean;
}

export interface Forum {
  _id: string;
  nome: string;
  palavrasChave?: string[];
  assunto?: string;
  descricao?: string;
  statusPrivacidade?: PrivacidadeForum;
  status?: StatusForum;
  donoUsuarioId?: string;
  criadoPor?: string;
  moderadores?: Moderador[];
  mudancas?: Mudanca[];
  votosExclusao?: VotoExclusao[];
  criadoEm?: string;
  atualizadoEm?: string;
  ultimaAtividade?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}