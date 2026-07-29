# 🚀 TaskFlow API

🌐 **Languages:** [English](./README.md) | [Português](/docs/README.pt-BR.md)

> REST API built with **Fastify**, **TypeScript**, and **Prisma ORM** for task management, following layered architecture best practices, JWT authentication, and automatic documentation with Swagger.

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

## 📑 Table of Contents

- [About the project](#-about-the-project)
- [Key features](#-key-features)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Project structure](#-project-structure)
- [Authentication flow](#-authentication-flow)
- [Endpoints](#-endpoints)
- [Running the project](#-running-the-project)
- [Docker](#-docker)
- [Swagger](#-swagger)
- [Tests](#-tests)
- [Technical highlights](#-technical-highlights)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About the project

**TaskFlow API** was built to simulate a backend used in a real production environment.

Beyond the task CRUD, the project demonstrates important backend development concepts, including:

- Layered architecture
- Repository Pattern
- JWT authentication
- Data validation
- Data isolation between users
- Automated testing
- Docker
- Automatic documentation

[↑ Back to top](#-taskflow-api)

---

## ✨ Key features

- 🔐 Sign-up and authentication with JWT
- 🔒 Password hashing using bcrypt
- ✅ Full task CRUD
- 📊 Dashboard with statistics
- 🔍 Advanced filters
- 📄 Pagination
- 📚 Swagger UI
- 🐳 Docker and Docker Compose
- 🧪 Unit tests
- 👤 Per-user data isolation

[↑ Back to top](#-taskflow-api)

---

## 🏗 Architecture

The project follows a layered architecture to separate responsibilities.

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

Each layer has a specific responsibility, making the system easier to maintain, test, and evolve.

[↑ Back to top](#-taskflow-api)

---

## 🛠 Technologies

### Backend

- TypeScript
- Node.js
- Fastify

### Database

- PostgreSQL 16
- Prisma ORM

### Authentication

- JWT
- bcryptjs

### Validation

- Zod

### Testing

- Vitest
- Coverage V8

### Documentation

- Swagger
- Swagger UI

### Infrastructure

- Docker
- Docker Compose

[↑ Back to top](#-taskflow-api)

---

## 📁 Project structure

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

[↑ Back to top](#-taskflow-api)

---

## 🔑 Authentication flow

```text
Sign-up
      │
      ▼

Password hashing (bcrypt)

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

Protected routes
```

[↑ Back to top](#-taskflow-api)

---

## 📚 Endpoints

### Authentication

| Method | Endpoint |
|--------|----------|
| POST | /users |
| POST | /sessions |

---

### Tasks

| Method | Endpoint |
|--------|----------|
| GET | /tasks |
| GET | /tasks/:id |
| POST | /tasks |
| PUT | /tasks/:id |
| PATCH | /tasks/:id/complete |
| DELETE | /tasks/:id |

---

### Dashboard

| Method | Endpoint |
|--------|----------|
| GET | /dashboard |

[↑ Back to top](#-taskflow-api)

---

## 🚀 Running the project

### Prerequisites

- Node.js 20+
- PostgreSQL

### Installation

```bash
git clone ...

cd taskflow-api

npm install
```

Set up the `.env` file

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

Run the migrations

```bash
npx prisma migrate dev

npx prisma generate
```

Start the app

```bash
npm run dev
```

[↑ Back to top](#-taskflow-api)

---

## 🐳 Docker

Production

```bash
docker compose up -d
```

Development

```bash
docker compose --profile dev up -d
```

[↑ Back to top](#-taskflow-api)

---

## 📖 Swagger

After starting the application:

```
http://localhost:3333/docs
```

[↑ Back to top](#-taskflow-api)

---

## 🧪 Tests

```bash
npm test
```

Coverage

```bash
npm run test:coverage
```

The project has coverage of:

- Statements: 100%
- Branches: 100%
- Functions: 100%
- Lines: 100%

[↑ Back to top](#-taskflow-api)

---

## 📌 Technical highlights

- Layered architecture
- Repository Pattern
- JWT Authentication
- Validation with Zod
- Prisma ORM
- Multi-stage Docker
- Swagger
- Automated tests
- Per-user data isolation
- Pagination
- Dynamic filters
- Dashboard with statistics

[↑ Back to top](#-taskflow-api)

---

## 🛣 Roadmap

- [ ] Refresh Token
- [ ] File upload
- [ ] Soft Delete
- [ ] Rate Limiting
- [ ] Structured logs
- [ ] Redis Cache
- [ ] E2E tests
- [ ] GitHub Actions

[↑ Back to top](#-taskflow-api)

---

## 🤝 Contributing

Contributions are welcome.

Feel free to open Issues or Pull Requests.

[↑ Back to top](#-taskflow-api)

---

## 📄 License

This project is licensed under the MIT license.

[↑ Back to top](#-taskflow-api)