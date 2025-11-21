import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { badgesService, type Badge } from '@/services/badges.service';
import { judge0Service, languagesService } from '@/services/index';
import type { Language } from '@/services/languages.service';
import { useNotification } from '@/components/Notification';
import { FaPlus, FaCode, FaPlayCircle, FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
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
  padding: 0.875rem 0;
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#252526")};
  color: ${({ $isDark }) => ($isDark ? "#94a3b8" : "#858585")};
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.5;
  text-align: right;
  user-select: none;
  border-right: ${({ $isDark }) =>
    $isDark ? "1px solid #0c1220" : "1px solid #1e1e1e"};
  min-width: 50px;
  z-index: 1;
`;

const LineNumber = styled.div`
  padding: 0 0.875rem;
  height: 19.5px;
`;

const CodeTextareaStyled = styled.textarea<{ $isDark: boolean }>`
  width: 100%;
  height: 100%;
  padding: 0.875rem 0.875rem 0.875rem 60px;
  background: transparent;
  color: ${({ $isDark }) => ($isDark ? "#e2e8f0" : "#d4d4d4")};
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 13px;
  line-height: 1.5;
  border: none;
  outline: none;
  resize: none;
  position: absolute;
  top: 0;
  left: 0;
  min-height: 350px;

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

// Estilos para a seção de testes - mais compactos
const TestsSection = styled.div<{ $isDark: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#f8f9fa")};
  border: 1px solid ${({ $isDark }) => ($isDark ? "#334155" : "#e2e8f0")};
  border-radius: 8px;
`;

const TestsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const TestsTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
`;

const TestsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ValidInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #10b981;
  font-size: 0.8rem;
  font-weight: 500;
`;

const WarningInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #f59e0b;
  font-size: 0.8rem;
  font-weight: 500;
`;

const TestsDescription = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  line-height: 1.5;

  strong {
    color: var(--color-text);
    font-weight: 600;
  }
`;

const TestsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TestCard = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? "#0f172a" : "#ffffff")};
  border: 1px solid ${({ $isDark }) => ($isDark ? "#334155" : "#e2e8f0")};
  border-radius: 6px;
  padding: 0.875rem;
`;

const TestCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const TestNumber = styled.span`
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-text);
`;

const RemoveTestButton = styled.button`
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.75rem;

  &:hover {
    background: #ef4444;
    color: white;
  }
`;

const TestFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TestField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const TestLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text);

  span {
    font-size: 0.7rem;
    font-weight: 400;
    color: var(--color-text-secondary);
    margin-left: 0.25rem;
  }
`;

const TestTextarea = styled.textarea<{ $isDark: boolean; $hasError?: boolean }>`
  width: 100%;
  padding: 0.5rem 0.625rem;
  background: ${({ $isDark }) => ($isDark ? "#0f172a" : "#ffffff")};
  border: 1.5px solid ${({ $isDark, $hasError }) => 
    $hasError 
      ? "#ef4444" 
      : ($isDark ? "#334155" : "#e2e8f0")};
  border-radius: 6px;
  color: var(--color-text);
  font-size: 0.8rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  resize: vertical;
  transition: all 0.2s ease;
  min-height: 45px;
  line-height: 1.4;

  &:focus {
    outline: none;
    border-color: ${({ $isDark, $hasError }) => 
      $hasError 
        ? "#ef4444" 
        : ($isDark ? "#667eea" : "#667eea")};
    box-shadow: 0 0 0 3px ${({ $isDark, $hasError }) => 
      $hasError 
        ? "rgba(239, 68, 68, 0.1)" 
        : ($isDark ? "rgba(102, 126, 234, 0.1)" : "rgba(102, 126, 234, 0.1)")};
  }

  &:hover:not(:disabled) {
    border-color: ${({ $isDark, $hasError }) => 
      $hasError 
        ? "#ef4444" 
        : ($isDark ? "#475569" : "#cbd5e1")};
  }

  &::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }
`;

const TestError = styled.div`
  color: #ef4444;
  font-size: 0.7rem;
  margin-top: -0.2rem;
`;

const AddTestButton = styled.button<{ $isDark: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: ${({ $isDark }) => ($isDark ? "#334155" : "#e2e8f0")};
  border: 1px dashed ${({ $isDark }) => ($isDark ? "#475569" : "#cbd5e1")};
  border-radius: 6px;
  color: var(--color-text);
  font-weight: 500;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isDark }) => ($isDark ? "#475569" : "#cbd5e1")};
    border-color: ${({ $isDark }) => ($isDark ? "#64748b" : "#94a3b8")};
  }

  svg {
    font-size: 0.8rem;
  }
`;

interface CreateExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExerciseData) => Promise<void>;
  codeTemplate?: string;
}

export interface ITest {
  input: string;
  expectedOutput: string;
  description?: string;
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
  tests?: ITest[];
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
    tests: [],
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
        let updated = { ...prev };
        if (!updated.languageId && list.length > 0) {
          const javaLanguage = list.find(l => l.name.toLowerCase() === 'java' || l.slug === 'java');
          if (javaLanguage) {
            updated.languageId = javaLanguage.id;
          }
        }
        // Inicializar com 2 testes vazios se não houver testes
        if (!updated.tests || updated.tests.length === 0) {
          updated.tests = [
            { input: '', expectedOutput: '', description: '' },
            { input: '', expectedOutput: '', description: '' }
          ];
        }
        return updated;
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

    // Validação de testes: mínimo 2 testes obrigatórios
    const validTests = (formData.tests || []).filter(test => 
      test.expectedOutput && test.expectedOutput.trim().length > 0
    );
    
    if (validTests.length < 2) {
      setFormError('É necessário adicionar pelo menos 2 testes com saída esperada válida para criar o desafio.');
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
        languageId: formData.languageId,
        tests: validTests
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
      tests: [],
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

  // Funções para gerenciar testes
  const addTest = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...(prev.tests || []), { input: '', expectedOutput: '', description: '' }]
    }));
  };

  const removeTest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tests: (prev.tests || []).filter((_, i) => i !== index)
    }));
  };

  const updateTest = (index: number, field: keyof ITest, value: string) => {
    setFormData(prev => {
      const tests = [...(prev.tests || [])];
      tests[index] = { ...tests[index], [field]: value };
      return { ...prev, tests };
    });
  };

  const validTestsCount = (formData.tests || []).filter(test => 
    test.expectedOutput && test.expectedOutput.trim().length > 0
  ).length;

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

          {/* Seção de Testes */}
          <TestsSection $isDark={isDark}>
            <TestsHeader>
              <TestsTitle>
                <FaCode />
                Testes do Desafio
              </TestsTitle>
              <TestsInfo>
                {validTestsCount >= 2 ? (
                  <ValidInfo>
                    <FaCheckCircle />
                    {validTestsCount} teste(s) válido(s) - Mínimo: 2
                  </ValidInfo>
                ) : (
                  <WarningInfo>
                    <FaExclamationTriangle />
                    {validTestsCount} de 2 testes obrigatórios
                  </WarningInfo>
                )}
              </TestsInfo>
            </TestsHeader>

            <TestsDescription>
              Adicione pelo menos <strong>2 testes obrigatórios</strong> para validar o código dos usuários.
              Cada teste deve ter uma <strong>saída esperada</strong>. Entrada e descrição são opcionais.
            </TestsDescription>

            <TestsList>
              {(formData.tests || []).map((test, index) => (
                <TestCard key={index} $isDark={isDark}>
                  <TestCardHeader>
                    <TestNumber>Teste #{index + 1}</TestNumber>
                    {(formData.tests || []).length > 2 && (
                      <RemoveTestButton
                        type="button"
                        onClick={() => removeTest(index)}
                        title="Remover teste"
                      >
                        <FaTrash />
                      </RemoveTestButton>
                    )}
                  </TestCardHeader>

                  <TestFields>
                    <TestField>
                      <TestLabel>
                        Entrada (stdin) <span>Opcional</span>
                      </TestLabel>
                      <TestTextarea
                        $isDark={isDark}
                        value={test.input}
                        onChange={(e) => updateTest(index, 'input', e.target.value)}
                        placeholder="Ex: 5 10 ou deixe vazio"
                        rows={1}
                        maxLength={10000}
                      />
                    </TestField>

                    <TestField>
                      <TestLabel>
                        Saída Esperada (stdout) <span style={{ color: '#ef4444' }}>*</span>
                      </TestLabel>
                      <TestTextarea
                        $isDark={isDark}
                        value={test.expectedOutput}
                        onChange={(e) => updateTest(index, 'expectedOutput', e.target.value)}
                        placeholder="Ex: 15 ou Hello World"
                        rows={1}
                        required
                        maxLength={10000}
                        $hasError={!test.expectedOutput.trim()}
                      />
                      {!test.expectedOutput.trim() && (
                        <TestError>Saída esperada é obrigatória</TestError>
                      )}
                    </TestField>

                    <TestField>
                      <TestLabel>
                        Descrição <span>Opcional</span>
                      </TestLabel>
                      <TestTextarea
                        $isDark={isDark}
                        value={test.description || ''}
                        onChange={(e) => updateTest(index, 'description', e.target.value)}
                        placeholder="Ex: Testa soma de números positivos"
                        rows={1}
                        maxLength={500}
                      />
                    </TestField>
                  </TestFields>
                </TestCard>
              ))}
            </TestsList>

            <AddTestButton
              type="button"
              onClick={addTest}
              $isDark={isDark}
            >
              <FaPlus />
              Adicionar Teste
            </AddTestButton>
          </TestsSection>

          <S.ButtonGroup>
            <S.CancelButton type="button" onClick={handleClose}>
              Cancelar
            </S.CancelButton>
            <S.SubmitButton 
              type="submit" 
              disabled={isSubmitting || !formData.title.trim() || validTestsCount < 2}
            >
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