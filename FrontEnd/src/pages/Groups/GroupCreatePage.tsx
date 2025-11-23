import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { groupService } from '../../services/group.service';
import { CreateGroupData, GroupVisibility } from '../../types/group.types';
import styled from 'styled-components';
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout';
import { useGroupNotification } from '../../hooks/useGroupNotification';
import GroupNotification from '../../components/Groups/GroupNotification';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  color: var(--color-text-primary);
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

const Form = styled.form`
  background: var(--color-surface);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all 0.3s ease;

  &::placeholder {
    color: var(--color-text-light);
  }

  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    background: var(--color-surface-hover);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  background: var(--color-surface);
  color: var(--color-text-primary);

  &::placeholder {
    color: var(--color-text-light);
  }

  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    background: var(--color-surface-hover);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--color-text-primary);
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

const Button = styled.button<{ variant?: 'secondary' }>`
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.variant === 'secondary' ? `
    background: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);

    &:hover {
      background: var(--color-surface-hover);
      border-color: var(--color-border);
      box-shadow: var(--shadow-md);
    }
  ` : `
    background: var(--color-blue-500);
    color: white;
    border: 1px solid var(--color-blue-500);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);

    &:hover {
      background: var(--color-blue-600);
      border-color: var(--color-blue-600);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
      transform: translateY(-1px);
    }
  `}

  &:disabled {
    background: var(--color-gray-400);
    border-color: var(--color-gray-400);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: var(--color-danger-bg);
  color: var(--color-danger-text);
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid var(--color-red-400);
`;

const GroupCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { notifications, removeNotification, showError, showSuccess } = useGroupNotification();

  const [formData, setFormData] = useState<CreateGroupData>({
    name: '',
    description: '',
    visibility: 'PUBLIC'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showError('Acesso negado', 'Você precisa estar logado para criar um grupo');
      return;
    }

    if (!formData.name.trim()) {
      setError('O nome do grupo é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newGroup = await groupService.create(formData);
      showSuccess('Grupo criado!', 'O grupo foi criado com sucesso.');
      navigate(`/grupos/${newGroup.id}`);
    } catch (error: any) {
      setError(error.message || 'Erro ao criar grupo');
      showError('Erro ao criar grupo', error.message || 'Não foi possível criar o grupo. Tente novamente.');
    } finally {
      setLoading(false);
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
    navigate('/grupos');
  };

  if (!isAuthenticated) {
    return (
      <AuthenticatedLayout>
        <Container>
          <div>Você precisa estar logado para criar um grupo.</div>
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
        <Title>Criar Novo Grupo</Title>
        <Subtitle>Convide pessoas para estudar juntas</Subtitle>
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Grupo'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
    </AuthenticatedLayout>
  );
};

export default GroupCreatePage;