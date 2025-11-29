import { useState, useEffect } from "react";
import { FaTrophy, FaMedal, FaUsers, FaCog } from "react-icons/fa";
import { motion, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import { leaderboardService } from "@services/leaderboard.service";
import { useFetch } from "@hooks/useFetch";
import { useTheme } from "@contexts/ThemeContext";
import { resolvePublicUrl } from "@services/api";
import * as S from "@/styles/pages/Ranking/styles";

// Componente para animação de contagem
const AnimatedNumber = ({ value }: { value: number }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 30 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span style={{ display: 'inline-block' }}>{display}</motion.span>;
};

export default function RankingPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { data: leaderboard, loading } = useFetch(
    () =>
      leaderboardService.getGeneralLeaderboard({
        page: 1,
        limit: 50, // Buscar mais para ter top 3 e tabela
      }),
    {
      immediate: true,
      dependencies: [],
    }
  );

  // Calcular estatísticas baseado no leaderboard
  const totalRegistered = leaderboard?.length || 0;
  const totalParticipated = leaderboard?.filter(u => u.points > 0).length || 0;
  const topThree = leaderboard?.slice(0, 3) || [];
  const globalRanking = leaderboard || [];

  // Dados reais vindos do backend
  const getEntryStats = (entry: any) => {
    return {
      level: entry.level ?? 1,
      xpTotal: entry.xpTotal || entry.points,
      points: entry.points,
      completedChallenges: entry.completedChallenges || 0,
    };
  };

  const getMedalIcon = (position: number) => {
    if (position === 1) return { icon: <FaTrophy />, color: "gold" };
    if (position === 2) return { icon: <FaMedal />, color: "silver" };
    if (position === 3) return { icon: <FaMedal />, color: "bronze" };
    return null;
  };

  return (
    <AuthenticatedLayout>
      <S.RankingPage $isDark={isDark}>
        <S.HeroSection $isDark={isDark}>
          <S.HeroContent>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <S.HeroTitle $isDark={isDark}>Leaderboard</S.HeroTitle>
            </motion.div>
          </S.HeroContent>
          {!isDark && <S.YellowDecoration />}
        </S.HeroSection>

        <S.ContentSection>
          {/* Cards de Estatísticas */}
          <S.StatsCardsContainer>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <S.StatCard $isDark={isDark}>
                <S.StatIcon $color="#10b981">
                  <FaUsers />
                </S.StatIcon>
                <S.StatContent>
                  <S.StatValue $isDark={isDark}>
                    <AnimatedNumber value={totalRegistered} />
                  </S.StatValue>
                  <S.StatLabel $isDark={isDark}>Total Registrados</S.StatLabel>
                </S.StatContent>
              </S.StatCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <S.StatCard $isDark={isDark}>
                <S.StatIcon $color="#3b82f6">
                  <FaCog />
                </S.StatIcon>
                <S.StatContent>
                  <S.StatValue $isDark={isDark}>
                    <AnimatedNumber value={totalParticipated} />
                  </S.StatValue>
                  <S.StatLabel $isDark={isDark}>Total Participaram</S.StatLabel>
                </S.StatContent>
              </S.StatCard>
            </motion.div>
          </S.StatsCardsContainer>

          {/* Top 3 Cards */}
          {!loading && topThree.length > 0 && (
            <S.TopThreeContainer>
              {topThree.map((entry, index) => {
                const position = index + 1;
                const avatarSrc = entry.avatarUrl
                  ? resolvePublicUrl(entry.avatarUrl) ?? entry.avatarUrl
                  : null;
                const medal = getMedalIcon(position);

                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.4 + (index * 0.1),
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <S.TopThreeCard 
                      $position={position} 
                      $isDark={isDark}
                      onClick={() => navigate(`/perfil/${entry.userId}`)}
                    >
                      <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.6 + (index * 0.1), duration: 0.6, type: "spring" }}
                      >
                        <S.TopThreeMedal $position={position}>
                          {medal?.icon}
                        </S.TopThreeMedal>
                      </motion.div>
                      <S.TopThreeAvatarContainer>
                        {avatarSrc ? (
                          <S.TopThreeAvatarImg src={avatarSrc} alt={entry.name} $isDark={isDark} />
                        ) : (
                          <S.TopThreeAvatar $isDark={isDark}>
                            {entry.name.charAt(0)}
                          </S.TopThreeAvatar>
                        )}
                        <S.TopThreeBadge $position={position}>
                          {position}
                        </S.TopThreeBadge>
                      </S.TopThreeAvatarContainer>
                      <S.TopThreeName $isDark={isDark}>{entry.name}</S.TopThreeName>
                      <S.TopThreeHandle $isDark={isDark}>@{entry.handle || 'user'}</S.TopThreeHandle>
                      <S.TopThreeStats $isDark={isDark}>
                        {(() => {
                          const stats = getEntryStats(entry);
                          return (
                            <>
                              <S.TopThreeStatItem $isDark={isDark}>
                                <span>DESAFIOS</span>
                                <strong>{stats.completedChallenges}</strong>
                              </S.TopThreeStatItem>
                              <S.TopThreeStatItem $isDark={isDark}>
                                <span>NÍVEL</span>
                                <strong>{stats.level}</strong>
                              </S.TopThreeStatItem>
                              <S.TopThreeStatItem $isDark={isDark}>
                                <span>XP TOTAL</span>
                                <strong>{stats.xpTotal.toLocaleString()}</strong>
                              </S.TopThreeStatItem>
                            </>
                          );
                        })()}
                      </S.TopThreeStats>
                    </S.TopThreeCard>
                  </motion.div>
                );
              })}
            </S.TopThreeContainer>
          )}

          {/* Tabela Global Ranking */}
          <S.MainContent $isDark={isDark}>
            <S.SectionHeader $isDark={isDark}>
              <S.SectionIcon>
                <FaTrophy />
              </S.SectionIcon>
              <S.SectionTitle $isDark={isDark}>Ranking Global</S.SectionTitle>
            </S.SectionHeader>

            <S.LeaderboardTable $noScroll>
              <S.TableHeader $isDark={isDark}>
                <S.HeaderCell width="8%" $isDark={isDark}>Rank</S.HeaderCell>
                <S.HeaderCell width="30%" $isDark={isDark}>Nome do Usuário</S.HeaderCell>
                <S.HeaderCell width="15%" $isDark={isDark}>Desafios Feitos</S.HeaderCell>
                <S.HeaderCell width="12%" $isDark={isDark}>Nível</S.HeaderCell>
                <S.HeaderCell width="15%" $isDark={isDark}>XP Total</S.HeaderCell>
                <S.HeaderCell width="15%" $isDark={isDark}>Pontos</S.HeaderCell>
              </S.TableHeader>

              <S.TableBody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <S.TableRow key={`skeleton-${index}`} $isDark={isDark}>
                      <S.TableCell $isDark={isDark}>
                        <S.SkeletonText width="30px" $isDark={isDark} />
                      </S.TableCell>
                      <S.TableCell $isDark={isDark}>
                        <S.SkeletonAvatar $isDark={isDark} />
                        <S.SkeletonText width="120px" $isDark={isDark} />
                      </S.TableCell>
                      <S.TableCell $isDark={isDark}>
                      <S.SkeletonText width="40px" $isDark={isDark} />
                    </S.TableCell>
                    <S.TableCell $isDark={isDark}>
                      <S.SkeletonText width="40px" $isDark={isDark} />
                    </S.TableCell>
                    <S.TableCell $isDark={isDark}>
                      <S.SkeletonText width="50px" $isDark={isDark} />
                    </S.TableCell>
                    <S.TableCell $isDark={isDark}>
                      <S.SkeletonText width="60px" $isDark={isDark} />
                      </S.TableCell>
                    </S.TableRow>
                  ))
                ) : globalRanking.length > 0 ? (
                  globalRanking.map((entry, index) => {
                    const stats = getEntryStats(entry);
                    const avatarSrc = entry.avatarUrl
                      ? resolvePublicUrl(entry.avatarUrl) ?? entry.avatarUrl
                      : null;

                    const AnimatedTableRow = motion(S.TableRow);

                    return (
                      <AnimatedTableRow
                        key={entry.userId}
                        $isDark={isDark}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ x: 5, transition: { duration: 0.2 } }}
                        onClick={() => navigate(`/perfil/${entry.userId}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <S.TableCell $isDark={isDark}>
                          <S.PositionBadge $position={entry.position}>
                            {entry.position}º
                          </S.PositionBadge>
                        </S.TableCell>
                        <S.TableCell $isDark={isDark}>
                          <S.UserInfo>
                            {avatarSrc ? (
                              <S.UserAvatarImg src={avatarSrc} alt={entry.name} />
                            ) : (
                              <S.UserAvatar>{entry.name.charAt(0)}</S.UserAvatar>
                            )}
                            <S.UserNameLink to={`/perfil/${entry.userId}`} $isDark={isDark}>
                              {entry.name}
                            </S.UserNameLink>
                          </S.UserInfo>
                        </S.TableCell>
                        <S.TableCell $isDark={isDark}>
                          <S.StatValueSmall $isDark={isDark}>{stats.completedChallenges}</S.StatValueSmall>
                        </S.TableCell>
                        <S.TableCell $isDark={isDark}>
                          <S.StatValueSmall $isDark={isDark}>Nível {stats.level}</S.StatValueSmall>
                        </S.TableCell>
                        <S.TableCell $isDark={isDark}>
                          <S.StatValueSmall $isDark={isDark}>{stats.xpTotal.toLocaleString()}</S.StatValueSmall>
                        </S.TableCell>
                        <S.TableCell $isDark={isDark}>
                          <S.Points>{entry.points.toLocaleString()}</S.Points>
                        </S.TableCell>
                      </AnimatedTableRow>
                    );
                  })
                ) : (
                  <S.NoDataRow $isDark={isDark}>
                    <S.NoDataCell colSpan={6}>
                      <S.NoDataMessage $isDark={isDark}>
                        Nenhum dado disponível no momento.
                      </S.NoDataMessage>
                    </S.NoDataCell>
                  </S.NoDataRow>
                )}
              </S.TableBody>
            </S.LeaderboardTable>

          </S.MainContent>
        </S.ContentSection>
      </S.RankingPage>
    </AuthenticatedLayout>
  );
}
