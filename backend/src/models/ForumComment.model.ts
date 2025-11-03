import { Schema, model, models, Types } from 'mongoose'

export type StatusComentario = 'ATIVO' | 'EDITADO' | 'EXCLUIDO'

export interface IForumComment {
  _id: Types.ObjectId
  forumId: Types.ObjectId
  topicId: Types.ObjectId
  autorUsuarioId: Types.ObjectId
  conteudo: string
  status: StatusComentario
  criadoEm?: Date
  atualizadoEm?: Date
}

const ForumCommentSchema = new Schema<IForumComment>(
  {
    forumId: { type: Schema.Types.ObjectId, ref: 'Forum', required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: 'ForumTopic', required: true, index: true },
    autorUsuarioId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    conteudo: { type: String, required: true, trim: true },
    status: { type: String, enum: ['ATIVO', 'EDITADO', 'EXCLUIDO'], default: 'ATIVO' },
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date, default: Date.now },
  },
  { versionKey: false }
)

ForumCommentSchema.index({ topicId: 1, criadoEm: 1 })

export default models.ForumComment || model<IForumComment>('ForumComment', ForumCommentSchema, 'forum_comments')