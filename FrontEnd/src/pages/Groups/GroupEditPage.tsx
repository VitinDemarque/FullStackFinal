import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { groupService } from '../../services/group.service';
import { Group, GroupVisibility } from '../../types/group.types';
import styled from 'styled-components';
import AuthenticatedLayout from '@components/Layout/AuthenticatedLayout';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
`;

const Form = styled.form`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
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

const Button = styled.button<{ variant?: 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

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

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
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

const GroupEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

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
      alert('Grupo atualizado com sucesso!');
      navigate(`/grupos/${updatedGroup.id}`);
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar grupo');
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
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
    </AuthenticatedLayout>
  );
};

export default GroupEditPage;