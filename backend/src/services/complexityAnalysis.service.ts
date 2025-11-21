import { IComplexityMetrics } from '../models/Submission.model';

/**
 * Interface para resultado da análise de complexidade
 */
export interface ComplexityAnalysisResult {
  metrics: IComplexityMetrics;
  complexityScore: number;  // Score de complexidade (0-100)
  bonusPoints: number;      // Pontos de bônus (0-20)
}

/**
 * Remove comentários de uma linha de código Java
 */
function removeJavaComments(line: string): string {
  let cleaned = line.split('//')[0];
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  return cleaned.trim();
}

/**
 * Verifica se uma linha é vazia ou apenas espaços/comentários
 */
function isEmptyLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.length === 0 || trimmed.startsWith('//') || trimmed.startsWith('/*');
}

/**
 * Conta linhas de código (sem comentários e vazias)
 */
function countLinesOfCode(code: string): number {
  const lines = code.split('\n');
  let count = 0;

  for (const line of lines) {
    const cleaned = removeJavaComments(line);
    if (!isEmptyLine(cleaned) && cleaned.length > 0) {
      count++;
    }
  }

  return count;
}

/**
 * Detecta estruturas de controle que aumentam complexidade ciclomática
 */
function countControlStructures(code: string): number {
  const patterns = [
    /\bif\s*\(/g,
    /\belse\s+if\s*\(/g,
    /\bwhile\s*\(/g,
    /\bfor\s*\(/g,
    /\bswitch\s*\(/g,
    /\bcatch\s*\(/g,
    /\bcase\s+/g,
    /\b&&/g,
    /\b\|\|/g,
    /\b\?\s*.*\s*:/g,
  ];

  let complexity = 1;

  for (const pattern of patterns) {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  }

  return complexity;
}

/**
 * Calcula profundidade máxima de aninhamento
 */
function calculateMaxNestingDepth(code: string): number {
  const lines = code.split('\n');
  let maxDepth = 0;
  let currentDepth = 0;

  for (const line of lines) {
    const cleaned = removeJavaComments(line);
    const openBraces = (cleaned.match(/\{/g) || []).length;
    const closeBraces = (cleaned.match(/\}/g) || []).length;
    currentDepth += openBraces - closeBraces;
    
    if (currentDepth > maxDepth) {
      maxDepth = currentDepth;
    }
  }

  return maxDepth;
}

/**
 * Detecta se o código usa recursão
 */
function detectRecursion(code: string): boolean {
  const methodDefPattern = /(public|private|protected|static)\s+\w+\s+(\w+)\s*\(/g;
  const methods: string[] = [];
  let match;

  while ((match = methodDefPattern.exec(code)) !== null) {
    if (match[2]) {
      methods.push(match[2]);
    }
  }

  for (const methodName of methods) {
    const methodBodyPattern = new RegExp(
      `(public|private|protected|static)\\s+\\w+\\s+${methodName}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\}`,
      'g'
    );
    
    let methodMatch;
    while ((methodMatch = methodBodyPattern.exec(code)) !== null) {
      const methodBody = methodMatch[2];
      const selfCallPattern = new RegExp(`\\b${methodName}\\s*\\(`, 'g');
      if (selfCallPattern.test(methodBody)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Analisa a complexidade do código
 * 
 * @param code - Código fonte a ser analisado
 * @param language - Linguagem do código (default: 'java')
 * @returns Métricas de complexidade
 */
export function analyzeComplexity(
  code: string,
  language: string = 'java'
): IComplexityMetrics {
  const cleanedCode = code.trim();
  const cyclomaticComplexity = countControlStructures(cleanedCode);
  const linesOfCode = countLinesOfCode(cleanedCode);
  const maxNestingDepth = calculateMaxNestingDepth(cleanedCode);
  const hasRecursion = detectRecursion(cleanedCode);

  return {
    cyclomaticComplexity,
    linesOfCode,
    maxNestingDepth,
    hasRecursion
  };
}

/**
 * Calcula score de complexidade (0-100)
 * 
 * Quanto menor a complexidade, maior o score
 * 
 * @param metrics - Métricas de complexidade
 * @returns Score de 0 a 100
 */
export function calculateComplexityScore(metrics: IComplexityMetrics): number {
  const penalty = 
    (metrics.cyclomaticComplexity * 2) +
    (metrics.linesOfCode / 10) +
    (metrics.maxNestingDepth * 5) +
    (metrics.hasRecursion ? 10 : 0);

  const score = Math.max(0, Math.min(100, 100 - penalty));
  return Math.round(score * 100) / 100;
}

/**
 * Calcula pontos de bônus baseado no score de complexidade
 * 
 * Bônus máximo: 20 pontos
 * Fórmula: (complexityScore / 100) × 20
 * 
 * @param complexityScore - Score de complexidade (0-100)
 * @returns Pontos de bônus (0-20)
 */
export function calculateBonusPoints(complexityScore: number): number {
  const bonus = (complexityScore / 100) * 20;
  return Math.round(bonus * 100) / 100;
}

/**
 * Analisa complexidade completa e calcula scores
 * 
 * @param code - Código fonte a ser analisado
 * @param language - Linguagem do código (default: 'java')
 * @returns Resultado completo da análise
 */
export function analyzeComplexityComplete(
  code: string,
  language: string = 'java'
): ComplexityAnalysisResult {
  const metrics = analyzeComplexity(code, language);
  const complexityScore = calculateComplexityScore(metrics);
  const bonusPoints = calculateBonusPoints(complexityScore);

  return {
    metrics,
    complexityScore,
    bonusPoints
  };
}

