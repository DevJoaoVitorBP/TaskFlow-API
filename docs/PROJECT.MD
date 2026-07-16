# TaskFlow API — Project Documentation


---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Escopo](#2-escopo)
3. [Stack Técnica](#3-stack-técnica)
4. [Arquitetura](#4-arquitetura)
5. [Funcionalidades](#5-funcionalidades)
6. [Modelo de Dados](#6-modelo-de-dados)
7. [Requisitos Não-Funcionais](#7-requisitos-não-funcionais)
8. [Cronograma / Roadmap](#8-cronograma--roadmap)
9. [Convenções](#9-convenções)
10. [Como Rodar o Projeto](#10-como-rodar-o-projeto)
11. [Testes](#11-testes)
12. [Riscos e Dependências](#12-riscos-e-dependências)
13. [Glossário](#13-glossário)

---

## 1. Visão Geral

### Nome
**TaskFlow API**

### Descrição
API REST para gerenciamento de tarefas com autenticação JWT, construída para simular um fluxo real de backend — desde o cadastro de usuários até consulta de estatísticas via dashboard.

### Objetivo Principal
Demonstrar a construção de uma API REST de produção com arquitetura em camadas (Controller → Service → Repository), validação robusta de dados, isolamento multi-usuário e cobertura de testes de 100%.

### Problema Resolvido
Desenvolvedores e estudantes de backend carecem de um projeto de referência que una boas práticas arquiteturais, segurança (JWT, hash de senha, isolamento de dados, queries parametrizadas), testes unitários com mocks e infraestrutura containerizada — tudo em um único codebase coerente.

### Proposta de Valor

| Para quem | Entrega |
|-----------|---------|
| Desenvolvedor aprendendo backend | Projeto-modelo com arquitetura real, não didática simplificada |
| Equipe avaliando stack Fastify/Prisma | Referência funcional e testável com boas práticas aplicadas |
| Profissional montando portfólio | API completa com CI/CD, Docker, Swagger e cobertura 100% |

---

## 2. Escopo

### ✅ Incluso (MVP Atual)

- Cadastro e autenticação de usuários (JWT)
- CRUD completo de tarefas com isolamento por usuário
- Marcação de tarefa como concluída
- Filtros avançados na listagem (status, prioridade, título, datas, paginação)
- Endpoint de dashboard com estatísticas agregadas
- Documentação interativa via Swagger UI
- Containerização com Docker e Docker Compose
- Pipeline CI/CD com GitHub Actions (lint, testes, cobertura, build, deploy)
- Testes unitários com 100% de cobertura (services + utils)

### ❌ Fora de Escopo (v1)

- Interface frontend (web ou mobile)
- Sistema de notificações (e-mail, push)
- Compartilhamento de tarefas entre usuários
- Gestão de times / workspaces
- Webhooks ou eventos em tempo real (WebSocket)
- Billing / planos pagos
- Internacionalização (i18n)

### Versionamento

| Versão | Conteúdo |
|--------|----------|
| **v1.0 (atual)** | Auth + CRUD Tarefas + Filtros + Dashboard + Docker + CI/CD |
| v1.1 (planejado) | Refresh token, soft delete, ordenação configurável |
| v2.0 (futuro) | Testes E2E, rate limiting, atualização de perfil |

---

## 3. Stack Técnica

### Linguagem e Runtime

| Tecnologia | Versão | Papel |
|------------|--------|-------|
| TypeScript | ^5.x | Linguagem principal |
| Node.js | 20+ LTS | Runtime |

### Framework e Bibliotecas

| Pacote | Versão | Papel |
|--------|--------|-------|
| `fastify` | ^5.10.0 | Framework HTTP |
| `@fastify/cors` | ^11.3.0 | Controle de CORS |
| `@fastify/swagger` | ^9.8.1 | Geração do spec OpenAPI |
| `@fastify/swagger-ui` | ^6.1.0 | Documentação interativa |
| `@fastify/env` | ^7.0.0 | Carregamento de env |
| `zod` | ^4.4.3 | Validação de schemas |
| `jsonwebtoken` | ^9.0.3 | Geração e verificação de JWT |
| `bcryptjs` | ^3.0.3 | Hash de senhas |
| `dotenv` | ^17.4.2 | Variáveis de ambiente locais |
| `pino-pretty` | ^13.1.3 | Formatação de logs em dev |

### ORM e Banco de Dados

| Tecnologia | Versão | Papel |
|------------|--------|-------|
| `@prisma/client` | ^7.8.0 | ORM (client gerado em `generated/prisma`) |
| `@prisma/adapter-pg` | ^7.8.0 | Adapter PostgreSQL |
| PostgreSQL | 16-alpine | Banco de dados relacional |

### Testes

| Pacote | Versão | Papel |
|--------|--------|-------|
| `vitest` | ^4.1.10 | Test runner |
| `@vitest/coverage-v8` | — | Relatório de cobertura |

### Ferramentas de Build / Dev

| Ferramenta | Papel |
|------------|-------|
| `tsup` | Bundle/build para produção (ESM) |
| `tsx` | Execução TS em desenvolvimento com watch |
| `eslint` | Linting de código |
| `prettier` | Formatação de código |

### Infraestrutura / DevOps

| Tecnologia | Papel |
|------------|-------|
| Docker (multi-stage) | Containerização da aplicação |
| Docker Compose | Orquestração local (PostgreSQL + API) |
| `dumb-init` | Tratamento de sinais Unix no container |
| GitHub Actions | CI/CD (4 workflows) |

---

## 4. Arquitetura

### Padrão Arquitetural
**Arquitetura em Camadas** (Layered Architecture) com separação estrita de responsabilidades:

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

Cada camada conhece apenas a imediatamente abaixo. Erros são propagados via `AppError` e capturados pelo `setErrorHandler` global no `app.ts`.

### Estrutura de Pastas

```
src/
├── config/
│   └── env.ts                  # Variáveis de ambiente validadas com Zod
├── lib/
│   ├── prisma.ts               # Singleton do Prisma Client
│   └── swagger.ts              # Configuração OpenAPI / Swagger
├── utils/
│   └── errors.ts               # Classe AppError(message, statusCode)
├── types/
│   └── fastify.d.ts            # Extensão de FastifyRequest com userId: string
├── repositories/               # Acesso ao banco (apenas queries Prisma)
│   ├── task.repository.ts
│   └── dashboard.repository.ts
├── services/                   # Regras de negócio (lança AppError)
│   ├── auth.service.ts
│   ├── task.service.ts
│   └── dashboard.service.ts
└── http/
    ├── controllers/            # Handlers HTTP por domínio
    │   ├── auth/               # register.controller.ts, login.controller.ts
    │   ├── task/               # create, list, getById, update, delete, complete
    │   └── dashboard/          # stats.controller.ts
    ├── middlewares/
    │   ├── authenticate.ts     # Valida JWT → extrai userId para request
    │   └── index.ts            # Re-exporta middlewares
    └── routes/
        ├── index.ts            # Registra todos os grupos de rotas
        ├── auth.routes.ts
        ├── task.routes.ts
        └── dashboard.routes.ts
```

### Tratamento de Erros

```
AppError       → status configurado + { error: message }
ZodError       → 422 Unprocessable Entity + detalhes dos campos
Erro desconhecido → 500 Internal Server Error
```

### Fluxo de Dados — Exemplo: Criar Tarefa

```
POST /tasks
  └─ authenticate (middleware) → valida JWT, seta req.userId
  └─ createTask.controller.ts  → valida body com Zod
  └─ task.service.ts           → verifica regras de negócio
  └─ task.repository.ts        → INSERT com Prisma (inclui userId)
  └─ 201 { task }
```

### Integrações Externas

| Serviço | Finalidade | Obrigatório |
|---------|------------|-------------|
| PostgreSQL | Armazenamento de dados | Sim |
| GitHub Actions | CI/CD automatizado | Sim (prod) |
| CodeCov | Relatório de cobertura na nuvem | Não (opcional) |
| Docker Hub / GHCR | Registro de imagens | [A DEFINIR] |

---

## 5. Funcionalidades

### Endpoints

#### Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/register` | Cria novo usuário | Não |
| `POST` | `/auth/login` | Autentica e retorna JWT | Não |

#### Tarefas

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/tasks` | Cria nova tarefa | Sim |
| `GET` | `/tasks` | Lista tarefas com filtros e paginação | Sim |
| `GET` | `/tasks/:id` | Busca tarefa por ID | Sim |
| `PUT` | `/tasks/:id` | Atualiza tarefa (campos opcionais) | Sim |
| `DELETE` | `/tasks/:id` | Remove tarefa permanentemente | Sim |
| `PATCH` | `/tasks/:id/complete` | Marca tarefa como `DONE` | Sim |

#### Dashboard

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `GET` | `/dashboard` | Estatísticas do usuário autenticado | Sim |

### Parâmetros de Filtro — `GET /tasks`

| Parâmetro | Tipo | Exemplo | Descrição |
|-----------|------|---------|-----------|
| `status` | string (CSV) | `TODO,IN_PROGRESS` | Filtra por status (OR interno) |
| `priority` | string (CSV) | `HIGH,MEDIUM` | Filtra por prioridade (OR interno) |
| `title` | string | `reunião` | Busca parcial case-insensitive |
| `createdAfter` | ISO 8601 | `2025-01-01T00:00:00Z` | Data de criação ≥ |
| `createdBefore` | ISO 8601 | `2025-12-31T23:59:59Z` | Data de criação ≤ |
| `page` | number | `2` | Página (default: 1) |
| `limit` | number | `20` | Itens por página (max: 100, default: 10) |

Todos os filtros ativos são combinados com `AND`.

### Priorização de Features

| Feature | Prioridade | Status |
|---------|------------|--------|
| Cadastro e autenticação JWT | Must-have | ✅ Implementado |
| CRUD de tarefas | Must-have | ✅ Implementado |
| Isolamento de dados por usuário | Must-have | ✅ Implementado |
| Filtros e paginação | Must-have | ✅ Implementado |
| Dashboard de estatísticas | Must-have | ✅ Implementado |
| Documentação Swagger | Must-have | ✅ Implementado |
| Docker + Docker Compose | Must-have | ✅ Implementado |
| CI/CD com GitHub Actions | Must-have | ✅ Implementado |
| Refresh token | Nice-to-have | ⏳ Planejado |
| Soft delete | Nice-to-have | ⏳ Planejado |
| Ordenação configurável (`sortBy`) | Nice-to-have | ⏳ Planejado |
| Rate limiting nos endpoints de auth | Nice-to-have | ⏳ Planejado |
| Testes E2E (integração com DB) | Nice-to-have | ⏳ Planejado |
| Atualização de perfil do usuário | Nice-to-have | ⏳ Planejado |

---

## 6. Modelo de Dados

### Entidades Principais

#### `User`

| Campo | Tipo | Restrição |
|-------|------|-----------|
| `id` | `String` (CUID) | PK, auto-gerado |
| `name` | `String` | Obrigatório |
| `email` | `String` | Único, obrigatório |
| `password` | `String` | Hash bcrypt, obrigatório |
| `createdAt` | `DateTime` | Auto (`now()`) |

#### `Task`

| Campo | Tipo | Restrição |
|-------|------|-----------|
| `id` | `String` (CUID) | PK, auto-gerado |
| `title` | `String` | 1–255 caracteres, obrigatório |
| `description` | `String?` | Máx. 1000 caracteres, opcional |
| `status` | `TaskStatus` | Enum: `TODO`, `IN_PROGRESS`, `DONE`; default `TODO` |
| `priority` | `TaskPriority` | Enum: `LOW`, `MEDIUM`, `HIGH`; default `MEDIUM` |
| `createdAt` | `DateTime` | Auto (`now()`) |
| `updatedAt` | `DateTime` | Auto (`@updatedAt`) |
| `userId` | `String` | FK → `User.id` (Cascade Delete) |

### Relacionamentos

```
User ──< Task   (1 para N)
         └─ onDelete: Cascade (deletar usuário remove suas tarefas)
```

### Schema Resumido (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  tasks     Task[]
  @@map("users")
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  status      TaskStatus   @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
  @@map("tasks")
}
```

### Índices

| Índice | Campo | Objetivo |
|--------|-------|----------|
| `@@index([userId])` | `tasks.userId` | Performance em filtros por usuário |
| `@@unique` | `users.email` | Integridade de e-mail único |

---

## 7. Requisitos Não-Funcionais

### Segurança

- **Autenticação**: Bearer JWT com expiração de 7 dias; segredo via variável de ambiente
- **Hash de senhas**: bcrypt com salt (nunca armazenada em texto plano)
- **Isolamento de dados**: toda query de tarefa inclui cláusula `WHERE userId = ?`; retorna 404 para recursos de outros usuários (sem vazamento de existência)
- **Queries parametrizadas**: uso exclusivo do Prisma ORM — sem SQL concatenado, imune a SQL injection
- **Validação de entrada**: Zod valida body, path params e query strings antes de atingir a camada de serviço
- **Container não-root**: imagem de produção roda com usuário `nodejs` (UID 1001)
- **CORS configurável**: via `@fastify/cors`
- **Secrets**: nunca commitados; gerenciados por `.env` (excluído do `.gitignore`) e variáveis do GitHub Actions

### Performance

- Queries paralelas com `Promise.all()` no dashboard (3 `COUNT` simultâneos)
- Índice `@@index([userId])` na tabela `tasks`
- Paginação com `skip`/`take` no nível do banco, não em memória
- Multi-stage build Docker reduz imagem final a apenas artefatos necessários
- Cache de dependências npm no CI/CD (~30–60s economizados por execução)

### Escalabilidade

- Stateless por design (JWT); escalável horizontalmente sem sessões compartilhadas
- Separação entre container da API e do banco — escalamento independente
- [A DEFINIR] Estratégia de connection pooling para alta concorrência (PgBouncer ou `@prisma/adapter-pg`)

### Confiabilidade

- CI bloqueia merge se testes, lint ou build falharem
- Healthcheck no container PostgreSQL (`pg_isready`) antes de subir a API
- `dumb-init` garante encerramento gracioso dos processos no container

### Acessibilidade

- API: não se aplica diretamente (sem UI)
- Documentação Swagger acessível em `/docs`

---

## 8. Cronograma / Roadmap

### Fases Concluídas

| Fase | Conteúdo | Status |
|------|----------|--------|
| 1 — Setup | Estrutura base, Fastify, TypeScript, Prisma, variáveis de ambiente | ✅ |
| 2 — Auth | Registro, login, JWT, middleware de autenticação | ✅ |
| 3 — Tasks | CRUD completo, isolamento por userId, validações Zod | ✅ |
| 4 — Filtros | Filtros avançados, paginação, queries dinâmicas | ✅ |
| 5 — Dashboard | Endpoint de estatísticas, queries paralelas | ✅ |
| 6 — Testes | 20 testes unitários, 100% de cobertura (services + utils) | ✅ |
| 7 — Docker | Multi-stage build, Docker Compose, script de gerenciamento | ✅ |
| 8 — CI/CD | 4 workflows GitHub Actions, scripts locais, documentação | ✅ |

### Roadmap Futuro

| Versão | Feature | Prioridade |
|--------|---------|------------|
| v1.1 | Refresh token + revogação de sessão | Alta |
| v1.1 | Soft delete de tarefas (`deletedAt`) | Média |
| v1.1 | Ordenação configurável (`sortBy`, `order`) | Média |
| v1.2 | Rate limiting nos endpoints de auth | Alta |
| v1.2 | Atualização de perfil (`PUT /users/me`) | Baixa |
| v2.0 | Testes de integração E2E com DB isolado | Alta |
| v2.0 | Métricas de observabilidade (Prometheus/OpenTelemetry) | [A DEFINIR] |
| v2.0 | Deploy automatizado em cloud | [A DEFINIR] |

---

## 9. Convenções

### Padrão de Código

- **Linguagem**: TypeScript strict mode
- **Linter**: ESLint (`eslint.config.mjs`)
- **Formatter**: Prettier (integrado ao ESLint)
- **Módulos**: ESM (`"type": "module"` no `package.json`)
- **Importações**: caminhos relativos explícitos com extensão `.js` no output compilado

### Convenção de Commits (Conventional Commits)

```
<tipo>(escopo opcional): descrição curta

[corpo opcional]
[rodapé opcional — ex: BREAKING CHANGE]
```

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `test` | Adição/modificação de testes |
| `refactor` | Refatoração sem mudança de comportamento |
| `chore` | Tarefas de manutenção (deps, config, CI) |
| `docs` | Apenas documentação |
| `perf` | Melhoria de performance |
| `ci` | Mudanças em workflows/scripts de CI |

### Nomenclatura

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivos | `kebab-case` | `task.service.ts` |
| Classes | `PascalCase` | `AppError` |
| Funções e variáveis | `camelCase` | `getTasksByUserId` |
| Constantes globais | `UPPER_SNAKE_CASE` | `JWT_SECRET` |
| Tabelas no banco | `snake_case` (via `@@map`) | `users`, `tasks` |
| Colunas no banco | `camelCase` (Prisma) → `snake_case` (gerado) | — |
| Rotas HTTP | `kebab-case` plural | `/tasks`, `/auth/register` |
| Branches | `feat/`, `fix/`, `chore/` + slug | `feat/refresh-token` |

---

## 10. Como Rodar o Projeto

### Pré-requisitos

- Node.js **20+** LTS
- npm **10+**
- PostgreSQL **16+** (local ou Docker)
- Docker e Docker Compose (para execução containerizada)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz com:

```env
# Banco de dados (string de conexão Prisma)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/taskflow?schema=public"

# JWT
JWT_SECRET="seu-segredo-aqui-use-256-bits-ou-mais"

# Servidor
PORT=3333
```

> ⚠️ Nunca commite o arquivo `.env`. Ele está no `.gitignore`.

### Execução Local

```bash
# 1. Clone o repositório
git clone https://github.com/<usuario>/taskflow-api.git
cd taskflow-api

# 2. Instale as dependências
npm install

# 3. Configure o .env (veja acima)

# 4. Execute as migrations e gere o Prisma Client
npx prisma migrate dev
npx prisma generate

# 5. (Opcional) Popule o banco com dados de exemplo
npx prisma db seed

# 6. Inicie em modo desenvolvimento (com hot reload)
npm run dev
```

API disponível em: `http://localhost:3333`  
Swagger UI: `http://localhost:3333/docs`

### Execução com Docker

```bash
# Pré-requisito: .env com POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, JWT_SECRET

# Produção
docker compose up -d

# Desenvolvimento (com live reload na porta 3334)
docker compose --profile dev up -d

# Via script auxiliar (Windows)
.\docker-manage.ps1 up        # sobe em produção
.\docker-manage.ps1 dev       # sobe em modo dev
.\docker-manage.ps1 logs      # exibe logs em tempo real
.\docker-manage.ps1 shell     # abre terminal no container
.\docker-manage.ps1 migrate   # executa migrations manualmente
.\docker-manage.ps1 clean     # remove containers e volumes
.\docker-manage.ps1 rebuild   # rebuild completo da imagem
```

### Comandos de Desenvolvimento

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia com hot reload (tsx watch) |
| `npm run build` | Compila para `dist/` via tsup |
| `npm run start` | Executa o build compilado |
| `npm run lint` | Verifica erros de lint |
| `npm run lint:fix` | Corrige erros de lint automaticamente |
| `npm run format` | Formata código com Prettier |
| `npm run test` | Executa todos os testes |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Testes + relatório de cobertura |
| `npx prisma studio` | Interface visual do banco de dados |
| `npx prisma migrate dev` | Cria e aplica nova migration |
| `npx prisma db seed` | Popula o banco com seed data |

---

## 11. Testes

### Estratégia

| Tipo | Ferramenta | Escopo | Status |
|------|------------|--------|--------|
| Unitários | Vitest | Services + Utils | ✅ 100% cobertura |
| Integração (E2E) | [A DEFINIR] | Endpoints + DB | ⏳ Planejado v2.0 |

### Cobertura Atual

```
Statements : 100%
Branches   : 100%
Functions  : 100%
Lines      : 100%
```

**20 testes passando:**

| Suite | Testes | Casos cobertos |
|-------|--------|----------------|
| `AuthService` | 5 | register, login, e-mail duplicado, senha incorreta, usuário não encontrado |
| `TaskService` | 10 | create, list, getById, update, delete, complete + casos de erro (404, 403) |
| `DashboardService` | 5 | com tarefas, sem tarefas |

### Padrões de Teste

- **Mocks**: Prisma completamente mockado (sem I/O de banco)
- **Dependências mockadas**: `bcryptjs`, `jsonwebtoken`
- **Padrão**: AAA (Arrange → Act → Assert)
- **Isolamento**: `vi.clearAllMocks()` antes de cada teste
- **Factory**: `createMockTask()` para dados consistentes entre suítes

### Arquivos sem Testes Unitários (por design)

| Camada | Razão |
|--------|-------|
| Repositórios | Requerem banco real; testados em E2E |
| Controllers | Apenas orquestração HTTP; sem lógica de negócio |
| Rotas / Middlewares | Testados em E2E |
| `config/env.ts`, `lib/prisma.ts`, `lib/swagger.ts` | Sem lógica de domínio |

### Cobertura Mínima no CI

O workflow `coverage.yml` falha o pipeline se a cobertura cair abaixo de **80%** em qualquer métrica.

### Executando os Testes

```bash
npm run test              # execução única
npm run test:watch        # modo interativo
npm run test:coverage     # + relatório HTML em coverage/
npm run test:ui           # interface visual Vitest UI
```

---

## 12. Riscos e Dependências

### Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| JWT_SECRET fraco ou exposto | Baixa | Crítico | Gerar 256+ bits aleatórios; nunca commitar |
| Migração Prisma em produção com dados | Média | Alto | Testar migrations em staging antes; backup prévio |
| Expiração de token sem refresh | Alta | Médio | Implementar refresh token (roadmap v1.1) |
| Breaking changes em Fastify v5 | Baixa | Médio | Pins de versão no package.json |
| Cobertura de testes cair abaixo de 80% | Baixa | Médio | Gate no CI bloqueia merge |
| Imagem Docker desatualizada com vulnerabilidades | Média | Alto | `npm audit` periódico; atualizar Node alpine |

### Dependências Externas Críticas

| Dependência | Tipo | Criticidade | Fallback |
|-------------|------|-------------|---------|
| PostgreSQL | Banco de dados | Crítico | Sem fallback; alta disponibilidade necessária em prod |
| GitHub Actions | CI/CD | Alto | Scripts locais disponíveis (`.github/scripts/`) |
| Docker Hub / GHCR | Registro de imagens | Médio | Build local sempre disponível |
| `jsonwebtoken` | Auth | Crítico | Biblioteca madura, RFC 7519 |
| `bcryptjs` | Segurança | Crítico | Implementação JS pura, sem dependências nativas |

---

## 13. Glossário

| Termo | Definição |
|-------|-----------|
| **JWT** | JSON Web Token — padrão RFC 7519 para transmissão segura de claims entre partes |
| **Bearer Token** | Esquema de autenticação HTTP onde o token é enviado no header `Authorization: Bearer <token>` |
| **CUID** | Collision-resistant Unique Identifier — identificador único gerado pelo Prisma, seguro para URLs |
| **ORM** | Object-Relational Mapper — abstração que mapeia objetos TypeScript para tabelas relacionais |
| **AppError** | Classe de erro customizada do projeto que carrega `message` e `statusCode` HTTP |
| **Repository** | Camada responsável exclusivamente por queries ao banco de dados via Prisma |
| **Service** | Camada de regras de negócio; lança `AppError` para condições inválidas |
| **Controller** | Handler HTTP; valida entrada com Zod, chama o service, retorna resposta |
| **Middleware** | Função executada antes do controller; ex: `authenticate` que extrai `userId` do JWT |
| **Multi-stage build** | Técnica Docker de usar múltiplos estágios no Dockerfile para reduzir o tamanho da imagem final |
| **Soft delete** | Estratégia de "exclusão" que apenas marca o registro como deletado (campo `deletedAt`), sem remover do banco |
| **CI/CD** | Continuous Integration / Continuous Delivery — automação de testes, qualidade e deploy |
| **Seed** | Dados iniciais inseridos no banco para desenvolvimento e testes |
| **Paginação por offset** | Técnica de paginação usando `SKIP` e `TAKE` (LIMIT/OFFSET no SQL) |
| **AAA** | Padrão de teste: Arrange (preparar dados) → Act (executar) → Assert (verificar resultado) |

---

*Última atualização: 2026-07-16*
