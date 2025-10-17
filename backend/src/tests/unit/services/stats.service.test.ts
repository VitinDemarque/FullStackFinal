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

// Mock de todos os models Mongoose usados
jest.mock('../../../models/ExerciseStat.model', () => ({
    find: jest.fn(),
    countDocuments: jest.fn(),
}));
jest.mock('../../../models/UserStat.model', () => ({
    findOne: jest.fn(),
}));
jest.mock('../../../models/Exercise.model', () => ({
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
            // Mock da query do ExerciseStat
            (ExerciseStat.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([mockExerciseStat]),
            });
            (ExerciseStat.countDocuments as jest.Mock).mockResolvedValue(1);

            // Mock da query do Exercise
            (Exercise.find as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue([mockExercise]),
            });

            const result = await statsService.listExerciseStats({
                skip: 0,
                limit: 10,
                exerciseId: mockExerciseStat.exerciseId.toString(), // ✅ corrigido
            });

            expect(ExerciseStat.find).toHaveBeenCalledWith({
                exerciseId: new Types.ObjectId(mockExerciseStat.exerciseId.toString()), // ✅ corrigido
            });
            expect(Exercise.find).toHaveBeenCalledWith({
                _id: { $in: [mockExerciseStat.exerciseId] }, // ✅ corrigido
            });
            expect(result.items[0]).toMatchObject({
                exerciseId: mockExerciseStat.exerciseId.toString(),
                solvesCount: 5,
                avgScore: 80,
                exercise: { id: mockExerciseStat.exerciseId.toString(), title: 'Exercício de Teste' },
            });

            it('deve retornar lista de estatísticas sem informações adicionais quando não há exercícios correspondentes', async () => {
                (ExerciseStat.find as jest.Mock).mockReturnValue({
                    sort: jest.fn().mockReturnThis(),
                    skip: jest.fn().mockReturnThis(),
                    limit: jest.fn().mockReturnThis(),
                    lean: jest.fn().mockResolvedValue([mockExerciseStat]),
                });
                (ExerciseStat.countDocuments as jest.Mock).mockResolvedValue(1);

                (Exercise.find as jest.Mock).mockReturnValue({
                    select: jest.fn().mockReturnThis(),
                    lean: jest.fn().mockResolvedValue([]),
                });

                const result = await statsService.listExerciseStats({ skip: 0, limit: 10 });

                expect(ExerciseStat.find).toHaveBeenCalledWith({});
                expect(result.items[0].exercise).toBeNull();
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
                expect(result.total).toBe(0);
                expect(Exercise.find).not.toHaveBeenCalled();
            });
        });

        describe('getUserStats', () => {
            it('deve retornar estatísticas do usuário existentes', async () => {
                const mockUserStat = {
                    userId: new Types.ObjectId('507f1f77bcf86cd799439011'),
                    exercisesCreatedCount: 10,
                    exercisesSolvedCount: 7,
                    lastUpdatedAt: new Date('2025-04-10'),
                };

                (UserStat.findOne as jest.Mock).mockReturnValue({
                    lean: jest.fn().mockResolvedValue(mockUserStat),
                });

                const result = await statsService.getUserStats('507f1f77bcf86cd799439011');

                expect(UserStat.findOne).toHaveBeenCalledWith({
                    userId: new Types.ObjectId('507f1f77bcf86cd799439011'),
                });
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
                jest.spyOn(statsService, 'getUserStats').mockResolvedValue({
                    userId: 'u1',
                    exercisesCreatedCount: 3,
                    exercisesSolvedCount: 7,
                    lastUpdatedAt: new Date(),
                });

                const result = await statsService.getUserScoreboard('u1');

                expect(result).toEqual({ created: 3, solved: 7 });
                expect(statsService.getUserStats).toHaveBeenCalledWith('u1');
            });
        });
    });
});