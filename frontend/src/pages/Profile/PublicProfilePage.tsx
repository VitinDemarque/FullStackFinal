import { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import { useTheme } from '@contexts/ThemeContext'
import { useAuth } from '@contexts/AuthContext'
import { useFetch } from '@hooks/useFetch'
import { userService } from '@services/user.service'
import { leaderboardService } from '@services/leaderboard.service'
import { exercisesService } from '@services/exercises.service'
import { titlesService } from '@services/titles.service'
import * as S from '@/styles/pages/Profile/styles'
import { resolvePublicUrl } from '@services/api'
import { deriveLevelFromXp } from '@utils/levels'
import { FaAward, FaCheckCircle, FaCode, FaMedal, FaTrophy, FaFire, FaStar, FaFilter, FaLock, FaArrowLeft } from 'react-icons/fa'

export default function PublicProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { user: viewer } = useAuth()

  const { data: profile, loading } = useFetch(
    () => userService.getPublicProfile(id as string),
    { immediate: true, dependencies: [id] }
  )

  const [activeTab, setActiveTab] = useState<'completed' | 'badges' | 'titles' | 'created'>('completed')

  const user = profile?.user
  const badgesCount = profile?.badges?.length ?? 0
  const completedCount = profile?.scoreboard?.solved ?? 0
  const createdCount = profile?.scoreboard?.created ?? 0

  const visitedUserId = useMemo(() => {
    return String(profile?.user?.id ?? (profile as any)?.user?._id ?? '')
  }, [profile?.user?.id, (profile as any)?.user?._id])

  const isPrivateProfile = useMemo(() => {
    try {
      const visibility = localStorage.getItem(`userPrivacy:${visitedUserId}`) || 'public'
      const viewerId = String(viewer?.id ?? viewer?._id ?? '')
      return visibility === 'private' && viewerId !== visitedUserId
    } catch {
      return false
    }
  }, [visitedUserId, viewer?.id, viewer?._id])

  const rawExercises = useMemo(() => {
    const ex: any = (profile as any)?.exercises
    if (Array.isArray(ex)) return ex
    if (ex && Array.isArray(ex.items)) return ex.items
    return []
  }, [profile?.exercises])

  const createdExercises = useMemo(() => {
    return rawExercises.filter((e: any) => String(e.authorUserId ?? '') === visitedUserId)
  }, [rawExercises, visitedUserId])

  const completedExercises = useMemo(() => {
    const withFlag = rawExercises.filter((e: any) => e.isCompleted === true)
    if (withFlag.length > 0) return withFlag
    return rawExercises.filter((e: any) => String(e.authorUserId ?? '') !== visitedUserId)
  }, [rawExercises, visitedUserId])

  const [completedView, setCompletedView] = useState<any[]>([])
  const [createdView, setCreatedView] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    async function enrichCompleted() {
      const list = Array.isArray(completedExercises) ? completedExercises : []
      if (list.length === 0) {
        setCompletedView([])
        return
      }
      const enriched = await Promise.all(list.map(async (e: any) => {
        const id = String(e.id ?? e._id ?? e.exerciseId ?? '')
        const hasAll = !!e.description && !!e.baseXp && !!e.subject
        if (!id || hasAll) return e
        try {
          const full = await exercisesService.getById(id)
          return { ...full, ...e }
        } catch {
          return e
        }
      }))
      if (mounted) setCompletedView(enriched)
    }
    enrichCompleted()
    return () => { mounted = false }
  }, [completedExercises])

  useEffect(() => {
    let mounted = true
    async function fetchCreated() {
      const uid = visitedUserId
      if (!uid) {
        setCreatedView([])
        return
      }
      if (Array.isArray(createdExercises) && createdExercises.length > 0) {
        setCreatedView(createdExercises)
        return
      }
      try {
        const res = await exercisesService.getAll({ page: 1, limit: 1000, status: 'PUBLISHED', authorUserId: uid } as any)
        const items = (res as any)?.items || []
        if (mounted) setCreatedView(items)
      } catch {
        try {
          const res = await exercisesService.getCommunityChallenges({ page: 1, limit: 1000 } as any)
          const items = ((res as any)?.items || []).filter((e: any) => String(e.authorUserId ?? '') === uid)
          if (mounted) setCreatedView(items)
        } catch {
          if (mounted) setCreatedView([])
        }
      }
    }
    fetchCreated()
    return () => { mounted = false }
  }, [visitedUserId, createdExercises])

  const [userRank, setUserRank] = useState<number | null>(null)
  const [allTitles, setAllTitles] = useState<any[]>([])
  const [earnedTitles, setEarnedTitles] = useState<any[]>([])
  const [loadingTitles, setLoadingTitles] = useState<boolean>(true)

  useFetch(
    async () => {
      const uid = String(user?.id ?? (user as any)?._id ?? id ?? '')
      if (!uid) return null
      let page = 1
      const limit = 100
      while (page <= 200) {
        try {
          const resp = await leaderboardService.getGeneralLeaderboard({ page, limit }) as any
          const entries = Array.isArray(resp?.items)
            ? resp.items
            : Array.isArray(resp?.data)
            ? resp.data
            : Array.isArray(resp)
            ? resp
            : []
          if (!entries || entries.length === 0) break
          const found = entries.find((e: any) => {
            const candidateIds = [e.userId, e.id, e._id, e.user?.id, e.user?._id]
              .filter(Boolean)
              .map((v: any) => String(v))
            return candidateIds.includes(uid)
          })
          if (found) {
            const pos = Number(found.position ?? found.rank ?? found.pos ?? NaN)
            if (!Number.isNaN(pos)) return pos
          }
          if (entries.length < limit) break
          page++
        } catch {
          break
        }
      }
      return null
    },
    {
      immediate: true,
      dependencies: [user?.id, user?._id, id],
      onSuccess: (pos) => setUserRank(pos ?? (Number((profile as any)?.user?.rank ?? (profile as any)?.rank ?? NaN) || null))
    }
  )

  useEffect(() => {
    let mounted = true
    async function fetchTitles() {
      try {
        setLoadingTitles(true)
        if (!user?.id && !(user as any)?._id) {
          setAllTitles([])
          setEarnedTitles([])
          return
        }
        const uid = String(user.id ?? (user as any)._id ?? id)
        const [allResp, userTitles] = await Promise.all([
          titlesService.listAll().catch(() => ({ items: [] })),
          titlesService.getUserTitles(uid).catch(() => [])
        ])
        const allCandidate = (allResp as any)
        const all = Array.isArray(allCandidate?.items)
          ? allCandidate.items
          : Array.isArray(allCandidate?.data)
          ? allCandidate.data
          : (Array.isArray(allCandidate) ? allCandidate : [])
        const userTitleItems = Array.isArray(userTitles)
          ? userTitles
          : Array.isArray((userTitles as any)?.items)
          ? (userTitles as any).items
          : Array.isArray((userTitles as any)?.data)
          ? (userTitles as any).data
          : []
        const earned = userTitleItems.map((ut: any) => {
          if (ut && typeof ut === 'object') {
            if (ut.title) {
              if (typeof ut.title === 'string') {
                return all.find((t: any) => String(t._id || t.id) === String(ut.title))
              }
              return ut.title
            }
            if (ut.titleId) {
              return all.find((t: any) => String(t._id || t.id) === String(ut.titleId)) || null
            }
            if ((ut._id || ut.id) && ut.name) {
              return ut
            }
          }
          return null
        }).filter(Boolean)
        if (!mounted) return
        setAllTitles(all)
        setEarnedTitles(earned)
      } finally {
        if (mounted) setLoadingTitles(false)
      }
    }
    fetchTitles()
    return () => { mounted = false }
  }, [user?.id, (user as any)?._id])

  useEffect(() => {
    const raw = (profile as any)?.titles || (profile as any)?.user?.titles
    const items = Array.isArray(raw) ? raw : (Array.isArray(raw?.items) ? raw.items : (Array.isArray(raw?.data) ? raw.data : []))
    if (items.length > 0) {
      setLoadingTitles(true)
      const list = items.map((ut: any) => {
        if (ut && typeof ut === 'object') {
          if (ut.title) {
            if (typeof ut.title === 'object') return ut.title
            const found = allTitles.find((t: any) => String(t._id || t.id) === String(ut.title))
            return found || null
          }
          if (ut.titleId) {
            const found = allTitles.find((t: any) => String(t._id || t.id) === String(ut.titleId))
            return found || null
          }
          if ((ut._id || ut.id) && ut.name) {
            return ut
          }
        }
        return null
      }).filter(Boolean)
      setEarnedTitles(list as any[])
      setLoadingTitles(false)
    }
  }, [profile?.titles, allTitles])

  if (isPrivateProfile) {
    return (
      <AuthenticatedLayout>
        <S.ProfilePageContainer $isDark={isDark}>
          <S.ProfileHeader>
            <S.BackCircleButton onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </S.BackCircleButton>
            <S.HeaderContent>
              <S.ProfileSection>
                <S.AvatarContainer>
                  <S.Avatar>
                    {user?.avatarUrl ? (
                      <S.AvatarImage src={resolvePublicUrl(user.avatarUrl)!} alt={user?.name ?? ''} />
                    ) : (
                      <span>{user?.name?.charAt(0) ?? '?'}</span>
                    )}
                  </S.Avatar>
                </S.AvatarContainer>
                <S.UserInfo>
                  <S.Username>{user?.name ?? 'Usuário'}</S.Username>
                </S.UserInfo>
              </S.ProfileSection>
            </S.HeaderContent>
          </S.ProfileHeader>
          <S.ContentArea $isDark={isDark}>
            <S.EmptyState $isDark={isDark}>
              <FaLock />
              <p>Este perfil é privado.</p>
            </S.EmptyState>
          </S.ContentArea>
        </S.ProfilePageContainer>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <S.ProfilePageContainer $isDark={isDark}>
        <S.ProfileHeader>
          <S.BackCircleButton onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </S.BackCircleButton>
          <S.HeaderContent>
            <S.ProfileSection>
              <S.AvatarContainer>
                <S.Avatar>
                  {user?.avatarUrl ? (
                    <S.AvatarImage src={resolvePublicUrl(user.avatarUrl)!} alt={user?.name ?? ''} />
                  ) : (
                    <span>{user?.name?.charAt(0) ?? '?'}</span>
                  )}
                </S.Avatar>
              </S.AvatarContainer>

              <S.UserInfo>
                <S.Username>{user?.name ?? 'Carregando...'}</S.Username>
                <S.SocialInfo>
                  {(() => {
                    const xpTotal = Number(user?.xpTotal ?? 0)
                    const level = deriveLevelFromXp(xpTotal)
                    return (
                      <>
                        <S.LevelInfo>
                          <S.LevelLabel>Nível</S.LevelLabel>
                          <S.LevelValue>{level}</S.LevelValue>
                        </S.LevelInfo>
                        <S.ProgressInfo>
                          <S.ProgressLabel>XP Total</S.ProgressLabel>
                          <S.ProgressValue>{xpTotal}</S.ProgressValue>
                        </S.ProgressInfo>
                      </>
                    )
                  })()}
                </S.SocialInfo>
              </S.UserInfo>
            </S.ProfileSection>

            <S.StatsCards>
              <S.StatCard>
                <S.StatIcon>
                  <FaTrophy />
                </S.StatIcon>
                <S.StatValue>{userRank ?? 'N/A'}</S.StatValue>
                <S.StatLabel>Rank</S.StatLabel>
              </S.StatCard>
              <S.StatCard>
                <S.StatIcon>
                  <FaMedal />
                </S.StatIcon>
                <S.StatValue>{badgesCount}</S.StatValue>
                <S.StatLabel>Emblemas</S.StatLabel>
              </S.StatCard>
              <S.StatCard>
                <S.StatIcon>
                  <FaFire />
                </S.StatIcon>
                <S.StatValue>{0}</S.StatValue>
                <S.StatLabel>Streak</S.StatLabel>
              </S.StatCard>
              <S.StatCard>
                <S.StatIcon>
                  <FaCheckCircle />
                </S.StatIcon>
                <S.StatValue>{completedCount}</S.StatValue>
                <S.StatLabel>Desafios Completos</S.StatLabel>
              </S.StatCard>
            </S.StatsCards>
          </S.HeaderContent>
        </S.ProfileHeader>

        <S.TabsContainer $isDark={isDark}>
          <S.Tabs>
            <S.Tab $active={activeTab === 'completed'} $isDark={isDark} onClick={() => setActiveTab('completed')}>
              <FaCheckCircle /> Desafios Completos
            </S.Tab>
            <S.Tab $active={activeTab === 'badges'} $isDark={isDark} onClick={() => setActiveTab('badges')}>
              <FaMedal /> Badges
            </S.Tab>
            <S.Tab $active={activeTab === 'titles'} $isDark={isDark} onClick={() => setActiveTab('titles')}>
              <FaAward /> Títulos
            </S.Tab>
            <S.Tab $active={activeTab === 'created'} $isDark={isDark} onClick={() => setActiveTab('created')}>
              <FaCode /> Desafios Criados
            </S.Tab>
          </S.Tabs>
        </S.TabsContainer>

        <S.ContentArea $isDark={isDark}>
          {activeTab === 'completed' && (
            <S.CompletedContent $isDark={isDark}>
              {loading ? (
                <S.LoadingBadges $isDark={isDark}>Carregando desafios completos...</S.LoadingBadges>
              ) : completedView.length > 0 ? (
                <S.ExercisesGrid>
                  {completedView.map((exercise: any, idx: number) => (
                    <S.ExerciseCard key={exercise.id ?? exercise._id ?? idx} $isDark={isDark}>
                      <S.ExerciseCardHeader>
                        <S.ExerciseTitle $isDark={isDark}>{exercise.title}</S.ExerciseTitle>
                        {exercise.difficulty && (
                          <S.DifficultyBadge $difficulty={exercise.difficulty} $isDark={isDark}>
                            Dificuldade: {exercise.difficulty}/5
                          </S.DifficultyBadge>
                        )}
                      </S.ExerciseCardHeader>
                      {exercise.description && (
                        <S.ExerciseDescription $isDark={isDark}>
                          {exercise.description}
                        </S.ExerciseDescription>
                      )}
                      <S.ExerciseFooter $isDark={isDark}>
                        {(exercise.baseXp ?? exercise.xpAwarded) && (
                          <S.ExerciseXp $isDark={isDark}>
                            <FaStar /> {(exercise.baseXp ?? exercise.xpAwarded)} XP
                          </S.ExerciseXp>
                        )}
                        {exercise.subject && (
                          <S.ExerciseSubject $isDark={isDark}>
                            {exercise.subject}
                          </S.ExerciseSubject>
                        )}
                      </S.ExerciseFooter>
                    </S.ExerciseCard>
                  ))}
                </S.ExercisesGrid>
              ) : (
                <S.EmptyState $isDark={isDark}>
                  <p>Este usuário ainda não completou nenhum desafio.</p>
                </S.EmptyState>
              )}
            </S.CompletedContent>
          )}

          {activeTab === 'badges' && (
            <S.BadgesContent>
              {loading ? (
                <S.LoadingBadges $isDark={isDark}>Carregando emblemas...</S.LoadingBadges>
              ) : badgesCount > 0 ? (
                <S.AllBadges>
                  {profile!.badges.map((b, index) => {
                    const icons = [FaTrophy, FaStar, FaMedal, FaAward, FaTrophy, FaStar]
                    const Icon = icons[index % icons.length]
                    const resolvedIconUrl = b.iconUrl ? resolvePublicUrl(b.iconUrl) : null
                    return (
                      <S.BadgeItem key={`${b.id}-${index}`} $isEarned={true} $colorIndex={index} title={b.name}>
                        {resolvedIconUrl ? (
                          <S.BadgeImage src={resolvedIconUrl} alt={b.name} $isDark={isDark} />
                        ) : (
                          <Icon />
                        )}
                        <S.BadgeBase $isEarned={true} />
                        <S.BadgeName $isDark={isDark}>{b.name}</S.BadgeName>
                      </S.BadgeItem>
                    )
                  })}
                </S.AllBadges>
              ) : (
                <S.NoBadgesMessage $isDark={isDark}>
                  <FaLock />
                  <p>Nenhum emblema público encontrado.</p>
                </S.NoBadgesMessage>
              )}
            </S.BadgesContent>
          )}

          {activeTab === 'titles' && (
            <S.TitlesContent $isDark={isDark}>
              <S.TitlesHeader>
                <div>
                  <S.SectionTitle $isDark={isDark}>Títulos</S.SectionTitle>
                  <S.SectionSubtitle $isDark={isDark}>Títulos conquistados pelo usuário</S.SectionSubtitle>
                </div>
                <S.FilterControls>{/* sem filtros */}</S.FilterControls>
              </S.TitlesHeader>

              {loadingTitles ? (
                <S.LoadingBadges $isDark={isDark}>Carregando títulos...</S.LoadingBadges>
              ) : earnedTitles.length > 0 ? (
                <S.TitlesGrid>
                  {earnedTitles.map((t: any) => (
                    <S.TitleCard key={t._id || t.id} $isDark={isDark}>
                      <S.TitleHeader>
                        <S.TitleName $isDark={isDark}>{t.name}</S.TitleName>
                        <S.TitleLabel $earned={true} $isDark={isDark}>✅ Conquistado</S.TitleLabel>
                      </S.TitleHeader>
                      {t.description && (
                        <S.TitleDescription $isDark={isDark}>{t.description}</S.TitleDescription>
                      )}
                    </S.TitleCard>
                  ))}
                </S.TitlesGrid>
              ) : (
                <S.NoBadgesMessage $isDark={isDark}>
                  <p>Nenhum título conquistado encontrado.</p>
                </S.NoBadgesMessage>
              )}
            </S.TitlesContent>
          )}

          {activeTab === 'created' && (
            <S.CompletedContent $isDark={isDark}>
              {loading ? (
                <S.LoadingBadges $isDark={isDark}>Carregando desafios criados...</S.LoadingBadges>
              ) : createdView.length > 0 ? (
                <S.ExercisesGrid>
                  {createdView.map((exercise: any, idx: number) => (
                    <S.ExerciseCard key={exercise.id ?? exercise._id ?? idx} $isDark={isDark}>
                      <S.ExerciseCardHeader>
                        <S.ExerciseTitle $isDark={isDark}>{exercise.title}</S.ExerciseTitle>
                        {exercise.difficulty && (
                          <S.DifficultyBadge $difficulty={exercise.difficulty} $isDark={isDark}>
                            Dificuldade: {exercise.difficulty}/5
                          </S.DifficultyBadge>
                        )}
                      </S.ExerciseCardHeader>
                      {exercise.description && (
                        <S.ExerciseDescription $isDark={isDark}>{exercise.description}</S.ExerciseDescription>
                      )}
                      <S.ExerciseFooter $isDark={isDark}>
                        {(exercise.baseXp ?? exercise.xpAwarded) && (
                          <S.ExerciseXp $isDark={isDark}>
                            <FaStar /> {(exercise.baseXp ?? exercise.xpAwarded)} XP
                          </S.ExerciseXp>
                        )}
                        {exercise.subject && (
                          <S.ExerciseSubject $isDark={isDark}>{exercise.subject}</S.ExerciseSubject>
                        )}
                        {exercise.status && (
                          <S.ExerciseSubject $isDark={isDark}>
                            Status: {exercise.status === 'PUBLISHED' ? 'Publicado' : exercise.status === 'DRAFT' ? 'Rascunho' : 'Arquivado'}
                          </S.ExerciseSubject>
                        )}
                      </S.ExerciseFooter>
                    </S.ExerciseCard>
                  ))}
                </S.ExercisesGrid>
              ) : (
                <S.EmptyState $isDark={isDark}>
                  <p>Este usuário ainda não criou nenhum desafio.</p>
                </S.EmptyState>
              )}
            </S.CompletedContent>
          )}
        </S.ContentArea>
      </S.ProfilePageContainer>
    </AuthenticatedLayout>
  )
}