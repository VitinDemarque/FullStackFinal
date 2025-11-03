import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import { userService } from '@/services/user.service'
import { forumTopicService } from '@/services/forumTopic.service'
import type { Forum, ForumTopic } from '@/types/forum'
import type { User } from '@/types/index'

export default function ForumDetalhesPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [forum, setForum] = useState<Forum | null>(null)
    const [dono, setDono] = useState<User | null>(null)
    const [usuarioAtual, setUsuarioAtual] = useState<User | null>(null)
    const [participando, setParticipando] = useState(false)
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState<string | null>(null)
    const [processando, setProcessando] = useState(false)
    const [topicos, setTopicos] = useState<ForumTopic[]>([])
    const [criandoTopico, setCriandoTopico] = useState(false)
    const [tituloTopico, setTituloTopico] = useState('')
    const [conteudoTopico, setConteudoTopico] = useState('')

    useEffect(() => {
        const carregarDados = async () => {
            if (!id) {
                setErro('ID do fórum não informado.')
                return
            }

            try {
                setLoading(true)

                const me = await userService.getMe()
                setUsuarioAtual(me)

                const data = await forunsService.getById(id)
                setForum(data)

                if (data.donoUsuarioId) {
                    const donoUser = await userService.getById(data.donoUsuarioId)
                    setDono(donoUser)
                }

                // Verifica se o usuário já participa
                const ehParticipante =
                    data.donoUsuarioId === me.id ||
                    data.moderadores?.some((m) => m.usuarioId === me.id) ||
                    data.membros?.some((m) => m.usuarioId === me.id)

                setParticipando(!!ehParticipante)

                // Carregar tópicos do fórum
                const lista = await forumTopicService.listarPorForum(id)
                setTopicos(lista)
            } catch (err: any) {
                console.error('Erro ao carregar fórum:', err)
                setErro(err.message || 'Erro ao carregar fórum.')
            } finally {
                setLoading(false)
            }
        }

        carregarDados()
    }, [id])

    const handleParticipar = async () => {
        if (!id) return
        try {
            setProcessando(true)
            await forunsService.participar(id)
            setParticipando(true)
            const atualizado = await forunsService.getById(id)
            setForum(atualizado)
        } catch (err: any) {
            console.error('Erro ao participar:', err)
            setErro(err.message || 'Não foi possível participar deste fórum.')
        } finally {
            setProcessando(false)
        }
    }

    const handleCriarTopico = async () => {
        if (!id) return
        try {
            setCriandoTopico(true)
            const criado = await forumTopicService.criar(id, {
                titulo: tituloTopico,
                conteudo: conteudoTopico,
                palavrasChave: [],
            })
            setTituloTopico('')
            setConteudoTopico('')
            // Recarregar lista
            const lista = await forumTopicService.listarPorForum(id)
            setTopicos(lista)
        } catch (err: any) {
            setErro(err.message || 'Não foi possível criar o tópico.')
        } finally {
            setCriandoTopico(false)
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

                {loading && <p>Carregando fórum...</p>}
                {erro && <p className="text-red-600">{erro}</p>}

                {forum && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-3xl font-bold mb-2">{forum.nome}</h1>
                        <p className="text-gray-700 mb-4">
                            {forum.descricao || 'Sem descrição'}
                        </p>

                        <p className="text-sm text-gray-600 mb-2">
                            <strong>Dono:</strong> {dono?.name || 'Desconhecido'}
                        </p>

                        <p className="text-sm text-gray-600 mb-4">
                            <strong>Privacidade:</strong>{' '}
                            {forum.statusPrivacidade === 'PRIVADO' ? 'Privado' : 'Público'}
                        </p>

                        {participando ? (
                            <div className="space-y-4">
                                <div className="border-t pt-4">
                                    <h2 className="text-xl font-semibold mb-2">Tópicos</h2>
                                    {topicos.length === 0 ? (
                                        <p className="text-gray-600">Nenhum tópico ainda.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {topicos.map((t) => (
                                                <li key={t._id} className="p-4 bg-gray-50 rounded border hover:bg-gray-100 transition">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{t.titulo}</p>
                                                            <p className="text-sm text-gray-600 line-clamp-2">{t.conteudo}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => navigate(`/foruns/${forum._id}/topicos/${t._id}`)}
                                                            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                                                        >
                                                            Abrir
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-2">Criar novo tópico</h3>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={tituloTopico}
                                            onChange={(e) => setTituloTopico(e.target.value)}
                                            placeholder="Título"
                                            className="w-full border rounded px-3 py-2"
                                        />
                                        <textarea
                                            value={conteudoTopico}
                                            onChange={(e) => setConteudoTopico(e.target.value)}
                                            placeholder="Conteúdo"
                                            className="w-full border rounded px-3 py-2 h-28"
                                        />
                                        <button
                                            onClick={handleCriarTopico}
                                            disabled={criandoTopico || !tituloTopico || !conteudoTopico}
                                            className={`${criandoTopico ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded`}
                                        >
                                            {criandoTopico ? 'Criando...' : 'Criar tópico'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleParticipar}
                                disabled={processando}
                                className={`${processando
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white px-4 py-2 rounded-lg shadow transition`}
                            >
                                {processando ? 'Ingressando...' : 'Participar deste fórum'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}