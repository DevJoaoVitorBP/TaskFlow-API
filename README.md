# TaskFlow API

## Sobre o projeto

API REST para gerenciamento de tarefas com autenticação JWT, construída para simular um fluxo real de backend — desde o cadastro de usuários até a consulta de estatísticas via dashboard. O objetivo técnico foi aplicar uma arquitetura em camadas (controllers, services, repositories), validação de dados com Zod e isolamento de dados por usuário em todas as operações.

---

## Funcionalidades

- Cadastro e autenticação de usuários com hash de senha (bcrypt) e token JWT
- CRUD completo de tarefas: criar, listar, buscar por ID, atualizar e deletar
- Marcação de tarefa como concluída via endpoint dedicado (`PATCH /tasks/:id/complete`)
- Filtros avançados na listagem de tarefas: status, prioridade, título (busca parcial), intervalo de datas
- Paginação configurável na listagem (`page` e `limit`)
- Endpoint de dashboard com estatísticas do usuário autenticado (total, concluídas, pendentes, taxa de conclusão)
- Isolamento de dados por usuário: nenhum usuário acessa as tarefas de outro
- Documentação interativa da API gerada automaticamente com Swagger UI
- Containerização completa com Docker e Docker Compose

---

## Tecnologias utilizadas

**Linguagem**
- TypeScript

**Framework**
- Fastify v5

**ORM / Banco de dados**
- Prisma ORM (com output customizado)
- PostgreSQL 16

**Autenticação**
- JSON Web Token (`jsonwebtoken`) — expiração de 7 dias
- `bcryptjs` para hash de senhas

**Validação**
- Zod v4 — validação de body, params e query strings

**Testes**
- Vitest com cobertura via `@vitest/coverage-v8`
- 20 testes unitários com 100% de cobertura em Statements, Branches, Functions e Lines

**Documentação**
- `@fastify/swagger` + `@fastify/swagger-ui`

**Infraestrutura / DevOps**
- Docker (multi-stage build: base → dependencies → builder → production)
- Docker Compose (PostgreSQL + API em produção; perfil `dev` com live reload)
- `dumb-init` para tratamento de sinais; usuário não-root em produção

**Ferramentas**
- `tsup` (build), `tsx` (execução em desenvolvimento)
- ESLint + Prettier
- `dotenv`

---

## Como executar o projeto

### Pré-requisitos

- Node.js 20+
- PostgreSQL (local ou via Docker)

### Execução local

```bash
# 1. Clone o repositório
git clone https://github.com/<seu-usuario>/taskflow-api.git
cd taskflow-api

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com os valores: DATABASE_URL, JWT_SECRET, PORT

# 4. Execute as migrations e gere o client Prisma
npx prisma migrate dev
npx prisma generate

# 5. Inicie em modo desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3333`.  
Documentação Swagger: `http://localhost:3333/docs`

### Execução com Docker

```bash
# Configure o .env com: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, JWT_SECRET

# Produção
docker compose up -d

# Desenvolvimento (com live reload)
docker compose --profile dev up -d
```

Ou use o script auxiliar:

```powershell
.\docker-manage.ps1 up      # produção
.\docker-manage.ps1 dev     # desenvolvimento
.\docker-manage.ps1 logs    # logs em tempo real
.\docker-manage.ps1 shell   # terminal no container
```

---

## Organização do projeto

```
src/
├── config/
│   └── env.ts                  # Variáveis de ambiente validadas com Zod
├── lib/
│   ├── prisma.ts               # Instância singleton do Prisma Client
│   └── swagger.ts              # Configuração da documentação
├── utils/
│   └── errors.ts               # Classe AppError com status HTTP
├── types/
│   └── fastify.d.ts            # Extensão do FastifyRequest (userId)
├── repositories/               # Acesso ao banco de dados (Prisma)
├── services/                   # Regras de negócio (lança AppError)
└── http/
    ├── controllers/            # Handlers HTTP organizados por domínio
    ├── middlewares/            # Middleware de autenticação JWT
    └── routes/                 # Definição e registro de rotas
```

O tratamento de erros é centralizado via `setErrorHandler` no `app.ts`: `AppError` retorna o status configurado, `ZodError` retorna 422, e erros desconhecidos retornam 500.

---

## O que este projeto demonstra

- Construção de API REST com Fastify v5 e TypeScript com tipagem estrita
- Arquitetura em camadas com separação clara de responsabilidades (Controller → Service → Repository)
- Autenticação stateless com JWT e proteção de rotas via middleware
- Validação de entrada com Zod em body, path params e query strings
- Isolamento de dados multi-usuário com filtragem por `userId` em todas as queries
- Consultas parametrizadas e seguras contra SQL injection via Prisma
- Filtros dinâmicos combinados com AND/OR e paginação eficiente
- Queries paralelas com `Promise.all()` para performance no dashboard
- Testes unitários com mocks completos (sem I/O), padrão AAA e 100% de cobertura
- Containerização com Docker multi-stage e boas práticas de segurança (non-root, dumb-init)
- Documentação interativa gerada automaticamente com Swagger UI

---

## Melhorias futuras

- Implementar refresh token para renovação de sessão sem novo login
- Adicionar endpoint de atualização de perfil do usuário
- Suporte a ordenação configurável na listagem de tarefas (`sortBy`, `order`)
- Testes de integração (E2E) com banco de dados em memória ou container isolado
- Rate limiting por IP para os endpoints de autenticação
- Soft delete nas tarefas em vez de remoção permanente
