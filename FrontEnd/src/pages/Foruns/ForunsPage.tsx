import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import { useAuth } from '@/contexts/AuthContext'
import ModalCriarForum from '@/components/Forum/ModalCriarForum'
import type { Forum } from '@/types/forum'

export default function ForunsPage() {
  const { user } = useAuth()
  const [foruns, setForuns] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false)
  const [busca, setBusca] = useState('')
  const [mostrarMeus, setMostrarMeus] = useState(false)
  const navigate = useNavigate()

  const carregarForuns = async () => {
    try {
      setLoading(true)
      const data = await forunsService.listarPublicos()
      setForuns(data || [])
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar fóruns.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarForuns()
  }, [])

  const forunsFiltrados = useMemo(() => {
    return foruns.filter((forum) => {
      const termo = busca.toLowerCase()
      const correspondeBusca =
        forum.nome?.toLowerCase().includes(termo) ||
        forum.assunto?.toLowerCase().includes(termo) ||
        forum.descricao?.toLowerCase().includes(termo)

      const souParticipante =
        forum.donoUsuarioId === user?.id ||
        forum.moderadores?.some((mod) => mod.usuarioId === user?.id)

      if (mostrarMeus) return correspondeBusca && souParticipante
      return correspondeBusca
    })
  }, [foruns, busca, mostrarMeus, user?.id])

  return (
    <AuthenticatedLayout>
      <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Fóruns Públicos</h1>

          <button
            onClick={() => setMostrarModalCriar(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Novo Fórum
          </button>
        </div>

        {erro && (
          <p className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded mb-4">
            {erro}
          </p>
        )}

        {loading ? (
          <p className="text-gray-700">Carregando...</p>
        ) : foruns.length === 0 ? (
          <p className="text-gray-700">Nenhum fórum encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {foruns.map((forum) => (
              <li
                key={forum._id}
                onClick={() => navigate(`/foruns/${forum._id}`)} // 👈 redireciona
                className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-gray-900">{forum.nome}</h2>
                <p className="text-gray-700 mt-1">{forum.descricao}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Assunto: {forum.assunto || 'Geral'}
                </p>
              </li>
            ))}
          </ul>
        )}

        <ModalCriarForum
          aberto={mostrarModalCriar}
          onFechar={() => setMostrarModalCriar(false)}
          onCriado={carregarForuns}
        />
      </div>
    </AuthenticatedLayout>
  )
}