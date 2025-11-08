import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { groupService } from "../../services/group.service";
import styled from "styled-components";
import AuthenticatedLayout from "@components/Layout/AuthenticatedLayout";
import { useGroupNotification } from "../../hooks/useGroupNotification";
import GroupNotification from "../../components/Groups/GroupNotification";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--color-text-primary);
`;

const Card = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
`;

const Message = styled.p`
  color: var(--color-text-secondary);
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--color-blue-500);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    background: var(--color-gray-400);
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--color-blue-600);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const GroupJoinByTokenPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const { notifications, removeNotification, showError, showSuccess } = useGroupNotification();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!isAuthenticated) {
      showError('Acesso negado', 'Você precisa estar logado para entrar no grupo.');
      navigate('/login');
      return;
    }

    if (!token) {
      showError('Token inválido', 'Link de convite inválido ou expirado.');
      navigate('/grupos');
      return;
    }

    // Auto-join quando a página carregar
    if (id && token && isAuthenticated) {
      handleJoin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token, isAuthenticated]);

  const handleJoin = async () => {
    if (!id || !token) return;

    try {
      setLoading(true);
      await groupService.joinByToken(id, token);
      setJoined(true);
      showSuccess('Sucesso!', 'Você entrou no grupo com sucesso!');
      setTimeout(() => {
        navigate(`/grupos/${id}`);
      }, 1500);
    } catch (error: any) {
      showError('Erro ao entrar no grupo', error.message || 'Não foi possível entrar no grupo. O link pode estar expirado ou inválido.');
      setTimeout(() => {
        navigate('/grupos');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !token) {
    return null;
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
        
        <Card>
          {loading && !joined && (
            <>
              <Title>Entrando no grupo...</Title>
              <Message>Por favor, aguarde enquanto processamos seu convite.</Message>
              <LoadingContainer>
                <div>Carregando...</div>
              </LoadingContainer>
            </>
          )}

          {joined && (
            <>
              <Title>✅ Você entrou no grupo!</Title>
              <Message>Redirecionando para a página do grupo...</Message>
            </>
          )}

          {!loading && !joined && (
            <>
              <Title>Entrar no Grupo</Title>
              <Message>
                Você foi convidado para participar deste grupo. Clique no botão abaixo para entrar.
              </Message>
              <Button onClick={handleJoin} disabled={loading}>
                {loading ? "Entrando..." : "Entrar no Grupo"}
              </Button>
            </>
          )}
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
};

export default GroupJoinByTokenPage;

