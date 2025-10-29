import { useEffect, useState } from 'react'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Fóruns Públicos</h1>

        {erro && <p className="text-red-500 mb-4">{erro}</p>}
        {loading ? (
          <p>Carregando...</p>
        ) : foruns.length === 0 ? (
          <p>Nenhum fórum encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {foruns.map((forum) => (
              <li key={forum._id} className="p-4 bg-white rounded shadow">
                <h2 className="text-lg font-semibold">{forum.titulo}</h2>
                <p className="text-gray-600">{forum.descricao}</p>
                <p className="text-sm text-gray-400 mt-1">
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