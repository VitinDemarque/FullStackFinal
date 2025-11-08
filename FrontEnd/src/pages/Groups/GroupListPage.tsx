import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Group } from "../../types/group.types";
import { groupService } from "../../services/group.service";
import GroupCard from "../../components/Groups/GroupCard";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import { useGroupNotification } from "../../hooks/useGroupNotification";
import GroupNotification from "../../components/Groups/GroupNotification";

const Container = styled.div`
  max-width: 100%;
  margin: 0; /* alinhado com o sidebar */
  padding: 24px;
  min-height: 100vh;
  background: var(--color-background);
  overflow-x: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes["4xl"]};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: var(--color-text-primary);
  margin: 0;
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

const CreateButton = styled(Link)`
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid var(--color-border);
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
  text-align: center;

  .dark & {
    color: white;
  }

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-blue-400);
    box-shadow: var(--shadow-md);
  }
`;

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyStateTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #333;
`;

const EmptyStateText = styled.p`
  margin: 0 0 24px 0;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ active }) => active ? 'var(--color-blue-400)' : 'var(--color-text-secondary)'};
  cursor: pointer;
  border-bottom: 3px solid ${({ active }) => active ? 'var(--color-blue-400)' : 'transparent'};
  transition: all 0.2s ease;
  position: relative;
  bottom: -2px;

  &:hover {
    color: var(--color-blue-400);
  }
`;

const GroupListPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { notifications, removeNotification, showError, showSuccess } = useGroupNotification();

  const loadGroups = async () => {
    try {
      setLoading(true);
      let response;
      if (activeTab === 'my' && isAuthenticated) {
        response = await groupService.listMyGroups();
      } else {
        response = await groupService.listPublic();
      }
      setGroups(response.items);
    } catch (error: any) {
      showError("Erro ao carregar grupos", error.message || "Não foi possível carregar a lista de grupos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Se não estiver autenticado e tentar ver "meus grupos", volta para públicos
    if (!isAuthenticated && activeTab === 'my') {
      setActiveTab('public');
      return;
    }
    loadGroups();
  }, [activeTab, isAuthenticated]);

  const handleJoinGroup = async (groupId: string) => {
    if (!isAuthenticated) {
      showError("Acesso negado", "Você precisa estar logado para entrar em um grupo");
      return;
    }

    try {
      await groupService.join(groupId);
      showSuccess("Sucesso!", "Você entrou no grupo com sucesso!");
      // Recarrega a lista e depois navega para o grupo
      await loadGroups();
      // Navega para a página do grupo após entrar
      setTimeout(() => {
        navigate(`/grupos/${groupId}`);
      }, 500); // Pequeno delay para mostrar a notificação de sucesso
    } catch (error: any) {
      showError("Erro ao entrar no grupo", error.message || "Não foi possível entrar no grupo. Tente novamente.");
    }
  };

  // CORREÇÃO: Garantir que sempre retorna boolean
  const isUserMember = (group: Group): boolean => {
    return !!group.members?.some((member) => member.userId === user?.id);
  };

  // CORREÇÃO: Garantir que sempre retorna boolean
  const isUserOwner = (group: Group): boolean => {
    return group.ownerUserId === user?.id;
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <LoadingContainer>
          <Spinner>Carregando grupos...</Spinner>
        </LoadingContainer>
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
        
        <Header>
          <Title>Grupos de Estudo</Title>
          {isAuthenticated && (
            <CreateButton to="/grupos/novo">Criar Novo Grupo</CreateButton>
          )}
        </Header>

        {isAuthenticated && (
          <TabsContainer>
            <TabButton 
              active={activeTab === 'public'} 
              onClick={() => setActiveTab('public')}
            >
              Grupos Públicos
            </TabButton>
            <TabButton 
              active={activeTab === 'my'} 
              onClick={() => setActiveTab('my')}
            >
              Meus Grupos
            </TabButton>
          </TabsContainer>
        )}

        <GroupsGrid>
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isAuthenticated={isAuthenticated}
              isUserMember={isUserMember(group)} // Agora sempre boolean
              isUserOwner={isUserOwner(group)} // Agora sempre boolean
              onJoinGroup={handleJoinGroup}
            />
          ))}
        </GroupsGrid>

        {groups.length === 0 && !loading && (
          <EmptyState>
            <EmptyStateTitle>
              {activeTab === 'my' 
                ? 'Você ainda não participa de nenhum grupo' 
                : 'Nenhum grupo público encontrado'}
            </EmptyStateTitle>
            <EmptyStateText>
              {activeTab === 'my' 
                ? 'Explore os grupos públicos ou crie um novo grupo!' 
                : 'Seja o primeiro a criar um grupo!'}
            </EmptyStateText>
            {isAuthenticated && (
              <CreateButton to="/grupos/novo">
                Criar Primeiro Grupo
              </CreateButton>
            )}
          </EmptyState>
        )}
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupListPage;
