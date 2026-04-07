# Altum Sistemas Reboque

MVP full-stack para marketplace de socorro veicular e busca de reboque próximo, com áreas separadas para cliente, prestador e administrador.

## Stack

- Frontend: React 19, Vite, TypeScript, Tailwind CSS 4, Leaflet
- Backend: Node.js, Express 5, TypeScript, Prisma
- Banco: PostgreSQL
- Autenticação: JWT com diferenciação por perfil

## Estrutura

```text
.
├── apps
│   ├── api
│   │   ├── prisma
│   │   └── src
│   └── web
│       └── src
├── packages
│   └── shared
├── docker-compose.yml
└── README.md
```

## Funcionalidades do MVP

- Home pública com visual premium e CTAs claros
- Cadastro e login por e-mail e senha
- Perfis: `customer`, `provider`, `admin`
- Solicitação de atendimento com geolocalização
- Busca de prestadores próximos por raio e distância
- Aceite do chamado pelo primeiro prestador disponível
- Atualização de status do atendimento
- Dashboards separados por perfil
- Painel admin com métricas, usuários, prestadores, chamados e categorias
- Seed inicial com apenas o administrador master

## Execução local

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir PostgreSQL

```bash
docker compose up -d
```

### 3. Configurar ambiente da API

```bash
cp apps/api/.env.example apps/api/.env
```

Configuracao padrao do projeto:

```env
HOST=127.0.0.1
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/altum_reboque
JWT_SECRET=troque-esta-chave-em-producao
FRONTEND_URL=http://localhost:5173
```

### 4. Gerar client Prisma

```bash
npm run db:generate
```

### 5. Criar schema no banco

Use o script já configurado:

```bash
npm run db:push
```

### 6. Popular dados iniciais

```bash
npm run db:seed
```

### 7. Rodar backend e frontend

Em terminais separados:

```bash
npm run dev:api
npm run dev:web
```

Frontend: `http://localhost:5173`

API: `http://localhost:3333/api`

## Deploy no Railway

Estrutura recomendada no Railway:

- 1 servico `PostgreSQL`
- 1 servico `API` usando [apps/api/Dockerfile](/home/albiere/code/reboque/apps/api/Dockerfile)
- 1 servico `Web` usando [apps/web/Dockerfile](/home/albiere/code/reboque/apps/web/Dockerfile)

### 1. Banco de dados

Crie um banco PostgreSQL no Railway e copie a `DATABASE_URL` gerada pelo servico.

### 2. Servico da API

Crie um novo servico a partir deste repositorio e configure:

- Root Directory: `apps/api`
- Builder: `Dockerfile`
- Dockerfile Path: `Dockerfile`

Variaveis recomendadas:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3333
DATABASE_URL=<cole-a-url-do-postgres-do-railway>
JWT_SECRET=<gere-um-segredo-forte>
FRONTEND_URL=https://<url-do-web>.up.railway.app
```

Observacao:

- `FRONTEND_URL` tambem aceita multiplas origens separadas por virgula, por exemplo:
  `https://app.exemplo.com,https://web-projeto.up.railway.app`

### 3. Servico do Web

Crie outro servico a partir do mesmo repositorio e configure:

- Root Directory: `apps/web`
- Builder: `Dockerfile`
- Dockerfile Path: `Dockerfile`

Variavel necessaria:

- `VITE_API_URL=https://<url-da-api>.up.railway.app/api`

O container do frontend injeta essa URL em runtime, entao voce pode atualizar a API sem precisar rebuildar o site.

### 4. Prisma em producao

Depois que a API estiver com acesso ao banco, execute no servico da API:

```bash
npm run db:push
npm run db:seed
```

Se quiser, voce tambem pode rodar apenas `npm run db:push` primeiro e depois aplicar a seed.

### 5. Ordem sugerida

1. Criar o Postgres
2. Publicar a API
3. Rodar `db:push`
4. Rodar `db:seed`
5. Publicar o Web com `VITE_API_URL` apontando para a API

## Usuario inicial

- Admin master: `contatoaltumsistemas@gmail.com` / `123456`

## Rotas principais do frontend

- `/`
- `/como-funciona`
- `/solicitar`
- `/prestadores`
- `/login`
- `/cadastro`
- `/app/cliente`
- `/app/prestador`
- `/app/admin`

## Rotas principais da API

### Autenticação

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Cliente

- `GET /api/service-requests/categories`
- `POST /api/service-requests`
- `GET /api/service-requests/mine`
- `GET /api/service-requests/:id`
- `PATCH /api/service-requests/:id/cancel`
- `POST /api/service-requests/:id/rate`

### Prestador

- `GET /api/provider/dashboard`
- `GET /api/provider/service-requests/available`
- `POST /api/provider/service-requests/:id/accept`
- `PATCH /api/provider/service-requests/:id/status`
- `GET /api/provider/history`
- `PATCH /api/provider/profile`
- `PATCH /api/provider/availability`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `GET /api/admin/providers`
- `PATCH /api/admin/providers/:userId/approval`
- `GET /api/admin/service-requests`
- `GET /api/admin/regions`
- `GET /api/admin/service-categories`
- `POST /api/admin/service-categories`
- `PATCH /api/admin/service-categories/:id`

## Modelagem inicial

Entidades principais:

- `users`
- `provider_profiles`
- `service_requests`
- `ratings`
- `notifications`
- `service_categories`

O schema Prisma está em [apps/api/prisma/schema.prisma](/home/albiere/code/reboque/apps/api/prisma/schema.prisma).

## Build validado

```bash
npm run build --workspace api
npm run build --workspace web
```
