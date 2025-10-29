import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Group } from '../../types/group.types';
import { groupService } from '../../services/group.service';
import GroupCard from '../../components/Groups/GroupCard';
import styled from 'styled-components';
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
  color: #333;
  margin: 0;
  font-size: 2rem;
`;

const CreateButton = styled(Link)`
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  text-align: center;

  &:hover {
    background: #0056b3;
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

const GroupListPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth();
  
    const loadGroups = async () => {
      try {
        const response = await groupService.listPublic();
        setGroups(response.items);
      } catch (error: any) {
        console.error('Erro ao carregar grupos:', error);
        alert(error.message || 'Erro ao carregar grupos');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      loadGroups();
    }, []);
  
    const handleJoinGroup = async (groupId: string) => {
      if (!isAuthenticated) {
        alert('Você precisa estar logado para entrar em um grupo');
        return;
      }
  
      try {
        await groupService.join(groupId);
        alert('Você entrou no grupo com sucesso!');
        loadGroups();
      } catch (error: any) {
        alert(error.message || 'Erro ao entrar no grupo');
      }
    };
  
    // CORREÇÃO: Garantir que sempre retorna boolean
    const isUserMember = (group: Group): boolean => {
      return !!group.members?.some(member => member.userId === user?.id);
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
        <Header>
          <Title>Grupos de Estudo</Title>
          {isAuthenticated && (
            <CreateButton to="/grupos/novo">
              Criar Novo Grupo
            </CreateButton>
          )}
        </Header>
  
        <GroupsGrid>
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isAuthenticated={isAuthenticated}
              isUserMember={isUserMember(group)}      // Agora sempre boolean
              isUserOwner={isUserOwner(group)}        // Agora sempre boolean
              onJoinGroup={handleJoinGroup}
            />
          ))}
        </GroupsGrid>
  
        {groups.length === 0 && !loading && (
          <EmptyState>
            <EmptyStateTitle>Nenhum grupo público encontrado</EmptyStateTitle>
            <EmptyStateText>Seja o primeiro a criar um grupo!</EmptyStateText>
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