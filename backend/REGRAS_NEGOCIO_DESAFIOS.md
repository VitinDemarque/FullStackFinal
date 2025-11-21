# Regras de Negócio - Exercícios

## 📋 Índice
1. [Regras para Criação de Exercícios](#regras-para-criação-de-exercícios)
2. [Regras para Análise de Exercícios](#regras-para-análise-de-exercícios)
3. [Sistema de Testes Automatizados](#sistema-de-testes-automatizados)
4. [Análise de Complexidade](#análise-de-complexidade)
5. [Sistema de Ranking](#sistema-de-ranking)

---

## 🎯 Resumo Executivo

Este documento define as regras de negócio para o sistema de exercícios, incluindo:

### **Criação de Exercícios**
- Validações obrigatórias e opcionais
- Sistema de testes: **mínimo de 3 testes obrigatórios** por exercício
- Permissões por papel (usuário comum vs administrador)
- Regras de grupo e visibilidade

### **Análise Automatizada de Exercícios**
1. **Validação com Testes**: Executa código do usuário contra todos os testes do exercício
2. **Cálculo de Score**: Baseado na porcentagem de testes passados
3. **Análise de Complexidade**: Avalia complexidade ciclomática, linhas de código, aninhamento e recursão
4. **Bônus de Pontos**: Até 20 pontos extras para códigos com baixa complexidade
5. **Score Final**: Score dos testes + bônus de complexidade (máximo 100)

### **Sistema de Ranking**
- **Critérios de ordenação**:
  1. Score Final (maior é melhor)
  2. Score de Complexidade (maior é melhor - desempate)
  3. Tempo Gasto (menor é melhor - desempate final)

### **Fluxo Completo**
```
Criar Exercício → Adicionar 3+ Testes → Publicar
     ↓
Usuário Resolve → Executa Testes → Analisa Complexidade → Calcula Score Final → Atualiza Ranking
```

---

## 🎯 Regras para Criação de Exercícios

### 1. Validações Obrigatórias

#### 1.1 Campos Obrigatórios
- **Título** (`title`): 
  - ✅ Obrigatório
  - ✅ Mínimo de 3 caracteres
  - ✅ Máximo de 200 caracteres
  - ✅ Não pode ser apenas espaços em branco

- **Autor** (`authorUserId`):
  - ✅ Obrigatório (obtido do token de autenticação)
  - ✅ Usuário deve existir no sistema

#### 1.2 Campos Opcionais com Validações

- **Linguagem** (`languageId`):
  - ⚠️ Opcional
  - ✅ Se fornecido, deve existir no sistema
  - ✅ Se não fornecido, exercício fica sem linguagem específica

- **Assunto** (`subject`):
  - ⚠️ Opcional
  - ✅ Máximo de 100 caracteres
  - ✅ Padrão: string vazia

- **Descrição** (`description`):
  - ⚠️ Opcional
  - ✅ Máximo de 5000 caracteres
  - ✅ Padrão: string vazia

- **Dificuldade** (`difficulty`):
  - ⚠️ Opcional
  - ✅ Valor entre 1 e 5 (inclusive)
  - ✅ Padrão: 1
  - ✅ Números inteiros apenas

- **XP Base** (`baseXp`):
  - ⚠️ Opcional
  - ✅ Valor mínimo: 0
  - ✅ Padrão: 100
  - ✅ Números inteiros apenas

- **Template de Código** (`codeTemplate`):
  - ⚠️ Opcional
  - ✅ Padrão: `"// start coding..."`
  - ✅ Máximo de 50000 caracteres

- **Visibilidade** (`isPublic`):
  - ⚠️ Opcional
  - ✅ Padrão: `true`
  - ✅ Se `groupId` for fornecido, automaticamente vira `false`

- **Status** (`status`):
  - ⚠️ Opcional
  - ✅ Valores permitidos: `'DRAFT'`, `'PUBLISHED'`, `'ARCHIVED'`
  - ✅ Padrão: `'PUBLISHED'` se `isPublic = true`, senão `'DRAFT'`

### 2. Regras de Permissões

#### 2.1 Permissões por Papel do Usuário

- **Usuário Comum**:
  - ✅ Pode criar exercícios
  - ❌ Não pode configurar badges (`triumphantBadgeId`, `highScoreBadgeId`)
  - ❌ Não pode alterar `badgeRarity` (sempre `'COMMON'`)
  - ❌ Não pode configurar `highScoreThreshold`

- **Administrador**:
  - ✅ Pode criar exercícios
  - ✅ Pode configurar todos os badges
  - ✅ Pode alterar `badgeRarity` (`'COMMON'`, `'RARE'`, `'EPIC'`, `'LEGENDARY'`)
  - ✅ Pode configurar `highScoreThreshold` (0-100)

### 3. Regras de Grupo

#### 3.1 Exercícios para Grupos

- **Se `groupId` for fornecido**:
  - ✅ Usuário deve ser membro do grupo
  - ✅ Grupo deve existir no sistema
  - ✅ `isPublic` automaticamente vira `false`
  - ✅ Exercício fica visível apenas para membros do grupo
  - ✅ Status padrão: `'DRAFT'` (pode ser alterado para `'PUBLISHED'`)

- **Se `groupId` não for fornecido**:
  - ✅ Exercício pode ser público ou privado
  - ✅ Se `isPublic = true`, status padrão: `'PUBLISHED'`

### 4. Geração de Código Público

- **Código Público** (`publicCode`):
  - ✅ Gerado automaticamente
  - ✅ Formato: `#AAAA0000` (4 letras maiúsculas + 4 dígitos)
  - ✅ Deve ser único no sistema
  - ✅ Tentativas: até 10 tentativas aleatórias
  - ✅ Fallback: `#EX` + timestamp (últimos 8 dígitos)

### 5. Sistema de Testes do Exercício

#### 5.1 Testes Obrigatórios

- **Mínimo de 2 testes obrigatórios**:
  - ✅ Todo exercício DEVE ter pelo menos 2 testes
  - ✅ Testes são obrigatórios para publicação
  - ❌ Não é possível publicar exercício sem pelo menos 2 testes

#### 5.2 Estrutura de um Teste

Cada teste contém:
- **Entrada** (`input`):
  - ✅ String contendo a entrada do teste
  - ✅ Pode ser vazio se o teste não requer entrada
  - ✅ Máximo de 10000 caracteres

- **Saída Esperada** (`expectedOutput`):
  - ✅ String contendo a saída esperada
  - ✅ Obrigatório
  - ✅ Máximo de 10000 caracteres
  - ✅ Será comparada exatamente com a saída do código do usuário

- **Descrição** (`description`):
  - ⚠️ Opcional
  - ✅ Máximo de 500 caracteres
  - ✅ Usado para documentar o que o teste valida

#### 5.3 Testes Opcionais Adicionais

- **Após os 2 obrigatórios**:
  - ✅ Autor pode adicionar testes opcionais adicionais
  - ✅ Não há limite máximo de testes
  - ✅ Recomendado: 3-5 testes para boa cobertura

#### 5.4 Validação dos Testes

- **Ao criar/editar exercício**:
  - ✅ Valida que há pelo menos 2 testes
  - ✅ Valida que cada teste tem `expectedOutput`
  - ✅ Valida tamanhos máximos dos campos
  - ❌ Não permite publicar se não tiver 2 testes válidos

#### 5.5 Armazenamento

- **Estrutura no banco**:
  - ✅ Array de objetos `tests` no modelo `Exercise`
  - ✅ Cada teste tem: `input`, `expectedOutput`, `description` (opcional)
  - ✅ Ordem dos testes é preservada

### 6. Estatísticas

- **Ao criar exercício**:
  - ✅ Incrementa `exercisesCreatedCount` do autor em `UserStat`
  - ✅ Cria registro se não existir

---

## 🔍 Regras para Análise de Exercícios

### 1. Validações Pré-Submissão

#### 1.1 Verificações Obrigatórias

- **Exercício existe**:
  - ✅ Exercício deve existir no banco de dados
  - ❌ Se não existir: `NotFoundError('Exercise not found')`

- **Exercício publicado**:
  - ✅ Status deve ser `'PUBLISHED'`
  - ❌ Se não publicado: `BadRequestError('Exercise not published')`

- **Usuário não completou anteriormente**:
  - ✅ Não pode ter submissão `'ACCEPTED'` para este exercício
  - ❌ Se já completou: `BadRequestError('Este desafio já foi concluído. Não é possível refazê-lo.')`

#### 1.2 Dados da Submissão

- **Código** (`code`):
  - ⚠️ Opcional
  - ✅ Se fornecido, armazenado na submissão
  - ✅ Máximo de 50000 caracteres

- **Score** (`score`):
  - ⚠️ Opcional
  - ✅ Valor entre 0 e 100 (inclusive)
  - ✅ Padrão: 0
  - ✅ Números decimais permitidos

- **Tempo Gasto** (`timeSpentMs`):
  - ⚠️ Opcional
  - ✅ Valor mínimo: 0
  - ✅ Padrão: 0
  - ✅ Em milissegundos

### 2. Validação Automática com Testes

#### 2.1 Execução dos Testes

- **Processo de validação**:
  1. ✅ Recebe código do usuário
  2. ✅ Executa código via Judge0 com cada teste do exercício
  3. ✅ Compara saída do código com `expectedOutput` de cada teste
  4. ✅ Conta quantos testes passaram
  5. ✅ Calcula score baseado na porcentagem de testes passados

#### 2.2 Cálculo de Score

- **Fórmula de Score**:
  - ✅ `Score = (Testes Passados / Total de Testes) × 100`
  - ✅ Arredondado para 2 casas decimais
  - ✅ Exemplo: 3 de 5 testes = 60.00 pontos

- **Validação de Saída**:
  - ✅ Comparação exata (trim de espaços em branco no início/fim)
  - ✅ Case-sensitive (maiúsculas/minúsculas importam)
  - ✅ Quebras de linha são preservadas

#### 2.3 Tratamento de Erros na Execução

- **Erros de compilação**:
  - ❌ Score = 0
  - ❌ Status = `'REJECTED'`
  - ✅ Mensagem de erro retornada ao usuário

- **Erros de runtime**:
  - ❌ Score = 0
  - ❌ Status = `'REJECTED'`
  - ✅ Mensagem de erro retornada ao usuário

- **Timeout**:
  - ❌ Score = 0
  - ❌ Status = `'REJECTED'`
  - ✅ Mensagem de timeout retornada

#### 2.4 Resultado dos Testes

- **Armazenamento**:
  - ✅ Cada submissão armazena quais testes passaram/falharam
  - ✅ Array de resultados: `[{ testIndex, passed, actualOutput, expectedOutput }]`
  - ✅ Usado para feedback ao usuário

### 3. Cálculo de Status

#### 3.1 Regra de Aprovação/Rejeição

- **Status `'ACCEPTED'`**:
  - ✅ Score >= 60 (pelo menos 60% dos testes passaram)
  - ✅ Exercício considerado concluído
  - ✅ Usuário não pode mais submeter para este exercício

- **Status `'REJECTED'`**:
  - ✅ Score < 60 (menos de 60% dos testes passaram)
  - ✅ Exercício não considerado concluído
  - ✅ Usuário pode tentar novamente (sem limite de tentativas)

### 4. Análise de Complexidade

#### 4.1 Objetivo

- **Análise automática**:
  - ✅ Avalia a complexidade do código submetido
  - ✅ Dá bônus de pontos se o código não for muito complexo
  - ✅ Incentiva soluções elegantes e eficientes

#### 4.2 Métricas de Complexidade

- **Complexidade Ciclomática**:
  - ✅ Conta estruturas de controle (if, for, while, switch, etc.)
  - ✅ Quanto mais estruturas, maior a complexidade

- **Linhas de Código**:
  - ✅ Conta linhas não vazias e não comentadas
  - ✅ Códigos muito longos são penalizados

- **Profundidade de Aninhamento**:
  - ✅ Mede o nível máximo de aninhamento (if dentro de if, etc.)
  - ✅ Aninhamento profundo aumenta complexidade

- **Uso de Recursão**:
  - ✅ Detecta chamadas recursivas
  - ✅ Recursão pode aumentar complexidade (dependendo do contexto)

#### 4.3 Cálculo do Score de Complexidade

- **Score de Complexidade** (0-100):
  - ✅ `complexityScore = 100 - (complexityPenalty)`
  - ✅ Penalidade baseada nas métricas acima
  - ✅ Quanto menor a complexidade, maior o score

- **Fórmula de Penalidade**:
  ```
  penalty = (cyclomaticComplexity × 2) + 
            (linesOfCode / 10) + 
            (maxNesting × 5) + 
            (hasRecursion ? 10 : 0)
  ```

- **Limites**:
  - ✅ Penalidade mínima: 0
  - ✅ Penalidade máxima: 100 (score = 0)
  - ✅ Score de complexidade: 0-100

#### 4.4 Bônus de Pontos

- **Aplicação do bônus**:
  - ✅ Bônus = `(complexityScore / 100) × 20` (máximo 20 pontos)
  - ✅ Aplicado APENAS se submissão for `'ACCEPTED'`
  - ✅ Score final = Score dos testes + Bônus de complexidade
  - ✅ Score final limitado a 100 (não pode ultrapassar)

- **Exemplo**:
  - Score dos testes: 80
  - Score de complexidade: 90
  - Bônus: (90/100) × 20 = 18 pontos
  - Score final: 80 + 18 = 98 pontos

#### 4.5 Armazenamento

- **Campos na submissão**:
  - ✅ `complexityScore`: Score de complexidade (0-100)
  - ✅ `complexityMetrics`: Objeto com métricas detalhadas
  - ✅ `bonusPoints`: Pontos de bônus concedidos
  - ✅ `finalScore`: Score final (testes + bônus)

### 5. Cálculo de XP

#### 5.1 Fórmula Base

- **XP Calculado**:
  - ✅ Usa função `calculateXp()` centralizada
  - ✅ Parâmetros:
    - `baseXp`: XP base do exercício (padrão: 100)
    - `difficulty`: Dificuldade (1-5)
    - `score`: Score final da submissão (testes + bônus, 0-100)
    - `timeSpentMs`: Tempo gasto em milissegundos

#### 5.2 Multiplicador por Raridade

- **Multiplicadores**:
  - `'COMMON'`: 1.0x
  - `'RARE'`: 1.1x
  - `'EPIC'`: 1.25x
  - `'LEGENDARY'`: 1.5x

- **XP Final**:
  - ✅ `XP Final = XP Calculado × Multiplicador de Raridade`
  - ✅ Arredondado para inteiro

### 6. Processamento de Submissão Aceita

#### 6.1 Crédito de XP e Nível

- **Se status = `'ACCEPTED'`**:
  - ✅ Credita XP ao usuário (`user.xpTotal += finalXpAwarded`)
  - ✅ Recalcula nível do usuário baseado nas regras de `LevelRule`
  - ✅ Atualiza `user.level` se necessário

#### 6.2 Concessão de Badges

- **Badge Triunfante** (`triumphantBadgeId`):
  - ✅ Se exercício tem `triumphantBadgeId` configurado
  - ✅ Concede badge ao usuário ao completar
  - ✅ Usa função `grantTriumphantBadgesForExerciseCompletion()`

- **Badge de Alta Pontuação** (`highScoreBadgeId`):
  - ✅ Se exercício tem `highScoreBadgeId` configurado
  - ✅ Verifica se é o melhor no ranking:
    - Score final maior que o atual, OU
    - Score final igual mas complexity score maior, OU
    - Score final e complexity iguais mas tempo menor
  - ✅ Se for o melhor:
    - Atualiza campos no exercício:
      - `highScoreAwarded = true`
      - `highScoreWinnerUserId = userId`
      - `highScoreWinnerSubmissionId = submissionId`
      - `highScoreWinnerScore = finalScore` (score final, não apenas testes)
      - `highScoreWinnerTime = timeSpentMs`
      - `highScoreAwardedAt = new Date()`
    - Remove badge do vencedor anterior (se houver)
    - Concede badge ao novo vencedor

#### 6.3 Limpeza de Tentativas

- **Ao aceitar submissão**:
  - ✅ Remove tentativas salvas (`ChallengeAttempt`) do usuário para este exercício
  - ✅ Usa `AttemptsService.deleteAttempt()`

### 7. Sistema de Ranking

#### 7.1 Critérios de Ranking

- **Ordem de prioridade**:
  1. ✅ **Score Final** (testes + bônus de complexidade) - maior é melhor
  2. ✅ **Score de Complexidade** - maior é melhor (desempate)
  3. ✅ **Tempo Gasto** - menor é melhor (desempate final)

#### 7.2 Cálculo da Posição no Ranking

- **Algoritmo de ordenação**:
  ```
  1. Ordena por score final (DESC)
  2. Se empate, ordena por complexity score (DESC)
  3. Se ainda empate, ordena por tempo gasto (ASC)
  ```

- **Exemplo**:
  - Usuário A: Score 100, Complexity 95, Tempo 5000ms
  - Usuário B: Score 100, Complexity 90, Tempo 3000ms
  - Usuário C: Score 95, Complexity 100, Tempo 2000ms
  - **Ranking**: A (1º), B (2º), C (3º)

#### 7.3 Armazenamento do Ranking

- **Campos na submissão para ranking**:
  - ✅ `finalScore`: Score final (testes + bônus)
  - ✅ `complexityScore`: Score de complexidade
  - ✅ `timeSpentMs`: Tempo gasto
  - ✅ `rankingPosition`: Posição no ranking (calculada dinamicamente)

#### 7.4 Atualização do Ranking

- **Quando atualizar**:
  - ✅ Toda vez que uma nova submissão `'ACCEPTED'` é criada
  - ✅ Recalcula posições de todos os usuários para aquele exercício
  - ✅ Mantém histórico de rankings por exercício

#### 7.5 Badge de Alta Pontuação

- **Atualização**:
  - ✅ Badge de alta pontuação agora considera ranking completo
  - ✅ Vencedor: melhor posição no ranking (score final > complexity > tempo)
  - ✅ Se empate em tudo, mantém o primeiro que alcançou

### 8. Temporadas (Seasons)

#### 8.1 Associação com Temporada

- **Temporada Ativa**:
  - ✅ Verifica se existe temporada ativa no momento da submissão
  - ✅ Critérios:
    - `isActive = true`
    - `startDate <= now`
    - `endDate >= now`
  - ✅ Se existir, associa `seasonId` à submissão

### 6. Estatísticas

#### 9.1 Estatísticas do Usuário

- **UserStat**:
  - ✅ Incrementa `exercisesSolvedCount` se status = `'ACCEPTED'`
  - ✅ Atualiza `lastUpdatedAt`
  - ✅ Cria registro se não existir (`upsert: true`)

#### 9.2 Estatísticas do Exercício

- **ExerciseStat**:
  - ✅ Incrementa `solvesCount` (independente do status)
  - ✅ Atualiza `lastSolveAt`
  - ✅ Cria registro se não existir (`upsert: true`)

### 10. Tratamento de Erros

#### 10.1 Erros Críticos

- **Erros que impedem submissão**:
  - ❌ Exercício não encontrado
  - ❌ Exercício não publicado
  - ❌ Usuário já completou o exercício

#### 10.2 Erros Não-Críticos

- **Erros que não impedem submissão**:
  - ⚠️ Falha ao atualizar estatísticas (silenciosamente ignorado)
  - ⚠️ Falha ao deletar tentativas (silenciosamente ignorado)

---

## 📝 Notas de Implementação

### Pontos de Atenção

1. **Validação de Score**: Atualmente o score é recebido do frontend. Considerar validação automática via Judge0 no futuro.

2. **Limite de Tentativas**: Atualmente não há limite de tentativas para exercícios rejeitados.

3. **Tempo de Submissão**: O tempo é calculado no frontend. Considerar validação no backend.

4. **Código Público**: Pode haver colisões raras. O fallback com timestamp resolve isso.

5. **Badges**: Apenas administradores podem configurar badges. Usuários comuns recebem badges configurados pelos admins.

---

## 🔄 Fluxo Completo

### Criação de Exercício
```
1. Usuário autenticado faz POST /exercises
2. Valida campos obrigatórios
3. Valida permissões (admin vs comum)
4. Valida grupo (se fornecido)
5. Gera código público único
6. Cria exercício no banco
7. Atualiza estatísticas do autor
8. Retorna exercício criado
```

### Análise de Exercício
```
1. Usuário autenticado faz POST /submissions
2. Valida se exercício existe e está publicado
3. Valida se usuário não completou anteriormente
4. Valida se exercício tem pelo menos 3 testes
5. Executa código do usuário com cada teste do exercício
6. Compara saídas e calcula score (testes passados / total)
7. Analisa complexidade do código:
   - Calcula complexidade ciclomática
   - Conta linhas de código
   - Mede profundidade de aninhamento
   - Detecta recursão
   - Calcula score de complexidade (0-100)
8. Calcula bônus de pontos (máximo 20 pontos)
9. Calcula score final (score testes + bônus, máximo 100)
10. Determina status (ACCEPTED se score final >= 60)
11. Calcula XP (base + multiplicador de raridade)
12. Cria submissão no banco com:
    - Score dos testes
    - Score de complexidade
    - Bônus concedido
    - Score final
    - Resultados de cada teste
    - Métricas de complexidade
13. Se ACCEPTED:
    - Credita XP e atualiza nível
    - Concede badges (triumphant e highScore se aplicável)
    - Remove tentativas salvas
    - Atualiza ranking do exercício
14. Atualiza estatísticas (usuário e exercício)
15. Retorna submissão criada com detalhes completos
```

---

## ✅ Checklist de Validações

### Criação
- [ ] Título válido (3-200 caracteres)
- [ ] Autor existe e está autenticado
- [ ] Linguagem existe (se fornecido)
- [ ] Dificuldade entre 1-5
- [ ] XP base >= 0
- [ ] Grupo existe e usuário é membro (se fornecido)
- [ ] Código público gerado e único
- [ ] **Pelo menos 2 testes obrigatórios configurados**
- [ ] **Cada teste tem expectedOutput válido**
- [ ] **Não permite publicar sem 2 testes**

### Análise
- [ ] Exercício existe
- [ ] Exercício está publicado
- [ ] Usuário não completou anteriormente
- [ ] **Exercício tem pelo menos 2 testes**
- [ ] **Código executa sem erros de compilação**
- [ ] **Código executa sem erros de runtime**
- [ ] **Todos os testes são executados**
- [ ] **Score calculado corretamente (testes passados / total)**
- [ ] **Complexidade analisada (ciclo, linhas, aninhamento, recursão)**
- [ ] **Score de complexidade calculado (0-100)**
- [ ] **Bônus de pontos calculado (máximo 20)**
- [ ] **Score final calculado (testes + bônus, máximo 100)**
- [ ] Status determinado corretamente (score final >= 60)
- [ ] Tempo >= 0
- [ ] XP calculado corretamente
- [ ] **Ranking atualizado (score final > complexity > tempo)**
- [ ] Status determinado corretamente
- [ ] Badges concedidos (se aplicável)
- [ ] Estatísticas atualizadas

