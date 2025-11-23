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
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
    background: var(--color-surface-hover);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
`;

const GroupName = styled.h3`
  margin: 0 0 12px 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 700;
  flex: 1;
  line-height: 1.4;
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ variant: 'public' | 'private' | 'owner' | 'member' | 'private-info' }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.variant) {
      case 'public':
        return `
          background: var(--color-blue-100, #dbeafe);
          color: var(--color-blue-600, #1d4ed8);
        `;
      case 'private':
        return `
          background: var(--color-success-bg, #d1fae5);
          color: var(--color-success-text, #065f46);
        `;
      case 'owner':
        return `
          background: var(--color-danger-bg, #fecaca);
          color: var(--color-danger-text, #991b1b);
        `;
      case 'member':
        return `
          background: var(--color-blue-100, #dbeafe);
          color: var(--color-blue-600, #1d4ed8);
        `;
      case 'private-info':
        return `
          background: var(--color-gray-100, #f3f4f6);
          color: var(--color-text-light, #6b7280);
        `;
      default:
        return '';
    }
  }}
`;

const TopBadgeContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
`;

const GroupDescription = styled.p`
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
  font-size: 0.875rem;
  flex: 1;
`;

const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
`;

const GroupMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetaText = styled.span`
  color: var(--color-text-light);
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ActivityInfo = styled.div`
  color: var(--color-text-light);
  font-size: 0.8125rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '•';
    color: var(--color-gray-400, #9ca3af);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const DetailsButton = styled(Link)`
  color: var(--color-text-primary);
  text-decoration: none;
  padding: 10px 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: var(--color-surface);
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-primary);
  }
`;

const JoinButton = styled.button`
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: var(--color-gray-400, #9ca3af);
    cursor: not-allowed;
    box-shadow: none;
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
    const memberCount = group.memberCount ?? group.members?.length ?? 0;
    const daysAgo = Math.floor((Date.now() - new Date(group.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const activityText = daysAgo === 0 ? 'Hoje' : daysAgo === 1 ? '1 dia atrás' : `${daysAgo} dias atrás`;

    return (
      <GroupCardContainer>
        <TopBadgeContainer>
          <Badge variant={group.visibility.toLowerCase() as 'public' | 'private'}>
            {group.visibility === 'PUBLIC' ? 'Grupo Público' : 'Grupo Privado'}
          </Badge>
          {isUserOwner && (
            <Badge variant="owner">Dono</Badge>
          )}
        </TopBadgeContainer>

        <GroupName>{group.name}</GroupName>
        
        <ActivityInfo>
          Criado {activityText} • {memberCount} {memberCount === 1 ? 'Membro' : 'Membros'}
        </ActivityInfo>
        
        <GroupDescription>
          {group.description || 'Sem descrição'}
        </GroupDescription>
        
        <CardFooter>
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
              <JoinButton as="div" style={{ 
                background: 'var(--color-green-400, #10b981)', 
                cursor: 'default',
                pointerEvents: 'none'
              }}>
                ✅ Membro
              </JoinButton>
            )}
  
            {isAuthenticated && group.visibility === 'PRIVATE' && !isUserMember && (
              <DetailsButton as="div" style={{ 
                background: 'var(--color-gray-100, #f3f4f6)',
                color: 'var(--color-text-light, #6b7280)',
                cursor: 'default',
                pointerEvents: 'none',
                borderColor: 'var(--color-border, #e5e7eb)'
              }}>
                🔒 Privado
              </DetailsButton>
            )}
          </ActionsContainer>
        </CardFooter>
      </GroupCardContainer>
    );
  };
  
  export default GroupCard;