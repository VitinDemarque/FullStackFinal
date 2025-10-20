// comando de teste para esse arquivo: npm test -- src/tests/unit/services/stats.service.test.ts --verbose

import * as statsService from '@/services/stats.service';
import ExerciseStat from '@/models/ExerciseStat.model';
import UserStat from '@/models/UserStat.model';
import Exercise from '@/models/Exercise.model';
import { Types } from 'mongoose';

/*
  O que este teste cobre:

    Função	                                Cenários
     listExerciseStats                       Agregacao e mapeamento
     getUserStats                            Uso de valores com ou sem estatisticas
     getUserScoreboard                       Created e solved
*/

// Mock de Types.ObjectId
jest.spyOn(Types, 'ObjectId').mockImplementation((id?: any) => ({
    toString: () => (id ? id.toString() : '000000000000000000000000'),
}) as any);

// Mock dos Models Mongoose
jest.mock('@/models/ExerciseStat.model', () => ({
    find: jest.fn(),
    countDocuments: jest.fn(),
}));
jest.mock('@/models/UserStat.model', () => ({
    findOne: jest.fn(),
}));
jest.mock('@/models/Exercise.model', () => ({
    find: jest.fn(),
}));

describe('stats.service', () => {
    beforeEach(() => jest.clearAllMocks());

    const mockExerciseStat = {
        _id: new Types.ObjectId(),
        exerciseId: new Types.ObjectId('507f1f77bcf86cd799439011'),
        solvesCount: 5,
        avgScore: 80,
        lastSolveAt: new Date('2025-05-05'),
    };

    const mockExercise = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        title: 'Exercício de Teste',
    };

    describe('listExerciseStats', () => {
        it('deve retornar lista de estatísticas com informações do exercício', async () => {
            (ExerciseStat.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([mockExerciseStat]),
            });
            (ExerciseStat.countDocuments as jest.Mock).mockResolvedValue(1);
            (Exercise.find as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([mockExercise]),
            });

            const result = await statsService.listExerciseStats({
                skip: 0,
                limit: 10,
                exerciseId: mockExerciseStat.exerciseId.toString(),
            });

            expect(result.items[0].exercise).toMatchObject({
                id: mockExerciseStat.exerciseId.toString(),
                title: 'Exercício de Teste',
            });
        });

        it('deve lidar com lista vazia', async () => {
            (ExerciseStat.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([]),
            });
            (ExerciseStat.countDocuments as jest.Mock).mockResolvedValue(0);

            const result = await statsService.listExerciseStats({ skip: 0, limit: 10 });

            expect(result.items).toHaveLength(0);
        });
    });

    describe('getUserStats', () => {
        it('deve retornar estatísticas do usuário existentes', async () => {
            (UserStat.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    userId: new Types.ObjectId('507f1f77bcf86cd799439011'),
                    exercisesCreatedCount: 10,
                    exercisesSolvedCount: 7,
                    lastUpdatedAt: new Date(),
                }),
            });

            const result = await statsService.getUserStats('507f1f77bcf86cd799439011');

            expect(result).toMatchObject({
                userId: '507f1f77bcf86cd799439011',
                exercisesCreatedCount: 10,
                exercisesSolvedCount: 7,
            });
        });

        it('deve retornar valores padrão se o usuário não tiver estatísticas', async () => {
            (UserStat.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            });

            const result = await statsService.getUserStats('507f1f77bcf86cd799439012');

            expect(result).toMatchObject({
                exercisesCreatedCount: 0,
                exercisesSolvedCount: 0,
                lastUpdatedAt: null,
            });
        });
    });

    describe('getUserScoreboard', () => {
        it('deve retornar apenas created e solved', async () => {
            // Mock do UserStat usado dentro de getUserStats
            (UserStat.findOne as jest.Mock).mockReturnValue({
                lean: jest.fn().mockResolvedValue({
                    userId: '507f1f77bcf86cd799439011',
                    exercisesCreatedCount: 3,
                    exercisesSolvedCount: 7,
                    lastUpdatedAt: new Date(),
                }),
            });

            const result = await statsService.getUserScoreboard('507f1f77bcf86cd799439011');

            expect(result).toEqual({ created: 3, solved: 7 });
        });
    });
});