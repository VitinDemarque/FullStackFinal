import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { groupService } from '../../services/group.service';
import { Group } from '../../types/group.types';
import styled from 'styled-components';
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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
  color: #333;
  margin: 0 0 8px 0;
`;

const Description = styled.p`
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
  color: #888;
  font-size: 0.875rem;
`;

const ActionsSection = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'secondary' | 'danger' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: #6c757d;
          color: white;

          &:hover {
            background: #545b62;
          }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;

          &:hover {
            background: #c82333;
          }
        `;
      default:
        return `
          background: #007bff;
          color: white;

          &:hover {
            background: #0056b3;
          }
        `;
    }
  }}

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LinkButton = styled(Link)`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;

  &:hover {
    background: #0056b3;
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  color: #333;
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
  border: 1px solid #e0e0e0;
  border-radius: 6px;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MemberName = styled.span`
  font-weight: 500;
`;

const MemberRole = styled.span<{ role: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;

  ${props => props.role === 'MODERATOR' ? `
    background: #fff3e0;
    color: #f57c00;
  ` : `
    background: #e3f2fd;
    color: #1976d2;
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
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
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
      console.error('Erro ao carregar grupo:', error);
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
      alert('Você entrou no grupo!');
      loadGroup();
    } catch (error: any) {
      alert(error.message || 'Erro ao entrar no grupo');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!id || !isAuthenticated) return;

    if (!confirm('Tem certeza que deseja sair do grupo?')) return;

    setActionLoading(true);
    try {
      await groupService.leave(id);
      alert('Você saiu do grupo');
      navigate('/grupos');
    } catch (error: any) {
      alert(error.message || 'Erro ao sair do grupo');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !isAuthenticated) return;

    if (!confirm('Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita.')) return;

    setActionLoading(true);
    try {
      await groupService.delete(id);
      alert('Grupo excluído com sucesso');
      navigate('/grupos');
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir grupo');
    } finally {
      setActionLoading(false);
    }
  };

  const isUserMember = group?.members?.some(member => member.userId === user?.id);
  const isUserOwner = group?.ownerUserId === user?.id;
  const isUserModerator = group?.members?.some(
    member => member.userId === user?.id && member.role === 'MODERATOR'
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
      <Header>
        <TitleSection>
          <Title>{group.name}</Title>
          <Description>{group.description || 'Sem descrição'}</Description>
          <MetaInfo>
            <span>👥 {group.members?.length || 0} membros</span>
            <span>
              {group.visibility === 'PUBLIC' ? '🌐 Público' : '🔒 Privado'}
            </span>
            <span>Criado em: {new Date(group.createdAt).toLocaleDateString('pt-BR')}</span>
          </MetaInfo>
        </TitleSection>

        <ActionsSection>
          {isAuthenticated && !isUserMember && group.visibility === 'PUBLIC' && (
            <Button onClick={handleJoin} disabled={actionLoading}>
              {actionLoading ? 'Entrando...' : 'Entrar no Grupo'}
            </Button>
          )}
          
          {isAuthenticated && isUserMember && (
            <Button variant="secondary" onClick={handleLeave} disabled={actionLoading}>
              {actionLoading ? 'Saindo...' : 'Sair do Grupo'}
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
              <Button variant="danger" onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? 'Excluindo...' : 'Excluir Grupo'}
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
                      {member.userId === group.ownerUserId ? '👑 ' : ''}
                      Usuário {member.userId}
                    </MemberName>
                    <MemberRole role={member.role}>
                      {member.role === 'MODERATOR' ? 'Moderador' : 'Membro'}
                      {member.userId === group.ownerUserId ? ' (Dono)' : ''}
                    </MemberRole>
                  </MemberInfo>
                  <div>
                    <small>
                      Entrou em: {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
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