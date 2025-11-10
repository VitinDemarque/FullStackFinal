import { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthenticatedLayout from '@/components/Layout/AuthenticatedLayout'
import { forunsService } from '@/services/forum.services'
import { exercisesService } from '@/services/exercises.service'
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
  const [ownerAvatars, setOwnerAvatars] = useState<Record<string, string | null>>({})
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({})
  const [exerciseStatuses, setExerciseStatuses] = useState<Record<string, 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | null>>({})
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

  // Busca dados básicos dos donos dos fóruns quando a lista muda
  useEffect(() => {
    const fetchOwnerData = async () => {
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
              return [id, profile.user.name, profile.user.avatarUrl ?? null] as const
            } catch {
              try {
                // Fallback autenticado (caso token esteja presente)
                const u = await userService.getById(id)
                return [id, u.name, u.avatarUrl ?? null] as const
              } catch {
                return [id, `Usuário ${id}`, null] as const
              }
            }
          })
        )

        const nameMap: Record<string, string> = {}
        const avatarMap: Record<string, string | null> = {}
        results.forEach(([id, name, avatar]) => {
          nameMap[id] = name
          avatarMap[id] = avatar
        })
        setOwnerNames((prev) => ({ ...prev, ...nameMap }))
        setOwnerAvatars((prev) => ({ ...prev, ...avatarMap }))
      } catch {}
    }

    fetchOwnerData()
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

  // Buscar status do desafio para cada fórum com exerciseId
  useEffect(() => {
    const fetchExerciseStatuses = async () => {
      try {
        const pairs = await Promise.all(
          (foruns || [])
            .filter((f) => !!f.exerciseId)
            .map(async (f) => {
              try {
                const ex = await exercisesService.getById(String(f.exerciseId))
                return [f._id, ex.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'] as const
              } catch {
                return [f._id, null] as const
              }
            })
        )
        const map: Record<string, 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | null> = {}
        pairs.forEach(([id, status]) => { map[id] = status })
        setExerciseStatuses((prev) => ({ ...prev, ...map }))
      } catch {}
    }
    if (foruns.length > 0) fetchExerciseStatuses()
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
          
            Novo Publicação
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
            {forunsFiltrados.map((forum) => {
              const status = exerciseStatuses[forum._id]
              const isActive = status === 'PUBLISHED'
              return (
              <S.ForumCard
                key={forum._id}
                onClick={() => navigate(`/foruns/${forum._id}`)}
                $inactive={!isActive}
              >
                <S.CardTopGrid>
                  <div>
                    <S.CardTitle>{forum.nome}</S.CardTitle>
                    <S.CardDescription>
                      {forum.descricao || 'Sem descrição'}
                    </S.CardDescription>
                  </div>
                  <div>
                    <S.BadgeContainer>
                      <S.Badge variant={forum.statusPrivacidade === 'PRIVADO' ? 'private' : 'public'}>
                        {forum.statusPrivacidade === 'PRIVADO' ? '🔒 Privado' : '🌐 Público'}
                      </S.Badge>
                      {forum.assunto && (
                        <S.Badge>{forum.assunto}</S.Badge>
                      )}
                    </S.BadgeContainer>
                  </div>
                </S.CardTopGrid>

                <S.CardMeta>
                  <S.MetaItem>🧩 Tópicos: {topicCounts[forum._id] ?? 0}</S.MetaItem>
                </S.CardMeta>
                {!isActive && (
                  <S.InactiveOverlay>
                    <S.InactiveLabel>INATIVO</S.InactiveLabel>
                  </S.InactiveOverlay>
                )}
              </S.ForumCard>
            )})}
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