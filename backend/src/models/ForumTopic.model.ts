import { Schema, model, models, Types } from 'mongoose'

export type StatusTopico = 'ABERTO' | 'FECHADO' | 'ARQUIVADO'

export interface IForumTopic {
  _id: Types.ObjectId
  forumId: Types.ObjectId
  titulo: string
  conteudo: string
  autorUsuarioId: Types.ObjectId
  palavrasChave?: string[]
  status: StatusTopico
  fixado?: boolean
  numComentarios: number
  criadoEm?: Date
  atualizadoEm?: Date
  ultimaAtividade?: Date
}

const ForumTopicSchema = new Schema<IForumTopic>(
  {
    forumId: { type: Schema.Types.ObjectId, ref: 'Forum', required: true, index: true },
    titulo: { type: String, required: true, trim: true },
    conteudo: { type: String, required: true, trim: true },
    autorUsuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    palavrasChave: [{ type: String, trim: true, index: true }],
    status: { type: String, enum: ['ABERTO', 'FECHADO', 'ARQUIVADO'], default: 'ABERTO' },
    fixado: { type: Boolean, default: false },
    numComentarios: { type: Number, default: 0 },
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date, default: Date.now },
    ultimaAtividade: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

ForumTopicSchema.index({ titulo: 'text', conteudo: 'text', palavrasChave: 'text' })
ForumTopicSchema.index({ forumId: 1, ultimaAtividade: -1 })

export default models.ForumTopic || model<IForumTopic>('ForumTopic', ForumTopicSchema, 'forum_topics')