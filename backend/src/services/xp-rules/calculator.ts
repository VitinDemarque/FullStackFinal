/**
 * Motorzinho de XP centralizado — ajuste a gosto.
 * Exemplo:
 *  - baseXp (por exercício) multiplicado pela dificuldade (1..5 -> 1.0..2.0)
 *  - bônus proporcional ao score (0..100)
 *  - ligeiro bônus por tempo (resolver mais rápido dá + até 10%)
 */

export interface XpInput {
  baseXp: number;        // do exercício
  difficulty: number;    // 1..5
  score: number;         // 0..100
  timeSpentMs: number;   // duração da resolução
}

export function calculateXp(input: XpInput): number {
  const base = Math.max(0, input.baseXp || 100);
  const diffMultiplier = 1 + Math.min(4, Math.max(0, (input.difficulty || 1) - 1)) * 0.25; // 1..2.0
  const scoreMultiplier = Math.max(0, Math.min(1, (input.score || 0) / 100));              // 0..1
  const speedBonus = calcSpeedBonus(input.timeSpentMs);                                    // 0..0.1

  const xp = base * diffMultiplier * (0.5 + 0.5 * scoreMultiplier) * (1 + speedBonus);
  return Math.round(xp);
}

function calcSpeedBonus(ms: number): number {
  if (!ms || ms <= 0) return 0;
  // 0..10% bônus: ≤ 1min => 10%, ≥ 30min => 0%
  const min = ms / 60000;
  if (min <= 1) return 0.1;
  if (min >= 30) return 0;
  return (30 - min) / 30 / 10; // decai linearmente até 0
}