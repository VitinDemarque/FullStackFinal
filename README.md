# FullStackFinal — Plataforma de Ranking e Desafios de Código

Plataforma full‑stack para criação de exercícios de programação, submissão com execução automática de testes, ranking com critérios múltiplos, gamificação (badges e títulos), grupos, fóruns e estatísticas.

## Visão Geral
- Backend em `Node.js + Express` com `TypeScript` e `MongoDB`
- Frontend em `React + Vite` com `styled-components`
- Execução/validação de código via Judge0
- Autenticação com `JWT` e suporte a login com Google
- Ranking inteligente considerando score de testes, complexidade e tempo

## Arquitetura
```
FullStackFinal/
├── backend/              # API REST (Express, TypeScript, MongoDB)
│   ├── src/
│   │   ├── controllers/  # Controladores HTTP
│   │   ├── services/     # Regras de negócio
│   │   ├── models/       # Modelos Mongoose
│   │   ├── routes/       # Rotas montadas em /api
│   │   ├── middlewares/  # Autenticação e erros
│   │   ├── utils/        # Utilitários
│   │   ├── app.ts        # Configuração do Express
│   │   └── server.ts     # Bootstrap do servidor
│   ├── migrations/       # Migrações (migrate-mongo)
│   ├── tests/            # Testes unitários e integração (Jest)
│   ├── .env.example      # Variáveis de ambiente de exemplo
│   └── README_API.md     # Documentação detalhada da API
└── frontend/             # Aplicação web (React + Vite)
    ├── src/
    │   ├── components/   # Componentes UI
    │   ├── pages/        # Páginas e fluxos
    │   ├── contexts/     # Contextos (Auth, Theme)
    │   ├── services/     # Cliente HTTP e serviços
    │   └── main.tsx      # Bootstrap do app
    ├── .env.example      # Variáveis de ambiente de exemplo
    └── index.html
```

## Requisitos
- Node.js 18+
- MongoDB 6+ (local ou Atlas)
- Judge0 API (opcional, para execução real de código)

## Configuração
### 1) Backend
1. Instale dependências:
   ```bash
   cd backend
   npm install
   ```
2. Crie `.env` com base em `.env.example` e ajuste valores (NUNCA use segredos do exemplo):
   ```env
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB_NAME=projeto_final_db
   JWT_SECRET=troque_este_valor
   JWT_REFRESH_SECRET=troque_este_valor
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   JUDGE0_API_KEY=opcional
   ```
3. (Opcional) Rode migrações do MongoDB:
   ```bash
   npx migrate-mongo up
   ```
4. (Opcional) Popule dados iniciais:
   ```bash
   npm run seed
   npm run seed:colleges
   npm run seed:java
   npm run seed:titles
   ```

### 2) Frontend
1. Instale dependências:
   ```bash
   cd frontend
   npm install
   ```
2. Crie `.env` com base em `.env.example`. IMPORTANTE: a URL deve incluir o prefixo `/api`.
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_GOOGLE_CLIENT_ID=opcional
   ```
   Dica: o cliente HTTP usa `baseURL` a partir de `VITE_API_URL` (ver `frontend/src/services/api.ts:4`). A API monta rotas em `/api` (ver `backend/src/app.ts:43`).

## Execução em Desenvolvimento
- Terminal A (API):
  ```bash
  cd backend
  npm run dev
  ```
- Terminal B (Web):
  ```bash
  cd frontend
  npm run dev
  ```
- Acesse o frontend em `http://localhost:5173`. A API roda em `http://localhost:3000` com rotas sob `/api`.

## Scripts Úteis
### Backend (`backend/package.json`)
- `npm run dev` — desenvolvimento com `ts-node-dev`
- `npm run build` — compila TypeScript
- `npm start` — inicia `dist/server.js`
- `npm test` / `npm run test:coverage` — executa testes (Jest)
- `npm run seed` / `seed:colleges` / `seed:java` / `seed:titles` — popula dados

### Frontend (`frontend/package.json`)
- `npm run dev` — servidor Vite
- `npm run build` — build de produção
- `npm run preview` — preview do build
- `npm run lint` — ESLint

## Testes
- Backend: testes unitários e de integração com Jest.
  ```bash
  cd backend
  npm test
  npm run test:coverage
  ```
- Frontend: lint disponível via ESLint.
  ```bash
  cd frontend
  npm run lint
  ```

## Deploy
### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
# ou sirva o conteúdo de dist/ em um host estático
```

## Documentação de API
- Guia completo disponível em `backend/README_API.md`.
- Rotas principais montadas sob `/api` (ver `backend/src/app.ts:43`).

## Dicas e Troubleshooting
- `VITE_API_URL` deve incluir `/api` para que as chamadas (ex.: `/auth/login`) atinjam os endpoints corretos. Base no código do cliente HTTP em `frontend/src/services/api.ts:4`.
- Se o MongoDB não conectar, verifique `MONGO_URI` e `MONGO_DB_NAME`.
- Conflito de porta: ajuste `PORT` no backend (`backend/src/server.ts:6`) ou mude a porta do Vite.

## Segurança
- Não comite segredos. Use `.env` localmente e variáveis seguras em produção.
- Senhas são armazenadas com `bcrypt` no backend.
- Helmet e CORS configurados no servidor.

## Licença
Este projeto não define uma licença explícita.

## 👨🏽‍💻 Colaboradores

<div align="center">
  <table>
    <tr>
    <td align="center">
        <a href="https://github.com/VitinDemarque" style="text-decoration: none;">
          <img src="https://avatars.githubusercontent.com/u/126296402?v=4" width="100" height="100" style="border-radius: 50%;">
          <br>
          Victor Demarque
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Samuel-SouzaZz" style="text-decoration: none;">
          <img src="https://avatars.githubusercontent.com/u/129301287?v=4" width="100" height="100" style="border-radius: 50%;">
          <br>
          Samuel Souza
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/JoaoASouzaN" style="text-decoration: none;">
          <img src="https://avatars.githubusercontent.com/u/127859422?v=4" width="100" height="100" style="border-radius: 50%;">
          <br>
          João Antônio Souza
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/ArthurSilva902" style="text-decoration: none;">
          <img src="https://avatars.githubusercontent.com/u/180798363?v=4" width="100" height="100" style="border-radius: 50%;">
          <br>
          Arthur Silva
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/mts3324" style="text-decoration: none;">
          <img src="https://avatars.githubusercontent.com/u/133476027?v=4" width="100" height="100" style="border-radius: 50%;">
          <br>
          Mateus Silva
        </a>
      </td>
    </tr>
  </table>
</div>
