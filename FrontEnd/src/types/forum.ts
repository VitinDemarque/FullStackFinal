export type PrivacidadeForum = 'PUBLICO' | 'PRIVADO'
export type StatusForum = 'ATIVO' | 'PENDENTE_EXCLUSAO' | 'EXCLUIDO'

export interface Moderador {
  usuarioId: string
  desde: string
  aprovado: boolean
}

export interface Membro {
  usuarioId: string;
  desde: string;
}

export interface Mudanca {
  camposAlterados: string[]
  usuarioAlteracaoId?: string
  usuarioValidacaoId?: string | null
  data: string
  tipo: 'EDICAO' | 'PRIVACIDADE' | 'TRANSFERENCIA' | 'EXCLUSAO'
}

export interface VotoExclusao {
  usuarioId: string
  data: string
  decisao?: boolean
}

export interface Forum {
  _id: string
  exerciseId?: string
  exerciseCode?: string
  nome: string
  assunto?: string
  descricao?: string
  palavrasChave?: string[]
  statusPrivacidade?: PrivacidadeForum
  status?: StatusForum
  donoUsuarioId?: string
  criadoPor?: string
  criadoEm?: string
  atualizadoEm?: string
  ultimaAtividade?: string
  moderadores?: Moderador[]
  membros?: Membro[];
  mudancas?: Mudanca[]
  votosExclusao?: VotoExclusao[]
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export type StatusTopico = 'ABERTO' | 'FECHADO' | 'ARQUIVADO'

export interface ForumTopic {
  _id: string
  forumId: string
  titulo: string
  conteudo: string
  autorUsuarioId: string
  palavrasChave?: string[]
  status: StatusTopico
  fixado?: boolean
  numComentarios: number
  criadoEm?: string
  atualizadoEm?: string
  ultimaAtividade?: string
}

export type StatusComentario = 'ATIVO' | 'EDITADO' | 'EXCLUIDO'

export interface ForumComment {
  _id: string
  forumId: string
  topicId: string
  autorUsuarioId: string
  conteudo: string
  status: StatusComentario
  criadoEm?: string
  atualizadoEm?: string
}