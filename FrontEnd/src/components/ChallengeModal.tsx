import { useState, useEffect, useRef } from "react";
import { FaTimes, FaClock, FaCode, FaCheckCircle, FaPlayCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import styled from "styled-components";
import { useTheme } from "@contexts/ThemeContext";
import attemptsService from "@services/attempts.service";
import ConfirmationModal from "@components/ConfirmationModal";
import { useNotification } from "@components/Notification";

const Overlay = styled.div<{ $isDark: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ $isDark }) => 
    $isDark ? "rgba(0, 0, 0, 0.95)" : "rgba(0, 0, 0, 0.85)"};
  backdrop-filter: blur(5px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  max-width: 1400px;
  height: 90vh;
  background: ${({ $isDark }) => ($isDark ? "#0f172a" : "#ffffff")};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
  border: ${({ $isDark }) => ($isDark ? "1px solid #334155" : "none")};

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;

  svg {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  flex: 1;
  overflow: hidden;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div<{ $isDark: boolean }>`
  padding: 2rem;
  overflow-y: auto;
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#f8f9fa")};
  border-right: ${({ $isDark }) =>
    $isDark ? "2px solid #334155" : "2px solid #e9ecef"};

  @media (max-width: 968px) {
    border-right: none;
    border-bottom: ${({ $isDark }) =>
      $isDark ? "2px solid #334155" : "2px solid #e9ecef"};
  }
`;

const RightPanel = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${({ $isDark }) => ($isDark ? "#0c1220" : "#1e1e1e")};
`;

const SectionTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#2d3748")};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Description = styled.div<{ $isDark: boolean }>`
  font-size: 1rem;
  line-height: 1.8;
  color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#4a5568")};
  margin-bottom: 2rem;
  white-space: pre-wrap;
  
  strong {
    color: ${({ $isDark }) => ($isDark ? "#f8fafc" : "#1a202c")};
  }
`;

const DifficultyBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'difficulty'
})<{ difficulty: string }>`
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background: ${({ difficulty }) => {
    switch (difficulty) {
      case "fácil":
        return "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
      case "médio":
        return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
      case "difícil":
        return "linear-gradient(135deg, #fa709a 0%, #fee140 100%)";
      case "expert":
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      case "master":
        return "linear-gradient(135deg, #000000 0%, #434343 100%)";
      default:
        return "#cbd5e0";
    }
  }};
  color: white;
`;

const CodeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

const CopyButton = styled.button`
  background: white;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0.15rem 0.4rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const EditorHeader = styled.div<{ $isDark: boolean }>`
  padding: 1rem 1.5rem;
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#2d2d2d")};
  color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#d4d4d4")};
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: ${({ $isDark }) =>
    $isDark ? "1px solid #0c1220" : "1px solid #1e1e1e"};
`;

const EditorContainer = styled.div<{ $isDark: boolean }>`
  flex: 1;
  position: relative;
  overflow: auto;
  background: ${({ $isDark }) => ($isDark ? "#0c1220" : "#1e1e1e")};
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

const CodeTextarea = styled.textarea<{ $isDark: boolean }>`
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

  &::selection {
    background: ${({ $isDark }) => ($isDark ? "#1e40af" : "#264f78")};
  }

  &::placeholder {
    color: ${({ $isDark }) => ($isDark ? "#64748b" : "#858585")};
  }
`;

const Footer = styled.div<{ $isDark: boolean }>`
  padding: 1.5rem 2rem;
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "white")};
  border-top: ${({ $isDark }) =>
    $isDark ? "2px solid #334155" : "2px solid #e9ecef"};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterInfo = styled.div<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? "#94a3b8" : "#718096")};
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  
  span {
    color: ${({ $isDark }) => ($isDark ? "#34d399" : "#48bb78")};
  }

  small {
    color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#4a5568")};
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ $variant?: "primary" | "secondary" | "outline" }>`
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;

  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }
        `;
      case "outline":
        return `
          background: transparent;
          border: 1px solid rgba(148, 163, 184, 0.6);
          color: #94a3b8;

          &:hover {
            color: #667eea;
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.08);
          }
        `;
      default:
        return `
          background: #e2e8f0;
          color: #4a5568;

          &:hover {
            background: #cbd5e0;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const TestOutputContainer = styled.div<{ $isDark: boolean; $isMinimized: boolean }>`
  background: ${({ $isDark }) => ($isDark ? "#0f172a" : "#111827")};
  border-top: 1px solid ${({ $isDark }) => ($isDark ? "#1e293b" : "#1f2937")};
  padding: ${({ $isMinimized }) => ($isMinimized ? "0.75rem 1.5rem" : "1.5rem")};
  color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#e2e8f0")};
  min-height: ${({ $isMinimized }) => ($isMinimized ? "auto" : "150px")};
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.3s ease;
  overflow: hidden;
`;

const TestOutputHeader = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    opacity: 0.9;
  }
`;

const MinimizeButton = styled.button<{ $isDark: boolean }>`
  background: transparent;
  border: none;
  color: ${({ $isDark }) => ($isDark ? "#cbd5e1" : "#e2e8f0")};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $isDark }) => ($isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)")};
  }
  
  svg {
    font-size: 0.85rem;
  }
`;

const TestOutputContentWrapper = styled.div<{ $isMinimized: boolean }>`
  display: ${({ $isMinimized }) => ($isMinimized ? "none" : "flex")};
  flex-direction: column;
  gap: 0.75rem;
  animation: ${({ $isMinimized }) => ($isMinimized ? "fadeOut" : "fadeIn")} 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;

const TestOutputContent = styled.pre<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? "#111c2e" : "#1f2a3a")};
  border: 1px solid ${({ $isDark }) => ($isDark ? "#1e2f47" : "#243044")};
  border-radius: 12px;
  padding: 1rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${({ $isDark }) => ($isDark ? "#e2e8f0" : "#f8fafc")};
  white-space: pre-wrap;
  max-height: 200px;
  overflow: auto;
  margin: 0;
`;

const TestOutputPlaceholder = styled.div`
  font-size: 0.9rem;
  color: #94a3b8;
`;

const TestOutputError = styled.div`
  font-size: 0.85rem;
  color: #f87171;
  font-weight: 500;
`;

const TestConsoleContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TestConsolePanel = styled.div<{ $isDark: boolean; $type: 'input' | 'output' }>`
  display: flex;
  flex-direction: column;
  background: ${({ $isDark }) => ($isDark ? "#1e293b" : "#ffffff")};
  border: 1.5px solid ${({ $isDark, $type }) => {
    if ($type === 'input') {
      return $isDark ? "#3b82f6" : "#60a5fa";
    }
    return $isDark ? "#10b981" : "#34d399";
  }};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:focus-within {
    box-shadow: 0 0 0 3px ${({ $isDark, $type }) => {
      if ($type === 'input') {
        return $isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(96, 165, 250, 0.15)";
      }
      return $isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(52, 211, 153, 0.15)";
    }};
  }
`;

const TestConsolePanelHeader = styled.div<{ $isDark: boolean; $type: 'input' | 'output' }>`
  padding: 0.5rem 0.75rem;
  background: ${({ $isDark, $type }) => {
    if ($type === 'input') {
      return $isDark ? "#1e3a8a" : "#dbeafe";
    }
    return $isDark ? "#065f46" : "#d1fae5";
  }};
  color: ${({ $isDark, $type }) => {
    if ($type === 'input') {
      return $isDark ? "#93c5fd" : "#1e40af";
    }
    return $isDark ? "#6ee7b7" : "#065f46";
  }};
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 0.5px;
`;

const TestConsoleTextarea = styled.textarea<{ $isDark: boolean }>`
  flex: 1;
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: ${({ $isDark }) => ($isDark ? "#e2e8f0" : "#1a202c")};
  font-size: 0.85rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  resize: none;
  min-height: 100px;
  line-height: 1.5;
  
  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ $isDark }) => ($isDark ? "#64748b" : "#a0aec0")};
  }
`;

const TestConsoleOutput = styled.pre<{ $isDark: boolean }>`
  flex: 1;
  padding: 0.75rem;
  margin: 0;
  background: transparent;
  color: ${({ $isDark }) => ($isDark ? "#e2e8f0" : "#1a202c")};
  font-size: 0.85rem;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-y: auto;
  min-height: 100px;
`;

const TestConsoleHint = styled.div<{ $isDark: boolean }>`
  padding: 0 0.75rem 0.75rem 0.75rem;
  font-size: 0.7rem;
  color: ${({ $isDark }) => ($isDark ? "#94a3b8" : "#718096")};
  line-height: 1.4;
  
  code {
    background: ${({ $isDark }) => ($isDark ? "rgba(148, 163, 184, 0.1)" : "rgba(0, 0, 0, 0.05)")};
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
    font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
    font-size: 0.7rem;
  }
`;

const CompletedOverlay = styled.div<{ $isDark: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $isDark }) => ($isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)")};
  z-index: 10;
`;

const CompletedMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #10b981;
  
  svg {
    margin-bottom: 1rem;
    opacity: 0.9;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.75rem 0;
    color: #10b981;
  }
  
  p {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.6;
  }
`;

interface ChallengeModalProps {
  exercise: {
    id: string;
    title: string;
    description: string | null;
    difficulty: number;
    baseXp: number;
    publicCode?: string;
    codeTemplate?: string;
    isCompleted?: boolean;
  };
  onClose: () => void;
  onSubmit: (code: string, timeSpent: number) => void;
  onTest: (code: string, input?: string) => Promise<string>;
}

export default function ChallengeModal({
  exercise,
  onClose,
  onSubmit,
  onTest,
}: ChallengeModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { addNotification, NotificationContainer } = useNotification();
  
  // Template básico para quem está resolvendo o desafio
  // Não usa o codeTemplate completo para evitar mostrar a solução
  const getDefaultTemplate = () => {
    return "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        \n        // Escreva seu código aqui\n        \n        scanner.close();\n    }\n}";
  };
  
  const defaultCode = getDefaultTemplate();
  const [code, setCode] = useState(defaultCode);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [testInput, setTestInput] = useState<string>('');
  const [isTestOutputMinimized, setIsTestOutputMinimized] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isLoadingAttempt, setIsLoadingAttempt] = useState(true);
  const latestStateRef = useRef({ code: defaultCode, timeSpent: 0 });
  const skipAutoSaveRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    latestStateRef.current = { code, timeSpent };
  }, [code, timeSpent]);

  useEffect(() => {
    let canceled = false;
    setIsLoadingAttempt(true);

    (async () => {
      try {
        const attempt = await attemptsService.getCurrent(exercise.id);
        if (!attempt || attempt.status !== "IN_PROGRESS") return;
        if (canceled) return;
        setCode(attempt.code || defaultCode);
        setTimeSpent(Math.floor((attempt.timeSpentMs ?? 0) / 1000));
        setLastSavedAt(attempt.updatedAt ? new Date(attempt.updatedAt) : null);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("Erro ao carregar rascunho do desafio:", error);
        }
      } finally {
        if (!canceled) {
          setIsLoadingAttempt(false);
        }
      }
    })();

    return () => {
      canceled = true;
      if (skipAutoSaveRef.current) return;
      const { code: latestCode, timeSpent: latestTime } = latestStateRef.current;
      const normalizedDefault = defaultCode.trim();
      const normalizedCurrent = (latestCode || "").trim();
      const hasProgress =
        (normalizedCurrent && normalizedCurrent !== normalizedDefault) || latestTime > 0;

      if (!hasProgress) return;

      attemptsService
        .saveAttempt({
          exerciseId: exercise.id,
          code: latestCode,
          timeSpentMs: latestTime * 1000,
        })
        .catch(() => {});
    };
  }, [exercise.id, defaultCode]);


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const formatSavedLabel = (date: Date) => {
    return date.toLocaleString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const handleSubmitClick = () => {
    // Bloquear submissão se o desafio já foi concluído
    if (exercise.isCompleted) {
      addNotification('Este desafio já foi concluído. Não é possível refazê-lo.', 'warning', 4000);
      onClose();
      return;
    }

    // Mostrar modal de confirmação
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      await onSubmit(code, timeSpent);
      skipAutoSaveRef.current = true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Erro durante a submissão do desafio:", error);
      }
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTest = async () => {
    // Bloquear teste se o desafio já foi concluído
    if (exercise.isCompleted) {
      addNotification('Este desafio já foi concluído. Não é possível testar novamente.', 'warning', 4000);
      return;
    }

    setIsTesting(true);
    setTestError(null);
    setTestResult(null);
    setIsTestOutputMinimized(false); // Expande automaticamente ao testar
    try {
      // Passa a entrada de teste se fornecida
      const inputToUse = testInput.trim() || undefined;
      const result = await onTest(code, inputToUse);
      setTestResult(result);
    } catch (error) {
      setTestResult(null);
      setTestError(
        error instanceof Error
          ? error.message
          : "Não foi possível testar o código. Tente novamente."
      );
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveDraft = async (closeAfter = false) => {
    // Bloquear salvamento se o desafio já foi concluído
    if (exercise.isCompleted) {
      addNotification('Este desafio já foi concluído. Não é possível salvar progresso.', 'warning', 4000);
      if (closeAfter) {
        onClose();
      }
      return;
    }

    if (isSavingDraft) return;
    setIsSavingDraft(true);
    try {
      const saved = await attemptsService.saveAttempt({
        exerciseId: exercise.id,
        code,
        timeSpentMs: timeSpent * 1000,
        status: "IN_PROGRESS",
      });
      const updatedDate = saved?.updatedAt ? new Date(saved.updatedAt) : new Date();
      setLastSavedAt(updatedDate);
      if (closeAfter) {
        skipAutoSaveRef.current = true;
        onClose();
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Erro ao salvar progresso do desafio:", error);
      }
      if (!closeAfter) {
        addNotification("Não foi possível salvar seu progresso. Tente novamente.", 'error', 4000);
      }
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSaveAndExit = async () => {
    if (isSavingDraft) return;
    await handleSaveDraft(true);
  };

  const lineCount = code.split("\n").length;

  const difficultyMap: Record<number, string> = {
    1: "fácil",
    2: "médio",
    3: "difícil",
    4: "expert",
    5: "master",
  };

  const difficultyText = difficultyMap[exercise.difficulty] || "médio";
  const codeToShow = exercise.publicCode ?? exercise.id;
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeToShow);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <Overlay $isDark={isDark} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContainer $isDark={isDark}>
        <Header>
          <HeaderLeft>
            <Title>
              <FaCode />
              {exercise.title}
            </Title>
            <DifficultyBadge difficulty={difficultyText}>
              {difficultyText.toUpperCase()}
            </DifficultyBadge>
            <CodeBadge>
              Código: <code>{codeToShow}</code>
              <CopyButton onClick={handleCopyCode} type="button">
                {copied ? 'Copiado!' : 'Copiar'}
              </CopyButton>
            </CodeBadge>
          </HeaderLeft>
          <HeaderLeft>
            <Timer>
              <FaClock />
              {formatTime(timeSpent)}
            </Timer>
            <CloseButton onClick={onClose}>
              <FaTimes />
            </CloseButton>
          </HeaderLeft>
        </Header>

        <Content>
          <LeftPanel $isDark={isDark}>
            <SectionTitle $isDark={isDark}>📋 Descrição do Desafio</SectionTitle>
            <Description $isDark={isDark}>{exercise.description ?? ""}</Description>

            <SectionTitle $isDark={isDark}>🎯 Objetivo</SectionTitle>
            <Description $isDark={isDark}>
              Resolva o desafio implementando uma solução eficiente e bem
              estruturada. Seu código será avaliado com base em correção,
              performance e boas práticas.
              {"\n\n"}
              <strong>Recompensa:</strong> {exercise.baseXp} XP base + bônus por
              performance
            </Description>

            <SectionTitle $isDark={isDark}>💡 Dicas</SectionTitle>
            <Description $isDark={isDark}>
              • Leia o enunciado com atenção
              {"\n"}• Pense na solução antes de começar a codificar
              {"\n"}• Teste seu código com diferentes casos
              {"\n"}• Tempo mínimo: 10 minutos
            </Description>

          </LeftPanel>

          <RightPanel $isDark={isDark}>
            <EditorHeader $isDark={isDark}>
              <FaCode />
              Editor de Código
            </EditorHeader>
            <EditorContainer $isDark={isDark}>
              <LineNumbers $isDark={isDark}>
                {Array.from({ length: lineCount }, (_, i) => (
                  <LineNumber key={i + 1}>{i + 1}</LineNumber>
                ))}
              </LineNumbers>
              {exercise.isCompleted ? (
                <CompletedOverlay $isDark={isDark}>
                  <CompletedMessage>
                    <FaCheckCircle size={48} />
                    <h3>Desafio Concluído!</h3>
                    <p>Você já completou este desafio com sucesso. Não é possível refazê-lo.</p>
                  </CompletedMessage>
                </CompletedOverlay>
              ) : (
                <CodeTextarea
                  $isDark={isDark}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Escreva seu código aqui..."
                  spellCheck={false}
                />
              )}
            </EditorContainer>
            <TestOutputContainer $isDark={isDark} $isMinimized={isTestOutputMinimized}>
              <TestOutputHeader onClick={() => setIsTestOutputMinimized(!isTestOutputMinimized)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaPlayCircle />
                  Resultado do Teste
                </div>
                <MinimizeButton
                  $isDark={isDark}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTestOutputMinimized(!isTestOutputMinimized);
                  }}
                  title={isTestOutputMinimized ? "Expandir" : "Minimizar"}
                >
                  {isTestOutputMinimized ? <FaChevronUp /> : <FaChevronDown />}
                </MinimizeButton>
              </TestOutputHeader>
              <TestOutputContentWrapper $isMinimized={isTestOutputMinimized}>
                {!exercise.isCompleted && (
                  <TestConsoleContainer>
                    <TestConsolePanel $isDark={isDark} $type="input">
                      <TestConsolePanelHeader $isDark={isDark} $type="input">
                        📥 Input (stdin)
                      </TestConsolePanelHeader>
                      <TestConsoleTextarea
                        $isDark={isDark}
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        placeholder="Digite as entradas aqui&#10;Uma por linha&#10;&#10;Exemplo para somar 5 + 3:&#10;5&#10;3"
                      />
                      <TestConsoleHint $isDark={isDark}>
                        💡 <strong>Uma entrada por linha.</strong> Para somar 5 e 3, digite:<br/>
                        <code>5</code> (Enter) <code>3</code>
                      </TestConsoleHint>
                    </TestConsolePanel>
                    
                    <TestConsolePanel $isDark={isDark} $type="output">
                      <TestConsolePanelHeader $isDark={isDark} $type="output">
                        📤 Output (resultado)
                      </TestConsolePanelHeader>
                      {isTesting ? (
                        <TestConsoleOutput $isDark={isDark}>
                          Executando seu código...
                        </TestConsoleOutput>
                      ) : testResult ? (
                        <TestConsoleOutput $isDark={isDark}>
                          {testResult}
                        </TestConsoleOutput>
                      ) : testError ? (
                        <TestConsoleOutput $isDark={isDark} style={{ color: '#f87171' }}>
                          ❌ Erro: {testError}
                        </TestConsoleOutput>
                      ) : (
                        <TestConsoleOutput $isDark={isDark} style={{ opacity: 0.5 }}>
                          Execute um teste para ver a saída aqui...
                        </TestConsoleOutput>
                      )}
                      {testResult && !isTesting && (
                        <TestConsoleHint $isDark={isDark}>
                          ✅ Código executado com sucesso!
                        </TestConsoleHint>
                      )}
                    </TestConsolePanel>
                  </TestConsoleContainer>
                )}
                {exercise.isCompleted && (
                  <TestOutputPlaceholder style={{ textAlign: 'center', padding: '2rem' }}>
                    ✅ Desafio concluído! Teste não disponível.
                  </TestOutputPlaceholder>
                )}
              </TestOutputContentWrapper>
            </TestOutputContainer>
          </RightPanel>
        </Content>

        <Footer $isDark={isDark}>
          <FooterInfo $isDark={isDark}>
            <span style={{ fontWeight: 600 }}>
              Tempo decorrido: {formatTime(timeSpent)}
            </span>
            <small>
              {isLoadingAttempt
                ? "Carregando progresso salvo..."
                : lastSavedAt
                ? `Último salvamento: ${formatSavedLabel(lastSavedAt)}`
                : "Rascunho ainda não salvo"}
            </small>
          </FooterInfo>
          <ButtonGroup>
            <Button $variant="secondary" onClick={onClose}>
              {exercise.isCompleted ? "Fechar" : "Cancelar"}
            </Button>
            {!exercise.isCompleted && (
              <>
                <Button
                  $variant="secondary"
                  onClick={handleSaveAndExit}
                  disabled={isSavingDraft}
                >
                  {isSavingDraft ? "Salvando..." : "Salvar e sair"}
                </Button>
                <Button
                  $variant="outline"
                  onClick={handleTest}
                  disabled={isTesting}
                >
                  <FaPlayCircle />
                  {isTesting ? "Testando..." : "Testar Código"}
                </Button>
                <Button
                  $variant="primary"
                  onClick={handleSubmitClick}
                  disabled={isSubmitting}
                >
                  <FaCheckCircle />
                  {isSubmitting ? "Enviando..." : "Submeter Solução"}
                </Button>
              </>
            )}
          </ButtonGroup>
        </Footer>
      </ModalContainer>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        title="Confirmar Submissão"
        message={`Tem certeza que deseja submeter sua solução?\n\nApós a submissão, seu código será avaliado e você não poderá mais editá-lo para este desafio.\n\nTempo decorrido: ${formatTime(timeSpent)}`}
        confirmText="Sim, Submeter"
        cancelText="Cancelar"
        type="warning"
      />
      
      <NotificationContainer />
    </Overlay>
  );
}
