import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GroupNameBadge = styled.span`
  background: var(--color-blue-100);
  color: var(--color-blue-700);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  border: 1px solid var(--color-blue-300);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: var(--color-text-secondary);
  
  &:hover {
    color: var(--color-text-primary);
  }
`;

const GroupInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-blue-50);
  border: 1px solid var(--color-blue-200);
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 20px;
`;

const InfoText = styled.span`
  font-size: 0.875rem;
  color: var(--color-blue-700);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
  }
`;

const CodeTextArea = styled(TextArea)`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.75rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--color-surface);
  color: var(--color-text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--color-blue-400);
  }
`;

const GroupExerciseNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 6px;
  padding: 12px;
  margin: 10px 0;
`;

const NoticeText = styled.span`
  font-size: 0.875rem;
  color: var(--color-gray-700);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'secondary' ? `
    background: var(--color-surface);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    
    &:hover {
      background: var(--color-surface-hover);
    }
  ` : `
    background: var(--color-blue-500);
    color: white;
    
    &:hover {
      background: var(--color-blue-600);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export interface CreateGroupExerciseData {
  title: string;
  description: string;
  difficulty: number;
  baseXp: number;
  codeTemplate: string;
  languageId?: string;
  groupId: string;
  status: 'DRAFT' | 'PUBLISHED';
}

interface CreateGroupExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGroupExerciseData) => Promise<void>;
  groupId: string;
  groupName: string;
}

export default function CreateGroupExerciseModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  groupId,
  groupName 
}: CreateGroupExerciseModalProps) {
  const [formData, setFormData] = useState<CreateGroupExerciseData>({
    title: '',
    description: '',
    difficulty: 1,
    baseXp: 100,
    codeTemplate: '// start coding...',
    languageId: undefined,
    groupId: groupId,
    status: 'DRAFT'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      groupId: groupId
    }));
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Erro ao criar Desafio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 1,
      baseXp: 100,
      codeTemplate: '// start coding...',
      languageId: undefined,
      groupId: groupId,
      status: 'DRAFT'
    });
    onClose();
  };

  const handleInputChange = (field: keyof CreateGroupExerciseData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            Criar Desafio
            <GroupNameBadge>{groupName}</GroupNameBadge>
          </Title>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </Header>

        <GroupInfo>
          <InfoText>
            📝 Este Desafio será visível apenas para membros do grupo <strong>{groupName}</strong>
          </InfoText>
        </GroupInfo>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <Label htmlFor="title">Título do Desafio *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Digite o título do exercício"
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="description">Descrição</Label>
            <TextArea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o Desafio para os membros do grupo..."
              rows={3}
            />
          </FieldGroup>

          <Row>
            <FieldGroup>
              <Label htmlFor="difficulty">Dificuldade</Label>
              <Select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
              >
                <option value={1}>Fácil (1)</option>
                <option value={2}>Médio (2)</option>
                <option value={3}>Intermediário (3)</option>
                <option value={4}>Difícil (4)</option>
                <option value={5}>Expert (5)</option>
              </Select>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="baseXp">XP Base</Label>
              <Input
                id="baseXp"
                type="number"
                min="0"
                value={formData.baseXp}
                onChange={(e) => handleInputChange('baseXp', parseInt(e.target.value))}
              />
            </FieldGroup>
          </Row>

          <FieldGroup>
            <Label htmlFor="codeTemplate">Template de Código</Label>
            <CodeTextArea
              id="codeTemplate"
              value={formData.codeTemplate}
              onChange={(e) => handleInputChange('codeTemplate', e.target.value)}
              placeholder="// Digite o código inicial para os membros..."
              rows={6}
            />
          </FieldGroup>

          <GroupExerciseNotice>
            <NoticeText>
              👥 <strong>Desafio de Grupo:</strong> Visível apenas para membros de <strong>{groupName}</strong>
            </NoticeText>
          </GroupExerciseNotice>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
              {isSubmitting ? 'Criando...' : 'Criar Desafio'}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
}