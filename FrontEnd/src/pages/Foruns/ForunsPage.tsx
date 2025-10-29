import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import type { Forum } from '@/types/forum'

export default function ForunsPage() {
  const [foruns, setForuns] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true)
        const data = await forunsService.listarPublicos()
        setForuns(data.items || [])
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Fóruns Públicos</h1>

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
                <h2 className="text-xl font-semibold text-gray-900">{forum.titulo}</h2>
                <p className="text-gray-700 mt-1">{forum.descricao}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Categoria: {forum.categoria || 'Geral'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthenticatedLayout>
  )
}