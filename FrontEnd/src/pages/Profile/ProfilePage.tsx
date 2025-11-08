import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useAsync } from "@hooks/useAsync";
import { userService } from "@services/user.service";
import { api } from "@services/api";
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
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  useEffect(() => {
    if (user) {
      execute();
      loadBadges();

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

      setAllBadges(Array.isArray(allBadgesData) ? allBadgesData : []);
      setUserBadges(earnedBadgeIds);
    } catch (error) {
      setAllBadges(createMockBadges());
      setUserBadges([]);
    } finally {
      setLoadingBadges(false);
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

  const topBadges = allBadges
    .filter((badge) => userBadges.includes(badge._id) && badge.type === "gold")
    .slice(0, 3);

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
          setProfileImage(updated.avatarUrl || null);
          updateUser({ avatarUrl: updated.avatarUrl || null });
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
        updateUser({ avatarUrl: updated.avatarUrl || null });
        alert("✅ Foto de perfil removida!");
      } catch (err) {
        alert("❌ Erro ao remover a foto no servidor.");
      }
    }
  }

  if (!user) return null;

  const xpPercent = ((user.xp || 0) / 800) * 100;
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
              <S.StatValue>{user.level || 7}</S.StatValue>
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel>Experiência</S.StatLabel>
              <S.StatValue>{user.xp || 730}/800</S.StatValue>
            </S.StatItem>
          </S.ProfileStats>

          <S.XpProgressContainer>
            <S.XpProgressBar>
              <S.XpProgressFill $progress={xpPercent} />
            </S.XpProgressBar>
          </S.XpProgressContainer>
        </S.ProfileHero>

        <S.AchievementsSection>
          <S.SectionTitle>
            {"<"}CONQUISTAS TRIUNFANTES{">"}
          </S.SectionTitle>
          <S.SectionSubtitle>
            Somente conquistas de maior prestígio ficam aqui
          </S.SectionSubtitle>

          {loadingBadges ? (
            <S.LoadingBadges>Carregando conquistas...</S.LoadingBadges>
          ) : hasAnyBadge && topBadges.length > 0 ? (
            <S.TopBadges>
              {topBadges.map((badge, index) => (
                <S.TopBadge key={badge._id}>
                  <S.BadgeTrophy position={(index + 1) as 1 | 2 | 3}>
                    <FaTrophy />
                  </S.BadgeTrophy>
                  <S.BadgePedestal />
                </S.TopBadge>
              ))}
            </S.TopBadges>
          ) : (
            <S.NoBadgesMessage>
              <FaLock />
              <p>
                Complete desafios para desbloquear suas primeiras conquistas!
              </p>
            </S.NoBadgesMessage>
          )}
        </S.AchievementsSection>

        <S.AchievementsSection>
          <S.SectionTitle>
            {"<"}CONQUISTAS{">"}
          </S.SectionTitle>

          {loadingBadges ? (
            <S.LoadingBadges>Carregando...</S.LoadingBadges>
          ) : allBadges.length > 0 ? (
            <S.AllBadges>
              {allBadges.map((badge, index) => {
                const isEarned = userBadges.includes(badge._id);
                const icons = [
                  FaTrophy,
                  FaStar,
                  FaMedal,
                  FaAward,
                  FaTrophy,
                  FaStar,
                ];
                const Icon = icons[index % icons.length];

                return (
                  <S.BadgeItem
                    key={badge._id}
                    isEarned={isEarned}
                    colorIndex={index}
                    title={
                      isEarned
                        ? badge.name
                        : `🔒 ${badge.requirement || "Bloqueado"}`
                    }
                  >
                    {isEarned ? <Icon /> : <FaLock />}
                    <S.BadgeBase isEarned={isEarned} />
                  </S.BadgeItem>
                );
              })}
            </S.AllBadges>
          ) : (
            <S.NoBadgesMessage>
              <p>Nenhuma conquista disponível no momento.</p>
            </S.NoBadgesMessage>
          )}
        </S.AchievementsSection>
      </S.ProfilePage>
    </AuthenticatedLayout>
  );
}
