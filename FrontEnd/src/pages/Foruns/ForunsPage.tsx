import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import type { Forum } from '@/types/forum'

export default function ForunsPage() {
  const [foruns, setForuns] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [mostrarModalCriar, setMostrarModalCriar] = useState(false)

  useEffect(() => {
    const carregar = async () => {
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
    carregar()
  }, [])

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
                className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
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

        {mostrarModalCriar && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Criar Novo Fórum
              </h2>
              <p className="text-gray-600 mb-4">
                Aqui ficará o formulário de criação de fórum.
              </p>
              <button
                onClick={() => setMostrarModalCriar(false)}
                className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}