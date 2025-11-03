import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import { userService } from '@/services/user.service'
import type { Forum } from '@/types/forum'
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
                            <button
                                onClick={() => navigate(`/foruns/${forum._id}/topicos`)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
                            >
                                Acessar tópicos
                            </button>
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