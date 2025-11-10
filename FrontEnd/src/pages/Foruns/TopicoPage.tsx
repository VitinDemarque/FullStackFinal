import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forumTopicService } from '@/services/forumTopic.service'
import { forumCommentService } from '@/services/forumComment.service'
import { forunsService } from '@/services/forum.services'
import { exercisesService } from '@/services/exercises.service'
import { useAuth } from '@/contexts/AuthContext'
import * as S from '@/styles/pages/Foruns/styles'
import type { ForumComment, ForumTopic } from '@/types/forum'

export default function TopicoPage() {
  const { id, topicId } = useParams<{ id: string; topicId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [topico, setTopico] = useState<ForumTopic | null>(null)
  const [comentarios, setComentarios] = useState<ForumComment[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [novoComentario, setNovoComentario] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mostrarTodos, setMostrarTodos] = useState(false)
  const formSectionRef = useRef<HTMLDivElement | null>(null)
  const [forumOwnerId, setForumOwnerId] = useState<string | null>(null)
  const [excluindoId, setExcluindoId] = useState<string | null>(null)
  const [exerciseStatus, setExerciseStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | null>(null)

  useEffect(() => {
    const carregar = async () => {
      if (!topicId) {
        setErro('Tópico não informado.')
        return
      }
      try {
        setLoading(true)
        const t = await forumTopicService.obterPorId(topicId)
        setTopico(t)
        // Buscar dono do fórum para validar permissão de exclusão
        try {
          const forum = await forunsService.getById(t.forumId)
          setForumOwnerId(forum?.donoUsuarioId ?? null)
          if (forum?.exerciseId) {
            try {
              const ex = await exercisesService.getById(String(forum.exerciseId))
              setExerciseStatus(ex.status as any)
            } catch {}
          }
        } catch {}
        const list = await forumCommentService.listarPorTopico(topicId)
        setComentarios(list)
      } catch (err: any) {
        setErro(err.message || 'Erro ao carregar tópico.')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [topicId])

  const handleEnviarComentario = async () => {
    if (!topicId || !novoComentario.trim()) return
    try {
      setEnviando(true)
      await forumCommentService.criar(topicId, { conteudo: novoComentario.trim() })
      setNovoComentario('')
      const list = await forumCommentService.listarPorTopico(topicId)
      setComentarios(list)
    } catch (err: any) {
      setErro(err.message || 'Não foi possível enviar o comentário.')
    } finally {
      setEnviando(false)
    }
  }

  const comentariosVisiveis = mostrarTodos ? comentarios : comentarios.slice(0, 2)
  const restantes = Math.max(0, comentarios.length - comentariosVisiveis.length)

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleExcluirComentario = async (commentId: string) => {
    if (!commentId) return
    const confirmar = window.confirm('Excluir este comentário?')
    if (!confirmar) return
    try {
      setExcluindoId(commentId)
      await forumCommentService.excluir(commentId)
      if (topicId) {
        const list = await forumCommentService.listarPorTopico(topicId)
        setComentarios(list)
      }
    } catch (err: any) {
      setErro(err?.message || 'Não foi possível excluir o comentário.')
    } finally {
      setExcluindoId(null)
    }
  }

  const isExerciseActive = exerciseStatus === 'PUBLISHED'

  return (
    <AuthenticatedLayout>
      <S.Container>
        <S.BackButton to={id ? `/foruns/${id}` : '/foruns'}>← Voltar</S.BackButton>

        {loading && <S.Loading>Carregando tópico...</S.Loading>}
        {erro && <S.Error>{erro}</S.Error>}

        {topico && (
          <S.DetailContainer $inactive={!isExerciseActive}>
            <S.DetailTitle>{topico.titulo}</S.DetailTitle>
            <S.DetailText style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
              {topico.conteudo}
            </S.DetailText>

            {!isExerciseActive && (
              <S.InactiveOverlay>
                <S.InactiveLabel>INATIVO</S.InactiveLabel>
              </S.InactiveOverlay>
            )}

            <S.DetailSection>
              <S.CommentsHeader>Comentários</S.CommentsHeader>
              {comentarios.length === 0 ? (
                <S.DetailText>Ainda não há comentários.</S.DetailText>
              ) : (
                <>
                  <S.CommentsListWrapper>
                    <S.CommentsList>
                      {comentariosVisiveis.map((c) => {
                        const meuId = user?._id || user?.id
                        const isAutor = !!meuId && String(c.autorUsuarioId) === String(meuId)
                        const isDonoForum = !!meuId && !!forumOwnerId && String(forumOwnerId) === String(meuId)
                        const isAdmin = user?.role === 'ADMIN'
                        const podeExcluir = isAutor || isDonoForum || isAdmin
                        return (
                          <S.CommentItem key={c._id}>
                            <S.CommentContent>{c.conteudo}</S.CommentContent>
                            <S.CommentMeta>
                              {new Date(c.criadoEm || '').toLocaleString()}
                            </S.CommentMeta>
                            {podeExcluir && (
                              <S.CommentActions>
                                <S.Button
                                  variant="danger"
                                  disabled={excluindoId === c._id}
                                  onClick={() => handleExcluirComentario(c._id)}
                                >
                                  {excluindoId === c._id ? 'Excluindo...' : 'Excluir'}
                                </S.Button>
                              </S.CommentActions>
                            )}
                          </S.CommentItem>
                        )
                      })}
                    </S.CommentsList>
                    {!mostrarTodos && restantes > 0 && <S.FadeOverlay />}
                  </S.CommentsListWrapper>

                  <S.CommentsFooter>
                    {restantes > 0 && (
                      <S.Button variant="secondary" onClick={() => setMostrarTodos(true)}>
                        Ver mais respostas ({restantes})
                      </S.Button>
                    )}
                    {mostrarTodos && (
                      <S.Button variant="secondary" onClick={() => setMostrarTodos(false)}>
                        Mostrar menos
                      </S.Button>
                    )}
                    <S.Button variant="primary" onClick={scrollToForm}>
                      Comentar
                    </S.Button>
                  </S.CommentsFooter>
                </>
              )}
            </S.DetailSection>

            <S.DetailSection ref={formSectionRef}>
              <S.DetailSectionTitle>Novo comentário</S.DetailSectionTitle>
              <S.FormRow>
                <S.Textarea
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Escreva seu comentário..."
                />
                <S.Button
                  onClick={handleEnviarComentario}
                  disabled={enviando || !novoComentario.trim()}
                  variant="primary"
                >
                  {enviando ? 'Enviando...' : 'Enviar comentário'}
                </S.Button>
              </S.FormRow>
            </S.DetailSection>
          </S.DetailContainer>
        )}
      </S.Container>
    </AuthenticatedLayout>
  )
}