import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { groupService } from "../../services/group.service";
import { Group } from "../../types/group.types";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";

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
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  font-size: ${({ theme }) => theme.fontSizes.base};

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-border);
    color: var(--color-text-primary);
  }
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
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  &::before {
    content: "{";
    color: var(--color-yellow-400);
    margin-right: 0.25rem;
  }

  &::after {
    content: "}";
    color: var(--color-yellow-400);
    margin-left: 0.25rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes["2xl"]};
  }
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
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ActionsSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: "secondary" | "danger" }>`
  padding: 0.75rem 1.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  box-shadow: var(--shadow-sm);

  ${(props) => {
    switch (props.variant) {
      case "secondary":
        return `
          background: var(--color-surface);
          color: var(--color-text-primary);
          border-color: var(--color-border);

          &:hover {
            background: var(--color-surface-hover);
            border-color: var(--color-blue-400);
            box-shadow: var(--shadow-md);
          }
        `;
      case "danger":
        return `
          background: var(--color-red-600);
          color: white;
          border-color: var(--color-red-600);
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);

          &:hover {
            background: var(--color-red-700);
            border-color: var(--color-red-700);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: var(--color-blue-500);
          color: white;
          border-color: var(--color-blue-500);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);

          &:hover {
            background: var(--color-blue-600);
            border-color: var(--color-blue-600);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:disabled {
    background: var(--color-gray-400);
    border-color: var(--color-gray-400);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const LinkButton = styled(Link)`
  padding: 0.75rem 1.25rem;
  background: var(--color-blue-500);
  color: #fff !important;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--color-blue-500);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);

  &:link,
  &:visited {
    color: #fff !important;
  }

  &:hover {
    background: var(--color-blue-600);
    border-color: var(--color-blue-600);
    color: #fff !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
    transform: translateY(-1px);
  }

  &:active {
    color: #fff !important;
  }
`;

const Content = styled.div`
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
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
  font-size: ${({ theme }) => theme.fontSizes.xl};
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
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MemberName = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: var(--color-text-primary);
`;

const MemberRole = styled.span<{ role: string }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};

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
  font-size: ${({ theme }) => theme.fontSizes.base};
  color: var(--color-text-secondary);
`;

const ErrorMessage = styled.div`
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  border: 1px solid var(--color-red-400);
`;

const GroupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleJoin = async () => {
    if (!id || !isAuthenticated) return;

    setActionLoading(true);
    try {
      await groupService.join(id);
      alert("Você entrou no grupo!");
      loadGroup();
    } catch (error: any) {
      alert(error.message || "Erro ao entrar no grupo");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!id || !isAuthenticated) return;

    if (!confirm("Tem certeza que deseja sair do grupo?")) return;

    setActionLoading(true);
    try {
      await groupService.leave(id);
      alert("Você saiu do grupo");
      navigate("/grupos");
    } catch (error: any) {
      alert(error.message || "Erro ao sair do grupo");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !isAuthenticated) return;

    if (
      !confirm(
        "Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita."
      )
    )
      return;

    setActionLoading(true);
    try {
      await groupService.delete(id);
      alert("Grupo excluído com sucesso");
      navigate("/grupos");
    } catch (error: any) {
      alert(error.message || "Erro ao excluir grupo");
    } finally {
      setActionLoading(false);
    }
  };

  const isUserMember = group?.members?.some(
    (member) => member.userId === user?.id
  );
  const isUserOwner = group?.ownerUserId === user?.id;
  const isUserModerator = group?.members?.some(
    (member) => member.userId === user?.id && member.role === "MODERATOR"
  );

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
        <BackButton to="/grupos">← Voltar</BackButton>
        <Header>
          <TitleSection>
            <Title>{group.name}</Title>
            <Description>{group.description || "Sem descrição"}</Description>
            <MetaInfo>
              <span>👥 {group.members?.length || 0} membros</span>
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
                variant="secondary"
                onClick={handleLeave}
                disabled={actionLoading}
              >
                {actionLoading ? "Saindo..." : "Sair do Grupo"}
              </Button>
            )}

            {(isUserOwner || isUserModerator) && (
              <LinkButton to={`/grupos/${group.id}/membros`}>
                Gerenciar Membros
              </LinkButton>
            )}

            {isUserOwner && (
              <>
                <LinkButton to={`/grupos/${group.id}/editar`}>
                  Editar Grupo
                </LinkButton>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Excluindo..." : "Excluir Grupo"}
                </Button>
              </>
            )}
          </ActionsSection>
        </Header>

        <Content>
          <Section>
            <SectionTitle>Membros do Grupo</SectionTitle>
            <MembersList>
              {group.members && group.members.length > 0 ? (
                group.members.map((member) => (
                  <MemberItem key={member.userId}>
                    <MemberInfo>
                      <MemberName>
                        {member.userId === group.ownerUserId ? "👑 " : ""}
                        Usuário {member.userId}
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
        </Content>
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupDetailsPage;
