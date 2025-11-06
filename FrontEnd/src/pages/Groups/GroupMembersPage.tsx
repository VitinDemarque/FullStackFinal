import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { groupService } from "../../services/group.service";
import { userService } from "../../services/user.service";
import { Group } from "../../types/group.types";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
`;

const Content = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #f8f9fa;
  }
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.span`
  font-weight: 500;
  color: #333;
`;

const MemberMeta = styled.span`
  font-size: 0.875rem;
  color: #666;
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
          background: #fff3e0;
          color: #f57c00;
        `;
      case "OWNER":
        return `
          background: #fce4ec;
          color: #c2185b;
        `;
      default:
        return `
          background: #e3f2fd;
          color: #1976d2;
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
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "danger"
      ? `
    color: #dc3545;
    border-color: #dc3545;

    &:hover {
      background: #dc3545;
      color: white;
    }
  `
      : `
    color: #007bff;
    border-color: #007bff;

    &:hover {
      background: #007bff;
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
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background: #545b62;
  }
`;

const GroupMembersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [memberNames, setMemberNames] = useState<Record<string, string>>({});

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
    const fetchNames = async () => {
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
              return [uid, profile.user.name] as const;
            } catch {
              try {
                const user = await userService.getById(uid);
                return [uid, user.name] as const;
              } catch {
                return [uid, `Usuário ${uid}`] as const;
              }
            }
          })
        );

        const map: Record<string, string> = {};
        pairs.forEach(([uid, name]) => {
          map[uid] = name;
        });
        setMemberNames((prev) => ({ ...prev, ...map }));
      } catch {}
    };

    fetchNames();
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
      alert("Usuário promovido a moderador!");
      loadGroup();
    } catch (error: any) {
      alert(error.message || "Erro ao promover usuário");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemoteToMember = async (targetUserId: string) => {
    if (!id || !canManageMembers) return;

    setActionLoading(targetUserId);
    try {
      await groupService.setMemberRole(id, targetUserId, "MEMBER");
      alert("Usuário destituído de moderador!");
      loadGroup();
    } catch (error: any) {
      alert(error.message || "Erro ao destituir usuário");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (
    targetUserId: string,
    targetUserName: string
  ) => {
    if (!id || !canManageMembers) return;

    if (!confirm(`Tem certeza que deseja remover ${targetUserName} do grupo?`))
      return;

    setActionLoading(targetUserId);
    try {
      await groupService.removeMember(id, targetUserId);
      alert("Membro removido do grupo!");
      loadGroup();
    } catch (error: any) {
      alert(error.message || "Erro ao remover membro");
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
        <BackButton onClick={() => navigate(`/grupos/${id}`)}>
          ← Voltar para o Grupo
        </BackButton>

        <Header>
          <Title>Gerenciar Membros</Title>
          <Subtitle>
            {group.name} - {group.members?.length || 0} membros
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
                      <MemberDetails>
                        <MemberName>
                          {memberNames[member.userId] || `Usuário ${member.userId}`}
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
                            onClick={() =>
                              handleRemoveMember(
                                member.userId,
                                memberNames[member.userId] || `Usuário ${member.userId}`
                              )
                            }
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
