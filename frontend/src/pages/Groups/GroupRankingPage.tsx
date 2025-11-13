import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import { leaderboardService } from "@services/leaderboard.service";
import { groupService } from "@services/group.service";
import { useTheme } from "@contexts/ThemeContext";
import * as S from "@/styles/pages/Ranking/styles";

export default function GroupRankingPage() {
  const { id: groupId } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      if (!groupId) return;
      setLoading(true);
      try {
        const [lb, group] = await Promise.all([
          leaderboardService.getByGroup(groupId, { page: currentPage, limit: 10 }),
          groupService.getById(groupId),
        ]);
        if (!mounted) return;
        setLeaderboard(lb);
        setGroupName(group.name || "Grupo");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      mounted = false;
    };
  }, [groupId, currentPage]);

  const getMedalIcon = (position: number) => {
    if (position === 1) return { icon: "trophy", color: "gold" } as const;
    if (position === 2) return { icon: "medal", color: "silver" } as const;
    if (position === 3) return { icon: "medal", color: "bronze" } as const;
    return null;
  };

  return (
    <AuthenticatedLayout>
      <S.RankingPage $isDark={isDark}>
        <S.HeroSection>
          <S.HeroContent>
            <S.HeroTitle>Ranking do Grupo</S.HeroTitle>
            <S.HeroSubtitle>{groupName}</S.HeroSubtitle>
          </S.HeroContent>
          <S.YellowDecoration />
        </S.HeroSection>

        <S.ContentSection>
          <S.MainContent $isDark={isDark}>
            <S.SectionHeader $isDark={isDark}>
              <S.SectionIcon>🏆</S.SectionIcon>
              <S.SectionTitle $isDark={isDark}>TOP 10 do Grupo</S.SectionTitle>
            </S.SectionHeader>

            <S.LeaderboardTable>
              <S.TableHeader $isDark={isDark}>
                <S.HeaderCell width="10%">Posição</S.HeaderCell>
                <S.HeaderCell width="40%">Nome</S.HeaderCell>
                <S.HeaderCell width="25%">Pontos</S.HeaderCell>
                <S.HeaderCell width="25%">Pontuação</S.HeaderCell>
              </S.TableHeader>

              <S.TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <S.TableRow key={`skeleton-${index}`} $isDark={isDark}>
                      <S.TableCell>
                        <S.SkeletonText width="30px" $isDark={isDark} />
                      </S.TableCell>
                      <S.TableCell>
                        <S.SkeletonAvatar $isDark={isDark} />
                        <S.SkeletonText width="120px" $isDark={isDark} />
                      </S.TableCell>
                      <S.TableCell>
                        <S.SkeletonText width="60px" $isDark={isDark} />
                      </S.TableCell>
                      <S.TableCell>
                        <S.SkeletonText width="40px" $isDark={isDark} />
                      </S.TableCell>
                    </S.TableRow>
                  ))
                ) : leaderboard && leaderboard.length > 0 ? (
                  leaderboard.map((entry) => {
                    const medal = getMedalIcon(entry.position);
                    return (
                      <S.TableRow key={entry.userId} $isDark={isDark}>
                        <S.TableCell>
                          <S.PositionBadge position={entry.position}>
                            {entry.position}º
                          </S.PositionBadge>
                        </S.TableCell>
                        <S.TableCell>
                          <S.UserInfo>
                            {entry.avatarUrl ? (
                              <S.UserAvatarImg src={entry.avatarUrl} alt={entry.name} />
                            ) : (
                              <S.UserAvatar>{entry.name?.charAt(0)}</S.UserAvatar>
                            )}
                            <Link to={`/perfil/${entry.userId}`} style={{ textDecoration: 'none' }}>
                              <S.UserNameLink $isDark={isDark}>{entry.name}</S.UserNameLink>
                            </Link>
                          </S.UserInfo>
                        </S.TableCell>
                        <S.TableCell>
                          <S.Points>{entry.points} pts</S.Points>
                        </S.TableCell>
                        <S.TableCell>
                          {medal ? (
                            <S.MedalIcon color={medal.color as any}>
                              {medal.icon === 'trophy' ? '🏆' : '🥇'}
                            </S.MedalIcon>
                          ) : (
                            <S.XpBadge $isDark={isDark}>{entry.xpTotal}</S.XpBadge>
                          )}
                        </S.TableCell>
                      </S.TableRow>
                    );
                  })
                ) : (
                  <S.NoDataRow $isDark={isDark}>
                    <S.NoDataCell colSpan={4}>
                      <S.NoDataMessage $isDark={isDark}>
                        Nenhum dado disponível no momento.
                      </S.NoDataMessage>
                    </S.NoDataCell>
                  </S.NoDataRow>
                )}
              </S.TableBody>
            </S.LeaderboardTable>

            {!loading && leaderboard && leaderboard.length > 0 && (
              <S.Pagination $isDark={isDark}>
                <S.PaginationDot
                  active={currentPage === 1}
                  $isDark={isDark}
                  onClick={() => setCurrentPage(1)}
                />
                <S.PaginationDot
                  active={currentPage === 2}
                  $isDark={isDark}
                  onClick={() => setCurrentPage(2)}
                />
                <S.PaginationDot
                  active={currentPage === 3}
                  $isDark={isDark}
                  onClick={() => setCurrentPage(3)}
                />
              </S.Pagination>
            )}
          </S.MainContent>
        </S.ContentSection>
      </S.RankingPage>
    </AuthenticatedLayout>
  );
}