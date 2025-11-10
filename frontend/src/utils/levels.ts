const BASE_XP = 100;
const FACTOR = 1.5;

export function requirementForLevel(level: number): number {
  if (level <= 0) return 0;
  return Math.round(BASE_XP * Math.pow(FACTOR, level - 1));
}

export function cumulativeForLevel(level: number): number {
  if (level <= 0) return 0;
  let total = 0;
  for (let l = 1; l <= level; l++) {
    total += requirementForLevel(l);
  }
  return total;
}

export function nextCumulativeForLevel(level: number): number {
  return cumulativeForLevel(level + 1);
}

export function getProgressToNextLevel(xpTotal: number, level: number) {
  const prevCumulative = cumulativeForLevel(level);
  const nextRequirement = requirementForLevel(level + 1);
  const withinLevelXp = Math.max(0, xpTotal - prevCumulative);
  const percent = Math.max(0, Math.min(100, (withinLevelXp / Math.max(1, nextRequirement)) * 100));
  return { withinLevelXp, nextRequirement, percent };
}

export function deriveLevelFromXp(xpTotal: number, maxLevel = 100): number {
  let level = 0;
  // Incrementa enquanto XP total atinge a cumulativa do próximo nível
  while (level < maxLevel && xpTotal >= cumulativeForLevel(level + 1)) {
    level++;
  }
  return level;
}