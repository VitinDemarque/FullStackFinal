import { useState, useEffect } from "react";
import { FaTimes, FaClock, FaCode, FaCheckCircle } from "react-icons/fa";
import styled from "styled-components";
import { useTheme } from "@contexts/ThemeContext";

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

const DifficultyBadge = styled.span<{ difficulty: string }>`
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
  
  span {
    color: ${({ $isDark }) => ($isDark ? "#34d399" : "#48bb78")};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
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

  ${({ variant }) =>
    variant === "primary"
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  `
      : `
    background: #e2e8f0;
    color: #4a5568;

    &:hover {
      background: #cbd5e0;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

interface ChallengeModalProps {
  exercise: {
    id: string;
    title: string;
    description: string;
    difficulty: number;
    baseXp: number;
    publicCode?: string;
    codeTemplate?: string;
  };
  onClose: () => void;
  onSubmit: (code: string, timeSpent: number) => void;
}

export default function ChallengeModal({
  exercise,
  onClose,
  onSubmit,
}: ChallengeModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [code, setCode] = useState(
    exercise.codeTemplate || "// Escreva seu código aqui\n"
  );
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (timeSpent < 600) {
      alert("Tempo mínimo de 10 minutos ainda não atingido!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(code, timeSpent);
    } finally {
      setIsSubmitting(false);
    }
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
            <Description $isDark={isDark}>{exercise.description}</Description>

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
              <CodeTextarea
                $isDark={isDark}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Escreva seu código aqui..."
                spellCheck={false}
              />
            </EditorContainer>
          </RightPanel>
        </Content>

        <Footer $isDark={isDark}>
          <FooterInfo $isDark={isDark}>
            {timeSpent < 600 ? (
              `Tempo mínimo: ${formatTime(600 - timeSpent)} restantes`
            ) : (
              <span style={{ fontWeight: 600 }}>
                ✓ Tempo mínimo atingido
              </span>
            )}
          </FooterInfo>
          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || timeSpent < 600}
            >
              <FaCheckCircle />
              {isSubmitting ? "Enviando..." : "Submeter Solução"}
            </Button>
          </ButtonGroup>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
}
