import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { badgesService, type Badge } from '@/services/badges.service';
import { judge0Service, languagesService } from '@/services/index';
import type { Language } from '@/services/languages.service';
import { useNotification } from '@/components/Notification';
import { FaPlus, FaCode, FaPlayCircle } from 'react-icons/fa';
import CreateBadgeModal from './CreateBadgeModal';
import * as S from '@/styles/components/CreateExerciseModal/styles';
import styled from 'styled-components';

// Componentes estilizados para o editor melhorado
const EditorHeaderStyled = styled.div<{ $isDark: boolean }>`
  padding: 1rem 1.5rem;
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#2d2d2d")};
  color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#d4d4d4")};
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: ${({ $isDark }) =>
    $isDark ? "1px solid #0c1220" : "1px solid #1e1e1e"};
`;

const EditorContainerStyled = styled.div<{ $isDark: boolean }>`
  flex: 1;
  position: relative;
  overflow: auto;
  background: ${({ $isDark }) => ($isDark ? "#0c1220" : "#1e1e1e")};
  min-height: 300px;
`;

const LineNumbers = styled.div<{ $isDark: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  padding: 1rem 0;
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#252526")};
  color: ${({ $isDark }) => ($isDark ? "#94a3b8" : "#858585")};
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 14px;
  line-height: 1.6;
  text-align: right;
  user-select: none;
  border-right: ${({ $isDark }) =>
    $isDark ? "1px solid #0c1220" : "1px solid #1e1e1e"};
  min-width: 50px;
  z-index: 1;
`;

const LineNumber = styled.div`
  padding: 0 1rem;
  height: 22.4px;
`;

const CodeTextareaStyled = styled.textarea<{ $isDark: boolean }>`
  width: 100%;
  height: 100%;
  padding: 1rem 1rem 1rem 70px;
  background: transparent;
  color: ${({ $isDark }) => ($isDark ? "#e2e8f0" : "#d4d4d4")};
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 14px;
  line-height: 1.6;
  border: none;
  outline: none;
  resize: none;
  position: absolute;
  top: 0;
  left: 0;
  min-height: 300px;

  &::selection {
    background: ${({ $isDark }) => ($isDark ? "#1e40af" : "#264f78")};
  }

  &::placeholder {
    color: ${({ $isDark }) => ($isDark ? "#64748b" : "#858585")};
  }
`;

const TestOutputContainer = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? "#0f172a" : "#111827")};
  border-top: 1px solid ${({ $isDark }) => ($isDark ? "#1e293b" : "#1f2937")};
  padding: 1.5rem;
  color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#e2e8f0")};
  min-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TestOutputHeader = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TestOutputContent = styled.pre<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? "#111c2e" : "#1f2a3a")};
  border: 1px solid ${({ $isDark }) => ($isDark ? "#1e2f47" : "#243044")};
  border-radius: 12px;
  padding: 1rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.6;
  color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#e2e8f0")};
  margin: 0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const TestButton = styled.button<{ $isDark: boolean; $isTesting: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ $isDark }) => ($isDark ? "#3b82f6" : "#2563eb")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${({ $isTesting }) => ($isTesting ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  opacity: ${({ $isTesting }) => ($isTesting ? 0.7 : 1)};

  &:hover:not(:disabled) {
    background: ${({ $isDark }) => ($isDark ? "#2563eb" : "#1d4ed8")};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? "#f87171" : "#ef4444")};
  font-size: 0.875rem;
  padding: 0.75rem;
  background: ${({ $isDark }) => ($isDark ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.05)")};
  border-radius: 8px;
  border: 1px solid ${({ $isDark }) => ($isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)")};
`;

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExerciseData) => Promise<void>;
  codeTemplate?: string;
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

export default function CreateExerciseModal({ isOpen, onClose, onSubmit, codeTemplate }: CreateExerciseModalProps) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { NotificationContainer } = useNotification();
  const isAdmin = user?.role === 'ADMIN';
  const [formData, setFormData] = useState<CreateExerciseData>({
    title: '',
    subject: '',
    description: '',
    difficulty: undefined,
    baseXp: 100,
    codeTemplate: codeTemplate || '// start coding...',
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
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  
  const JAVA_LANGUAGE_ID = 62;

  useEffect(() => {
    if (!isOpen) return;
    setLoadingBadges(true);
    badgesService.getAll().then((list) => {
      setBadges(Array.isArray(list) ? list : []);
    }).finally(() => setLoadingBadges(false));
    
    setLoadingLanguages(true);
    languagesService.getAll().then((list) => {
      setLanguages(Array.isArray(list) ? list : []);
      // Se não houver languageId definido e houver Java disponível, definir como padrão
      setFormData(prev => {
        if (!prev.languageId && list.length > 0) {
          const javaLanguage = list.find(l => l.name.toLowerCase() === 'java' || l.slug === 'java');
          if (javaLanguage) {
            return { ...prev, languageId: javaLanguage.id };
          }
        }
        return prev;
      });
    }).finally(() => setLoadingLanguages(false));
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // validação manual para garantir obrigatoriedade
    if (!formData.title.trim() || !formData.subject.trim() || !formData.description.trim() ||
        formData.difficulty === undefined || formData.difficulty === null || !formData.languageId) {
      setFormError('Preencha todos os campos obrigatórios: Título, Assunto, Descrição, Dificuldade e Linguagem.');
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
      codeTemplate: codeTemplate || '// start coding...',
      isPublic: true,
      languageId: undefined,
      triumphantBadgeId: undefined,
      highScoreBadgeId: undefined,
    });
    setFormError('');
    setTestResult(null);
    setTestError(null);
    onClose();
  };

  const handleInputChange = (field: keyof CreateExerciseData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBadgeCreated = async (created: Badge) => {
    setLoadingBadges(true)
    try {
      const updatedList = await badgesService.getAll()
      setBadges(Array.isArray(updatedList) ? updatedList : [])
    } catch (error) {
      setBadges((prev) => {
        const existing = Array.isArray(prev) ? prev : []
        const exists = existing.some(b => b._id === created._id)
        if (exists) return existing
        return [created, ...existing]
      })
    } finally {
      setLoadingBadges(false)
    }
    
    setFormData((prev) => {
      if (createBadgeMode === 'triumphant') {
        return { ...prev, triumphantBadgeId: created._id }
      }
      return { ...prev, highScoreBadgeId: created._id }
    })
    
    setIsCreateBadgeOpen(false)
    setCreateBadgeMode(null)
  }

  const handleTestCode = async () => {
    if (!formData.codeTemplate.trim()) {
      setTestError('Digite algum código para testar');
      setTestResult(null);
      return;
    }

    setIsTesting(true);
    setTestError(null);
    setTestResult(null);
    
    try {
      const compileResult = await judge0Service.executeCode(formData.codeTemplate, JAVA_LANGUAGE_ID);
      
      if (!compileResult.sucesso) {
        throw new Error(compileResult.resultado || 'Erro na execução do código');
      }

      setTestResult(compileResult.resultado || 'Código executado com sucesso!');
    } catch (error: any) {
      setTestResult(null);
      setTestError(
        error?.message || 'Não foi possível testar o código. Tente novamente.'
      );
    } finally {
      setIsTesting(false);
    }
  };

  const lineCount = formData.codeTemplate.split('\n').length;

  if (!isOpen) return null;

  return (
    <S.Overlay onClick={handleClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>Criar Novo Desafio</S.Title>
          <S.CloseButton onClick={handleClose}>×</S.CloseButton>
        </S.Header>

        <S.ContentGrid>
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
            <S.Label htmlFor="languageId">Linguagem *</S.Label>
            <S.Select
              id="languageId"
              value={formData.languageId || ''}
              onChange={(e) => handleInputChange('languageId', e.target.value || undefined)}
              required
              disabled={loadingLanguages}
            >
              <option value="">Selecione a linguagem</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </S.Select>
          </S.FieldGroup>

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

          {/* Editor de Código movido para o painel ao lado */}

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
        <S.EditorPanel>
          <EditorHeaderStyled $isDark={isDark}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaCode />
              Editor de Código
            </div>
            <TestButton
              $isDark={isDark}
              $isTesting={isTesting}
              type="button"
              onClick={handleTestCode}
              disabled={isTesting}
            >
              <FaPlayCircle />
              {isTesting ? 'Testando...' : 'Testar Código'}
            </TestButton>
          </EditorHeaderStyled>
          <EditorContainerStyled $isDark={isDark}>
            <LineNumbers $isDark={isDark}>
              {Array.from({ length: lineCount }, (_, i) => (
                <LineNumber key={i + 1}>{i + 1}</LineNumber>
              ))}
            </LineNumbers>
            <CodeTextareaStyled
              $isDark={isDark}
              value={formData.codeTemplate}
              onChange={(e) => handleInputChange('codeTemplate', e.target.value)}
              placeholder="// Escreva seu código aqui..."
              spellCheck={false}
            />
          </EditorContainerStyled>
          {(testResult || testError) && (
            <TestOutputContainer $isDark={isDark}>
              <TestOutputHeader>
                <FaCode />
                {testError ? 'Erro' : 'Resultado do Teste'}
              </TestOutputHeader>
              {testError ? (
                <ErrorMessage $isDark={isDark}>{testError}</ErrorMessage>
              ) : (
                <TestOutputContent $isDark={isDark}>{testResult}</TestOutputContent>
              )}
            </TestOutputContainer>
          )}
        </S.EditorPanel>
        </S.ContentGrid>

        {isAdmin && isCreateBadgeOpen && createBadgeMode && (
          <CreateBadgeModal
            isOpen={isCreateBadgeOpen}
            onClose={() => setIsCreateBadgeOpen(false)}
            onCreated={handleBadgeCreated}
            mode={createBadgeMode}
          />
        )}
        <NotificationContainer />
      </S.Modal>
    </S.Overlay>
  );
}