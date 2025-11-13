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
  FaFilter,
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
  const [titleFilter, setTitleFilter] = useState<'all' | 'earned' | 'locked'>('all');

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

  // Atualiza o streak de login ao abrir o perfil e recarrega o scoreboard
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        await userService.pingLoginStreak();
        await execute();
      } catch {}
    })();
  }, [user?.id]);

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

    // Criar 5 desafios => "Arquiteto de Ideias"
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

    // Para títulos sem métrica mensurável neste scoreboard, usar 0% até conquistar
    return { earned: false, percent: 0, label: 'Ação necessária' };
  }

  // Agrupamento por categoria de ação
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

    // Login (streak / constância)
    if (
      name.includes('explorador do código') ||
      name.includes('dev constante')
    ) return 'Login';

    return 'Outros';
  }

  // Valor numérico de requisito por título (para ordenação)
  function getTitleRequirementValue(t: Title): number | undefined {
    const name = getTitleDisplayName(t).toLowerCase().trim();
    const map: Record<string, number> = {
      // Resolver Desafios
      'primeiro de muitos': 1,
      'destrava códigos': 5,
      'dev em ascensão': 10,
      'mão na massa': 25,
      'ligeirinho da lógica': 50,
      'lenda do terminal': 100,
      // Criar Desafios
      'criador de bugs': 1,
      'arquiteto de ideias': 5,
      'engenheiro de lógica': 10,
      'sensei do código': 25,
      // Comentários no Fórum
      'palpiteiro de primeira viagem': 1,
      'conselheiro de plantão': 10,
      'guru da comunidade': 25,
      // Tópicos do Fórum
      'quebrador de gelo': 1,
      'gerador de ideias': 5,
      'debatedor nato': 10,
      'voz do fórum': 25,
      // Entrar em Grupos
      'recruta do código': 1,
      'integrador': 5,
      'conectadão': 10,
      // Criar Grupos
      'fundador de equipe': 1,
      'líder de stack': 3,
      'gestor do caos': 5,
      'senhor das comunidades': 10,
      // Login consecutivo
      'explorador do código': 1,
      'dev constante': 7,
      // Streaks de acertos em 24h
      'embalado no código': 3,
      'modo turbo': 5,
      'imparável': 10,
    };

    if (map[name] != null) return map[name];
    const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes('criador de bugs')) return 1; // variantes com sufixo
    // Heurísticas por inclusão para evitar divergências de nome
    if (normalized.includes('embalado')) return 3;
    if (normalized.includes('modo turbo')) return 5;
    if (normalized.includes('imparavel')) return 10;
    return undefined;
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
      'criador de bugs': 'Crie 1 desafio',
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
    // Correspondência direta
    if (requirementHints[name]) {
      return requirementHints[name];
    }

    // Correspondência por inclusão para variantes com sufixos como "(sem querer)"
    if (name.includes('criador de bugs')) {
      return requirementHints['criador de bugs'];
    }

    // Padrão: usar a descrição como pista e orientar ação
    if (t.description) {
      return `Para ganhar: ${t.description}`;
    }
    return 'Para ganhar: conclua desafios, participe do fórum ou grupos.';
  }

  // Nome de exibição ajustado para casos específicos
  function getTitleDisplayName(t: Title) {
    const n = (t.name || '').trim();
    if (n.toLowerCase().includes('criador de bugs')) {
      return n.replace(/\s*\(sem querer\)\s*/i, '');
    }
    return n;
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <S.SectionTitle>{"<"}TÍTULOS{">"}</S.SectionTitle>
              <S.SectionSubtitle style={{ marginBottom: 0, textAlign: 'left' }}>
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
          </div>

          {loadingTitles ? (
            <S.LoadingBadges>Carregando títulos...</S.LoadingBadges>
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
                      return true; // 'all'
                    });

                    if (visible.length === 0) return null; // Oculta categorias vazias sob o filtro atual

                    return (
                      <div key={cat} style={{ marginBottom: '1.5rem' }}>
                        <S.CategoryTitle>{cat}</S.CategoryTitle>
                        <S.TitlesGrid>
                          {visible
                            .sort((a, b) => {
                              const ra = getTitleRequirementValue(a);
                              const rb = getTitleRequirementValue(b);
                              if (Number.isFinite(ra) && Number.isFinite(rb) && ra !== rb) {
                                return (ra as number) - (rb as number);
                              }
                              const pa = getTitleProgress(a).percent;
                              const pb = getTitleProgress(b).percent;
                              if (pb !== pa) return pb - pa;
                              return (a.name || '').localeCompare(b.name || '');
                            })
                            .map((t) => {
                              const { earned, percent, label } = getTitleProgress(t);
                              return (
                                <S.TitleCard key={t._id} title={getTitleHint(t)}>
                                  {earned && <S.EarnedChip>Conquistado</S.EarnedChip>}
                                  <S.TitleHeader>
                                    <S.TitleName>{getTitleDisplayName(t)}</S.TitleName>
                                    <S.TitleLabel $earned={earned}>{earned ? '✅' : '🔒'} {label}</S.TitleLabel>
                                  </S.TitleHeader>
                                  {t.description && (
                                    <S.TitleDescription>{t.description}</S.TitleDescription>
                                  )}
                                  <S.TitleProgressWrapper>
                                    <S.TitleProgressBar>
                                      <S.TitleProgressFill $progress={percent} />
                                    </S.TitleProgressBar>
                                    <S.TitleProgressPercentContainer>
                                      <S.TitleProgressPercent $progress={percent}>{Math.round(percent)}%</S.TitleProgressPercent>
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
            <S.NoBadgesMessage>
              <p>Nenhum título cadastrado.</p>
            </S.NoBadgesMessage>
          )}
        </S.AchievementsSection>
      </S.ProfilePage>
    </AuthenticatedLayout>
  );
}
