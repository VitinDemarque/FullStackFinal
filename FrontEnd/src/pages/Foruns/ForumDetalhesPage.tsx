import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import type { Forum } from '@/types/forum'

export default function ForumDetalhesPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [forum, setForum] = useState<Forum | null>(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregarForum = async () => {
      if (!id) {
        setErro('ID do fórum não informado.')
        return
      }

      try {
        setLoading(true)
        const data = await forunsService.getById(id)
        setForum(data)
      } catch (err: any) {
        console.error('Erro ao carregar fórum:', err)
        setErro(err.message || 'Erro ao carregar fórum.')
      } finally {
        setLoading(false)
      }
    }

    carregarForum()
  }, [id])

  return (
    <AuthenticatedLayout>
      <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded transition"
        >
          ← Voltar
        </button>

        {loading && <p className="text-gray-700">Carregando fórum...</p>}

        {erro && (
          <p className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded">
            {erro}
          </p>
        )}

        {forum && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{forum.nome}</h1>

            <p className="text-lg text-gray-700 mb-2">
              <span className="font-semibold">Assunto:</span> {forum.assunto || '—'}
            </p>

            {forum.descricao && (
              <p className="text-gray-600 mb-4">{forum.descricao}</p>
            )}

            <div className="mb-3 text-sm text-gray-500">
              <p>
                <span className="font-semibold">Dono (ID):</span>{' '}
                {forum.donoUsuarioId ?? 'Desconhecido'}
              </p>
              <p>
                <span className="font-semibold">Data de criação:</span>{' '}
                {forum.criadoEm ? new Date(forum.criadoEm).toLocaleString('pt-BR') : '—'}
              </p>
              <p>
                <span className="font-semibold">Privacidade:</span>{' '}
                {forum.statusPrivacidade === 'PRIVADO' ? 'Privado' : 'Público'}
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Moderadores</h2>

              {forum.moderadores && forum.moderadores.length > 0 ? (
                <ul className="list-disc list-inside text-gray-700">
                  {forum.moderadores.map((mod, idx) => (
                    <li key={idx} className="mb-1">
                      <div>
                        <span className="font-medium">ID:</span> {String(mod.usuarioId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Desde:</span>{' '}
                        {mod.desde ? new Date(mod.desde).toLocaleString('pt-BR') : '—'}
                        {mod.aprovado === false ? ' (não aprovado)' : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Nenhum moderador.</p>
              )}
            </div>

            <div className="mt-6 border-t pt-4 text-gray-500 text-sm italic">
              <p>Em breve: tópicos e discussões deste fórum.</p>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}