import { apiRequest } from './api'
import type { ForumTopic } from '@/types/forum'

export const forumTopicService = {
  async listarPorForum(forumId: string): Promise<ForumTopic[]> {
    return apiRequest<ForumTopic[]>('GET', `/forum-topics/forum/${forumId}`)
  },

  async obterPorId(id: string): Promise<ForumTopic> {
    return apiRequest<ForumTopic>('GET', `/forum-topics/${id}`)
  },

  async criar(forumId: string, payload: Pick<ForumTopic, 'titulo' | 'conteudo' | 'palavrasChave'>): Promise<ForumTopic> {
    const body: any = {
      titulo: payload.titulo,
      conteudo: payload.conteudo,
      palavrasChave: payload.palavrasChave ?? [],
    }
    return apiRequest<ForumTopic>('POST', `/forum-topics/forum/${forumId}`, body)
  },

  async atualizar(id: string, payload: Partial<Pick<ForumTopic, 'titulo' | 'conteudo' | 'palavrasChave' | 'status' | 'fixado'>>): Promise<ForumTopic> {
    return apiRequest<ForumTopic>('PATCH', `/forum-topics/${id}`, payload)
  },

  async excluir(id: string): Promise<{ mensagem: string }> {
    return apiRequest<{ mensagem: string }>('DELETE', `/forum-topics/${id}`)
  },
}