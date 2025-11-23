import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Group } from "../../types/group.types";
import { Exercise } from "../../types";
import { groupService } from "../../services/group.service";
import { exercisesService } from "../../services/exercises.service";
import { userService } from "../../services/user.service";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import ExerciseCard from "@components/ExerciseCard";
import CreateExerciseModal, { CreateExerciseData } from "@/components/CreateExerciseModal";
import EditGroupExerciseModal, { UpdateGroupExerciseData } from "../../components/Groups/EditGroupExerciseModal";
import { useGroupNotification } from "../../hooks/useGroupNotification";
import GroupNotification from "../../components/Groups/GroupNotification";
import ConfirmationModal from "@/components/ConfirmationModal";

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--color-text-primary);
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.p`
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.6;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  color: var(--color-text-light);
  font-size: 0.875rem;
`;

const ActionsSection = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(2, auto);
  gap: 12px;
  align-items: flex-start;
`;

// Removido o fix de primeira linha para evitar reflow inesperado

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: "secondary" | "danger" }>`
  padding: 0.65rem 1rem;
  width: 180px;
  border-radius: 6px;
  font-size: 0.875rem;
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

          .dark & {
            color: white;
          }
        `;
      case "danger":
        return `
          background: var(--color-red-600);
          color: white;
          border-color: var(--color-red-600);
        `;
      default:
        return `
          background: var(--color-blue-500);
          color: white;
          border-color: var(--color-blue-500);
        `;
    }
  }}

  &:disabled {
    background: var(--color-gray-400);
    border-color: var(--color-gray-400);
    cursor: not-allowed;
  }
`;

const LinkButton = styled(Link)`
  padding: 0.65rem 1rem;
  width: 180px;
  background: var(--color-blue-500);
  color: white;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--color-blue-500);

  .dark & {
    color: white;
  }

  &:hover,
  &:focus {
    color: white !important;
    background: var(--color-blue-500);
    border-color: var(--color-blue-500);
    text-decoration: none;
  }
`;

const NavLink = styled(Link)`
  padding: 0.65rem 1rem;
  width: 180px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--color-border);

  .dark & {
    color: white;
  }
`;

const ProgressLink = styled(Link)`
  padding: 0.65rem 1rem;
  width: 180px;
  background: var(--color-green-500);
  color: white;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--color-green-500);

  .dark & {
    color: white;
  }

  &:hover,
  &:focus {
    color: white !important;
    background: var(--color-green-500);
    border-color: var(--color-green-500);
    text-decoration: none;
  }
`;

const Content = styled.div`
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
`;

const Section = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
  font-size: 1.25rem;
`;

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MemberItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MemberName = styled.span`
  font-weight: 500;
  color: var(--color-text-primary);
`;

const MemberAvatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border);
`;

const MemberAvatarFallback = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-blue-100);
  color: var(--color-blue-700);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--color-border);
`;

const MemberNameLink = styled.span`
  color: var(--color-blue-600);
  font-weight: 600;
  &:hover {
    color: var(--color-blue-700);
    text-decoration: underline;
  }
`;

const MemberRole = styled.span<{ role: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;

  ${(props) =>
    props.role === "MODERATOR"
      ? `
    background: var(--color-yellow-100);
    color: var(--color-yellow-700);
    border: 1px solid var(--color-yellow-300);
  `
      : `
    background: var(--color-blue-100);
    color: var(--color-blue-700);
    border: 1px solid var(--color-blue-300);
  `}
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
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
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

  const [group, setGroup] = useState<Group | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [memberNames, setMemberNames] = useState<Record<string, string>>({});
  const [memberAvatars, setMemberAvatars] = useState<Record<string, string | null>>({});
  
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showEditExerciseModal, setShowEditExerciseModal] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [leaveAsOwner, setLeaveAsOwner] = useState(false);
  const { notifications, removeNotification, showError, showSuccess } = useGroupNotification();

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
    if (!confirm('Tem certeza que deseja excluir este Desafio?')) return;

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

    if (!confirm(`Tem certeza que deseja ${action} o Desafio "${exercise.title}"?`)) return;

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
        {notifications.map((notification) => (
          <GroupNotification
            key={notification.id}
            variant={notification.variant}
            title={notification.title}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
        
        <BackButton to="/grupos">← Voltar para Grupos</BackButton>
        
        <Header>
          <TitleSection>
            <Title>{group.name}</Title>
            <Description>{group.description || "Sem descrição"}</Description>
            <MetaInfo>
              <span>👥 {group.memberCount ?? group.members?.length ?? 0} membros</span>
              <span>
                {group.visibility === "PUBLIC" ? "🌐 Público" : "🔒 Privado"}
              </span>
              <span>
                Criado em:{" "}
                {new Date(group.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </MetaInfo>
          </TitleSection>

          <ActionsSection>
            {isAuthenticated &&
              !isUserMember &&
              group.visibility === "PUBLIC" && (
                <Button onClick={handleJoin} disabled={actionLoading}>
                  {actionLoading ? "Entrando..." : "Entrar no Grupo"}
                </Button>
              )}

            {isAuthenticated && isUserMember && (
              <Button
                variant="danger"
                onClick={() => { setLeaveAsOwner(isUserOwner); setConfirmLeaveOpen(true); }}
                disabled={actionLoading}
              >
                {actionLoading ? "Saindo..." : "Sair do Grupo"}
              </Button>
            )}

            {isUserMember && (
              <>
                <NavLink to={`/grupos/${group.id}/exercicios`}>
                  Ver Desafios
                </NavLink>
                
                <ProgressLink to={`/grupos/${group.id}/progresso`}>
                  Meu Progresso
                </ProgressLink>

                <RankingLink to={`/grupos/${group.id}/ranking`}>
                  Ranking do Grupo
                </RankingLink>
              </>
            )}

            {(isUserOwner || isUserModerator) && (
              <>
                <LinkButton to={`/grupos/${group.id}/membros`}>
                  Gerenciar Membros
                </LinkButton>
                {group.visibility === 'PRIVATE' && (
                  <>
                    {!inviteLink && (
                      <Button
                        onClick={handleGenerateInviteLink}
                        disabled={generatingLink}
                      >
                        {generatingLink ? "Gerando..." : "Gerar Link de Convite"}
                      </Button>
                    )}
                  </>
                )}
              </>
            )}

            {isUserOwner && (
              <>
                <LinkButton to={`/grupos/${group.id}/editar`}>
                  Editar Grupo
                </LinkButton>
                <Button
                  variant="danger"
                  onClick={() => setConfirmDeleteOpen(true)}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Excluindo..." : "Excluir Grupo"}
                </Button>
              </>
            )}
          </ActionsSection>
        </Header>

        {/* Mostrar link de convite se gerado */}
        {inviteLink && (isUserOwner || isUserModerator) && group.visibility === 'PRIVATE' && (
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
        )}

        <Content>
          <Section>
            <SectionTitle>Membros do Grupo</SectionTitle>
            <MembersList>
              {group.members && group.members.length > 0 ? (
                group.members.map((member) => (
                  <MemberItem key={member.userId}>
                    <MemberInfo>
                      {memberAvatars[member.userId] ? (
                        <MemberAvatar src={memberAvatars[member.userId] as string} alt={memberNames[member.userId]} />
                      ) : (
                        <MemberAvatarFallback>
                          {(memberNames[member.userId] || 'U').charAt(0)}
                        </MemberAvatarFallback>
                      )}
                      <MemberName>
                        {member.userId === group.ownerUserId ? "👑 " : ""}
                        <Link to={`/perfil/${member.userId}`} style={{ textDecoration: 'none' }}>
                          <MemberNameLink>
                            {memberNames[member.userId] || `Usuário ${member.userId}`}
                          </MemberNameLink>
                        </Link>
                        {member.userId === user?.id && " (Você)"}
                      </MemberName>
                      <MemberRole role={member.role}>
                        {member.role === "MODERATOR" ? "Moderador" : "Membro"}
                        {member.userId === group.ownerUserId ? " (Dono)" : ""}
                      </MemberRole>
                    </MemberInfo>
                    <div>
                      <small>
                        Entrou em:{" "}
                        {new Date(member.joinedAt).toLocaleDateString("pt-BR")}
                      </small>
                    </div>
                  </MemberItem>
                ))
              ) : (
                <p>Nenhum membro no grupo.</p>
              )}
            </MembersList>
          </Section>

          <ExercisesSection>
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
              <ExercisesGrid>
                {exercises.slice(0, 3).map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    id={exercise.id}
                    publicCode={exercise.publicCode ?? undefined}
                    title={exercise.title}
                    description={exercise.description || ''}
                    icon="💻"
                    votes={0}
                    comments={0}
                    lastModified={new Date(exercise.updatedAt || exercise.createdAt).toLocaleDateString('pt-BR')}
                    status={exercise.status}
                    onEdit={() => handleEditExercise(exercise.id)}
                    onDelete={() => handleDeleteExercise(exercise.id)}
                    onInactivate={() => handleInactivateExercise(exercise.id)}
                  />
                ))}
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
              </ExercisesGrid>
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
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupDetailsPage;
const RankingLink = styled(Link)`
  padding: 0.65rem 1rem;
  width: 180px;
  background: var(--color-yellow-500);
  color: white;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: none;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid var(--color-yellow-500);

  &:hover,
  &:focus {
    color: white !important;
    background: var(--color-yellow-600);
    border-color: var(--color-yellow-600);
    text-decoration: none;
  }
`;
