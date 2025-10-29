import React from 'react';
import { Link } from 'react-router-dom';
import { Group } from '../../types/group.types';
import styled from 'styled-components';

const GroupCardContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const GroupName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  flex: 1;
  margin-right: 12px;
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ variant: 'public' | 'private' | 'owner' | 'member' | 'private-info' }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;

  ${props => {
    switch (props.variant) {
      case 'public':
        return `
          background: #e3f2fd;
          color: #1976d2;
        `;
      case 'private':
        return `
          background: #fff3e0;
          color: #f57c00;
        `;
      case 'owner':
        return `
          background: #fce4ec;
          color: #c2185b;
        `;
      case 'member':
        return `
          background: #e8f5e8;
          color: #2e7d32;
        `;
      case 'private-info':
        return `
          background: #f5f5f5;
          color: #666;
        `;
      default:
        return '';
    }
  }}
`;

const GroupDescription = styled.p`
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const GroupMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const MetaText = styled.span`
  color: #888;
  font-size: 0.875rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 480px) {
    justify-content: space-between;
  }
`;

const DetailsButton = styled(Link)`
  color: #007bff;
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid #007bff;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background: #007bff;
    color: white;
  }
`;

const JoinButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #218838;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

interface GroupCardProps {
    group: Group;
    isAuthenticated: boolean;
    isUserMember: boolean;           // Agora é obrigatório
    isUserOwner: boolean;            // Agora é obrigatório
    onJoinGroup: (groupId: string) => void;
  }
  
  const GroupCard: React.FC<GroupCardProps> = ({
    group,
    isAuthenticated,
    isUserMember,
    isUserOwner,
    onJoinGroup
  }) => {
    return (
      <GroupCardContainer>
        <CardHeader>
          <GroupName>{group.name}</GroupName>
          <BadgesContainer>
            <Badge variant={group.visibility.toLowerCase() as 'public' | 'private'}>
              {group.visibility === 'PUBLIC' ? '🌐 Público' : '🔒 Privado'}
            </Badge>
            {isUserOwner && (
              <Badge variant="owner">👑 Dono</Badge>
            )}
          </BadgesContainer>
        </CardHeader>
        
        <GroupDescription>
          {group.description || 'Sem descrição'}
        </GroupDescription>
        
        <CardFooter>
          <GroupMeta>
            <MetaText>👥 {group.members?.length || 0} membros</MetaText>
            <MetaText>
              Criado em: {new Date(group.createdAt).toLocaleDateString('pt-BR')}
            </MetaText>
          </GroupMeta>
          
          <ActionsContainer>
            <DetailsButton to={`/grupos/${group.id}`}>
              Ver Detalhes
            </DetailsButton>
            
            {isAuthenticated && !isUserMember && group.visibility === 'PUBLIC' && (
              <JoinButton onClick={() => onJoinGroup(group.id)}>
                Entrar
              </JoinButton>
            )}
            
            {isAuthenticated && isUserMember && (
              <Badge variant="member">✅ Membro</Badge>
            )}
  
            {isAuthenticated && group.visibility === 'PRIVATE' && !isUserMember && (
              <Badge variant="private-info">🔒 Privado</Badge>
            )}
          </ActionsContainer>
        </CardFooter>
      </GroupCardContainer>
    );
  };
  
  export default GroupCard;