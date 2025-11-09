import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Exercise } from "../../types";

// Reutilizando os mesmos estilos do CreateGroupExerciseModal com alguns adicionais
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

const HelpText = styled.span`
  font-size: 0.75rem;
  color: var(--color-gray-600);
  margin-top: 4px;
  display: block;
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

export interface UpdateGroupExerciseData {
  title: string;
  subject: string;
  description: string;
  difficulty: number;
  baseXp: number;
  codeTemplate: string;
  languageId?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  groupId: string;
}

interface EditGroupExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateGroupExerciseData) => Promise<void>;
  exercise: Exercise | null;
  groupId: string;
  groupName: string;
  userRole: 'MEMBER' | 'MODERATOR' | 'OWNER';
}

export default function EditGroupExerciseModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  exercise,
  groupId,
  groupName,
  userRole
}: EditGroupExerciseModalProps) {
  const [formData, setFormData] = useState<UpdateGroupExerciseData>({
    title: '',
    subject: '',
    description: '',
    difficulty: 1,
    baseXp: 100,
    codeTemplate: '// start coding...',
    languageId: undefined,
    status: 'DRAFT',
    groupId: groupId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canPublish = userRole === 'MODERATOR' || userRole === 'OWNER';

  useEffect(() => {
    if (exercise) {
      setFormData({
        title: exercise.title || '',
        subject: exercise.subject || '',
        description: exercise.description || '',
        difficulty: exercise.difficulty || 1,
        baseXp: exercise.baseXp || 100,
        codeTemplate: exercise.codeTemplate || '// start coding...',
        languageId: exercise.languageId || undefined,
        status: exercise.status || 'DRAFT',
        groupId: groupId
      });
    }
  }, [exercise, groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        description: formData.description || ''
      };
      
      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar Desafio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (exercise) {
      setFormData({
        title: exercise.title || '',
        subject: exercise.subject || '',
        description: exercise.description || '',
        difficulty: exercise.difficulty || 1,
        baseXp: exercise.baseXp || 100,
        codeTemplate: exercise.codeTemplate || '// start coding...',
        languageId: exercise.languageId || undefined,
        status: exercise.status || 'DRAFT',
        groupId: groupId
      });
    }
    onClose();
  };

  const handleInputChange = (field: keyof UpdateGroupExerciseData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !exercise) return null;

  return (
    <Overlay onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            Editar Desafio
            <GroupNameBadge>{groupName}</GroupNameBadge>
          </Title>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </Header>

        <GroupInfo>
          <InfoText>
            📝 Editando Desafio do grupo <strong>{groupName}</strong>
            {!canPublish && " - Apenas moderadores podem publicar Desafios"}
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
              placeholder="Digite o título do Desafio"
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="subject">Assunto *</Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Ex: Desenvolvimento Web, Backend, Frontend..."
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
            <HelpText>
              {formData.description.length}/500 caracteres
            </HelpText>
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

          {canPublish && (
            <FieldGroup>
              <Label htmlFor="status">Status do Exercício</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as any)}
              >
                <option value="DRAFT">Rascunho</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ARCHIVED">Arquivado</option>
              </Select>
              <HelpText>
                {formData.status === 'DRAFT' && '📝 Apenas você pode ver este exercício'}
                {formData.status === 'PUBLISHED' && '✅ Visível para todos os membros do grupo'}
                {formData.status === 'ARCHIVED' && '📁 Exercício arquivado (não visível)'}
              </HelpText>
            </FieldGroup>
          )}

          <GroupExerciseNotice>
            <NoticeText>
              👥 <strong>Exercício do Grupo:</strong> Este exercício pertence ao grupo <strong>{groupName}</strong>
              {formData.status === 'PUBLISHED' && ' e está visível para todos os membros'}
            </NoticeText>
          </GroupExerciseNotice>

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </Overlay>
  );
}