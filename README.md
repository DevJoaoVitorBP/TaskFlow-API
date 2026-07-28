# 🚀 TaskFlow API

> API REST desenvolvida com **Fastify**, **TypeScript** e **Prisma ORM** para gerenciamento de tarefas, construída seguindo boas práticas de arquitetura em camadas, autenticação JWT e documentação automática com Swagger.

<p align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-v5-000000?logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D?logo=swagger&logoColor=black)
![Tests](https://img.shields.io/badge/Tests-100%25-success)

</p>

---

## 📖 Sobre o projeto

O **TaskFlow API** foi desenvolvido para simular um backend utilizado em um ambiente real de produção.

Além do CRUD de tarefas, o projeto demonstra conceitos importantes de desenvolvimento backend, incluindo:

- Arquitetura em camadas
- Repository Pattern
- Autenticação JWT
- Validação de dados
- Isolamento de dados entre usuários
- Testes automatizados
- Docker
- Documentação automática

---

# ✨ Principais funcionalidades

- 🔐 Cadastro e autenticação com JWT
- 🔒 Hash de senha utilizando bcrypt
- ✅ CRUD completo de tarefas
- 📊 Dashboard com estatísticas
- 🔍 Filtros avançados
- 📄 Paginação
- 📚 Swagger UI
- 🐳 Docker e Docker Compose
- 🧪 Testes unitários
- 👤 Isolamento de dados por usuário

---

# 🏗 Arquitetura

O projeto segue uma arquitetura em camadas para separar responsabilidades.

```
Client
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

Cada camada possui uma responsabilidade específica, facilitando manutenção, testes e evolução do sistema.

---

# 🛠 Tecnologias

## Backend

- TypeScript
- Node.js
- Fastify

## Banco de dados

- PostgreSQL 16
- Prisma ORM

## Autenticação

- JWT
- bcryptjs

## Validação

- Zod

## Testes

- Vitest
- Coverage V8

## Documentação

- Swagger
- Swagger UI

## Infraestrutura

- Docker
- Docker Compose

---

# 📁 Estrutura do projeto

```text
src/
├── config/
├── http/
│   ├── controllers/
│   ├── middlewares/
│   └── routes/
├── lib/
├── repositories/
├── services/
├── types/
└── utils/

prisma/

tests/

docs/
```

---

# 🔑 Fluxo de autenticação

```text
Cadastro
      │
      ▼

Hash da senha (bcrypt)

      │
      ▼

Login

      │
      ▼

JWT

      │
      ▼

Middleware

      │
      ▼

Rotas protegidas
```

---

# 📚 Endpoints

## Autenticação

| Método | Endpoint |
|---------|----------|
| POST | /users |
| POST | /sessions |

---

## Tarefas

| Método | Endpoint |
|---------|----------|
| GET | /tasks |
| GET | /tasks/:id |
| POST | /tasks |
| PUT | /tasks/:id |
| PATCH | /tasks/:id/complete |
| DELETE | /tasks/:id |

---

## Dashboard

| Método | Endpoint |
|---------|----------|
| GET | /dashboard |

---

# 🚀 Executando o projeto

## Pré-requisitos

- Node.js 20+
- PostgreSQL

### Instalação

```bash
git clone ...

cd taskflow-api

npm install
```

Configure o `.env`

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

Execute as migrations

```bash
npx prisma migrate dev

npx prisma generate
```

Inicie

```bash
npm run dev
```

---

# 🐳 Docker

Produção

```bash
docker compose up -d
```

Desenvolvimento

```bash
docker compose --profile dev up -d
```

---

# 📖 Swagger

Após iniciar a aplicação:

```
http://localhost:3333/docs
```

---

# 🧪 Testes

```bash
npm test
```

Cobertura

```bash
npm run test:coverage
```

O projeto possui cobertura de:

- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

---

# 📌 Diferenciais técnicos

- Arquitetura em camadas
- Repository Pattern
- JWT Authentication
- Validação com Zod
- Prisma ORM
- Docker Multi-stage
- Swagger
- Testes automatizados
- Isolamento de dados por usuário
- Paginação
- Filtros dinâmicos
- Dashboard com estatísticas

---

# 🛣 Roadmap

- [ ] Refresh Token
- [ ] Upload de anexos
- [ ] Soft Delete
- [ ] Rate Limiting
- [ ] Logs estruturados
- [ ] Redis Cache
- [ ] Testes E2E

---

# 🤝 Contribuição

Contribuições são bem-vindas.

Sinta-se à vontade para abrir Issues ou Pull Requests.

---

# 📄 Licença

Este projeto está licenciado sob a licença MIT.
