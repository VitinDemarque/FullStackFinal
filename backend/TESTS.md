# Estrutura de Testes do Projeto
Este projeto utiliza Jest como framework de testes e Supertest para testes de integração da API.

## Estrutura de diretorios
   src/
    ├── tests/
    │    ├── unit/
    │    │    ├── services/
    |    |    |     ├── xp-rules/
    |    |    |     |      └── calculator.test.ts
    |    |    |     |
    │    │    │     ├── auth.service.test.ts
    |    |    |     ├── badges.service.test.ts
    |    |    |     ├── colleges.service.test.ts
    |    |    |     ├── exercises.service.test.ts
    |    |    |     ├── forum.service.test.ts
    |    |    |     ├── groups.service.test.ts
    |    |    |     ├── languages.service.test.ts
    |    |    |     ├── leaderboards.service.test.ts
    |    |    |     ├── levels.service.test.ts
    |    |    |     ├── seasons.service.test.ts
    |    |    |     ├── stats.service.test.ts
    |    |    |     ├── submissions.service.test.ts
    |    |    |     ├── titles.service.test.ts
    │    │    │     └── userService.test.ts
    │    │    │
    │    │    └── utils/
    │    │          ├── bcrypt.test.ts
    │    │          ├── formatDate.test.ts
    │    │          ├── httpErrors.test.ts
    │    │          ├── jwt.test.ts
    │    │          ├── pagination.test.ts
    │    │          └── sanitizeUser.test.ts
    │    │
    │    └── integration/
    │         └── routes/
    │               └── userRoutes.test.ts

## Configuração
Os testes estão configurados usando Jest + ts-jest para suporte ao TypeScript.

#### Arquivo: jest.config.js
Arquivo responsavel por toda a parte de configuração do jest

## Tipos de testes
1. Testes unitarios:
  - Testam funções isoladas, sem depender de funçoes externas, como por exemplo o banco de dados.
  - Estão localizados em `src/tests/unit/`
  - Exemplo: auth.service.test.ts e userService.test.ts

2. Testes de integração
  - Testam fluxos completos da aplicação, como por exemplo as requisioçoes HTTP
  - Estao localizados em `src/tests/integration/`
  - 

## Executando os testes

Para rodar todos os testes usamos o comando:
`npm test`

Para rodar os testes com o relatorio de cobertura:
`npm run test:coverage`

### Cobertura de Código
Os relatórios de cobertura são gerados na pasta `coverage/`.
Abra o arquivo `coverage/lcov-report/index.html` no navegador para visualizar o relatório completo.

## Boas praticas
  - Nomeie os arquivos de teste com o mesmo nome do modulo sendo testado + `.test.ts`
  - Sempre usar o `describe()` para agrupar testes por função ou comportamento
  - Use mocks para dependencias externas (DB, API, etc.)
  - Mantenha os testes curtos, legiveis e com nomes descritivos

## Referencias
  - [Jest Documentation](https://jestjs.io/docs/getting-started)
  - [Supertest](https://github.com/forwardemail/supertest)
  - [Testing TypeScript with ts-jest](https://github.com/kulshekhar/ts-jest)
