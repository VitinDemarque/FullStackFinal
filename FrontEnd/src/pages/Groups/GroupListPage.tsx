import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Group } from "../../types/group.types";
import { groupService } from "../../services/group.service";
import GroupCard from "../../components/Groups/GroupCard";
import { motion, AnimatePresence } from "framer-motion";
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

const Title = styled(motion.h1)`
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

const CreateButton = styled(motion(Link))`
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
    transform: translateY(-2px);
  }
`;

const GroupsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
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

const EmptyState = styled(motion.div)`
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

const TabsContainer = styled(motion.div)`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0;
`;

const TabButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
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
    if (!isAuthenticated || !user?.id) {
      showError("Acesso negado", "Você precisa estar logado para entrar em um grupo");
      return;
    }

    try {
      await groupService.join(groupId);
      
      // Busca o grupo atualizado com a lista de membros
      const updatedGroup = await groupService.getById(groupId);
      
      // Atualiza apenas o grupo específico no estado, garantindo que o grupo existe na lista
      setGroups(prevGroups => {
        const groupIndex = prevGroups.findIndex(g => g.id === groupId);
        if (groupIndex !== -1) {
          // Cria um novo array com o grupo atualizado
          const newGroups = [...prevGroups];
          newGroups[groupIndex] = updatedGroup;
          return newGroups;
        }
        // Se o grupo não estiver na lista (caso raro), adiciona ele
        return [...prevGroups, updatedGroup];
      });
      
      showSuccess("Sucesso!", "Você entrou no grupo com sucesso!");
      
      // Não redireciona automaticamente - deixa o usuário ver a atualização do botão
      // Se quiser redirecionar, pode descomentar a linha abaixo:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // setTimeout(() => { navigate(`/grupos/${groupId}`); }, 1500);
    } catch (error: any) {
      showError("Erro ao entrar no grupo", error.message || "Não foi possível entrar no grupo. Tente novamente.");
    }
  };

  // CORREÇÃO: Garantir que sempre retorna boolean
  const isUserMember = (group: Group): boolean => {
    // Se estamos na aba "Meus Grupos", todos os grupos retornados são grupos em que o usuário é membro
    if (activeTab === 'my') {
      return true;
    }
    // Verifica se o grupo tem a propriedade 'role' (indica que o usuário é membro quando vem de listMyGroups)
    if (group.role) {
      return true;
    }
    // Verifica se o usuário está no array de membros
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
        
        <Header>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Grupos de Estudo
          </Title>
          {isAuthenticated && (
            <CreateButton 
              to="/grupos/novo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Criar Novo Grupo
            </CreateButton>
          )}
        </Header>

        <AnimatePresence mode="wait">
          {isAuthenticated && (
            <TabsContainer
              key="tabs"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <TabButton 
                active={activeTab === 'public'} 
                onClick={() => setActiveTab('public')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Grupos Públicos
              </TabButton>
              <TabButton 
                active={activeTab === 'my'} 
                onClick={() => setActiveTab('my')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Meus Grupos
              </TabButton>
            </TabsContainer>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <GroupsGrid
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <GroupCard
                  group={group}
                  isAuthenticated={isAuthenticated}
                  isUserMember={isUserMember(group)}
                  isUserOwner={isUserOwner(group)}
                  onJoinGroup={handleJoinGroup}
                />
              </motion.div>
            ))}
          </GroupsGrid>
        </AnimatePresence>

        <AnimatePresence>
          {groups.length === 0 && !loading && (
            <EmptyState
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
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
                <CreateButton 
                  to="/grupos/novo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Criar Primeiro Grupo
                </CreateButton>
              )}
            </EmptyState>
          )}
        </AnimatePresence>
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupListPage;
