import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forumTopicService } from '@/services/forumTopic.service'
import { forumCommentService } from '@/services/forumComment.service'
import type { ForumComment, ForumTopic } from '@/types/forum'

export default function TopicoPage() {
  const { id, topicId } = useParams<{ id: string; topicId: string }>()
  const navigate = useNavigate()

  const [topico, setTopico] = useState<ForumTopic | null>(null)
  const [comentarios, setComentarios] = useState<ForumComment[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [novoComentario, setNovoComentario] = useState('')
  const [enviando, setEnviando] = useState(false)

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

  return (
    <AuthenticatedLayout>
      <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded transition"
        >
          ← Voltar
        </button>

        {loading && <p>Carregando tópico...</p>}
        {erro && <p className="text-red-600">{erro}</p>}

        {topico && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-2">{topico.titulo}</h1>
            <p className="text-gray-800 whitespace-pre-wrap mb-4">{topico.conteudo}</p>

            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-2">Comentários</h2>
              {comentarios.length === 0 ? (
                <p className="text-gray-600">Ainda não há comentários.</p>
              ) : (
                <ul className="space-y-3">
                  {comentarios.map((c) => (
                    <li key={c._id} className="p-4 bg-gray-50 rounded border">
                      <p className="text-gray-800 whitespace-pre-wrap">{c.conteudo}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(c.criadoEm || '').toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-2">Novo comentário</h3>
              <textarea
                value={novoComentario}
                onChange={(e) => setNovoComentario(e.target.value)}
                placeholder="Escreva seu comentário..."
                className="w-full border rounded px-3 py-2 h-28"
              />
              <button
                onClick={handleEnviarComentario}
                disabled={enviando || !novoComentario.trim()}
                className={`${enviando ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded mt-2`}
              >
                {enviando ? 'Enviando...' : 'Enviar comentário'}
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}