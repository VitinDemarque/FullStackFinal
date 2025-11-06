import { Schema, model, models, Types } from 'mongoose'

export type PrivacidadeForum = 'PUBLICO' | 'PRIVADO'
export type StatusForum = 'ATIVO' | 'PENDENTE_EXCLUSAO' | 'EXCLUIDO'

export interface IModerador {
  usuarioId: Types.ObjectId
  desde: Date
  aprovado: boolean
}

export interface IMudanca {
  camposAlterados: string[]
  usuarioAlteracaoId: Types.ObjectId
  usuarioValidacaoId?: Types.ObjectId | null
  data: Date
  tipo: 'EDICAO' | 'PRIVACIDADE' | 'TRANSFERENCIA' | 'EXCLUSAO'
}

export interface IVotoExclusao {
  usuarioId: Types.ObjectId
  data: Date
  decisao?: boolean
}

export interface IMembro {
  usuarioId: Types.ObjectId
  desde: Date
}

export interface IForum {
  _id: Types.ObjectId
  nome: string
  palavrasChave: string[]
  assunto: string
  descricao: string
  statusPrivacidade: PrivacidadeForum
  status: StatusForum
  donoUsuarioId: Types.ObjectId
  moderadores: IModerador[]
  membros?: IMembro[]
  mudancas: IMudanca[]
  votosExclusao?: IVotoExclusao[]
  criadoEm?: Date
  atualizadoEm?: Date
  ultimaAtividade?: Date
  tokenConvite?: string
  tokenConviteExpiraEm?: Date
}

const ModeradorSchema = new Schema<IModerador>(
  {
    usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    desde: { type: Date, default: Date.now },
    aprovado: { type: Boolean, default: true },
  },
  { _id: false }
)

const MudancaSchema = new Schema<IMudanca>(
  {
    camposAlterados: [{ type: String, required: true }],
    usuarioAlteracaoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    usuarioValidacaoId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    data: { type: Date, default: Date.now },
    tipo: {
      type: String,
      enum: ['EDICAO', 'PRIVACIDADE', 'TRANSFERENCIA', 'EXCLUSAO'],
      required: true,
    },
  },
  { _id: false }
)

const VotoExclusaoSchema = new Schema<IVotoExclusao>(
  {
    usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Date, default: Date.now },
    decisao: { type: Boolean, default: true },
  },
  { _id: false }
)

const MembroSchema = new Schema<IMembro>(
  {
    usuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    desde: { type: Date, default: Date.now },
  },
  { _id: false }
)

const ForumSchema = new Schema<IForum>(
  {
    nome: { type: String, required: true, trim: true },
    palavrasChave: [{ type: String, trim: true, index: true }],
    assunto: { type: String, required: true, trim: true },
    descricao: { type: String, default: '', trim: true },
    statusPrivacidade: { type: String, enum: ['PUBLICO', 'PRIVADO'], default: 'PUBLICO' },
    status: {
      type: String,
      enum: ['ATIVO', 'PENDENTE_EXCLUSAO', 'EXCLUIDO'],
      default: 'ATIVO',
    },
    donoUsuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    moderadores: [ModeradorSchema],
    membros: [MembroSchema],
    mudancas: [MudancaSchema],
    votosExclusao: [VotoExclusaoSchema],
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date, default: Date.now },
    ultimaAtividade: { type: Date, default: Date.now },
    tokenConvite: { type: String, required: false },
    tokenConviteExpiraEm: { type: Date, required: false },
  },
  { versionKey: false }
)

ForumSchema.index({ nome: 'text', assunto: 'text', palavrasChave: 'text' })

export default models.Forum || model<IForum>('Forum', ForumSchema, 'forums')