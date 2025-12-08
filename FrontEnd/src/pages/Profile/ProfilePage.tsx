import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { useTheme } from "@contexts/ThemeContext";
import { useAsync } from "@hooks/useAsync";
import { userService } from "@services/user.service";
import { api, resolvePublicUrl } from "@services/api";
import { titlesService } from "@services/titles.service";
import { leaderboardService } from "@services/leaderboard.service";
import { exercisesService, submissionsService, badgesService } from "@services/index";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import { useNotification } from "@components/Notification";
import type { Exercise } from "@/types";
import { deriveLevelFromXp, getProgressToNextLevel } from "@utils/levels";
import {
  FaUser,
  FaTrophy,
  FaStar,
  FaMedal,
  FaAward,
  FaEdit,
  FaLock,
  FaFilter,
  FaCheckCircle,
  FaFire,
  FaCode,
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

type TabType = 'completed' | 'badges' | 'titles' | 'created';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { addNotification, NotificationContainer } = useNotification();
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
  const [allTitles, setAllTitles] = useState<Title[]>([]);
  const [userTitles, setUserTitles] = useState<UserTitleItem[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(true);
  const [titleFilter, setTitleFilter] = useState<'all' | 'earned' | 'locked'>('all');
  const [activeTab, setActiveTab] = useState<TabType>('completed');
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loginStreak, setLoginStreak] = useState<number>(0);
  const [completedExercises, setCompletedExercises] = useState<Exercise[]>([]);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [createdExercises, setCreatedExercises] = useState<Exercise[]>([]);
  const [loadingCreated, setLoadingCreated] = useState(false);

  useEffect(() => {
    if (user) {
      execute();
      loadBadges();
      loadTitles();
      loadUserRank();
      loadLoginStreak();
      loadCompletedExercises();
      loadCreatedExercises();

      if (user.avatarUrl) {
        setProfileImage(user.avatarUrl);
      } else {
        setProfileImage(null);
      }
    }
  }, [user?.id, user?.avatarUrl]);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const streakData = await userService.pingLoginStreak();
        if (streakData) {
          setLoginStreak(streakData.loginStreakCurrent || 0);
        }
        await execute();
      } catch {}
    })();
  }, [user?.id]);

  async function loadUserRank() {
    try {
      const leaderboard = await leaderboardService.getGeneralLeaderboard({ page: 1, limit: 1000 });
      const userIndex = Array.isArray(leaderboard) ? leaderboard.findIndex((u: any) => String(u.userId || u._id || u.id) === String(user?.id)) : -1;
      if (userIndex !== undefined && userIndex !== -1) {
        setUserRank(userIndex + 1);
      }
    } catch (error) {
      setUserRank(null);
    }
  }

  async function loadLoginStreak() {
    try {
      const streakData = await userService.pingLoginStreak();
      if (streakData) {
        setLoginStreak(streakData.loginStreakCurrent || 0);
      }
    } catch (error) {
      setLoginStreak(0);
    }
  }

  async function loadCompletedExercises() {
    try {
      setLoadingCompleted(true);
      const submissions = await submissionsService.getMySubmissions(1, 1000);

      // Filtrar apenas submissões aceitas
      const acceptedSubmissions = submissions.items?.filter(
        (sub: any) => sub.status === 'ACCEPTED'
      ) || [];

      // Remover duplicatas (mesmo exercício pode ter múltiplas submissões)
      const uniqueExerciseIds = Array.from(
        new Set(acceptedSubmissions.map((sub: any) => sub.exerciseId))
      );

      // Buscar os exercícios
      const exercisesPromises = uniqueExerciseIds.map((exerciseId: string) =>
        exercisesService.getById(exerciseId).catch(() => null)
      );

      const exercises = await Promise.all(exercisesPromises);
      const validExercises = exercises.filter((ex): ex is Exercise => ex !== null);

      setCompletedExercises(validExercises);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar desafios completos:', error);
      }
      setCompletedExercises([]);
    } finally {
      setLoadingCompleted(false);
    }
  }

  async function loadCreatedExercises() {
    try {
      setLoadingCreated(true);
      const response = await exercisesService.getMine({ page: 1, limit: 1000 });
      const exercises = response.items || [];
      setCreatedExercises(Array.isArray(exercises) ? exercises : []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar desafios criados:', error);
      }
      setCreatedExercises([]);
    } finally {
      setLoadingCreated(false);
    }
  }

  async function loadBadges() {
    try {
      setLoadingBadges(true);

      // Usar o service que normaliza os dados corretamente
      const allBadgesData = await badgesService.getAll();

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
    ];
  }

  const earnedBadges = allBadges.filter((b: any) => userBadges.includes(b._id));
  const activeTitle = userTitles.find((ut) => ut.active)?.title;
  const titleName = typeof activeTitle === 'object' && activeTitle ? activeTitle.name : (typeof activeTitle === 'string' ? activeTitle : '');

  // Funções para calcular progresso dos títulos
  function getTitleProgress(t: Title) {
    const earned = userTitles.some((ut) => {
      const tid = typeof ut.title === 'string' ? ut.title : (ut.title as any)?._id;
      return tid && String(tid) === String(t._id);
    });
    if (earned) {
      return { earned: true, percent: 100, label: 'Conquistado' };
    }

    const solved = Number((scoreboard as any)?.solved ?? 0);
    const created = Number((scoreboard as any)?.created ?? 0);
    const forumComments = Number((scoreboard as any)?.forumComments ?? 0);
    const forumTopics = Number((scoreboard as any)?.forumTopics ?? 0);
    const groupsJoined = Number((scoreboard as any)?.groupsJoined ?? 0);
    const groupsCreated = Number((scoreboard as any)?.groupsCreated ?? 0);
    const loginStreak = Number((scoreboard as any)?.loginStreak ?? 0);
    const name = (t.name || '').toLowerCase();

    // Cálculo de progresso baseado em ações
    if (name === 'primeiro de muitos') {
      const needed = 1;
      const done = solved;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Falta ${falta} desafio` : 'Quase lá') };
    }
    if (name === 'dev em ascensão') {
      const needed = 10;
      const done = solved;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} desafios` : 'Quase lá') };
    }
    if (name === 'destrava códigos') {
      const needed = 5;
      const done = solved;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} desafios` : 'Quase lá') };
    }
    if (name === 'mão na massa') {
      const needed = 25;
      const done = solved;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} desafios` : 'Quase lá') };
    }
    if (name === 'ligeirinho da lógica') {
      const needed = 50;
      const done = solved;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} desafios` : 'Quase lá') };
    }
    if (name === 'lenda do terminal') {
      const needed = 100;
      const done = solved;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} desafios` : 'Quase lá') };
    }
    if (name.includes('criador de bugs')) {
      const needed = 1;
      const done = created;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Falta ${falta} desafio criado` : 'Quase lá') };
    }
    if (name === 'arquiteto de ideias') {
      const needed = 5;
      const done = created;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} desafios criados` : 'Quase lá') };
    }
    if (name === 'engenheiro de lógica') {
      const needed = 10;
      const done = created;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} desafios criados` : 'Quase lá') };
    }
    if (name === 'sensei do código') {
      const needed = 25;
      const done = created;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} desafios criados` : 'Quase lá') };
    }

    // Comentários no Fórum
    if (name === 'palpiteiro de primeira viagem') {
      const needed = 1;
      const done = forumComments;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Falta ${falta} comentário` : 'Quase lá') };
    }
    if (name === 'conselheiro de plantão') {
      const needed = 10;
      const done = forumComments;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} comentários` : 'Quase lá') };
    }
    if (name === 'guru da comunidade') {
      const needed = 25;
      const done = forumComments;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} comentários` : 'Quase lá') };
    }

    // Tópicos do Fórum
    if (name === 'quebrador de gelo') {
      const needed = 1;
      const done = forumTopics;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Falta ${falta} tópico` : 'Quase lá') };
    }
    if (name === 'gerador de ideias') {
      const needed = 5;
      const done = forumTopics;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} tópicos` : 'Quase lá') };
    }
    if (name === 'debatedor nato') {
      const needed = 10;
      const done = forumTopics;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} tópicos` : 'Quase lá') };
    }
    if (name === 'voz do fórum') {
      const needed = 25;
      const done = forumTopics;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} tópicos` : 'Quase lá') };
    }

    // Entrar em Grupos
    if (name === 'recruta do código') {
      const needed = 1;
      const done = groupsJoined;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Falta ${falta} grupo` : 'Quase lá') };
    }
    if (name === 'integrador') {
      const needed = 5;
      const done = groupsJoined;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} grupos` : 'Quase lá') };
    }
    if (name === 'conectadão') {
      const needed = 10;
      const done = groupsJoined;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} grupos` : 'Quase lá') };
    }

    // Criar Grupos
    if (name === 'fundador de equipe') {
      const needed = 1;
      const done = groupsCreated;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Falta ${falta} grupo criado` : 'Quase lá') };
    }
    if (name === 'líder de stack') {
      const needed = 3;
      const done = groupsCreated;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} grupos criados` : 'Quase lá') };
    }
    if (name === 'gestor do caos') {
      const needed = 5;
      const done = groupsCreated;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} grupos criados` : 'Quase lá') };
    }
    if (name === 'senhor das comunidades') {
      const needed = 10;
      const done = groupsCreated;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} grupos criados` : 'Quase lá') };
    }

    // Login consecutivo (streak)
    if (name === 'explorador do código') {
      const needed = 1;
      const done = loginStreak;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Falta ${falta} dia` : 'Quase lá') };
    }
    if (name === 'dev constante') {
      const needed = 7;
      const done = loginStreak;
      const percent = Math.max(0, Math.min(100, Math.round((done / needed) * 100)));
      const falta = Math.max(0, needed - done);
      const earnedNow = done >= needed;
      return { earned: earnedNow, percent, label: earnedNow ? 'Conquistado' : (falta > 0 ? `Faltam ${falta} dias` : 'Quase lá') };
    }

    return { earned: false, percent: 0, label: 'Ação necessária' };
  }

  function getTitleCategory(t: Title) {
    const name = (t.name || '').toLowerCase();
    if (
      name.includes('criador de bugs') ||
      name.includes('arquiteto de ideias') ||
      name.includes('engenheiro de lógica') ||
      name.includes('sensei do código')
    ) return 'Criar Desafios';

    if (
      name.includes('primeiro de muitos') ||
      name.includes('destrava códigos') ||
      name.includes('dev em ascensão') ||
      name.includes('mão na massa') ||
      name.includes('ligeirinho da lógica') ||
      name.includes('lenda do terminal')
    ) return 'Resolver Desafios';

    if (
      name.includes('palpiteiro de primeira viagem') ||
      name.includes('conselheiro de plantão') ||
      name.includes('guru da comunidade')
    ) return 'Comentários no Fórum';

    if (
      name.includes('quebrador de gelo') ||
      name.includes('gerador de ideias') ||
      name.includes('debatedor nato') ||
      name.includes('voz do fórum')
    ) return 'Tópicos do Fórum';

    if (
      name.includes('recruta do código') ||
      name.includes('integrador') ||
      name.includes('conectadão')
    ) return 'Entrar em Grupos';

    if (
      name.includes('fundador de equipe') ||
      name.includes('líder de stack') ||
      name.includes('gestor do caos') ||
      name.includes('senhor das comunidades')
    ) return 'Criar Grupos';

    if (
      name.includes('explorador do código') ||
      name.includes('dev constante')
    ) return 'Login';

    return 'Outros';
  }

  // Normaliza textos para comparação (remove acentos e deixa minúsculo)
  function normalizeText(s?: string) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // Mapeia o requisito numérico para títulos da categoria "Criar Desafios"
  function getTitleRequiredCount(t: Title) {
    const name = normalizeText(t.name);
    if (name.includes('criador de bugs')) return 1;
    if (name.includes('arquiteto de ideias')) return 5;
    if (name.includes('engenheiro de logica')) return 10;
    if (name.includes('sensei do codigo')) return 25;
    // Fallback para outros títulos
    return Number.MAX_SAFE_INTEGER;
  }

  // Mapeia o requisito numérico conforme a categoria
  function getRequiredCountByCategory(cat: string, t: Title) {
    const name = normalizeText(t.name);
    switch (cat) {
      case 'Criar Desafios':
        return getTitleRequiredCount(t);
      case 'Resolver Desafios':
        if (name.includes('primeiro de muitos')) return 1;
        if (name.includes('destrava codigos')) return 5;
        if (name.includes('dev em ascensao')) return 10;
        if (name.includes('mao na massa')) return 25;
        if (name.includes('ligeirinho da logica')) return 50;
        if (name.includes('lenda do terminal')) return 100;
        return Number.MAX_SAFE_INTEGER;
      case 'Comentários no Fórum':
        if (name.includes('palpiteiro de primeira viagem')) return 1;
        if (name.includes('conselheiro de plantao')) return 10;
        if (name.includes('guru da comunidade')) return 25;
        return Number.MAX_SAFE_INTEGER;
      case 'Tópicos do Fórum':
        if (name.includes('quebrador de gelo')) return 1;
        if (name.includes('gerador de ideias')) return 5;
        if (name.includes('debatedor nato')) return 10;
        if (name.includes('voz do forum')) return 25;
        return Number.MAX_SAFE_INTEGER;
      case 'Entrar em Grupos':
        if (name.includes('recruta do codigo')) return 1;
        if (name.includes('integrador')) return 5;
        if (name.includes('conectadao')) return 10;
        return Number.MAX_SAFE_INTEGER;
      case 'Criar Grupos':
        if (name.includes('fundador de equipe')) return 1;
        if (name.includes('lider de stack')) return 3;
        if (name.includes('gestor do caos')) return 5;
        if (name.includes('senhor das comunidades')) return 10;
        return Number.MAX_SAFE_INTEGER;
      case 'Login':
        if (name.includes('explorador do codigo')) return 1;
        if (name.includes('dev constante')) return 7;
        return Number.MAX_SAFE_INTEGER;
      default:
        return Number.MAX_SAFE_INTEGER;
    }
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addNotification("Por favor, selecione uma imagem válida", 'warning', 4000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification("A imagem deve ter no máximo 5MB", 'warning', 4000);
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
          addNotification("Foto de perfil atualizada com sucesso!", 'success', 4000);
        } catch (err) {
          addNotification("Erro ao enviar a imagem ao servidor.", 'error', 4000);
        } finally {
          setUploadingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      addNotification("Erro ao processar a imagem.", 'error', 4000);
      setUploadingImage(false);
    }
  }

  if (!user) return null;

  const completedRooms = (scoreboard as any)?.solved ?? 0;
  const badgesCount = userBadges.length;

  return (
    <AuthenticatedLayout>
      <S.ProfilePageContainer $isDark={isDark}>
        <S.ProfileHeader>
          <S.HeaderContent>
            <S.ProfileSection>
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

              <S.UserInfo>
                <S.Username>
                  {user.name}
                  {titleName && <S.UserTitle>[{titleName}]</S.UserTitle>}
                </S.Username>
                <S.SocialInfo>
                  {(() => {
                    const xpTotal = (user as any)?.xpTotal ?? 0;
                    const level = deriveLevelFromXp(xpTotal);
                    const progress = getProgressToNextLevel(xpTotal, level);
                    return (
                      <>
                        <S.LevelInfo>
                          <S.LevelLabel>Nível</S.LevelLabel>
                          <S.LevelValue>{level}</S.LevelValue>
                        </S.LevelInfo>
                        <S.ProgressInfo>
                          <S.ProgressLabel>Próximo Nível</S.ProgressLabel>
                          <S.ProgressValue>{progress.nextRequirement - progress.withinLevelXp} XP</S.ProgressValue>
                        </S.ProgressInfo>
                      </>
                    );
                  })()}
                </S.SocialInfo>
                <S.ActionButtons>
                  <S.ActionButton onClick={() => navigate("/profile/editar")}>
                    Editar Perfil
                  </S.ActionButton>
                </S.ActionButtons>
              </S.UserInfo>
            </S.ProfileSection>

            <S.StatsCards>
              <S.StatCard>
                <S.StatIcon>
                  <FaTrophy />
                </S.StatIcon>
                <S.StatValue>{userRank || 'N/A'}</S.StatValue>
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
                <S.StatValue>{loginStreak}</S.StatValue>
                <S.StatLabel>Streak</S.StatLabel>
              </S.StatCard>
              <S.StatCard>
                <S.StatIcon>
                  <FaCheckCircle />
                </S.StatIcon>
                <S.StatValue>{completedRooms}</S.StatValue>
                <S.StatLabel>Desafios Completos</S.StatLabel>
              </S.StatCard>
            </S.StatsCards>
          </S.HeaderContent>
        </S.ProfileHeader>

        <S.TabsContainer $isDark={isDark}>
          <S.Tabs>
            <S.Tab
              $active={activeTab === 'completed'}
              $isDark={isDark}
              onClick={() => setActiveTab('completed')}
            >
              <FaCheckCircle /> Desafios Completos
            </S.Tab>
            <S.Tab
              $active={activeTab === 'badges'}
              $isDark={isDark}
              onClick={() => setActiveTab('badges')}
            >
              <FaMedal /> Badges
            </S.Tab>
            <S.Tab
              $active={activeTab === 'titles'}
              $isDark={isDark}
              onClick={() => setActiveTab('titles')}
            >
              <FaAward /> Títulos
            </S.Tab>
            <S.Tab
              $active={activeTab === 'created'}
              $isDark={isDark}
              onClick={() => setActiveTab('created')}
            >
              <FaCode /> Desafios Criados
            </S.Tab>
          </S.Tabs>
        </S.TabsContainer>

        <S.ContentArea $isDark={isDark}>
          {activeTab === 'completed' && (
            <S.CompletedContent $isDark={isDark}>
              {loadingCompleted ? (
                <S.LoadingBadges $isDark={isDark}>Carregando desafios completos...</S.LoadingBadges>
              ) : completedExercises.length > 0 ? (
                <S.ExercisesGrid>
                  {completedExercises.map((exercise) => (
                    <S.ExerciseCard key={exercise.id} $isDark={isDark}>
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
                        {exercise.baseXp && (
                          <S.ExerciseXp $isDark={isDark}>
                            <FaStar /> {exercise.baseXp} XP
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
              {loadingBadges ? (
                <S.LoadingBadges $isDark={isDark}>Carregando emblemas...</S.LoadingBadges>
              ) : earnedBadges.length > 0 ? (
                <S.AllBadges>
                  {earnedBadges.map((badge, index) => {
                    const icons = [FaTrophy, FaStar, FaMedal, FaAward, FaTrophy, FaStar];
                    const Icon = icons[index % icons.length];
                    const badgeIcon = badge.icon || (badge as any).iconUrl;
                    const resolvedIconUrl = badgeIcon ? resolvePublicUrl(badgeIcon) : null;
                    return (
                      <S.BadgeItem
                        key={badge._id}
                        $isEarned={true}
                        $colorIndex={index}
                        title={badge.name}
                      >
                        {resolvedIconUrl ? (
                          <S.BadgeImage src={resolvedIconUrl} alt={badge.name} $isDark={isDark} />
                        ) : (
                          <Icon />
                        )}
                        <S.BadgeBase $isEarned={true} />
                        <S.BadgeName $isDark={isDark}>{badge.name}</S.BadgeName>
                      </S.BadgeItem>
                    );
                  })}
                </S.AllBadges>
              ) : (
                <S.NoBadgesMessage $isDark={isDark}>
                  <FaLock />
                  <p>Nenhum emblema conquistado ainda.</p>
                </S.NoBadgesMessage>
              )}
            </S.BadgesContent>
          )}
          {activeTab === 'titles' && (
            <S.TitlesContent $isDark={isDark}>
              <S.TitlesHeader>
                <div>
                  <S.SectionTitle $isDark={isDark}>Títulos</S.SectionTitle>
                  <S.SectionSubtitle $isDark={isDark}>
                    Seus títulos ficam aqui
                  </S.SectionSubtitle>
                </div>
                <S.FilterControls>
                  <FaFilter />
                  <S.FilterSelect
                    aria-label="Filtrar títulos"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value as any)}
                  >
                    <option value="all">Todos</option>
                    <option value="earned">Conquistados</option>
                    <option value="locked">Bloqueados</option>
                  </S.FilterSelect>
                </S.FilterControls>
              </S.TitlesHeader>

              {loadingTitles ? (
                <S.LoadingBadges $isDark={isDark}>Carregando títulos...</S.LoadingBadges>
              ) : allTitles.length > 0 ? (
                (() => {
                  const groups: Record<string, Title[]> = {};
                  for (const t of allTitles) {
                    const cat = getTitleCategory(t);
                    if (!groups[cat]) groups[cat] = [];
                    groups[cat].push(t);
                  }
                  const order = ['Criar Desafios', 'Resolver Desafios', 'Comentários no Fórum', 'Tópicos do Fórum', 'Entrar em Grupos', 'Criar Grupos', 'Login', 'Outros'];
                  return (
                    <div style={{ width: '100%' }}>
                      {order.filter((o) => groups[o]?.length).map((cat) => {
                        const visible = [...groups[cat]].filter((t) => {
                          const { earned } = getTitleProgress(t);
                          if (titleFilter === 'earned') return !!earned;
                          if (titleFilter === 'locked') return !earned;
                          return true;
                        });

                        if (visible.length === 0) return null;

                        return (
                          <div key={cat} style={{ marginBottom: '1.5rem' }}>
                            <S.CategoryTitle $isDark={isDark}>{cat}</S.CategoryTitle>
                            <S.TitlesGrid>
                              {visible
                                .sort((a, b) => {
                                  // Para categorias conhecidas, ordenar pelo requisito crescente
                                  if ([
                                    'Criar Desafios',
                                    'Resolver Desafios',
                                    'Comentários no Fórum',
                                    'Tópicos do Fórum',
                                    'Entrar em Grupos',
                                    'Criar Grupos',
                                    'Login',
                                  ].includes(cat)) {
                                    const ra = getRequiredCountByCategory(cat, a);
                                    const rb = getRequiredCountByCategory(cat, b);
                                    if (ra !== rb) return ra - rb;
                                    return (a.name || '').localeCompare(b.name || '');
                                  }
                                  // Outras categorias: manter ordenação por progresso desc e nome
                                  const { percent: pa } = getTitleProgress(a);
                                  const { percent: pb } = getTitleProgress(b);
                                  if (pb !== pa) return pb - pa;
                                  return (a.name || '').localeCompare(b.name || '');
                                })
                                .map((t) => {
                                  const { earned, percent, label } = getTitleProgress(t);
                                  return (
                                    <S.TitleCard key={t._id} $isDark={isDark}>
                                      {earned && <S.EarnedChip>Conquistado</S.EarnedChip>}
                                      <S.TitleHeader>
                                        <S.TitleName $isDark={isDark}>{t.name}</S.TitleName>
                                        <S.TitleLabel $earned={earned} $isDark={isDark}>
                                          {earned ? '✅' : '🔒'} {label}
                                        </S.TitleLabel>
                                      </S.TitleHeader>
                                      {t.description && (
                                        <S.TitleDescription $isDark={isDark}>{t.description}</S.TitleDescription>
                                      )}
                                      <S.TitleProgressWrapper>
                                        <S.TitleProgressBar $isDark={isDark}>
                                          <S.TitleProgressFill $progress={percent} />
                                        </S.TitleProgressBar>
                                        <S.TitleProgressPercentContainer>
                                          <S.TitleProgressPercent $progress={percent} $isDark={isDark}>
                                            {Math.round(percent)}%
                                          </S.TitleProgressPercent>
                                        </S.TitleProgressPercentContainer>
                                      </S.TitleProgressWrapper>
                                    </S.TitleCard>
                                  );
                                })}
                            </S.TitlesGrid>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : (
                <S.NoBadgesMessage $isDark={isDark}>
                  <p>Nenhum título cadastrado.</p>
                </S.NoBadgesMessage>
              )}
            </S.TitlesContent>
          )}
              {activeTab === 'created' && (
                <S.CompletedContent $isDark={isDark}>
                  {loadingCreated ? (
                    <S.LoadingBadges $isDark={isDark}>Carregando desafios criados...</S.LoadingBadges>
                  ) : createdExercises.length > 0 ? (
                    <S.ExercisesGrid>
                      {createdExercises.map((exercise) => (
                        <S.ExerciseCard key={exercise.id} $isDark={isDark}>
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
                            {exercise.baseXp && (
                              <S.ExerciseXp $isDark={isDark}>
                                <FaStar /> {exercise.baseXp} XP
                              </S.ExerciseXp>
                            )}
                            {exercise.subject && (
                              <S.ExerciseSubject $isDark={isDark}>
                                {exercise.subject}
                              </S.ExerciseSubject>
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
      <NotificationContainer />
    </AuthenticatedLayout>
  );
}
