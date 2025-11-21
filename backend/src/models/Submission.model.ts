import { Schema, model, models, Types } from 'mongoose';

export type SubmissionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// Interface para resultado de um teste individual
export interface ITestResult {
  testIndex: number;        // Índice do teste no array de testes do exercício
  passed: boolean;           // Se o teste passou ou não
  actualOutput: string;      // Saída real do código do usuário
  expectedOutput: string;   // Saída esperada do teste
  error?: string;           // Mensagem de erro (se houver)
}

// Interface para métricas de complexidade do código
export interface IComplexityMetrics {
  cyclomaticComplexity: number;  // Complexidade ciclomática
  linesOfCode: number;           // Linhas de código (sem comentários/vazias)
  maxNestingDepth: number;       // Profundidade máxima de aninhamento
  hasRecursion: boolean;         // Se usa recursão
}

export interface ISubmission {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  exerciseId: Types.ObjectId;
  seasonId?: Types.ObjectId | null;
  status: SubmissionStatus;
  score: number;          // 0..100 (mantido para compatibilidade, usar finalScore)
  timeSpentMs?: number;   // duração em ms
  xpAwarded: number;
  code?: string | null;
  // Novos campos para sistema de testes e complexidade
  testResults?: ITestResult[];        // Resultados de cada teste executado
  testScore?: number;                  // Score baseado nos testes (0-100)
  complexityScore?: number;            // Score de complexidade (0-100)
  complexityMetrics?: IComplexityMetrics; // Métricas detalhadas de complexidade
  bonusPoints?: number;                // Pontos de bônus concedidos (0-20)
  finalScore?: number;                 // Score final (testScore + bonusPoints, máximo 100)
  createdAt?: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true, index: true },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', default: null, index: true },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], required: true, index: true },
    score: { type: Number, default: 0, min: 0, max: 100 }, // Mantido para compatibilidade
    timeSpentMs: { type: Number, default: 0, min: 0 },
    xpAwarded: { type: Number, default: 0, min: 0 },
    code: { type: String, default: null },
    // Novos campos para sistema de testes e complexidade
    testResults: [{
      testIndex: { type: Number, required: true },
      passed: { type: Boolean, required: true },
      actualOutput: { type: String, default: '' },
      expectedOutput: { type: String, required: true },
      error: { type: String, default: null }
    }],
    testScore: { type: Number, default: null, min: 0, max: 100 },
    complexityScore: { type: Number, default: null, min: 0, max: 100 },
    complexityMetrics: {
      cyclomaticComplexity: { type: Number, default: 0, min: 0 },
      linesOfCode: { type: Number, default: 0, min: 0 },
      maxNestingDepth: { type: Number, default: 0, min: 0 },
      hasRecursion: { type: Boolean, default: false }
    },
    bonusPoints: { type: Number, default: 0, min: 0, max: 20 },
    finalScore: { type: Number, default: null, min: 0, max: 100, index: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default models.Submission || model<ISubmission>('Submission', SubmissionSchema);