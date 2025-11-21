import { Types } from 'mongoose';
import { NotFoundError, BadRequestError } from '../utils/httpErrors';
import Exercise, { IExercise, ITest } from '../models/Exercise.model';
import Language from '../models/Language.model';
import { executarCodigoComInput, ExecuteCodeWithInputResult } from './judge0.service';
import { ITestResult } from '../models/Submission.model';

/**
 * Mapeamento de slugs de linguagem para IDs do Judge0
 */
const LANGUAGE_JUDGE0_MAP: Record<string, number> = {
  'java': 62,
  'python': 71,
  'javascript': 63,
  'c': 50,
  'cpp': 54,
};

/**
 * Obtém o ID do Judge0 para uma linguagem
 */
async function getJudge0LanguageId(languageId: Types.ObjectId | null | undefined): Promise<number> {
  if (!languageId) {
    return LANGUAGE_JUDGE0_MAP['java'];
  }

  const language = await Language.findById(languageId).lean();
  if (!language) {
    throw new NotFoundError('Language not found');
  }

  const judge0Id = LANGUAGE_JUDGE0_MAP[language.slug.toLowerCase()];
  if (!judge0Id) {
    throw new BadRequestError(`Linguagem '${language.slug}' não suportada para execução de testes`);
  }

  return judge0Id;
}

/**
 * Compara duas saídas, normalizando espaços em branco
 * 
 * @param actual - Saída real do código
 * @param expected - Saída esperada
 * @returns true se as saídas são iguais (após normalização)
 */
function compareOutputs(actual: string, expected: string): boolean {
  const normalizedActual = actual.trim();
  const normalizedExpected = expected.trim();
  return normalizedActual === normalizedExpected;
}

/**
 * Executa um teste individual
 */
async function executeTest(
  userCode: string,
  test: ITest,
  testIndex: number,
  judge0LanguageId: number
): Promise<ITestResult> {
  try {
    const result: ExecuteCodeWithInputResult = await executarCodigoComInput(
      userCode,
      judge0LanguageId,
      test.input || ''
    );

    if (!result.sucesso) {
      const errorMessage = result.compileError || result.error || 'Erro desconhecido na execução';
      return {
        testIndex,
        passed: false,
        actualOutput: '',
        expectedOutput: test.expectedOutput,
        error: errorMessage
      };
    }

    const actualOutput = result.resultado || '';
    const passed = compareOutputs(actualOutput, test.expectedOutput);

    return {
      testIndex,
      passed,
      actualOutput,
      expectedOutput: test.expectedOutput,
      error: passed ? undefined : 'Saída não corresponde ao esperado'
    };

  } catch (error: any) {
    return {
      testIndex,
      passed: false,
      actualOutput: '',
      expectedOutput: test.expectedOutput,
      error: error instanceof Error ? error.message : 'Erro ao executar teste'
    };
  }
}

/**
 * Interface para resultado da validação de testes
 */
export interface ValidateTestsResult {
  testResults: ITestResult[];
  testScore: number;  // Score baseado em testes passados (0-100)
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

/**
 * Valida o código do usuário contra todos os testes do exercício
 * 
 * @param exerciseId - ID do exercício
 * @param userCode - Código do usuário a ser testado
 * @returns Resultado da validação com detalhes de cada teste
 */
export async function validateTests(
  exerciseId: string,
  userCode: string
): Promise<ValidateTestsResult> {
  const exercise = await Exercise.findById(exerciseId).lean<IExercise | null>();
  
  if (!exercise) {
    throw new NotFoundError('Exercise not found');
  }

  if (!exercise.tests || exercise.tests.length === 0) {
    throw new BadRequestError('Exercício não possui testes configurados');
  }

  if (exercise.tests.length < 2) {
    throw new BadRequestError('Exercício deve ter pelo menos 2 testes para validação');
  }

  const judge0LanguageId = await getJudge0LanguageId(exercise.languageId);
  const testPromises = exercise.tests.map((test, index) =>
    executeTest(userCode, test, index, judge0LanguageId)
  );
  const testResults = await Promise.all(testPromises);

  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;
  const testScore = totalTests > 0 
    ? Math.round((passedTests / totalTests) * 100 * 100) / 100
    : 0;

  return {
    testResults,
    testScore,
    totalTests,
    passedTests,
    failedTests
  };
}

/**
 * Valida se um exercício tem testes suficientes para publicação
 * 
 * @param exerciseId - ID do exercício
 * @returns true se tem pelo menos 2 testes válidos
 */
export async function hasValidTests(exerciseId: string): Promise<boolean> {
  const exercise = await Exercise.findById(exerciseId).lean<IExercise | null>();
  
  if (!exercise) {
    return false;
  }

  if (!exercise.tests || exercise.tests.length < 2) {
    return false;
  }

  return exercise.tests.every(test => 
    test.expectedOutput && test.expectedOutput.trim().length > 0
  );
}

