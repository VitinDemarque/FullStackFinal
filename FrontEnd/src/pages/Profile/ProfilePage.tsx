import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useAsync } from "@hooks/useAsync";
import { userService } from "@services/user.service";
import { api, resolvePublicUrl } from "@services/api";
import { titlesService } from "@services/titles.service";
import { getProgressToNextLevel, deriveLevelFromXp } from "@utils/levels";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import {
  FaUser,
  FaTrophy,
  FaStar,
  FaMedal,
  FaAward,
  FaEdit,
  FaLock,
} from "react-icons/fa";
import * as S from "@/styles/pages/Profile/styles";

interface Badge {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  type: "gold" | "silver" | "bronze" | "special";
  earned?: boolean;
  requirement?: string;
}

interface Title {
  _id: string;
  name: string;
  description?: string;
  minLevel?: number;
  minXp?: number;
}

interface UserTitleItem {
  title: string | Title;
  awardedAt?: string;
  active?: boolean;
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const {
    data: scoreboard,
    loading,
    execute,
  } = useAsync(() => userService.getScoreboard(user!.id), false);

  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [userBadgeRarity, setUserBadgeRarity] = useState<Record<string, 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'>>({});
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [allTitles, setAllTitles] = useState<Title[]>([]);
  const [userTitles, setUserTitles] = useState<UserTitleItem[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(true);

  useEffect(() => {
    if (user) {
      execute();
      loadBadges();
      loadTitles();

      if (user.avatarUrl) {
        setProfileImage(user.avatarUrl);
      } else {
        setProfileImage(null);
      }
    }
  }, [user?.id, user?.avatarUrl]);

  async function loadBadges() {
    try {
      setLoadingBadges(true);

      const badgesResponse = await api.get("/badges");
      const allBadgesData =
        badgesResponse.data.items ||
        badgesResponse.data.data ||
        badgesResponse.data;

      const userBadgesResponse = await api.get(`/users/${user?.id}/badges`);
      const userBadgesData = userBadgesResponse.data || [];

      const earnedBadgeIds = userBadgesData.map((ub: any) =>
        typeof ub.badge === "string" ? ub.badge : ub.badge?._id
      );
      const rarityMap: Record<string, 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'> = {};
      userBadgesData.forEach((ub: any) => {
        const bid = typeof ub.badge === 'string' ? ub.badge : ub.badge?._id;
        const src = ub.source || '';
        const match = String(src).match(/exercise(?:Complete|HighScore):(COMMON|RARE|EPIC|LEGENDARY)/);
        rarityMap[bid] = (match?.[1] as any) || rarityMap[bid] || 'COMMON';
      });

      setAllBadges(Array.isArray(allBadgesData) ? allBadgesData : []);
      setUserBadges(earnedBadgeIds);
      setUserBadgeRarity(rarityMap);
    } catch (error) {
      setAllBadges(createMockBadges());
      setUserBadges([]);
    } finally {
      setLoadingBadges(false);
    }
  }

  async function loadTitles() {
    try {
      setLoadingTitles(true);
      const [titlesRes, userTitlesRes] = await Promise.all([
        titlesService.listAll(),
        titlesService.getUserTitles(user!.id),
      ]);
      const items = (titlesRes as any)?.items || (titlesRes as any)?.data || titlesRes;
      setAllTitles(Array.isArray(items) ? items : []);
      setUserTitles(Array.isArray(userTitlesRes as any) ? (userTitlesRes as any) : []);
    } catch (err) {
      setAllTitles([]);
      setUserTitles([]);
    } finally {
      setLoadingTitles(false);
    }
  }

  function createMockBadges(): Badge[] {
    return [
      {
        _id: "1",
        name: "Primeiro Desafio",
        description: "Complete seu primeiro desafio",
        type: "bronze",
        requirement: "1 desafio",
      },
      {
        _id: "2",
        name: "10 Desafios",
        description: "Complete 10 desafios",
        type: "silver",
        requirement: "10 desafios",
      },
      {
        _id: "3",
        name: "50 Desafios",
        description: "Complete 50 desafios",
        type: "bronze",
        requirement: "50 desafios",
      },
      {
        _id: "4",
        name: "Streak 7 dias",
        description: "Pratique 7 dias seguidos",
        type: "special",
        requirement: "7 dias consecutivos",
      },
      {
        _id: "5",
        name: "100 Desafios",
        description: "Complete 100 desafios",
        type: "bronze",
        requirement: "100 desafios",
      },
      {
        _id: "6",
        name: "Mestre Python",
        description: "Domine Python",
        type: "gold",
        requirement: "50 desafios Python",
      },
      {
        _id: "7",
        name: "JavaScript Pro",
        description: "Expert em JavaScript",
        type: "silver",
        requirement: "50 desafios JS",
      },
      {
        _id: "8",
        name: "500 XP",
        description: "Alcance 500 XP",
        type: "bronze",
        requirement: "500 XP",
      },
      {
        _id: "9",
        name: "Top 100",
        description: "Entre no top 100",
        type: "special",
        requirement: "Top 100 ranking",
      },
      {
        _id: "10",
        name: "1000 XP",
        description: "Alcance 1000 XP",
        type: "silver",
        requirement: "1000 XP",
      },
      {
        _id: "11",
        name: "Speed Runner",
        description: "Complete em tempo recorde",
        type: "gold",
        requirement: "Tempo < 5min",
      },
      {
        _id: "12",
        name: "Perfect Score",
        description: "Nota 100% em desafio",
        type: "silver",
        requirement: "100% score",
      },
      {
        _id: "13",
        name: "Code Master",
        description: "Domine as estruturas",
        type: "bronze",
        requirement: "30 desafios",
      },
      {
        _id: "14",
        name: "Team Player",
        description: "Participe de grupos",
        type: "bronze",
        requirement: "Entre em 1 grupo",
      },
      {
        _id: "15",
        name: "Bug Hunter",
        description: "Encontre e corrija bugs",
        type: "bronze",
        requirement: "10 bugs corrigidos",
      },
      {
        _id: "16",
        name: "Algorithm Expert",
        description: "Expert em algoritmos",
        type: "silver",
        requirement: "20 algoritmos",
      },
      {
        _id: "17",
        name: "Database Guru",
        description: "Mestre em bancos de dados",
        type: "bronze",
        requirement: "15 BD desafios",
      },
      {
        _id: "18",
        name: "API Master",
        description: "Expert em APIs",
        type: "gold",
        requirement: "25 APIs criadas",
      },
    ];
  }

  const earnedBadges = allBadges.filter((b: any) => userBadges.includes(b._id));

  function getTitleProgress(t: Title) {
    const minLevel = Number(t.minLevel ?? 0);
    const minXp = Number(t.minXp ?? 0);
    const earned = userTitles.some((ut) => {
      const tid = typeof ut.title === 'string' ? ut.title : (ut.title as any)?._id;
      return tid && String(tid) === String(t._id);
    });

    const levelProgress = minLevel > 0 ? Math.min(100, (currentLevel / minLevel) * 100) : 0;
    const xpProgress = minXp > 0 ? Math.min(100, (currentXpTotal / minXp) * 100) : 0;
    const rawPercent = Math.round(Math.min(100, Math.max(levelProgress, xpProgress)));
    const percent = earned ? 100 : rawPercent;

    const remainingLevel = minLevel > 0 ? Math.max(0, minLevel - currentLevel) : 0;
    const remainingXp = minXp > 0 ? Math.max(0, minXp - currentXpTotal) : 0;
    const label = earned
      ? 'Conquistado'
      : minLevel > 0 && minXp > 0
        ? `Falta ${remainingLevel} níveis e ${remainingXp} XP`
        : minLevel > 0
          ? `Falta ${remainingLevel} níveis`
          : minXp > 0
            ? `Falta ${remainingXp} XP`
            : 'Em progresso';

    return { earned, percent, label };
  }

  function getTitleHint(t: Title) {
    // Frases fixas por título (hover). Chave: nome em minúsculas
    const requirementHints: Record<string, string> = {
      'primeiro de muitos': 'Conclua 1 Desafio',
      'destrava códigos': 'Conclua 5 Desafios',
      'dev em ascensão': 'Conclua 10 Desafios',
      'mão na massa': 'Conclua 25 Desafios',
      'ligeirinho da lógica': 'Conclua 50 Desafios',
      'lenda do terminal': 'Conclua 100 Desafios',

      'criador de bugs': 'Criei 1 Desafio',
      'arquiteto de ideias': 'Criei 5 Desafio',
      'engenheiro de lógica': 'Criei 10 Desafio',
      'sensei do código': 'Criei 25 Desafio',

      'embalado no código': '3 acertos seguidos em 24h',
      'modo turbo': '5 acertos seguidos em 24h',
      'imparável': '10 acertos seguidos em 24h',
      'ligeirinho': 'Concluir um desafio em menos de 1 min',

      'palpiteiro de primeira viagem': 'Comenta 1 vez no forum',
      'conselheiro de plantão': 'Comenta 10 vezes no forum',
      'guru da comunidade': 'Comenta 25 vezes no forum',

      'quebrador de gelo': 'Criei 1 tópico',
      'gerador de ideias': 'Criei 5 tópicos',
      'debatedor nato': 'Criei 10 tópicos',
      'voz do fórum': 'Criei 25 tópicos',

      'recruta do código': 'Entre em 1 grupo',
      'integrador': 'Entre em 5 grupos',
      'conectadão': 'Entre em 10 grupos',

      'fundador de equipe': 'Criei 1 grupo',
      'líder de stack': 'Criei 3 grupos',
      'gestor do caos': 'Criei 5 grupos',
      'senhor das comunidades': 'Criei 10 grupos',

      'explorador do código': 'Faça Login 1 dia consecutivo',
      'dev constante': 'Faça Login 7 dias consecutivos',
      'perfect coder': 'Conclua um desafio sem erra nada',
    };

    const earned = userTitles.some((ut) => {
      const tid = typeof ut.title === 'string' ? ut.title : (ut.title as any)?._id;
      return tid && String(tid) === String(t._id);
    });

    if (earned) {
      const ut = userTitles.find((u) => {
        const tid = typeof u.title === 'string' ? u.title : (u.title as any)?._id;
        return tid && String(tid) === String(t._id);
      });
      const when = ut?.awardedAt ? new Date(ut.awardedAt).toLocaleDateString() : undefined;
      return `✅ Conquistado${when ? ` em ${when}` : ''}`;
    }

    const solved = Number((scoreboard as any)?.solved ?? 0);
    const created = Number((scoreboard as any)?.created ?? 0);

    // Mapeamento de requisitos por título (foco no que precisa fazer)
    const name = (t.name || '').toLowerCase().trim();
    if (requirementHints[name]) {
      return requirementHints[name];
    }

    // Padrão: usar a descrição como pista e orientar ação
    if (t.description) {
      return `Para ganhar: ${t.description}`;
    }
    return 'Para ganhar: conclua desafios, participe do fórum ou grupos.';
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB");
      return;
    }

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        try {
          const updated = await userService.uploadAvatar(dataUrl);
          const resolved = resolvePublicUrl(updated.avatarUrl || null);
          setProfileImage(resolved);
          updateUser({ avatarUrl: resolved || null });
          alert("✅ Foto de perfil atualizada com sucesso!");
        } catch (err) {
          alert("❌ Erro ao enviar a imagem ao servidor.");
        } finally {
          setShowImageUpload(false);
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("❌ Erro ao processar a imagem.");
      setUploadingImage(false);
    }
  }

  async function handleRemoveImage() {
    if (confirm("Tem certeza que deseja remover sua foto de perfil?")) {
      try {
        const updated = await userService.updateMe({ avatarUrl: null });
        setProfileImage(null);
        const resolved = resolvePublicUrl(updated.avatarUrl || null);
        updateUser({ avatarUrl: resolved || null });
        alert("✅ Foto de perfil removida!");
      } catch (err) {
        alert("❌ Erro ao remover a foto no servidor.");
      }
    }
  }

  if (!user) return null;

  const currentXpTotal = (user as any).xpTotal ?? 0;
  const currentLevel = deriveLevelFromXp(currentXpTotal);
  const { withinLevelXp, nextRequirement, percent: xpPercent } = getProgressToNextLevel(currentXpTotal, currentLevel);
  const hasAnyBadge = userBadges.length > 0;

  return (
    <AuthenticatedLayout>
      <S.ProfilePage>
        <S.ProfileHero>
          <S.EditButton onClick={() => navigate("/profile/editar")}>
            <FaEdit /> Editar Perfil
          </S.EditButton>

          <S.AvatarContainer>
            <S.Avatar>
              {profileImage ? (
                <S.AvatarImage src={profileImage} alt="Perfil" />
              ) : (
                <FaUser />
              )}
            </S.Avatar>
            <S.AvatarEditButton
              onClick={() => document.getElementById("avatar-input")?.click()}
              title="Alterar foto"
            >
              <FaEdit />
            </S.AvatarEditButton>
            <S.HiddenInput
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </S.AvatarContainer>

          {showImageUpload && (
            <S.ImageUploadOptions>
              <S.UploadButton
                onClick={() => document.getElementById("avatar-input")?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? "Enviando..." : "📷 Escolher Foto"}
              </S.UploadButton>
              {profileImage && (
                <S.RemoveButton onClick={handleRemoveImage}>
                  🗑️ Remover Foto
                </S.RemoveButton>
              )}
            </S.ImageUploadOptions>
          )}

          <S.ProfileName>{user.name}</S.ProfileName>

          <S.BadgeIcon>
            <FaMedal />
          </S.BadgeIcon>

          <S.ProfileStats>
            <S.StatItem>
              <S.StatLabel>Nível</S.StatLabel>
              <S.StatValue>{currentLevel}</S.StatValue>
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel>XP no nível</S.StatLabel>
              <S.StatValue>{withinLevelXp}/{nextRequirement}</S.StatValue>
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel>XP total</S.StatLabel>
              <S.StatValue>{currentXpTotal}</S.StatValue>
            </S.StatItem>
          </S.ProfileStats>

          <S.XpProgressContainer>
            <S.XpProgressBar>
              <S.XpProgressFill $progress={xpPercent} />
            </S.XpProgressBar>
            <S.XpProgressPercentContainer>
              <S.XpProgressPercent $progress={xpPercent}>
                {Math.round(xpPercent)}%
              </S.XpProgressPercent>
            </S.XpProgressPercentContainer>
          </S.XpProgressContainer>
        </S.ProfileHero>

        <S.AchievementsSection>
          <S.SectionTitle>
            {"<"}EMBLEMAS TRIUNFANTES{">"}
          </S.SectionTitle>
          <S.SectionSubtitle>
            Somente conquistas de maior prestígio ficam aqui
          </S.SectionSubtitle>

          {loadingBadges ? (
            <S.LoadingBadges>Carregando emblemas...</S.LoadingBadges>
          ) : earnedBadges.length > 0 ? (
            <S.AllBadges>
              {earnedBadges.map((badge, index) => {
                const icons = [FaTrophy, FaStar, FaMedal, FaAward, FaTrophy, FaStar];
                const Icon = icons[index % icons.length];
                const rarity = userBadgeRarity[badge._id] || 'COMMON';
                return (
                  <S.BadgeItem
                    key={badge._id}
                    isEarned={true}
                    colorIndex={index}
                    title={badge.name}
                  >
                    <Icon />
                    <S.BadgeBase isEarned={true} />
                  </S.BadgeItem>
                );
              })}
            </S.AllBadges>
          ) : (
            <S.NoBadgesMessage>
              <FaLock />
              <p>Nenhum emblema conquistado ainda.</p>
            </S.NoBadgesMessage>
          )}
        </S.AchievementsSection>

        <S.AchievementsSection>
          <S.SectionTitle>{"<"}TITULOS{">"}</S.SectionTitle>
          <S.SectionSubtitle>
            Seus titulos ficam aqui
          </S.SectionSubtitle>

          {loadingTitles ? (
            <S.LoadingBadges>Carregando títulos...</S.LoadingBadges>
          ) : allTitles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', margin: 0, justifyItems: 'start', alignItems: 'stretch' }}>
              {allTitles.map((t) => {
                const { earned, percent, label } = getTitleProgress(t)
                return (
                  <div
                    key={t._id}
                    title={getTitleHint(t)}
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      height: '100%',
                      minHeight: 160,
                      boxSizing: 'border-box',
                      width: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{t.name}</strong>
                      <span style={{ fontSize: '0.875rem', color: earned ? 'var(--color-green-500)' : 'var(--color-text-secondary)' }}>
                        {earned ? '✅' : '🔒'} {label}
                      </span>
                    </div>
                    {t.description && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{t.description}</div>
                    )}
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 9999, overflow: 'hidden' }}>
                        <div style={{ width: `${percent}%`, height: 8, background: 'var(--gradient-blue)' }} />
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{percent}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <S.NoBadgesMessage>
              <p>Nenhum título cadastrado.</p>
            </S.NoBadgesMessage>
          )}
        </S.AchievementsSection>
      </S.ProfilePage>
    </AuthenticatedLayout>
  );
}
