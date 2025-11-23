import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { groupService } from "../../services/group.service";
import { userService } from "../../services/user.service";
import { Group } from "../../types/group.types";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import { useGroupNotification } from "../../hooks/useGroupNotification";
import GroupNotification from "../../components/Groups/GroupNotification";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: var(--color-text-primary);
  margin: 0 0 8px 0;

  .dark & {
    color: white;
  }
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  margin: 0;
`;

const Content = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-sm);
`;

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MemberCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: 8px;
  transition: background-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover {
    background: var(--color-surface-hover);
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
  }
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MemberAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border);
`;

const MemberAvatarFallback = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-blue-100);
  color: var(--color-blue-600);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid var(--color-border);
`;

const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.span`
  font-weight: 500;
  color: var(--color-text-primary);
`;

const MemberNameLink = styled.span`
  color: var(--color-blue-600);
  font-weight: 600;
  &:hover {
    color: var(--color-blue-700);
    text-decoration: underline;
  }
`;

const MemberMeta = styled.span`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;

  ${(props) => {
    switch (props.role) {
      case "MODERATOR":
        return `
          background: var(--color-warning-bg);
          color: var(--color-warning-text);
        `;
      case "OWNER":
        return `
          background: var(--color-danger-bg);
          color: var(--color-danger-text);
        `;
      default:
        return `
          background: var(--color-blue-100);
          color: var(--color-blue-600);
        `;
    }
  }}
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button<{ variant?: "danger" }>`
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "danger"
      ? `
    color: var(--color-red-600);
    border-color: var(--color-red-600);

    &:hover {
      background: var(--color-red-600);
      color: white;
    }
  `
      : `
    color: var(--color-blue-600);
    border-color: var(--color-blue-600);

    &:hover {
      background: var(--color-blue-600);
      color: white;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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
  padding: 20px;
  border-radius: 6px;
  text-align: center;
`;

const BackButton = styled.button`
  background: var(--color-gray-200);
  color: var(--color-text-primary);
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    filter: brightness(0.95);
  }

  .dark & {
    background: var(--color-gray-700);
    color: var(--color-text-primary);
  }
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ConfirmModal = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.25rem 1.5rem;
  color: var(--color-text-primary);
`;

const ConfirmTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ConfirmMessage = styled.p`
  margin: 0 0 1rem 0;
  color: var(--color-text-secondary);
  line-height: 1.5;
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const ConfirmCancelButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
`;

const ConfirmDangerButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-red-600);
  background: var(--color-red-600);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
`;

const GroupMembersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [memberNames, setMemberNames] = useState<Record<string, string>>({});
  const [memberAvatars, setMemberAvatars] = useState<Record<string, string | null>>({});
  const { notifications, removeNotification, showError, showSuccess } = useGroupNotification();
  const [confirmTarget, setConfirmTarget] = useState<{ userId: string; userName: string } | null>(null);

  const loadGroup = async () => {
    if (!id) return;

    try {
      const groupData = await groupService.getById(id);
      setGroup(groupData);
    } catch (error: any) {
      // Error loading group
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
  }, [id]);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!group) return;
      try {
        const ids = Array.from(
          new Set([
            ...(group.members?.map((m) => m.userId) || []),
            group.ownerUserId,
          ].filter((uid): uid is string => !!uid))
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
                return [uid, `Usuário`, null] as const;
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
      } catch {}
    };

    fetchMemberData();
  }, [group]);

  const isUserOwner = group?.ownerUserId === user?.id;
  const isUserModerator = group?.members?.some(
    (member) => member.userId === user?.id && member.role === "MODERATOR"
  );

  const canManageMembers = isUserOwner || isUserModerator;

  const handlePromoteToModerator = async (targetUserId: string) => {
    if (!id || !canManageMembers) return;

    setActionLoading(targetUserId);
    try {
      await groupService.setMemberRole(id, targetUserId, "MODERATOR");
      showSuccess("Usuário promovido!", "O usuário foi promovido a moderador com sucesso.");
      loadGroup();
    } catch (error: any) {
      showError("Erro ao promover usuário", error.message || "Não foi possível promover o usuário. Tente novamente.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemoteToMember = async (targetUserId: string) => {
    if (!id || !canManageMembers) return;

    setActionLoading(targetUserId);
    try {
      await groupService.setMemberRole(id, targetUserId, "MEMBER");
      showSuccess("Usuário destituído", "O usuário foi destituído de moderador.");
      loadGroup();
    } catch (error: any) {
      showError("Erro ao destituir usuário", error.message || "Não foi possível destituir o usuário. Tente novamente.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (
    targetUserId: string,
    targetUserName: string
  ) => {
    if (!id || !canManageMembers) return;
    setActionLoading(targetUserId);
    try {
      await groupService.removeMember(id, targetUserId);
      showSuccess("Membro removido", "O membro foi removido do grupo com sucesso.");
      setConfirmTarget(null);
      loadGroup();
    } catch (error: any) {
      showError("Erro ao remover membro", error.message || "Não foi possível remover o membro. Tente novamente.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <LoadingContainer>
          <Spinner>Carregando membros...</Spinner>
        </LoadingContainer>
      </AuthenticatedLayout>
    );
  }

  if (!group) {
    return (
      <AuthenticatedLayout>
        <Container>
          <ErrorMessage>Grupo não encontrado</ErrorMessage>
        </Container>
      </AuthenticatedLayout>
    );
  }

  if (!canManageMembers) {
    return (
      <AuthenticatedLayout>
        <Container>
          <ErrorMessage>
            Você não tem permissão para gerenciar membros deste grupo
          </ErrorMessage>
        </Container>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Container>
        {confirmTarget && (
          <ConfirmOverlay>
            <ConfirmModal role="dialog" aria-modal="true">
              <ConfirmTitle>Remover membro</ConfirmTitle>
              <ConfirmMessage>
                Tem certeza que deseja remover {confirmTarget.userName} do grupo? Esta ação não pode ser desfeita.
              </ConfirmMessage>
              <ConfirmActions>
                <ConfirmCancelButton onClick={() => setConfirmTarget(null)}>Cancelar</ConfirmCancelButton>
                <ConfirmDangerButton onClick={() => handleRemoveMember(confirmTarget.userId, confirmTarget.userName)}>
                  Remover membro
                </ConfirmDangerButton>
              </ConfirmActions>
            </ConfirmModal>
          </ConfirmOverlay>
        )}
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
        
        <BackButton onClick={() => navigate(`/grupos/${id}`)}>
          ← Voltar para o Grupo
        </BackButton>

        <Header>
          <Title>Gerenciar Membros</Title>
          <Subtitle>
            {group.name} - {group.memberCount ?? group.members?.length ?? 0} membros
          </Subtitle>
        </Header>

        <Content>
          <MembersList>
            {group.members && group.members.length > 0 ? (
              group.members.map((member) => {
                const isOwner = member.userId === group.ownerUserId;
                const isCurrentUser = member.userId === user?.id;

                return (
                  <MemberCard key={member.userId}>
                    <MemberInfo>
                      {memberAvatars[member.userId] ? (
                        <MemberAvatar src={memberAvatars[member.userId] as string} alt={memberNames[member.userId]} />
                      ) : (
                        <MemberAvatarFallback>
                          {(memberNames[member.userId] || 'U').charAt(0)}
                        </MemberAvatarFallback>
                      )}
                      <MemberDetails>
                        <MemberName>
                          <Link to={`/perfil/${member.userId}`} style={{ textDecoration: 'none' }}>
                            <MemberNameLink>
                              {memberNames[member.userId] || `Usuário ${member.userId}`}
                            </MemberNameLink>
                          </Link>
                          {isOwner && " 👑"}
                          {isCurrentUser && " (Você)"}
                        </MemberName>
                        <MemberMeta>
                          Entrou em:{" "}
                          {new Date(member.joinedAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </MemberMeta>
                      </MemberDetails>
                    </MemberInfo>

                    <Actions>
                      <RoleBadge role={isOwner ? "OWNER" : member.role}>
                        {isOwner
                          ? "Dono"
                          : member.role === "MODERATOR"
                          ? "Moderador"
                          : "Membro"}
                      </RoleBadge>

                      {canManageMembers && !isOwner && !isCurrentUser && (
                        <>
                          {member.role === "MEMBER" ? (
                            <ActionButton
                              onClick={() =>
                                handlePromoteToModerator(member.userId)
                              }
                              disabled={actionLoading === member.userId}
                            >
                              {actionLoading === member.userId
                                ? "Promovendo..."
                                : "Promover"}
                            </ActionButton>
                          ) : (
                            <ActionButton
                              onClick={() =>
                                handleDemoteToMember(member.userId)
                              }
                              disabled={actionLoading === member.userId}
                            >
                              {actionLoading === member.userId
                                ? "Destituindo..."
                                : "Destituir"}
                            </ActionButton>
                          )}

                          <ActionButton
                            variant="danger"
                            onClick={async () => {
                              let name = memberNames[member.userId];
                              if (!name || /^Usuário(\s|$)/.test(name)) {
                                try {
                                  const profile = await userService.getPublicProfile(member.userId);
                                  name = profile?.user?.name || name;
                                } catch {
                                  try {
                                    const u = await userService.getById(member.userId);
                                    name = u?.name || name;
                                  } catch {
                                    name = name || 'Usuário';
                                  }
                                }
                              }
                              setConfirmTarget({ userId: member.userId, userName: name || 'Usuário' });
                            }}
                            disabled={actionLoading === member.userId}
                          >
                            {actionLoading === member.userId
                              ? "Removendo..."
                              : "Remover"}
                          </ActionButton>
                        </>
                      )}
                    </Actions>
                  </MemberCard>
                );
              })
            ) : (
              <p>Nenhum membro no grupo.</p>
            )}
          </MembersList>
        </Content>
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupMembersPage;
