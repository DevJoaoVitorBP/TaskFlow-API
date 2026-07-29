# 🚀 TaskFlow API

🌐 **Idiomas:** [English](../README.md) | [Português](./README.pt-BR.md)

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

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Principais funcionalidades](#-principais-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Fluxo de autenticação](#-fluxo-de-autenticação)
- [Endpoints](#-endpoints)
- [Executando o projeto](#-executando-o-projeto)
- [Docker](#-docker)
- [Swagger](#-swagger)
- [Testes](#-testes)
- [Diferenciais técnicos](#-diferenciais-técnicos)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

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

[↑ Voltar ao topo](#-taskflow-api)

---

## ✨ Principais funcionalidades

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

[↑ Voltar ao topo](#-taskflow-api)

---

## 🏗 Arquitetura

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

[↑ Voltar ao topo](#-taskflow-api)

---

## 🛠 Tecnologias

### Backend

- TypeScript
- Node.js
- Fastify

### Banco de dados

- PostgreSQL 16
- Prisma ORM

### Autenticação

- JWT
- bcryptjs

### Validação

- Zod

### Testes

- Vitest
- Coverage V8

### Documentação

- Swagger
- Swagger UI

### Infraestrutura

- Docker
- Docker Compose

[↑ Voltar ao topo](#-taskflow-api)

---

## 📁 Estrutura do projeto

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

[↑ Voltar ao topo](#-taskflow-api)

---

## 🔑 Fluxo de autenticação

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

[↑ Voltar ao topo](#-taskflow-api)

---

## 📚 Endpoints

### Autenticação

| Método | Endpoint |
|---------|----------|
| POST | /users |
| POST | /sessions |

---

### Tarefas

| Método | Endpoint |
|---------|----------|
| GET | /tasks |
| GET | /tasks/:id |
| POST | /tasks |
| PUT | /tasks/:id |
| PATCH | /tasks/:id/complete |
| DELETE | /tasks/:id |

---

### Dashboard

| Método | Endpoint |
|---------|----------|
| GET | /dashboard |

[↑ Voltar ao topo](#-taskflow-api)

---

## 🚀 Executando o projeto

### Pré-requisitos

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

[↑ Voltar ao topo](#-taskflow-api)

---

## 🐳 Docker

Produção

```bash
docker compose up -d
```

Desenvolvimento

```bash
docker compose --profile dev up -d
```

[↑ Voltar ao topo](#-taskflow-api)

---

## 📖 Swagger

Após iniciar a aplicação:

```
http://localhost:3333/docs
```

[↑ Voltar ao topo](#-taskflow-api)

---

## 🧪 Testes

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

[↑ Voltar ao topo](#-taskflow-api)

---

## 📌 Diferenciais técnicos

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

[↑ Voltar ao topo](#-taskflow-api)

---

## 🛣 Roadmap

- [ ] Refresh Token
- [ ] Upload de anexos
- [ ] Soft Delete
- [ ] Rate Limiting
- [ ] Logs estruturados
- [ ] Redis Cache
- [ ] Testes E2E
- [ ] GitHub Actions

[↑ Voltar ao topo](#-taskflow-api)

---

## 🤝 Contribuição

Contribuições são bem-vindas.

Sinta-se à vontade para abrir Issues ou Pull Requests.

[↑ Voltar ao topo](#-taskflow-api)

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

[↑ Voltar ao topo](#-taskflow-api)