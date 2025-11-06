import React from 'react';
import { Link } from 'react-router-dom';
import { Group } from '../../types/group.types';
import styled from 'styled-components';

const GroupCardContainer = styled.div`
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
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
  color: var(--color-text-primary);
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
          background: var(--color-blue-100);
          color: var(--color-blue-600);
        `;
      case 'private':
        return `
          background: var(--color-warning-bg);
          color: var(--color-warning-text);
        `;
      case 'owner':
        return `
          background: var(--color-danger-bg);
          color: var(--color-danger-text);
        `;
      case 'member':
        return `
          background: var(--color-blue-100);
          color: var(--color-blue-600);
        `;
      case 'private-info':
        return `
          background: var(--color-gray-200);
          color: var(--color-text-secondary);
        `;
      default:
        return '';
    }
  }}
`;

const GroupDescription = styled.p`
  color: var(--color-text-secondary);
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
  color: var(--color-text-light);
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
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: var(--color-surface);

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
  }
`;

const JoinButton = styled.button`
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:disabled {
    background: var(--color-gray-500);
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
            <MetaText>👥 {group.memberCount ?? group.members?.length ?? 0} membros</MetaText>
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
                Acessar
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