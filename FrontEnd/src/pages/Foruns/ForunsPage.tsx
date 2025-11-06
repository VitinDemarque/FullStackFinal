import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import { forumTopicService } from '@/services/forumTopic.service'
import { userService } from '@/services/user.service'
import { useAuth } from '@/contexts/AuthContext'
import ModalCriarForum from '@/components/Forum/ModalCriarForum'
import type { Forum } from '@/types/forum'
import * as S from '@/styles/pages/Foruns/styles'
import { FaSearch } from 'react-icons/fa'

export default function ForunsPage() {
  const { user } = useAuth()
  const [foruns, setForuns] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false)
  const [busca, setBusca] = useState('')
  const [mostrarMeus, setMostrarMeus] = useState(false)
  const [ownerNames, setOwnerNames] = useState<Record<string, string>>({})
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({})
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

  // Busca os nomes dos donos dos fóruns quando a lista muda
  useEffect(() => {
    const fetchOwnerNames = async () => {
      try {
        const ids = Array.from(
          new Set(
            (foruns || [])
              .map((f) => f.donoUsuarioId)
              .filter((id): id is string => !!id)
          )
        )

        if (ids.length === 0) return

        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              // Endpoint público não exige autenticação
              const profile = await userService.getPublicProfile(id)
              return [id, profile.user.name] as const
            } catch {
              try {
                // Fallback autenticado (caso token esteja presente)
                const u = await userService.getById(id)
                return [id, u.name] as const
              } catch {
                return [id, `Usuário ${id}`] as const
              }
            }
          })
        )

        const map: Record<string, string> = {}
        results.forEach(([id, name]) => {
          map[id] = name
        })
        setOwnerNames((prev) => ({ ...prev, ...map }))
      } catch {}
    }

    fetchOwnerNames()
  }, [foruns])

  // Busca a contagem de tópicos para cada fórum
  useEffect(() => {
    const fetchTopicCounts = async () => {
      try {
        const ids = (foruns || []).map((f) => f._id)
        if (ids.length === 0) return

        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const { total } = await forumTopicService.contarPorForum(id)
              return [id, total] as const
            } catch {
              return [id, 0] as const
            }
          })
        )

        const map: Record<string, number> = {}
        results.forEach(([id, total]) => {
          map[id] = total
        })
        setTopicCounts((prev) => ({ ...prev, ...map }))
      } catch {}
    }

    fetchTopicCounts()
  }, [foruns])

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
      <S.Container>
        <S.Header>
          <S.Title>Fóruns Públicos</S.Title>
          <S.NewForumButton onClick={() => setMostrarModalCriar(true)}>
            ➕ Novo Fórum
          </S.NewForumButton>
        </S.Header>

        <S.SearchBar>
          <FaSearch />
          <input
            placeholder="Buscar por título, assunto ou descrição"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </S.SearchBar>

        {erro && <S.Error>{erro}</S.Error>}

        {loading ? (
          <S.Loading>Carregando...</S.Loading>
        ) : forunsFiltrados.length === 0 ? (
          <S.NoResults>
            <p>Nenhum fórum encontrado.</p>
          </S.NoResults>
        ) : (
          <S.ForumList>
            {forunsFiltrados.map((forum) => (
              <S.ForumCard
                key={forum._id}
                onClick={() => navigate(`/foruns/${forum._id}`)}
              >
                <S.CardHeader>
                  <S.CardTitle>{forum.nome}</S.CardTitle>
                  <S.BadgeContainer>
                    <S.Badge variant="public">🌐 Público</S.Badge>
                    {forum.assunto && (
                      <S.Badge>{forum.assunto}</S.Badge>
                    )}
                  </S.BadgeContainer>
                </S.CardHeader>

                <S.CardDescription>
                  {forum.descricao || 'Sem descrição'}
                </S.CardDescription>

                <S.CardMeta>
                  <S.MetaItem>🧩 Tópicos: {topicCounts[forum._id] ?? 0}</S.MetaItem>
                  <S.MetaItem>
                    👑 Dono: {forum.donoUsuarioId ? (ownerNames[forum.donoUsuarioId] || `Usuário ${forum.donoUsuarioId}`) : 'N/A'}
                  </S.MetaItem>
                </S.CardMeta>
              </S.ForumCard>
            ))}
          </S.ForumList>
        )}

        <ModalCriarForum
          aberto={mostrarModalCriar}
          onFechar={() => setMostrarModalCriar(false)}
          onCriado={carregarForuns}
        />
      </S.Container>
    </AuthenticatedLayout>
  )
}