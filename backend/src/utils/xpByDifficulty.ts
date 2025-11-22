/**
 * Calcula o XP base automaticamente baseado na dificuldade do exercício
 * 
 * Sistema padronizado de XP:
 * - Fácil (1): 50 XP base
 * - Médio (2): 100 XP base
 * - Difícil (3): 200 XP base
 * - Expert (4): 350 XP base
 * - Master (5): 500 XP base
 * 
 * Isso garante que todos os exercícios da mesma dificuldade
 * tenham o mesmo XP base, evitando manipulação.
 */

export function getBaseXpByDifficulty(difficulty: number): number {
  const difficultyMap: Record<number, number> = {
    1: 50,   // Fácil
    2: 100,  // Médio
    3: 200,  // Difícil
    4: 350,  // Expert
    5: 500,  // Master
  };

  // Valida e retorna o XP base, ou padrão se inválido
  if (difficulty >= 1 && difficulty <= 5) {
    return difficultyMap[difficulty] || 100;
  }

  // Se dificuldade inválida, retorna padrão (Médio)
  return 100;
}

/**
 * Retorna o nome da dificuldade em português
 */
export function getDifficultyName(difficulty: number): string {
  const names: Record<number, string> = {
    1: 'Fácil',
    2: 'Médio',
    3: 'Difícil',
    4: 'Expert',
    5: 'Master',
  };

  return names[difficulty] || 'Médio';
}

