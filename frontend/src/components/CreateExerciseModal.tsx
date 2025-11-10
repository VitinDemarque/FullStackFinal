import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { badgesService, type Badge } from '@/services/badges.service';
import { FaPlus } from 'react-icons/fa';
import CreateBadgeModal from './CreateBadgeModal';
import * as S from '@/styles/components/CreateExerciseModal/styles';

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExerciseData) => Promise<void>;
}

export interface CreateExerciseData {
  title: string;
  subject: string;
  description: string;
  difficulty?: number;
  baseXp: number;
  codeTemplate: string;
  isPublic: boolean;
  languageId?: string;
  triumphantBadgeId?: string;
  highScoreBadgeId?: string;
}

export default function CreateExerciseModal({ isOpen, onClose, onSubmit }: CreateExerciseModalProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [formData, setFormData] = useState<CreateExerciseData>({
    title: '',
    subject: '',
    description: '',
    difficulty: undefined,
    baseXp: 100,
    codeTemplate: '// start coding...',
    isPublic: true,
    languageId: undefined,
    triumphantBadgeId: undefined,
    highScoreBadgeId: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);
  const [isCreateBadgeOpen, setIsCreateBadgeOpen] = useState(false);
  const [createBadgeMode, setCreateBadgeMode] = useState<'triumphant' | 'highScore' | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingBadges(true);
    badgesService.getAll().then((list) => {
      setBadges(Array.isArray(list) ? list : []);
    }).finally(() => setLoadingBadges(false));
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validação manual para garantir obrigatoriedade
    if (!formData.title.trim() || !formData.subject.trim() || !formData.description.trim() ||
        formData.difficulty === undefined || formData.difficulty === null ||
        formData.codeTemplate.trim().length === 0) {
      setFormError('Preencha todos os campos obrigatórios: Título, Assunto, Descrição, Dificuldade e Template de Código.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateExerciseData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        difficulty: formData.difficulty,
        baseXp: formData.baseXp,
        codeTemplate: formData.codeTemplate,
        isPublic: formData.isPublic,
        languageId: formData.languageId
      };
      if (isAdmin) {
        payload.triumphantBadgeId = formData.triumphantBadgeId;
        payload.highScoreBadgeId = formData.highScoreBadgeId;
      }
      await onSubmit(payload);
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
      subject: '',
      description: '',
      difficulty: undefined,
      baseXp: 100,
      codeTemplate: '// start coding...',
      isPublic: true,
      languageId: undefined,
      triumphantBadgeId: undefined,
      highScoreBadgeId: undefined,
    });
    setFormError('');
    onClose();
  };

  const handleInputChange = (field: keyof CreateExerciseData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBadgeCreated = async (created: Badge) => {
    setBadges((prev) => [created, ...(Array.isArray(prev) ? prev : [])]);
    setFormData((prev) => {
      if (createBadgeMode === 'triumphant') {
        return { ...prev, triumphantBadgeId: created._id };
      }
      return { ...prev, highScoreBadgeId: created._id };
    });
    setIsCreateBadgeOpen(false);
    setCreateBadgeMode(null);
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

          {isAdmin && (
            <S.Row>
              <S.FieldGroup>
                <S.Label htmlFor="triumphantBadgeId">Emblema Triunfante</S.Label>
                <S.InlineControls>
                  <S.Select
                    id="triumphantBadgeId"
                    value={formData.triumphantBadgeId || ''}
                    onChange={(e) => handleInputChange('triumphantBadgeId', e.target.value || undefined)}
                  >
                    <option value="">(nenhuma)</option>
                    {(Array.isArray(badges) ? badges.filter(b => b.isTriumphant) : []).map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </S.Select>
                  <S.AddBadgeButton
                    type="button"
                    aria-label="Criar emblema"
                    title="Criar emblema"
                    onClick={() => { setCreateBadgeMode('triumphant'); setIsCreateBadgeOpen(true); }}
                  >
                    <FaPlus />
                  </S.AddBadgeButton>
                </S.InlineControls>
              </S.FieldGroup>

              {/* Raridade removida do formulário de exercício; agora definida no modal de criação de emblema */}
            </S.Row>
          )}

          {isAdmin && (
            <S.Row>
              <S.FieldGroup>
                <S.Label htmlFor="highScoreBadgeId">Emblema de Maior Pontuação</S.Label>
                <S.InlineControls>
                  <S.Select
                    id="highScoreBadgeId"
                    value={formData.highScoreBadgeId || ''}
                    onChange={(e) => handleInputChange('highScoreBadgeId', e.target.value || undefined)}
                  >
                    <option value="">(nenhuma)</option>
                    {(Array.isArray(badges) ? badges : []).map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </S.Select>
                  <S.AddBadgeButton
                    type="button"
                    aria-label="Criar emblema"
                    title="Criar emblema"
                    onClick={() => { setCreateBadgeMode('highScore'); setIsCreateBadgeOpen(true); }}
                  >
                    <FaPlus />
                  </S.AddBadgeButton>
                </S.InlineControls>
              </S.FieldGroup>
            </S.Row>
          )}

          <S.FieldGroup>
            <S.Label htmlFor="subject">Assunto *</S.Label>
            <S.Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Ex: Desenvolvimento Web, Backend, Frontend..."
              required
            />
          </S.FieldGroup>

          <S.FieldGroup>
            <S.Label htmlFor="description">Descrição *</S.Label>
            <S.TextArea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva o Desafio..."
              rows={3}
              required
            />
          </S.FieldGroup>

          <S.Row>
            <S.FieldGroup>
              <S.Label htmlFor="difficulty">Dificuldade *</S.Label>
              <S.Select
                id="difficulty"
                value={formData.difficulty ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) return handleInputChange('difficulty', undefined);
                  handleInputChange('difficulty', parseInt(value));
                }}
                required
              >
                <option value="">Selecione</option>
                <option value={1}>Fácil</option>
                <option value={2}>Médio</option>
                <option value={3}>Intermediário</option>
                <option value={4}>Difícil</option>
                <option value={5}>Profissional</option>
              </S.Select>
            </S.FieldGroup>

            <S.FieldGroup>
              <S.Label htmlFor="baseXp">XP Base *</S.Label>
              <S.Input
                id="baseXp"
                type="number"
                min="0"
                value={formData.baseXp}
                onChange={(e) => handleInputChange('baseXp', parseInt(e.target.value))}
                required
              />
            </S.FieldGroup>
          </S.Row>

          <S.FieldGroup>
            <S.Label htmlFor="codeTemplate">Template de Código *</S.Label>
            <S.CodeTextArea
              id="codeTemplate"
              value={formData.codeTemplate}
              onChange={(e) => handleInputChange('codeTemplate', e.target.value)}
              placeholder="// Digite o código inicial..."
              rows={6}
              required
            />
          </S.FieldGroup>

          {formError && (
            <S.FormAlert aria-live="polite">{formError}</S.FormAlert>
          )}

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

        {isAdmin && isCreateBadgeOpen && createBadgeMode && (
          <CreateBadgeModal
            isOpen={isCreateBadgeOpen}
            onClose={() => setIsCreateBadgeOpen(false)}
            onCreated={handleBadgeCreated}
            mode={createBadgeMode}
          />
        )}
      </S.Modal>
    </S.Overlay>
  );
}