import { apiRequest } from './api'
import type { ForumComment } from '@/types/forum'

export const forumCommentService = {
  async listarPorTopico(topicId: string): Promise<ForumComment[]> {
    return apiRequest<ForumComment[]>('GET', `/forum-comments/topic/${topicId}`)
  },

  async obterPorId(id: string): Promise<ForumComment> {
    return apiRequest<ForumComment>('GET', `/forum-comments/${id}`)
  },

  async criar(topicId: string, payload: Pick<ForumComment, 'conteudo'>): Promise<ForumComment> {
    return apiRequest<ForumComment>('POST', `/forum-comments/topic/${topicId}`, { conteudo: payload.conteudo })
  },

  async atualizar(id: string, payload: Partial<Pick<ForumComment, 'conteudo' | 'status'>>): Promise<ForumComment> {
    return apiRequest<ForumComment>('PATCH', `/forum-comments/${id}`, payload)
  },

  async excluir(id: string): Promise<{ mensagem: string }> {
    return apiRequest<{ mensagem: string }>('DELETE', `/forum-comments/${id}`)
  },
}