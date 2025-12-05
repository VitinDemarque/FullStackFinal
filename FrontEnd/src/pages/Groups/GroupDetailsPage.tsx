import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "@contexts/ThemeContext";
import { FaTrophy, FaCheckCircle } from "react-icons/fa";
import { Group } from "../../types/group.types";
import { Exercise } from "../../types";
import { groupService } from "../../services/group.service";
import { exercisesService } from "../../services/exercises.service";
import { userService } from "../../services/user.service";
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import CreateExerciseModal, { CreateExerciseData } from "@/components/CreateExerciseModal";
import ChallengeModal from "@components/ChallengeModal";
import ExerciseActionsMenu from "@components/ExerciseActionsMenu";
import EditGroupExerciseModal, { UpdateGroupExerciseData } from "../../components/Groups/EditGroupExerciseModal";
import { useGroupNotification } from "../../hooks/useGroupNotification";
import GroupNotification from "../../components/Groups/GroupNotification";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import ConfirmModal from "@/components/ConfirmModal";
import { judge0Service, submissionsService } from "@services/index";
import * as S from "@/styles/pages/Dashboard/styles";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--color-text-primary);
  background: var(--color-background);
  min-height: 100vh;
`;

const BackButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
    color: var(--color-text-primary);
    text-decoration: none;
    transform: translateX(-4px);
  }
`;

const Header = styled(motion.div)`
  background: var(--color-surface);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
  }
`;

const TitleSection = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
  line-height: 1.2;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  color: var(--color-text-secondary);
  margin: 0 0 20px 0;
  line-height: 1.6;
  font-size: 1.125rem;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 16px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 20px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-light);
  font-size: 0.875rem;
  
  &::before {
    font-size: 1.25rem;
  }
`;

const ActionsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    
    button, a {
      width: 100% !important;
    }
  }
`;

// Removido o fix de primeira linha para evitar reflow inesperado

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: "secondary" | "danger" }>`
  padding: 0.75rem 1.25rem;
  min-width: 160px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;

  ${(props) => {
    switch (props.variant) {
      case "secondary":
        return `
          background: var(--color-surface);
          color: var(--color-text-primary);
          border-color: var(--color-border);

          &:hover {
            background: var(--color-surface-hover);
            border-color: var(--color-primary);
          }
        `;
      case "danger":
        return `
          background: var(--color-red-500);
          color: white;
          border-color: var(--color-red-500);

          &:hover {
            background: var(--color-red-600);
            border-color: var(--color-red-600);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: var(--gradient-primary);
          color: white;
          border-color: transparent;

          &:hover {
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:disabled {
    background: var(--color-gray-400);
    border-color: var(--color-gray-400);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const LinkButton = styled(Link)`
  padding: 0.75rem 1.25rem;
  min-width: 160px;
  background: var(--gradient-primary);
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;

  &:hover {
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
    transform: translateY(-1px);
    text-decoration: none;
    color: white;
  }
`;

const NavLink = styled(Link)`
  padding: 0.75rem 1.25rem;
  min-width: 160px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--color-border);

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
    box-shadow: var(--shadow-sm);
    text-decoration: none;
    transform: translateY(-1px);
  }
`;

const ProgressLink = styled(Link)`
  padding: 0.75rem 1.25rem;
  min-width: 160px;
  background: var(--gradient-green);
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;

  &:hover {
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
    transform: translateY(-1px);
    text-decoration: none;
    color: white;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled(motion.div)`
  background: var(--color-surface);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const SectionTitle = styled.h2`
  color: var(--color-text-primary);
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 700;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-border);
`;

const MembersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MemberItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const MemberNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MemberName = styled.span`
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 1rem;
`;

const MemberAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-sm);
`;

const MemberAvatarFallback = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-sm);
`;

const MemberNameLink = styled.span`
  color: var(--color-primary);
  font-weight: 600;
  transition: color 0.2s ease;
  pointer-events: none;
`;

const MemberRole = styled.span<{ role: string }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${(props) =>
    props.role === "MODERATOR"
      ? `
    background: linear-gradient(135deg, var(--color-yellow-100) 0%, var(--color-yellow-200) 100%);
    color: var(--color-yellow-500);
    border: 1px solid var(--color-yellow-300);
  `
      : `
    background: linear-gradient(135deg, var(--color-blue-50) 0%, var(--color-blue-100) 100%);
    color: var(--color-blue-500);
    border: 1px solid var(--color-blue-200);
  `}
`;

const MemberDate = styled.small`
  color: var(--color-text-light);
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Spinner = styled.div`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--color-red-400);
`;

const ExercisesSection = styled(Section)`
  margin-top: 40px;
`;

const ExercisesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
`;

const ExercisesTitle = styled(SectionTitle)`
  margin: 0;
`;

const CreateExerciseButton = styled.button`
  background: var(--color-blue-500);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: var(--color-blue-600);
    transform: translateY(-1px);
  }

  &:disabled {
    background: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const ExercisesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyExercisesState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
  border: 2px dashed var(--color-border);
  border-radius: 12px;
`;

const EmptyExercisesTitle = styled.h3`
  margin: 0 0 12px 0;
  color: var(--color-text-primary);
`;

const EmptyExercisesText = styled.p`
  margin: 0 0 24px 0;
`;

const InviteLinkContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
`;

const InviteLinkLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`;

const InviteLinkInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-family: monospace;
  margin-bottom: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
  }
`;

const InviteLinkActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const GroupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const confirmModal = useConfirmModal();

  const [group, setGroup] = useState<Group | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [memberNames, setMemberNames] = useState<Record<string, string>>({});
  const [memberAvatars, setMemberAvatars] = useState<Record<string, string | null>>({});
  
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [leaveAsOwner, setLeaveAsOwner] = useState(false);
  const { notifications, removeNotification, showError, showSuccess } = useGroupNotification();

  const JAVA_LANGUAGE_ID = 62;

  // Esconde o checkbox "Desafio público" apenas quando o modal de criação de desafio do grupo estiver aberto
  useEffect(() => {
    if (!showCreateExerciseModal) return;

    const checkbox = document.getElementById('isPublic') as HTMLInputElement | null;
    if (!checkbox) return;

    const checkboxGroup = checkbox.parentElement?.parentElement as HTMLElement | null;
    if (!checkboxGroup) return;

    const previousDisplay = checkboxGroup.style.display;
    checkboxGroup.style.display = 'none';

    return () => {
      checkboxGroup.style.display = previousDisplay;
    };
  }, [showCreateExerciseModal]);

  const loadGroup = async () => {
    if (!id) return;

    try {
      const groupData = await groupService.getById(id);
      setGroup(groupData);
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Erro ao carregar grupo:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadGroupExercises = async () => {
    if (!id) return;
  
    try {
      setExercisesLoading(true);
      
      const response = await groupService.listExercises(id, 1, 50);
      
      const groupExercises = response.items.map((exercise: any) => ({
        ...exercise,
        languageId: exercise.languageId || null
      }));
      
      setExercises(groupExercises);
      
    } catch (error: any) {
    } finally {
      setExercisesLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
  }, [id]);

  useEffect(() => {
    if (user) {
      submissionsService.getMyCompletedExercises()
        .then(setCompletedExerciseIds)
        .catch(() => setCompletedExerciseIds([]));
    }
  }, [user]);

  useEffect(() => {
    if (group) {
      loadGroupExercises();
      // Buscar nomes de membros e do dono
      const fetchNames = async () => {
        try {
          const ids = Array.from(
            new Set([
              ...(group.members?.map((m) => m.userId) || []),
              group.ownerUserId,
            ].filter((id): id is string => !!id))
          );

          if (ids.length === 0) return;

          const pairs = await Promise.all(
            ids.map(async (uid) => {
              try {
                const profile = await userService.getPublicProfile(uid);
                return [uid, profile.user.name, profile.user.avatarUrl ?? null] as const;
              } catch {
                try {
                  const user = await userService.getById(uid);
                  return [uid, user.name, user.avatarUrl ?? null] as const;
                } catch {
                  return [uid, `Usuário ${uid}`, null] as const;
                }
              }
            })
          );

          const nameMap: Record<string, string> = {};
          const avatarMap: Record<string, string | null> = {};
          pairs.forEach(([uid, name, avatar]) => {
            nameMap[uid] = name;
            avatarMap[uid] = avatar;
          });
          setMemberNames((prev) => ({ ...prev, ...nameMap }));
          setMemberAvatars((prev) => ({ ...prev, ...avatarMap }));
        } catch (e) {
          // silencioso: mantém fallback para ID
        }
      };

      fetchNames();
    }
  }, [group]);

  const handleJoin = async () => {
    if (!id || !isAuthenticated) return;

    setActionLoading(true);
    try {
      await groupService.join(id);
      showSuccess("Sucesso!", "Você entrou no grupo!");
      loadGroup();
    } catch (error: any) {
      showError("Erro ao entrar no grupo", error.message || "Não foi possível entrar no grupo. Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  const doLeaveGroup = async () => {
    if (!id || !isAuthenticated) return;
    setActionLoading(true);
    try {
      await groupService.leave(id);
      showSuccess("Você saiu do grupo", "Você não é mais membro deste grupo.");
      navigate("/grupos");
    } catch (error: any) {
      // Caso o backend bloqueie a saída por ser dono (fallback de proteção)
      if (String(error?.message || '').includes('dono não pode sair')) {
        showError(
          "O dono não pode sair",
          "Para encerrar, exclua o grupo ou transfira a propriedade."
        );
      } else {
        showError(
          "Erro ao sair do grupo",
          error.message || "Não foi possível sair do grupo. Tente novamente."
        );
      }
    } finally {
      setActionLoading(false);
    }
  };

  const doDeleteGroup = async () => {
    if (!id || !isAuthenticated) return;
    setActionLoading(true);
    try {
      await groupService.delete(id);
      showSuccess("Grupo excluído", "O grupo foi excluído com sucesso.");
      navigate("/grupos");
    } catch (error: any) {
      showError("Erro ao excluir grupo", error.message || "Não foi possível excluir o grupo. Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateExercise = async (exerciseData: CreateExerciseData) => {
    if (!id || !user) return;

    try {
      setActionLoading(true);
      const exerciseWithGroup = {
        ...exerciseData,
        groupId: id,
        authorUserId: user.id,
        isPublic: false,
      } as any;
      const created = await exercisesService.create(exerciseWithGroup);
      // Publica automaticamente para aparecer na lista do grupo
      await exercisesService.publish(created.id);
      showSuccess('Desafio criado!', 'Desafio criado e publicado com sucesso no grupo!');
      setShowCreateExerciseModal(false);
      await loadGroupExercises();
      
    } catch (error: any) {
      showError('Erro ao criar Desafio', error.message || 'Não foi possível criar o desafio. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditExercise = (exerciseId: string) => {
    const exerciseToEdit = exercises.find(ex => ex.id === exerciseId);
    if (exerciseToEdit) {
      setEditingExercise(exerciseToEdit);
      setShowEditExerciseModal(true);
    }
  };

  const handleUpdateExercise = async (exerciseData: UpdateGroupExerciseData) => {
    if (!editingExercise) return;

    try {
      setActionLoading(true);
      
      await exercisesService.update(editingExercise.id, exerciseData);
      showSuccess('Desafio atualizado!', 'O desafio foi atualizado com sucesso.');
      setShowEditExerciseModal(false);
      setEditingExercise(null);
      loadGroupExercises(); // Recarrega a lista
    } catch (error: any) {
      showError('Erro ao atualizar Desafio', error.message || 'Não foi possível atualizar o desafio. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    const confirmed = await confirmModal.confirm({
      title: 'Excluir Desafio',
      message: 'Tem certeza que deseja excluir este Desafio? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    
    if (!confirmed) return;

    try {
      await exercisesService.delete(exerciseId);
      showSuccess('Desafio excluído!', 'O desafio foi excluído com sucesso.');
      loadGroupExercises();
    } catch (error: any) {
      showError('Erro ao excluir Desafio', error.message || 'Não foi possível excluir o desafio. Tente novamente.');
    }
  };

  const handleInactivateExercise = async (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const newStatus = exercise.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED';
    const action = newStatus === 'ARCHIVED' ? 'inativar' : 'ativar';

    const confirmed = await confirmModal.confirm({
      title: `${newStatus === 'ARCHIVED' ? 'Inativar' : 'Ativar'} Desafio`,
      message: `Tem certeza que deseja ${action} o Desafio "${exercise.title}"?`,
      confirmText: newStatus === 'ARCHIVED' ? 'Inativar' : 'Ativar',
      cancelText: 'Cancelar',
      type: 'warning'
    });
    
    if (!confirmed) return;

    try {
      setActionLoading(true);
      await exercisesService.update(exerciseId, { status: newStatus });
      showSuccess(
        newStatus === 'ARCHIVED' ? 'Desafio inativado!' : 'Desafio ativado!',
        `O desafio foi ${newStatus === 'ARCHIVED' ? 'inativado' : 'ativado'} com sucesso.`
      );
      await loadGroupExercises();
    } catch (error: any) {
      showError(
        `Erro ao ${action} Desafio`,
        error.message || `Não foi possível ${action} o desafio. Tente novamente.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateInviteLink = async () => {
    if (!id) return;

    try {
      setGeneratingLink(true);
      const result = await groupService.generateInviteLink(id);
      setInviteLink(result.link);
      showSuccess('Link gerado!', 'Link de convite gerado com sucesso. Copie e compartilhe!');
    } catch (error: any) {
      showError('Erro ao gerar link', error.message || 'Não foi possível gerar o link de convite. Tente novamente.');
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      showSuccess('Link copiado!', 'Link de convite copiado para a área de transferência.');
    } catch (error: any) {
      showError('Erro ao copiar', 'Não foi possível copiar o link. Tente novamente.');
    }
  };

  const getUserRole = (): 'MEMBER' | 'MODERATOR' | 'OWNER' => {
    if (!group || !user) return 'MEMBER';
    
    const member = group.members?.find(m => m.userId === user.id);
    return member?.role || 'MEMBER';
  };

  const handleTestChallenge = async (code: string, input?: string) => {
    try {
      const compileResult = await judge0Service.executeCode(code, JAVA_LANGUAGE_ID, input);

      if (!compileResult.sucesso) {
        throw new Error(compileResult.resultado || 'Erro na execução do código');
      }

      return compileResult.resultado;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.details?.resultado 
        || error?.response?.data?.error?.message 
        || error?.message 
        || 'Erro ao testar o código';
      throw new Error(errorMessage);
    }
  };

  const handleSubmitChallenge = async (code: string, timeSpent: number) => {
    if (!selectedExercise || !user) return;

    // Bloquear submissão se o desafio já foi concluído
    if (selectedExercise.isCompleted) {
      showError('Desafio já concluído', 'Este desafio já foi concluído. Não é possível refazê-lo.');
      setSelectedExercise(null);
      return;
    }

    try {
      const timeSpentMs = timeSpent * 1000;
      
      // O backend valida os testes automaticamente ao criar a submissão
      const submission = await submissionsService.create({
        exerciseId: selectedExercise.id,
        code: code,
        timeSpentMs: timeSpentMs,
      });

      const finalScore = submission.finalScore ?? submission.testScore ?? submission.score ?? 0;
      const scoreMessage = `Score Final: ${finalScore.toFixed(1)}%`;
      
      const statusMessage = submission.status === "ACCEPTED" 
        ? "✅ Aceito! Parabéns!" 
        : "❌ Rejeitado. Revise seu código e tente novamente.";

      const testsMessage = submission.totalTests 
        ? `\nTestes passados: ${submission.passedTests || 0}/${submission.totalTests}`
        : '';

      if (submission.status === "ACCEPTED") {
        showSuccess(
          'Desafio concluído!', 
          `Parabéns! Você ganhou ${submission.xpAwarded || 0} XP!\n${scoreMessage}${testsMessage}`
        );
        setSelectedExercise(null);
        await loadGroupExercises();
        // Recarregar desafios concluídos
        if (user) {
          submissionsService.getMyCompletedExercises()
            .then(setCompletedExerciseIds)
            .catch(() => {});
        }
      } else {
        showError('Desafio não passou', `${statusMessage}\n${scoreMessage}${testsMessage}`);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message 
        || error?.message 
        || 'Erro ao submeter desafio';
      showError('Erro ao submeter desafio', errorMessage);
    }
  };

  const isUserMember = group?.members?.some(
    (member) => member.userId === user?.id
  );
  const isUserOwner = group?.ownerUserId === user?.id;
  const isUserModerator = group?.members?.some(
    (member) => member.userId === user?.id && member.role === "MODERATOR"
  );

  const canCreateExercises = isUserMember;

  if (loading) {
    return (
      <AuthenticatedLayout>
        <LoadingContainer>
          <Spinner>Carregando grupo...</Spinner>
        </LoadingContainer>
      </AuthenticatedLayout>
    );
  }

  if (!group) {
    return (
      <AuthenticatedLayout>
        <Container>
          <ErrorMessage>
            <h2>Grupo não encontrado</h2>
            <p>O grupo que você está procurando não existe ou foi removido.</p>
            <LinkButton to="/grupos">Voltar para Grupos</LinkButton>
          </ErrorMessage>
        </Container>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Container>
        {notifications.map((notification, index) => (
          <GroupNotification
            key={notification.id}
            variant={notification.variant}
            title={notification.title}
            message={notification.message}
            duration={3000}
            offsetY={20 + index * 84}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
        
        <BackButton 
          to="/grupos"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          ← Voltar para Grupos
        </BackButton>
        
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TitleSection>
            <Title
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {group.name}
            </Title>
            <Description>{group.description || "Sem descrição"}</Description>
            <MetaInfo>
              <MetaItem>👥 {group.memberCount ?? group.members?.length ?? 0} membros</MetaItem>
              <MetaItem>
                {group.visibility === "PUBLIC" ? "🌐 Público" : "🔒 Privado"}
              </MetaItem>
              <MetaItem>
                Criado em: {new Date(group.createdAt).toLocaleDateString("pt-BR")}
              </MetaItem>
            </MetaInfo>
          </TitleSection>

          <ActionsSection
            as={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isAuthenticated &&
              !isUserMember &&
              group.visibility === "PUBLIC" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Button onClick={handleJoin} disabled={actionLoading}>
                    {actionLoading ? "Entrando..." : "Entrar no Grupo"}
                  </Button>
                </motion.div>
              )}

            {isAuthenticated && isUserMember && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Button
                  variant="danger"
                  onClick={() => { setLeaveAsOwner(isUserOwner); setConfirmLeaveOpen(true); }}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Saindo..." : "Sair do Grupo"}
                </Button>
              </motion.div>
            )}

            {isUserMember && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <NavLink to={`/grupos/${group.id}/exercicios`}>
                    Ver Desafios
                  </NavLink>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <ProgressLink to={`/grupos/${group.id}/progresso`}>
                    Meu Progresso
                  </ProgressLink>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <RankingLink to={`/grupos/${group.id}/ranking`}>
                    Ranking do Grupo
                  </RankingLink>
                </motion.div>
              </>
            )}

            {(isUserOwner || isUserModerator) && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <LinkButton to={`/grupos/${group.id}/membros`}>
                    Gerenciar Membros
                  </LinkButton>
                </motion.div>
                {group.visibility === 'PRIVATE' && (
                  <>
                    {!inviteLink && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.9 }}
                      >
                        <Button
                          onClick={handleGenerateInviteLink}
                          disabled={generatingLink}
                        >
                          {generatingLink ? "Gerando..." : "Gerar Link de Convite"}
                        </Button>
                      </motion.div>
                    )}
                  </>
                )}
              </>
            )}

            {isUserOwner && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.0 }}
                >
                  <LinkButton to={`/grupos/${group.id}/editar`}>
                    Editar Grupo
                  </LinkButton>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.1 }}
                >
                  <Button
                    variant="danger"
                    onClick={() => setConfirmDeleteOpen(true)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Excluindo..." : "Excluir Grupo"}
                  </Button>
                </motion.div>
              </>
            )}
          </ActionsSection>
        </Header>

        {/* Mostrar link de convite se gerado */}
        {inviteLink && (isUserOwner || isUserModerator) && group.visibility === 'PRIVATE' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <InviteLinkContainer>
            <InviteLinkLabel>Link de Convite do Grupo</InviteLinkLabel>
            <InviteLinkInput
              type="text"
              value={inviteLink}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <InviteLinkActions>
              <Button onClick={handleCopyInviteLink}>
                Copiar Link
              </Button>
              <Button
                variant="secondary"
                onClick={() => setInviteLink(null)}
              >
                Fechar
              </Button>
            </InviteLinkActions>
          </InviteLinkContainer>
          </motion.div>
        )}

        <Content>
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SectionTitle>Membros do Grupo</SectionTitle>
            <MembersList
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {group.members && group.members.length > 0 ? (
                group.members.map((member, index) => (
                  <MemberItem 
                    key={member.userId}
                    onClick={() => navigate(`/perfil/${member.userId}`)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <MemberInfo>
                      {memberAvatars[member.userId] ? (
                        <MemberAvatar src={memberAvatars[member.userId] as string} alt={memberNames[member.userId]} />
                      ) : (
                        <MemberAvatarFallback>
                          {(memberNames[member.userId] || 'U').charAt(0)}
                        </MemberAvatarFallback>
                      )}
                      <MemberDetails>
                        <MemberNameContainer>
                          {member.userId === group.ownerUserId && <span>👑</span>}
                          <MemberNameLink as="span" style={{ cursor: 'pointer' }}>
                            {memberNames[member.userId] || `Usuário ${member.userId}`}
                          </MemberNameLink>
                          {member.userId === user?.id && <span style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>(Você)</span>}
                        </MemberNameContainer>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <MemberRole role={member.role}>
                            {member.role === "MODERATOR" ? "Moderador" : "Membro"}
                            {member.userId === group.ownerUserId ? " (Dono)" : ""}
                          </MemberRole>
                        </div>
                      </MemberDetails>
                    </MemberInfo>
                    <MemberDate>
                      Entrou em: {new Date(member.joinedAt).toLocaleDateString("pt-BR")}
                    </MemberDate>
                  </MemberItem>
                ))
              ) : (
                <p>Nenhum membro no grupo.</p>
              )}
            </MembersList>
          </Section>

          <ExercisesSection
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ExercisesHeader>
              <ExercisesTitle>
                Desafios do Grupo ({exercises.length})
              </ExercisesTitle>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {exercises.length > 0 && (
                  <NavLink to={`/grupos/${group.id}/exercicios`}>
                    Ver Todos os Desafios →
                  </NavLink>
                )}
                
                {canCreateExercises && (
                  <CreateExerciseButton 
                    onClick={() => setShowCreateExerciseModal(true)}
                    disabled={actionLoading}
                  >
                    Criar Desafio
                  </CreateExerciseButton>
                )}
              </div>
            </ExercisesHeader>

            {exercisesLoading ? (
              <LoadingContainer>
                <Spinner>Carregando Desafios...</Spinner>
              </LoadingContainer>
            ) : exercises.length > 0 ? (
              <S.RecommendationsGrid
                as={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {exercises.slice(0, 3).map((exercise, index) => {
                  const completedIdsSet = new Set(completedExerciseIds);
                  const isCompleted = completedIdsSet.has(exercise.id) || exercise.isCompleted === true;
                  
                  // Verificação mais robusta do dono
                  const exerciseAuthorId = exercise.authorUserId ? String(exercise.authorUserId) : null;
                  const currentUserId = user?.id ? String(user.id) : null;
                  const isOwner = exerciseAuthorId && currentUserId && exerciseAuthorId === currentUserId;
                  
                  const difficultyMap: Record<number, string> = {
                    1: "Fácil",
                    2: "Médio",
                    3: "Difícil",
                    4: "Expert",
                    5: "Master",
                  };
                  const difficultyText = difficultyMap[exercise.difficulty] || "Médio";

                  return (
                    <S.ExerciseCard 
                      key={exercise.id} 
                      $isDark={isDark} 
                      $isCompleted={isCompleted}
                      as={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      {exercise.language && (
                        <S.LanguageBadge style={isOwner ? { 
                          right: '4rem', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          position: 'absolute'
                        } : { 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          position: 'absolute'
                        }}>
                          {exercise.language.name}
                        </S.LanguageBadge>
                      )}
                      {isCompleted && (
                        <S.CompletedBadge>
                          <FaCheckCircle />
                          Concluído
                        </S.CompletedBadge>
                      )}
                      <S.CardHeader 
                        $isDark={isDark} 
                        style={{ 
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          gap: '0.75rem',
                          position: 'relative',
                          paddingTop: '1.25rem'
                        }}
                      >
                        <S.DifficultyBadge 
                          difficulty={difficultyText.toLowerCase() as any}
                          style={{ position: 'relative', top: 'auto', left: 'auto', margin: 0 }}
                        >
                          {difficultyText}
                        </S.DifficultyBadge>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '0.75rem',
                          marginLeft: 'auto'
                        }}>
                          <S.XpBadge style={{ 
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                            margin: 0
                          }}>
                            <FaTrophy /> {exercise.baseXp || 0} XP
                          </S.XpBadge>
                          {isOwner && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                flexShrink: 0,
                                visibility: 'visible',
                                opacity: 1,
                                minWidth: '32px',
                                minHeight: '32px',
                                margin: 0,
                                zIndex: 10000
                              }}
                            >
                              <ExerciseActionsMenu
                                onEdit={() => handleEditExercise(exercise.id)}
                                onDelete={() => handleDeleteExercise(exercise.id)}
                                onInactivate={() => handleInactivateExercise(exercise.id)}
                                isActive={exercise.status === 'PUBLISHED'}
                              />
                            </div>
                          )}
                        </div>
                      </S.CardHeader>
                      <S.CardBody>
                        <S.CardTitle $isDark={isDark}>
                          {exercise.title}
                        </S.CardTitle>
                        <S.CardDescription $isDark={isDark}>
                          {exercise.description || "Resolva este desafio e ganhe experiência"}
                        </S.CardDescription>
                      </S.CardBody>
                      <S.CardFooter>
                        <S.FooterButtons>
                          {isCompleted ? (
                            <S.CompletedButton disabled>
                              <FaCheckCircle />
                              Concluído
                            </S.CompletedButton>
                          ) : exercise.status === 'PUBLISHED' ? (
                            <S.StartButton
                              onClick={() => {
                                setSelectedExercise({ ...exercise, isCompleted });
                              }}
                            >
                              Iniciar Desafio
                            </S.StartButton>
                          ) : (
                            <S.StartButton disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                              Desafio Indisponível
                            </S.StartButton>
                          )}
                        </S.FooterButtons>
                      </S.CardFooter>
                    </S.ExerciseCard>
                  );
                })}
                {exercises.length > 3 && (
                  <div style={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center', 
                    padding: '20px',
                    border: '2px dashed var(--color-border)',
                    borderRadius: '12px'
                  }}>
                    <p style={{ margin: '0 0 16px 0', color: 'var(--color-text-secondary)' }}>
                      E mais {exercises.length - 3} Desafios...
                    </p>
                    <NavLink to={`/grupos/${group.id}/exercicios`}>
                      Ver Todos os {exercises.length} Desafios
                    </NavLink>
                  </div>
                )}
              </S.RecommendationsGrid>
            ) : (
              <EmptyExercisesState>
                <EmptyExercisesTitle>
                  {canCreateExercises ? "Nenhum Desafio criado ainda" : "Nenhum Desafio no grupo"}
                </EmptyExercisesTitle>
                <EmptyExercisesText>
                  {canCreateExercises 
                    ? "Seja o primeiro a criar um Desafio para este grupo!"
                    : "Os membros do grupo ainda não criaram Desafios."
                  }
                </EmptyExercisesText>
              </EmptyExercisesState>
            )}
          </ExercisesSection>
        </Content>

        {/* Confirmação: Sair do Grupo ou Excluir (se dono) */}
        <ConfirmationModal
          isOpen={confirmLeaveOpen}
          onClose={() => setConfirmLeaveOpen(false)}
          onConfirm={async () => {
            if (leaveAsOwner) {
              await doDeleteGroup();
            } else {
              await doLeaveGroup();
            }
          }}
          title={leaveAsOwner ? "Excluir grupo ao sair" : "Confirmar saída do grupo"}
          message={
            leaveAsOwner
              ? "Você é o dono do grupo. Ao sair, o grupo será EXCLUÍDO para todos os membros. Tem certeza que deseja excluir? Esta ação não pode ser desfeita."
              : "Tem certeza que deseja sair do grupo? Você perderá acesso aos desafios e ao ranking deste grupo."
          }
          confirmText={leaveAsOwner ? "Excluir grupo" : "Sair do grupo"}
          cancelText="Cancelar"
          type="danger"
        />

        {/* Confirmação: Excluir Grupo */}
        <ConfirmationModal
          isOpen={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={doDeleteGroup}
          title="Confirmar exclusão do grupo"
          message="Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          type="danger"
        />

        <CreateExerciseModal
          isOpen={showCreateExerciseModal}
          onClose={() => setShowCreateExerciseModal(false)}
          onSubmit={handleCreateExercise}
        />

        <EditGroupExerciseModal
          isOpen={showEditExerciseModal}
          onClose={() => {
            setShowEditExerciseModal(false);
            setEditingExercise(null);
          }}
          onSubmit={handleUpdateExercise}
          exercise={editingExercise}
          groupId={id!}
          groupName={group.name}
          userRole={getUserRole()}
        />

        {selectedExercise && (
          <ChallengeModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            onTest={handleTestChallenge}
            onSubmit={handleSubmitChallenge}
          />
        )}

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={confirmModal.handleCancel}
          onConfirm={confirmModal.handleConfirm}
          title={confirmModal.options.title}
          message={confirmModal.options.message}
          confirmText={confirmModal.options.confirmText}
          cancelText={confirmModal.options.cancelText}
          type={confirmModal.options.type}
          isLoading={confirmModal.isLoading}
        />
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupDetailsPage;
const RankingLink = styled(Link)`
  padding: 0.75rem 1.25rem;
  min-width: 160px;
  background: var(--gradient-yellow);
  color: white;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;

  &:hover {
    box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
    transform: translateY(-1px);
    text-decoration: none;
    color: white;
  }
`;
