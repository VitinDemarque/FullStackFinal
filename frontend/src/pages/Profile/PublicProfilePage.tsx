import { useParams } from 'react-router-dom'
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout'
import { useFetch } from '@hooks/useFetch'
import { userService } from '@services/user.service'
import * as S from '@/styles/pages/Profile/styles'
import { resolvePublicUrl } from '@services/api'
import { FaAward } from 'react-icons/fa'

export default function PublicProfilePage() {
  const { id } = useParams()

  const { data: profile, loading } = useFetch(
    () => userService.getPublicProfile(id as string),
    { immediate: true, dependencies: [id] }
  )

  const user = profile?.user

  return (
    <AuthenticatedLayout>
      <S.ProfilePage>
        <S.ProfileHero>
          <S.AvatarContainer>
            <S.Avatar>
              {user?.avatarUrl ? (
                <S.AvatarImage src={resolvePublicUrl(user.avatarUrl)!} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0) ?? '?'}</span>
              )}
            </S.Avatar>
          </S.AvatarContainer>

          <S.ProfileName>{user?.name ?? 'Carregando...'}</S.ProfileName>

          <S.ProfileStats>
            <S.StatItem>
              <S.StatLabel>Desafios Criados</S.StatLabel>
              <S.StatValue>{profile?.scoreboard.created ?? 0}</S.StatValue>
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel>Desafios Resolvidos</S.StatLabel>
              <S.StatValue>{profile?.scoreboard.solved ?? 0}</S.StatValue>
            </S.StatItem>
          </S.ProfileStats>
        </S.ProfileHero>

        <S.AchievementsSection>
          <S.SectionTitle>Badges</S.SectionTitle>
          <S.SectionSubtitle>Conquistas públicas do usuário</S.SectionSubtitle>

          {loading ? (
            <S.LoadingBadges>Carregando perfil...</S.LoadingBadges>
          ) : profile && profile.badges && profile.badges.length > 0 ? (
            <S.AllBadges>
              {profile.badges.map((b, i) => (
                <S.BadgeItem key={`${b.id}-${i}`} isEarned={true} colorIndex={(i % 6) + 1}>
                  {b.iconUrl ? (
                    <img src={b.iconUrl} alt={b.name} style={{ width: 40, height: 40 }} />
                  ) : (
                    <FaAward />
                  )}
                  <S.BadgeBase isEarned={true} />
                </S.BadgeItem>
              ))}
            </S.AllBadges>
          ) : (
            <S.NoBadgesMessage>
              <p>Nenhuma badge pública encontrada.</p>
            </S.NoBadgesMessage>
          )}
        </S.AchievementsSection>
      </S.ProfilePage>
    </AuthenticatedLayout>
  )
}