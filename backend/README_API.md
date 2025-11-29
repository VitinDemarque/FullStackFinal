# Ranking Platform API - Documentação

## Visão Geral

API REST completa para plataforma de ranking de exercícios de programação com sistema de gamificação, análise de complexidade de código e execução automática de testes.

---

## Características Principais

### Sistema Híbrido de Bônus

Análise inteligente que premia tanto correção quanto qualidade de código:

- **100% dos testes:** Bônus completo (até 20 pontos)
- **90-99% dos testes:** Bônus parcial alto (até 10 pontos)
- **80-89% dos testes:** Bônus parcial baixo (até 5 pontos)
- **< 80% dos testes:** Sem bônus

### Ranking Inteligente

Ordenação por múltiplos critérios:

1. **Score Final** (testes + bônus) - Maior é melhor
2. **Score de Complexidade** (qualidade) - Desempate
3. **Tempo Gasto** (velocidade) - Desempate final

### Análise de Complexidade

Métricas calculadas automaticamente:

- Complexidade ciclomática
- Linhas de código (excluindo comentários)
- Profundidade de aninhamento
- Detecção de recursão

### Validação Automática

Sistema de testes integrado com Judge0:

- Execução automática contra múltiplos testes
- Comparação de outputs
- Feedback detalhado por teste
- Análise de erros de compilação e runtime

---

## Tecnologias

- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.1
- **Linguagem:** TypeScript 5.9
- **Banco de Dados:** MongoDB com Mongoose 8.19
- **Autenticação:** JWT (jsonwebtoken 9.0)
- **Segurança:** Helmet + CORS + bcrypt
- **Testes:** Jest 30.2
- **Code Execution:** Judge0 API

---

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (MongoDB)
│   ├── controllers/     # Controladores HTTP (20)
│   ├── services/        # Lógica de negócio (22)
│   ├── models/          # Modelos Mongoose (19)
│   ├── routes/          # Rotas Express (20)
│   ├── middlewares/     # Autenticação e erros
│   ├── utils/           # Utilitários (8)
│   ├── tests/           # Testes unitários/integração
│   ├── scripts/         # Scripts de seed
│   ├── app.ts           # Configuração Express
│   └── server.ts        # Bootstrap da aplicação
├── migrations/          # Migrações MongoDB (6)
├── uploads/             # Arquivos uploadados (avatars)
├── .env                 # Variáveis de ambiente
├── package.json
├── tsconfig.json
└── jest.config.js
```

---

## Instalação

### Pré-requisitos

- Node.js 18+ instalado
- MongoDB 6+ rodando
- Judge0 API configurada (opcional, para execução de código)

### Passo 1: Instalar Dependências

```bash
cd backend
npm install
```

### Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend:

```env
# Ambiente
NODE_ENV=development

# Servidor
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=ranking-platform

# JWT
JWT_SECRET=sua-chave-secreta-aqui-mude-isso
JWT_EXPIRES_IN=7d

# Judge0 (opcional)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=sua-chave-rapidapi
```

### Passo 3: Iniciar o Servidor

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

O servidor iniciará em `http://localhost:3000`.

---

## Documentação Postman

### Arquivos Disponíveis

1. **Collection:** `Ranking_Platform_API.postman_collection.json`
   - 80+ endpoints documentados
   - Exemplos de request/response
   - Scripts de autenticação automática

2. **Environment:** `Ranking_Platform_Environment.postman_environment.json`
   - Variáveis pré-configuradas
   - Tokens gerenciados automaticamente

3. **Guia Completo:** `POSTMAN_DOCUMENTATION.md`
   - Instruções detalhadas
   - Exemplos de uso
   - Troubleshooting

4. **Quick Start:** `QUICK_START_POSTMAN.md`
   - Início em 5 minutos
   - Fluxo básico de teste

### Importar no Postman

1. Abra o Postman
2. Import → Selecione os 2 arquivos JSON
3. Ative o environment "Ranking Platform - Development"
4. Execute `POST /auth/signup` ou `POST /auth/login`
5. Pronto! Tokens salvos automaticamente

---

## Endpoints Principais

### Autenticação

```
POST   /api/auth/signup          Criar conta
POST   /api/auth/login           Fazer login
POST   /api/auth/refresh         Renovar token
```

### Usuários

```
GET    /api/users/me             Meu perfil
PATCH  /api/users/me             Atualizar perfil
POST   /api/users/me/avatar      Upload avatar
POST   /api/users/me/password    Alterar senha
GET    /api/users/:id/profile    Perfil público
GET    /api/users/:id/badges     Badges do usuário
GET    /api/users/:id/titles     Títulos do usuário
```

### Exercícios

```
GET    /api/exercises                 Listar todos
GET    /api/exercises/mine            Meus exercícios
GET    /api/exercises/community       Exercícios da comunidade
GET    /api/exercises/:id             Buscar por ID
GET    /api/exercises/code/:code      Buscar por código
POST   /api/exercises                 Criar exercício
PATCH  /api/exercises/:id             Atualizar exercício
DELETE /api/exercises/:id             Deletar exercício
POST   /api/exercises/:id/publish     Publicar exercício
```

### Submissões

```
POST   /api/submissions                     Submeter solução
GET    /api/submissions/me                  Minhas submissões
GET    /api/submissions/me/completed        Exercícios concluídos
GET    /api/submissions/exercise/:id        Por exercício
GET    /api/submissions/:id                 Por ID
```

### Ranking

```
GET    /api/ranking/exercise/:id                 Ranking do exercício
GET    /api/ranking/exercise/:id/position/:user  Posição de usuário
GET    /api/ranking/exercise/:id/my-position     Minha posição
```

### Execução de Código

```
POST   /api/execute              Executar código (Judge0)
```

### Rascunhos (Auto-save)

```
GET    /api/attempts/:exerciseId    Obter rascunho
POST   /api/attempts                Salvar rascunho
DELETE /api/attempts/:exerciseId    Deletar rascunho
```

### Grupos

```
GET    /api/groups                   Listar públicos
GET    /api/groups/my                Meus grupos
POST   /api/groups                   Criar grupo
GET    /api/groups/:id               Detalhes do grupo
PATCH  /api/groups/:id               Atualizar grupo
DELETE /api/groups/:id               Deletar grupo
POST   /api/groups/:id/join          Entrar no grupo
POST   /api/groups/:id/leave         Sair do grupo
POST   /api/groups/:id/invite-link   Gerar convite
POST   /api/groups/:id/join-by-token Entrar via token
GET    /api/groups/:id/exercises     Exercícios do grupo
```

### Outros Recursos

```
GET    /api/languages        Linguagens disponíveis
GET    /api/badges           Badges da plataforma
GET    /api/colleges         Faculdades
GET    /api/seasons          Temporadas
GET    /api/stats/public     Estatísticas públicas
```

---

## Autenticação

### Bearer Token

Endpoints protegidos requerem header:

```
Authorization: Bearer {accessToken}
```

### Fluxo

1. `POST /auth/signup` ou `POST /auth/login`
2. Recebe `accessToken` e `refreshToken`
3. Inclui `accessToken` no header de requisições protegidas
4. Quando expirar, use `POST /auth/refresh` com `refreshToken`

---

## Regras de Negócio

### Criação de Exercícios

**Validações obrigatórias:**
- Título: 3-200 caracteres
- Dificuldade: 1-5
- BaseXp: >= 0
- Mínimo 2 testes obrigatórios
- Cada teste deve ter `expectedOutput`

**Permissões:**
- Usuário comum: Cria exercícios básicos (COMMON)
- Admin: Pode configurar badges e raridade (RARE, EPIC, LEGENDARY)

### Submissão de Soluções

**Processo:**

1. Valida exercício (existe, publicado, não concluído anteriormente)
2. Executa código contra todos os testes via Judge0
3. Calcula `testScore` = (testes passados / total) × 100
4. Analisa complexidade do código
5. Aplica sistema híbrido de bônus:
   - testScore 100%: multiplicador 1.0
   - testScore 90-99%: multiplicador 0.5
   - testScore 80-89%: multiplicador 0.25
   - testScore < 80%: multiplicador 0
6. Calcula `finalScore` = testScore + bonusPoints (máx 100)
7. Define status: ACCEPTED se finalScore >= 60
8. Se ACCEPTED:
   - Credita XP (com multiplicador de raridade)
   - Concede badges
   - Atualiza ranking
   - Deleta rascunho

**Restrições:**
- Não pode refazer exercícios concluídos (ACCEPTED)
- Tentativas ilimitadas para exercícios rejeitados

### Sistema de XP e Níveis

**Cálculo de XP:**

```typescript
xpBase = calculateXp(baseXp, difficulty, finalScore, timeSpentMs)

Multiplicadores por raridade:
- COMMON: 1.0x
- RARE: 1.1x
- EPIC: 1.25x
- LEGENDARY: 1.5x

xpFinal = xpBase × multiplicador
```

**Níveis:**
- Baseado em `LevelRule` (tabela de XP mínimo por nível)
- Recalculado automaticamente ao ganhar XP
- Visível no perfil público

### Análise de Complexidade

**Métricas:**

```typescript
penalty = (cyclomaticComplexity × 3) + 
          (linesOfCode / 8) + 
          (maxNestingDepth × 6) + 
          (hasRecursion ? 15 : 0)

complexityScore = max(0, min(100, 100 - penalty))
bonusPoints = (complexityScore / 100) × 20 × multiplicador
```

**Detecção:**
- Estruturas de controle: if, for, while, switch, catch, &&, ||, ?:
- Linhas: exclui comentários e linhas vazias
- Aninhamento: profundidade máxima de blocos
- Recursão: método chama a si mesmo

### Ranking

**Ordenação:**

```sql
ORDER BY 
  finalScore DESC,        -- 1º: Score final (maior)
  complexityScore DESC,   -- 2º: Complexidade (maior = mais limpo)
  timeSpentMs ASC         -- 3º: Tempo (menor = mais rápido)
```

**Badge de Alta Pontuação:**
- Concedido ao 1º colocado do ranking
- Transferido automaticamente quando alguém ultrapassa
- Considera todos os 3 critérios de ordenação

---

## Exemplos de Uso

### 1. Criar Conta e Login

```bash
# Criar conta
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123",
    "handle": "joaosilva"
  }'

# Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### 2. Criar Exercício

```bash
curl -X POST http://localhost:3000/api/exercises \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Soma de Dois Números",
    "description": "Receba dois inteiros e retorne a soma",
    "difficulty": 1,
    "baseXp": 100,
    "status": "PUBLISHED",
    "tests": [
      {
        "input": "5\n3",
        "expectedOutput": "8",
        "description": "Teste básico"
      },
      {
        "input": "-2\n7",
        "expectedOutput": "5",
        "description": "Com negativo"
      }
    ]
  }'
```

### 3. Submeter Solução

```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "{exerciseId}",
    "code": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int a = scanner.nextInt();\n        int b = scanner.nextInt();\n        System.out.println(a + b);\n        scanner.close();\n    }\n}",
    "timeSpentMs": 120000
  }'
```

### 4. Ver Ranking

```bash
curl -X GET "http://localhost:3000/api/ranking/exercise/{exerciseId}?limit=10"
```

---

## Códigos de Status

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | GET, PATCH, DELETE bem-sucedidos |
| 201 | Created | POST bem-sucedido |
| 400 | Bad Request | Validação falhou |
| 401 | Unauthorized | Token ausente/inválido |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não existe |
| 409 | Conflict | Email/handle já existe |
| 500 | Internal Error | Erro no servidor |

---

## Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Com cobertura
npm run test:coverage

# Watch mode
npm test -- --watch
```

### Estrutura de Testes

```
src/tests/
├── unit/              # Testes unitários (23)
│   ├── services/      # Testes de serviços
│   ├── controllers/   # Testes de controllers
│   └── utils/         # Testes de utilitários
├── integration/       # Testes de integração
└── UI/                # Testes de interface
```

---

## Scripts Disponíveis

```bash
npm run dev            # Desenvolvimento (ts-node-dev)
npm run build          # Build para produção
npm start              # Produção (node dist/server.js)
npm test               # Executar testes
npm run test:coverage  # Testes com cobertura
npm run seed           # Popular banco com dados
npm run seed:colleges  # Seed de faculdades
npm run seed:java      # Seed de linguagem Java
npm run seed:titles    # Seed de títulos
```

---

## Migr ações

Gerenciadas com `migrate-mongo`:

```bash
# Executar migrações pendentes
npx migrate-mongo up

# Reverter última migração
npx migrate-mongo down

# Ver status
npx migrate-mongo status
```

**Migrações disponíveis:**
1. `users_setup` - Estrutura de usuários
2. `exercises_setup` - Estrutura de exercícios
3. `UserBadge_setup` - Sistema de badges
4. `UserTitle_setup` - Sistema de títulos
5. `userstats_setup` - Estatísticas
6. `add_tests_and_complexity` - Sistema de testes

---

## Segurança

### Implementado

- Helmet (headers de segurança)
- CORS configurado
- Rate limiting (recomendado adicionar)
- Passwords hasheadas com bcrypt (cost 10)
- JWT com expiração configurável
- Validação de entrada de dados
- Sanitização de outputs
- MongoDB injection protection (Mongoose)

### Recomendações para Produção

1. Adicionar rate limiting (express-rate-limit)
2. Configurar CORS específico (não usar wildcard)
3. Habilitar HTTPS
4. Configurar MongoDB com autenticação
5. Usar variáveis de ambiente seguras
6. Implementar logs estruturados (Winston/Pino)
7. Monitoramento (Sentry, New Relic)

---

## Performance

### Otimizações Implementadas

- Índices no MongoDB (email, handle, publicCode, etc.)
- Lean queries (não instancia documentos desnecessariamente)
- Paginação em listagens
- Connection pooling (maxPoolSize: 10)
- Caching implícito do Mongoose

### Recomendações Adicionais

1. Adicionar Redis para cache
2. Implementar query optimization
3. CDN para assets estáticos
4. Load balancing
5. Database sharding (se necessário)

---

## Troubleshooting

### Erro: "Missing MONGO_URI"

**Causa:** Variável de ambiente não configurada

**Solução:** Crie arquivo `.env` com `MONGO_URI`

### Erro: "listen EADDRINUSE: address already in use"

**Causa:** Porta 3000 já está em uso

**Solução:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro: "Token expired"

**Causa:** Access token expirou

**Solução:** Use `POST /auth/refresh` ou faça login novamente

### Erro: "Exercise not published"

**Causa:** Tentando submeter para exercício não publicado

**Solução:** Publique o exercício com `POST /exercises/:id/publish`

---

## Documentação Adicional

- `REGRAS_NEGOCIO_DESAFIOS.md` - Regras completas dos desafios
- `ANALISE_COMPLEXIDADE.md` - Sistema de análise de código
- `CHANGELOG_RANKING_BONUS.md` - Histórico do sistema de bônus


**Última atualização:** 26 de Novembro de 2025  
**Versão da API:** 2.0  
**Autor:** Equipe Ranking Platform

