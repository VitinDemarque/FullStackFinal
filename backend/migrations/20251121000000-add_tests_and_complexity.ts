import { Db } from "mongodb";

/**
 * Migration: Adiciona campos de testes e análise de complexidade
 * 
 * Esta migration adiciona:
 * - Campo 'tests' na coleção 'exercises' (array vazio para exercícios existentes)
 * - Novos campos na coleção 'submissions' para armazenar:
 *   - testResults: resultados dos testes
 *   - testScore: score baseado nos testes
 *   - complexityScore: score de complexidade
 *   - complexityMetrics: métricas detalhadas
 *   - bonusPoints: pontos de bônus
 *   - finalScore: score final
 */
export const up = async (db: Db) => {
  // ============================================
  // EXERCISES: Adicionar campo 'tests'
  // ============================================
  console.log("Adicionando campo 'tests' aos exercícios existentes...");
  
  await db.collection("exercises").updateMany(
    { tests: { $exists: false } },
    { $set: { tests: [] } }
  );

  console.log("Campo 'tests' adicionado aos exercícios.");

  // ============================================
  // SUBMISSIONS: Adicionar novos campos
  // ============================================
  console.log("Adicionando novos campos às submissões existentes...");

  // Adicionar testResults (array vazio)
  await db.collection("submissions").updateMany(
    { testResults: { $exists: false } },
    { $set: { testResults: [] } }
  );

  // Adicionar testScore (null para submissões antigas)
  await db.collection("submissions").updateMany(
    { testScore: { $exists: false } },
    { $set: { testScore: null } }
  );

  // Adicionar complexityScore (null para submissões antigas)
  await db.collection("submissions").updateMany(
    { complexityScore: { $exists: false } },
    { $set: { complexityScore: null } }
  );

  // Adicionar complexityMetrics (objeto com valores padrão)
  await db.collection("submissions").updateMany(
    { complexityMetrics: { $exists: false } },
    {
      $set: {
        complexityMetrics: {
          cyclomaticComplexity: 0,
          linesOfCode: 0,
          maxNestingDepth: 0,
          hasRecursion: false
        }
      }
    }
  );

  // Adicionar bonusPoints (0 para submissões antigas)
  await db.collection("submissions").updateMany(
    { bonusPoints: { $exists: false } },
    { $set: { bonusPoints: 0 } }
  );

  // Adicionar finalScore (null para submissões antigas, ou copiar de 'score' se existir)
  // Primeiro, copiar score para finalScore onde score existe e finalScore não existe
  await db.collection("submissions").updateMany(
    {
      score: { $exists: true, $ne: null },
      finalScore: { $exists: false }
    },
    [{ $set: { finalScore: "$score" } }]
  );

  // Depois, definir null para os que não têm score
  await db.collection("submissions").updateMany(
    { finalScore: { $exists: false } },
    { $set: { finalScore: null } }
  );

  // ============================================
  // ÍNDICES: Criar índices para performance
  // ============================================
  console.log("Criando índices para performance...");

  // Índice para finalScore (usado em rankings)
  try {
    await db.collection("submissions").createIndex(
      { finalScore: -1, complexityScore: -1, timeSpentMs: 1 },
      { name: "ranking_index" }
    );
    console.log("Índice 'ranking_index' criado com sucesso.");
  } catch (error: any) {
    // Índice pode já existir, ignorar erro
    if (!error.message?.includes("already exists")) {
      console.warn("Aviso ao criar índice 'ranking_index':", error.message);
    }
  }

  // Índice composto para buscar submissões aceitas de um exercício ordenadas por ranking
  try {
    await db.collection("submissions").createIndex(
      { exerciseId: 1, status: 1, finalScore: -1, complexityScore: -1, timeSpentMs: 1 },
      { name: "exercise_ranking_index" }
    );
    console.log("Índice 'exercise_ranking_index' criado com sucesso.");
  } catch (error: any) {
    if (!error.message?.includes("already exists")) {
      console.warn("Aviso ao criar índice 'exercise_ranking_index':", error.message);
    }
  }

  console.log("Migration concluída com sucesso!");
};

/**
 * Rollback: Remove os campos adicionados
 * 
 * ATENÇÃO: Esta operação remove os dados dos novos campos.
 * Use apenas se realmente precisar reverter a migration.
 */
export const down = async (db: Db) => {
  console.log("Revertendo migration...");

  // Remover campo 'tests' dos exercícios
  await db.collection("exercises").updateMany(
    {},
    { $unset: { tests: "" } }
  );

  // Remover novos campos das submissões
  await db.collection("submissions").updateMany(
    {},
    {
      $unset: {
        testResults: "",
        testScore: "",
        complexityScore: "",
        complexityMetrics: "",
        bonusPoints: "",
        finalScore: ""
      }
    }
  );

  // Remover índices
  try {
    await db.collection("submissions").dropIndex("ranking_index");
  } catch (error: any) {
    console.warn("Índice 'ranking_index' não encontrado ou já removido.");
  }

  try {
    await db.collection("submissions").dropIndex("exercise_ranking_index");
  } catch (error: any) {
    console.warn("Índice 'exercise_ranking_index' não encontrado ou já removido.");
  }

  console.log("Rollback concluído.");
};

