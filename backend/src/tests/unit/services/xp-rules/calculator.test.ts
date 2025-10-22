// comando de teste para esse arquivo: npm test -- src/tests/unit/services/xp-rules/calculator.test.ts --verbose

import { calculateXp, XpInput } from '@/services/xp-rules/calculator';

const calcSpeedBonus = (ms: number): number => {
    if (!ms || ms <= 0) return 0;
    const min = ms / 60000;
    if (min <= 1) return 0.1;
    if (min >= 30) return 0;
    return (30 - min) / 30 / 10;
};

describe('calculator.ts - calculateXp', () => {

    it('deve retornar XP mínimo se baseXp for 0', () => {
        const input: XpInput = { baseXp: 0, difficulty: 1, score: 0, timeSpentMs: 0 };
        const xp = calculateXp(input);
        expect(xp).toBe(10); // mínimo garantido
    });

    it('deve calcular XP corretamente para score 100, dificuldade 1 e tempo médio', () => {
        const input: XpInput = { baseXp: 100, difficulty: 1, score: 100, timeSpentMs: 15 * 60 * 1000 };
        const xp = calculateXp(input);
        expect(xp).toBeGreaterThan(0);
    });

    it('deve aplicar multiplier de dificuldade corretamente', () => {
        const input: XpInput = { baseXp: 100, difficulty: 3, score: 100, timeSpentMs: 0 };
        const xp = calculateXp(input);
        const expected = Math.round(100 * (1 + 0.25 * 2) * (0.5 + 0.5 * 1) * (1 + 0));
        expect(xp).toBe(expected);
    });

    it('deve aplicar bônus de velocidade máximo para menos de 1 minuto', () => {
        const input: XpInput = { baseXp: 100, difficulty: 1, score: 100, timeSpentMs: 30 * 1000 }; // 30s
        const xp = calculateXp(input);
        expect(xp).toBeGreaterThan(100);
    });

    it('deve retornar XP correto quando score for 0', () => {
        const input = { baseXp: 100, difficulty: 3, score: 0, timeSpentMs: 10000 };
        const xp = calculateXp(input);
        const speedBonus = calcSpeedBonus(input.timeSpentMs);
        const diffMultiplier = 1 + (3 - 1) * 0.25; // = 1.5
        const expected = Math.round(100 * diffMultiplier * 0.5 * (1 + speedBonus));
        expect(xp).toBe(expected);
    });

    it('deve arredondar o XP para inteiro', () => {
        const input: XpInput = { baseXp: 123.45, difficulty: 2, score: 87, timeSpentMs: 0 };
        const xp = calculateXp(input);
        expect(Number.isInteger(xp)).toBe(true);
    });

    it('deve tratar tempo negativo ou zero como bônus 0', () => {
        const input: XpInput = { baseXp: 100, difficulty: 1, score: 50, timeSpentMs: -1000 };
        const xp = calculateXp(input);
        const expected = Math.round(100 * (1 + 0) * (0.5 + 0.5 * 0.5) * 1);
        expect(xp).toBe(expected);
    });

    it('deve aplicar corretamente XP com dificuldade mínima e máxima', () => {
        const minInput: XpInput = { baseXp: 100, difficulty: 1, score: 100, timeSpentMs: 0 };
        const maxInput: XpInput = { baseXp: 100, difficulty: 5, score: 100, timeSpentMs: 0 };

        const xpMin = calculateXp(minInput);
        const xpMax = calculateXp(maxInput);

        expect(xpMin).toBeLessThan(xpMax);
    });
});