import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { groupService } from '../../services/group.service';
import { Group, GroupVisibility } from '../../types/group.types';
import styled from 'styled-components';
import { ThemedButton, ThemedInput, ThemedTextarea, ThemedCard } from '../../styles/themed-components';
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout';
import { useGroupNotification } from '../../hooks/useGroupNotification';
import GroupNotification from '../../components/Groups/GroupNotification';

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  margin: 0;
`;

const Form = styled(ThemedCard).attrs({ as: 'form' })`
  padding: 30px;
  box-shadow: var(--shadow-md);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const Input = styled(ThemedInput)`
  width: 100%;
`;

const TextArea = styled(ThemedTextarea)`
  width: 100%;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-border);
  }
`;

const RadioInput = styled.input`
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const Button = styled(ThemedButton)`
  padding: 12px 20px;
`;

const ErrorMessage = styled.div`
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid var(--color-red-400);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const Spinner = styled.div`
  font-size: 1.125rem;
  color: var(--color-text-secondary);
`;

const GroupEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const { notifications, removeNotification, showError, showSuccess } = useGroupNotification();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'PUBLIC' as GroupVisibility
  });

  const loadGroup = async () => {
    if (!id) return;

    try {
      const groupData = await groupService.getById(id);
      setGroup(groupData);
      setFormData({
        name: groupData.name,
        description: groupData.description || '',
        visibility: groupData.visibility
      });

      if (groupData.ownerUserId !== user?.id) {
        setError('Apenas o dono do grupo pode editá-lo');
      }
    } catch (error: any) {
      setError(error.message || 'Erro ao carregar grupo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && id) {
      loadGroup();
    }
  }, [id, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !group) return;

    if (!formData.name.trim()) {
      setError('O nome do grupo é obrigatório');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const updatedGroup = await groupService.update(id, formData);
      showSuccess('Grupo atualizado!', 'As alterações foram salvas com sucesso.');
      navigate(`/grupos/${updatedGroup.id}`);
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar grupo');
      showError('Erro ao atualizar grupo', error.message || 'Não foi possível atualizar o grupo. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVisibilityChange = (visibility: GroupVisibility) => {
    setFormData(prev => ({
      ...prev,
      visibility
    }));
  };

  const handleCancel = () => {
    navigate(`/grupos/${id}`);
  };

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
            Grupo não encontrado
          </ErrorMessage>
        </Container>
      </AuthenticatedLayout>
    );
  }

  if (group.ownerUserId !== user?.id) {
    return (
      <AuthenticatedLayout>
        <Container>
          <ErrorMessage>
            Você não tem permissão para editar este grupo
          </ErrorMessage>
        </Container>
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
        <Title>Editar Grupo</Title>
        <Subtitle>Atualize as informações do grupo</Subtitle>
      </Header>

      <Form onSubmit={handleSubmit}>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}

        <FormGroup>
          <Label htmlFor="name">Nome do Grupo *</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Grupo de Estudo de React"
            required
            maxLength={100}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Descrição</Label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva o propósito do grupo..."
            maxLength={500}
          />
        </FormGroup>

        <FormGroup>
          <Label>Visibilidade</Label>
          <RadioGroup>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="visibility"
                value="PUBLIC"
                checked={formData.visibility === 'PUBLIC'}
                onChange={() => handleVisibilityChange('PUBLIC')}
              />
              🌐 Público - Qualquer um pode entrar
            </RadioLabel>
            <RadioLabel>
              <RadioInput
                type="radio"
                name="visibility"
                value="PRIVATE"
                checked={formData.visibility === 'PRIVATE'}
                onChange={() => handleVisibilityChange('PRIVATE')}
              />
              🔒 Privado - Apenas com convite
            </RadioLabel>
          </RadioGroup>
        </FormGroup>

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
    </AuthenticatedLayout>
  );
};

export default GroupEditPage;