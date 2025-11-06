import { useState } from 'react';
import * as S from '@/styles/components/CreateExerciseModal/styles';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExerciseData) => Promise<void>;
}

export interface CreateExerciseData {
  title: string;
  description: string;
  difficulty: number;
  baseXp: number;
  codeTemplate: string;
  isPublic: boolean;
  languageId?: string;
}

export default function CreateExerciseModal({ isOpen, onClose, onSubmit }: CreateExerciseModalProps) {
  const [formData, setFormData] = useState<CreateExerciseData>({
    title: '',
    description: '',
    difficulty: 1,
    baseXp: 100,
    codeTemplate: '// start coding...',
    isPublic: true,
    languageId: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      // Error handled by parent component
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
      isPublic: true,
      languageId: undefined
    });
    onClose();
  };

  const handleInputChange = (field: keyof CreateExerciseData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={handleClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>Criar Novo Desafio</S.Title>
          <S.CloseButton onClick={handleClose}>×</S.CloseButton>
        </S.Header>

        <S.Form onSubmit={handleSubmit}>
          <S.FieldGroup>
            <S.Label htmlFor="title">Título *</S.Label>
            <S.Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Digite o título do Desafio"
              required
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label htmlFor="description">Descrição</S.Label>
            <S.TextArea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o Desafio..."
              rows={3}
            />
          </S.FieldGroup>

          <S.Row>
            <S.FieldGroup>
              <S.Label htmlFor="difficulty">Dificuldade</S.Label>
              <S.Select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
              >
                <option value={1}>Fácil</option>
                <option value={2}>Médio</option>
                <option value={3}>Intermediário</option>
                <option value={4}>Difícil</option>
                <option value={5}>Profissional</option>
              </S.Select>
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label htmlFor="baseXp">XP Base</S.Label>
              <S.Input
                id="baseXp"
                type="number"
                min="0"
                value={formData.baseXp}
                onChange={(e) => handleInputChange('baseXp', parseInt(e.target.value))}
              />
            </S.FieldGroup>
          </S.Row>

          <S.FieldGroup>
            <S.Label htmlFor="codeTemplate">Template de Código</S.Label>
            <S.CodeTextArea
              id="codeTemplate"
              value={formData.codeTemplate}
              onChange={(e) => handleInputChange('codeTemplate', e.target.value)}
              placeholder="// Digite o código inicial..."
              rows={6}
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.CheckboxGroup>
              <S.Checkbox
                id="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              />
              <S.CheckboxLabel htmlFor="isPublic">
                Desafio público (visível para todos)
              </S.CheckboxLabel>
            </S.CheckboxGroup>
          </S.FieldGroup>

          <S.ButtonGroup>
            <S.CancelButton type="button" onClick={handleClose}>
              Cancelar
            </S.CancelButton>
            <S.SubmitButton type="submit" disabled={isSubmitting || !formData.title.trim()}>
              {isSubmitting ? 'Criando...' : 'Criar Desafio'}
            </S.SubmitButton>
          </S.ButtonGroup>
        </S.Form>
      </S.Modal>
    </S.Overlay>
  );
}