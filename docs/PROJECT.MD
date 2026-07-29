# TaskFlow API — Project Documentation

🌐 **Languages:** [English](./PROJECT.md) | [Português](./PROJECT.pt-BR.md)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Scope](#2-scope)
3. [Technical Stack](#3-technical-stack)
4. [Architecture](#4-architecture)
5. [Features](#5-features)
6. [Data Model](#6-data-model)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Timeline / Roadmap](#8-timeline--roadmap)
9. [Conventions](#9-conventions)
10. [How to Run the Project](#10-how-to-run-the-project)
11. [Tests](#11-tests)
12. [Risks and Dependencies](#12-risks-and-dependencies)
13. [Glossary](#13-glossary)

---

## 1. Overview

### Name
**TaskFlow API**

### Description
A REST API for task management with JWT authentication, built to simulate a real backend workflow — from user registration to statistics lookup via a dashboard.

### Main Objective
Demonstrate the construction of a production-grade REST API with layered architecture (Controller → Service → Repository), robust data validation, multi-user isolation, and 100% test coverage.

### Problem Solved
Backend developers and students lack a reference project that combines solid architectural practices, security (JWT, password hashing, data isolation, parameterized queries), unit tests with mocks, and containerized infrastructure — all in a single coherent codebase.

### Value Proposition

| For whom | Delivers |
|-----------|---------|
| Developer learning backend | A model project with real architecture, not simplified teaching material |
| Team evaluating the Fastify/Prisma stack | A functional, testable reference with applied best practices |
| Professional building a portfolio | A complete API with CI/CD, Docker, Swagger, and 100% coverage |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 2. Scope

### ✅ Included (Current MVP)

- User registration and authentication (JWT)
- Full task CRUD with per-user isolation
- Marking a task as completed
- Advanced listing filters (status, priority, title, dates, pagination)
- Dashboard endpoint with aggregated statistics
- Interactive documentation via Swagger UI
- Containerization with Docker and Docker Compose
- CI/CD pipeline with GitHub Actions (lint, tests, coverage, build, deploy)
- Unit tests with 100% coverage (services + utils)

### ❌ Out of Scope (v1)

- Frontend interface (web or mobile)
- Notification system (email, push)
- Task sharing between users
- Team / workspace management
- Webhooks or real-time events (WebSocket)
- Billing / paid plans
- Internationalization (i18n)

### Versioning

| Version | Content |
|--------|----------|
| **v1.0 (current)** | Auth + Task CRUD + Filters + Dashboard + Docker + CI/CD |
| v1.1 (planned) | Refresh token, soft delete, configurable sorting |
| v2.0 (future) | E2E tests, rate limiting, profile update |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 3. Technical Stack

### Language and Runtime

| Technology | Version | Role |
|------------|--------|-------|
| TypeScript | ^5.x | Main language |
| Node.js | 20+ LTS | Runtime |

### Framework and Libraries

| Package | Version | Role |
|--------|--------|-------|
| `fastify` | ^5.10.0 | HTTP framework |
| `@fastify/cors` | ^11.3.0 | CORS control |
| `@fastify/swagger` | ^9.8.1 | OpenAPI spec generation |
| `@fastify/swagger-ui` | ^6.1.0 | Interactive documentation |
| `@fastify/env` | ^7.0.0 | Env loading |
| `zod` | ^4.4.3 | Schema validation |
| `jsonwebtoken` | ^9.0.3 | JWT generation and verification |
| `bcryptjs` | ^3.0.3 | Password hashing |
| `dotenv` | ^17.4.2 | Local environment variables |
| `pino-pretty` | ^13.1.3 | Log formatting in dev |

### ORM and Database

| Technology | Version | Role |
|------------|--------|-------|
| `@prisma/client` | ^7.8.0 | ORM (client generated in `generated/prisma`) |
| `@prisma/adapter-pg` | ^7.8.0 | PostgreSQL adapter |
| PostgreSQL | 16-alpine | Relational database |

### Testing

| Package | Version | Role |
|--------|--------|-------|
| `vitest` | ^4.1.10 | Test runner |
| `@vitest/coverage-v8` | — | Coverage report |

### Build / Dev Tools

| Tool | Role |
|------------|-------|
| `tsup` | Bundle/build for production (ESM) |
| `tsx` | TS execution in development with watch |
| `eslint` | Code linting |
| `prettier` | Code formatting |

### Infrastructure / DevOps

| Technology | Role |
|------------|-------|
| Docker (multi-stage) | Application containerization |
| Docker Compose | Local orchestration (PostgreSQL + API) |
| `dumb-init` | Unix signal handling in the container |
| GitHub Actions | CI/CD (4 workflows) |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 4. Architecture

### Architectural Pattern
**Layered Architecture** with strict separation of responsibilities:

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

Each layer only knows the one immediately below it. Errors are propagated via `AppError` and caught by the global `setErrorHandler` in `app.ts`.

### Folder Structure

```
src/
├── config/
│   └── env.ts                  # Environment variables validated with Zod
├── lib/
│   ├── prisma.ts               # Prisma Client singleton
│   └── swagger.ts              # OpenAPI / Swagger configuration
├── utils/
│   └── errors.ts               # AppError(message, statusCode) class
├── types/
│   └── fastify.d.ts            # FastifyRequest extension with userId: string
├── repositories/               # Database access (Prisma queries only)
│   ├── task.repository.ts
│   └── dashboard.repository.ts
├── services/                   # Business rules (throws AppError)
│   ├── auth.service.ts
│   ├── task.service.ts
│   └── dashboard.service.ts
└── http/
    ├── controllers/            # HTTP handlers by domain
    │   ├── auth/               # register.controller.ts, login.controller.ts
    │   ├── task/               # create, list, getById, update, delete, complete
    │   └── dashboard/          # stats.controller.ts
    ├── middlewares/
    │   ├── authenticate.ts     # Validates JWT → extracts userId into request
    │   └── index.ts            # Re-exports middlewares
    └── routes/
        ├── index.ts            # Registers all route groups
        ├── auth.routes.ts
        ├── task.routes.ts
        └── dashboard.routes.ts
```

### Error Handling

```
AppError       → configured status + { error: message }
ZodError       → 422 Unprocessable Entity + field details
Unknown error  → 500 Internal Server Error
```

### Data Flow — Example: Create Task

```
POST /tasks
  └─ authenticate (middleware) → validates JWT, sets req.userId
  └─ createTask.controller.ts  → validates body with Zod
  └─ task.service.ts           → checks business rules
  └─ task.repository.ts        → INSERT with Prisma (includes userId)
  └─ 201 { task }
```

### External Integrations

| Service | Purpose | Required |
|---------|------------|-------------|
| PostgreSQL | Data storage | Yes |
| GitHub Actions | Automated CI/CD | Yes (prod) |
| CodeCov | Cloud coverage report | No (optional) |
| Docker Hub / GHCR | Image registry | [TBD] |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 5. Features

### Endpoints

#### Authentication

| Method | Route | Description | Auth |
|--------|------|-----------|------|
| `POST` | `/auth/register` | Creates a new user | No |
| `POST` | `/auth/login` | Authenticates and returns JWT | No |

#### Tasks

| Method | Route | Description | Auth |
|--------|------|-----------|------|
| `POST` | `/tasks` | Creates a new task | Yes |
| `GET` | `/tasks` | Lists tasks with filters and pagination | Yes |
| `GET` | `/tasks/:id` | Fetches a task by ID | Yes |
| `PUT` | `/tasks/:id` | Updates a task (optional fields) | Yes |
| `DELETE` | `/tasks/:id` | Permanently removes a task | Yes |
| `PATCH` | `/tasks/:id/complete` | Marks a task as `DONE` | Yes |

#### Dashboard

| Method | Route | Description | Auth |
|--------|------|-----------|------|
| `GET` | `/dashboard` | Statistics for the authenticated user | Yes |

### Filter Parameters — `GET /tasks`

| Parameter | Type | Example | Description |
|-----------|------|---------|-----------|
| `status` | string (CSV) | `TODO,IN_PROGRESS` | Filters by status (internal OR) |
| `priority` | string (CSV) | `HIGH,MEDIUM` | Filters by priority (internal OR) |
| `title` | string | `meeting` | Case-insensitive partial search |
| `createdAfter` | ISO 8601 | `2025-01-01T00:00:00Z` | Creation date ≥ |
| `createdBefore` | ISO 8601 | `2025-12-31T23:59:59Z` | Creation date ≤ |
| `page` | number | `2` | Page (default: 1) |
| `limit` | number | `20` | Items per page (max: 100, default: 10) |

All active filters are combined with `AND`.

### Feature Prioritization

| Feature | Priority | Status |
|---------|------------|--------|
| Registration and JWT authentication | Must-have | ✅ Implemented |
| Task CRUD | Must-have | ✅ Implemented |
| Per-user data isolation | Must-have | ✅ Implemented |
| Filters and pagination | Must-have | ✅ Implemented |
| Statistics dashboard | Must-have | ✅ Implemented |
| Swagger documentation | Must-have | ✅ Implemented |
| Docker + Docker Compose | Must-have | ✅ Implemented |
| CI/CD with GitHub Actions | Must-have | ✅ Implemented |
| Refresh token | Nice-to-have | ⏳ Planned |
| Soft delete | Nice-to-have | ⏳ Planned |
| Configurable sorting (`sortBy`) | Nice-to-have | ⏳ Planned |
| Rate limiting on auth endpoints | Nice-to-have | ⏳ Planned |
| E2E tests (DB integration) | Nice-to-have | ⏳ Planned |
| User profile update | Nice-to-have | ⏳ Planned |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 6. Data Model

### Main Entities

#### `User`

| Field | Type | Constraint |
|-------|------|-----------|
| `id` | `String` (CUID) | PK, auto-generated |
| `name` | `String` | Required |
| `email` | `String` | Unique, required |
| `password` | `String` | bcrypt hash, required |
| `createdAt` | `DateTime` | Auto (`now()`) |

#### `Task`

| Field | Type | Constraint |
|-------|------|-----------|
| `id` | `String` (CUID) | PK, auto-generated |
| `title` | `String` | 1–255 characters, required |
| `description` | `String?` | Max. 1000 characters, optional |
| `status` | `TaskStatus` | Enum: `TODO`, `IN_PROGRESS`, `DONE`; default `TODO` |
| `priority` | `TaskPriority` | Enum: `LOW`, `MEDIUM`, `HIGH`; default `MEDIUM` |
| `createdAt` | `DateTime` | Auto (`now()`) |
| `updatedAt` | `DateTime` | Auto (`@updatedAt`) |
| `userId` | `String` | FK → `User.id` (Cascade Delete) |

### Relationships

```
User ──< Task   (1 to N)
         └─ onDelete: Cascade (deleting a user removes their tasks)
```

### Summary Schema (Prisma)

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

### Indexes

| Index | Field | Purpose |
|--------|-------|----------|
| `@@index([userId])` | `tasks.userId` | Performance on per-user filters |
| `@@unique` | `users.email` | Unique email integrity |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 7. Non-Functional Requirements

### Security

- **Authentication**: Bearer JWT with a 7-day expiration; secret via environment variable
- **Password hashing**: bcrypt with salt (never stored in plain text)
- **Data isolation**: every task query includes a `WHERE userId = ?` clause; returns 404 for other users' resources (no existence leakage)
- **Parameterized queries**: exclusive use of Prisma ORM — no concatenated SQL, immune to SQL injection
- **Input validation**: Zod validates body, path params, and query strings before reaching the service layer
- **Non-root container**: production image runs with the `nodejs` user (UID 1001)
- **Configurable CORS**: via `@fastify/cors`
- **Secrets**: never committed; managed via `.env` (excluded from `.gitignore`) and GitHub Actions variables

### Performance

- Parallel queries with `Promise.all()` on the dashboard (3 simultaneous `COUNT`s)
- `@@index([userId])` index on the `tasks` table
- Pagination with `skip`/`take` at the database level, not in memory
- Multi-stage Docker build reduces the final image to only the necessary artifacts
- npm dependency caching in CI/CD (~30–60s saved per run)

### Scalability

- Stateless by design (JWT); horizontally scalable with no shared sessions
- Separation between API and database containers — independent scaling
- [TBD] Connection pooling strategy for high concurrency (PgBouncer or `@prisma/adapter-pg`)

### Reliability

- CI blocks merges if tests, lint, or build fail
- Healthcheck on the PostgreSQL container (`pg_isready`) before starting the API
- `dumb-init` ensures graceful process shutdown in the container

### Accessibility

- API: not directly applicable (no UI)
- Swagger documentation accessible at `/docs`

[↑ Back to top](#taskflow-api--project-documentation)

---

## 8. Timeline / Roadmap

### Completed Phases

| Phase | Content | Status |
|------|----------|--------|
| 1 — Setup | Base structure, Fastify, TypeScript, Prisma, environment variables | ✅ |
| 2 — Auth | Registration, login, JWT, authentication middleware | ✅ |
| 3 — Tasks | Full CRUD, isolation by userId, Zod validations | ✅ |
| 4 — Filters | Advanced filters, pagination, dynamic queries | ✅ |
| 5 — Dashboard | Statistics endpoint, parallel queries | ✅ |
| 6 — Tests | 20 unit tests, 100% coverage (services + utils) | ✅ |
| 7 — Docker | Multi-stage build, Docker Compose, management script | ✅ |
| 8 — CI/CD | 4 GitHub Actions workflows, local scripts, documentation | ✅ |

### Future Roadmap

| Version | Feature | Priority |
|--------|---------|------------|
| v1.1 | Refresh token + session revocation | High |
| v1.1 | Soft delete for tasks (`deletedAt`) | Medium |
| v1.1 | Configurable sorting (`sortBy`, `order`) | Medium |
| v1.2 | Rate limiting on auth endpoints | High |
| v1.2 | Profile update (`PUT /users/me`) | Low |
| v2.0 | E2E integration tests with isolated DB | High |
| v2.0 | Observability metrics (Prometheus/OpenTelemetry) | [TBD] |
| v2.0 | Automated cloud deployment | [TBD] |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 9. Conventions

### Code Standard

- **Language**: TypeScript strict mode
- **Linter**: ESLint (`eslint.config.mjs`)
- **Formatter**: Prettier (integrated with ESLint)
- **Modules**: ESM (`"type": "module"` in `package.json`)
- **Imports**: explicit relative paths with `.js` extension in the compiled output

### Commit Convention (Conventional Commits)

```
<type>(optional scope): short description

[optional body]
[optional footer — e.g. BREAKING CHANGE]
```

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `test` | Adding/modifying tests |
| `refactor` | Refactoring without behavior change |
| `chore` | Maintenance tasks (deps, config, CI) |
| `docs` | Documentation only |
| `perf` | Performance improvement |
| `ci` | Changes to workflows/CI scripts |

### Naming

| Element | Convention | Example |
|----------|-----------|---------|
| Files | `kebab-case` | `task.service.ts` |
| Classes | `PascalCase` | `AppError` |
| Functions and variables | `camelCase` | `getTasksByUserId` |
| Global constants | `UPPER_SNAKE_CASE` | `JWT_SECRET` |
| Database tables | `snake_case` (via `@@map`) | `users`, `tasks` |
| Database columns | `camelCase` (Prisma) → `snake_case` (generated) | — |
| HTTP routes | plural `kebab-case` | `/tasks`, `/auth/register` |
| Branches | `feat/`, `fix/`, `chore/` + slug | `feat/refresh-token` |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 10. How to Run the Project

### Prerequisites

- Node.js **20+** LTS
- npm **10+**
- PostgreSQL **16+** (local or Docker)
- Docker and Docker Compose (for containerized execution)

### Environment Variables

Create a `.env` file at the project root with:

```env
# Database (Prisma connection string)
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow?schema=public"

# JWT
JWT_SECRET="your-secret-here-use-256-bits-or-more"

# Server
PORT=3333
```

> ⚠️ Never commit the `.env` file. It is in `.gitignore`.

### Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/<user>/taskflow-api.git
cd taskflow-api

# 2. Install dependencies
npm install

# 3. Set up the .env (see above)

# 4. Run the migrations and generate the Prisma Client
npx prisma migrate dev
npx prisma generate

# 5. (Optional) Seed the database with sample data
npx prisma db seed

# 6. Start in development mode (with hot reload)
npm run dev
```

API available at: `http://localhost:3333`
Swagger UI: `http://localhost:3333/docs`

### Running with Docker

```bash
# Prerequisite: .env with POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, JWT_SECRET

# Production
docker compose up -d

# Development (with live reload on port 3334)
docker compose --profile dev up -d

# Using the helper script (Windows)
.\docker-manage.ps1 up        # starts in production
.\docker-manage.ps1 dev       # starts in dev mode
.\docker-manage.ps1 logs      # shows live logs
.\docker-manage.ps1 shell     # opens a terminal in the container
.\docker-manage.ps1 migrate   # runs migrations manually
.\docker-manage.ps1 clean     # removes containers and volumes
.\docker-manage.ps1 rebuild   # full image rebuild
```

### Development Commands

| Command | Description |
|---------|-----------|
| `npm run dev` | Starts with hot reload (tsx watch) |
| `npm run build` | Compiles to `dist/` via tsup |
| `npm run start` | Runs the compiled build |
| `npm run lint` | Checks for lint errors |
| `npm run lint:fix` | Automatically fixes lint errors |
| `npm run format` | Formats code with Prettier |
| `npm run test` | Runs all tests |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:coverage` | Tests + coverage report |
| `npx prisma studio` | Visual database interface |
| `npx prisma migrate dev` | Creates and applies a new migration |
| `npx prisma db seed` | Seeds the database with sample data |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 11. Tests

### Strategy

| Type | Tool | Scope | Status |
|------|------------|--------|--------|
| Unit | Vitest | Services + Utils | ✅ 100% coverage |
| Integration (E2E) | [TBD] | Endpoints + DB | ⏳ Planned for v2.0 |

### Current Coverage

```
Statements : 100%
Branches   : 100%
Functions  : 100%
Lines      : 100%
```

**20 passing tests:**

| Suite | Tests | Cases covered |
|-------|--------|----------------|
| `AuthService` | 5 | register, login, duplicate email, incorrect password, user not found |
| `TaskService` | 10 | create, list, getById, update, delete, complete + error cases (404, 403) |
| `DashboardService` | 5 | with tasks, without tasks |

### Testing Patterns

- **Mocks**: Prisma fully mocked (no database I/O)
- **Mocked dependencies**: `bcryptjs`, `jsonwebtoken`
- **Pattern**: AAA (Arrange → Act → Assert)
- **Isolation**: `vi.clearAllMocks()` before each test
- **Factory**: `createMockTask()` for consistent data across suites

### Files Without Unit Tests (by design)

| Layer | Reason |
|--------|-------|
| Repositories | Require a real database; tested in E2E |
| Controllers | HTTP orchestration only; no business logic |
| Routes / Middlewares | Tested in E2E |
| `config/env.ts`, `lib/prisma.ts`, `lib/swagger.ts` | No domain logic |

### Minimum Coverage in CI

The `coverage.yml` workflow fails the pipeline if coverage drops below **80%** on any metric.

### Running the Tests

```bash
npm run test              # single run
npm run test:watch        # interactive mode
npm run test:coverage     # + HTML report in coverage/
npm run test:ui           # Vitest UI visual interface
```

[↑ Back to top](#taskflow-api--project-documentation)

---

## 12. Risks and Dependencies

### Identified Risks

| Risk | Probability | Impact | Mitigation |
|-------|--------------|---------|-----------|
| Weak or exposed JWT_SECRET | Low | Critical | Generate 256+ random bits; never commit |
| Prisma migration in production with data | Medium | High | Test migrations in staging first; prior backup |
| Token expiration without refresh | High | Medium | Implement refresh token (roadmap v1.1) |
| Breaking changes in Fastify v5 | Low | Medium | Version pins in package.json |
| Test coverage dropping below 80% | Low | Medium | CI gate blocks merges |
| Outdated Docker image with vulnerabilities | Medium | High | Periodic `npm audit`; update Node alpine |

### Critical External Dependencies

| Dependency | Type | Criticality | Fallback |
|-------------|------|-------------|---------|
| PostgreSQL | Database | Critical | No fallback; high availability required in prod |
| GitHub Actions | CI/CD | High | Local scripts available (`.github/scripts/`) |
| Docker Hub / GHCR | Image registry | Medium | Local build always available |
| `jsonwebtoken` | Auth | Critical | Mature library, RFC 7519 |
| `bcryptjs` | Security | Critical | Pure JS implementation, no native dependencies |

[↑ Back to top](#taskflow-api--project-documentation)

---

## 13. Glossary

| Term | Definition |
|-------|-----------|
| **JWT** | JSON Web Token — RFC 7519 standard for securely transmitting claims between parties |
| **Bearer Token** | HTTP authentication scheme where the token is sent in the `Authorization: Bearer <token>` header |
| **CUID** | Collision-resistant Unique Identifier — a unique identifier generated by Prisma, safe for URLs |
| **ORM** | Object-Relational Mapper — an abstraction that maps TypeScript objects to relational tables |
| **AppError** | The project's custom error class, carrying an HTTP `message` and `statusCode` |
| **Repository** | Layer responsible exclusively for database queries via Prisma |
| **Service** | Business rules layer; throws `AppError` for invalid conditions |
| **Controller** | HTTP handler; validates input with Zod, calls the service, returns the response |
| **Middleware** | Function executed before the controller; e.g. `authenticate`, which extracts `userId` from the JWT |
| **Multi-stage build** | Docker technique of using multiple stages in the Dockerfile to reduce the final image size |
| **Soft delete** | A "deletion" strategy that only marks the record as deleted (`deletedAt` field), without removing it from the database |
| **CI/CD** | Continuous Integration / Continuous Delivery — automation of testing, quality, and deployment |
| **Seed** | Initial data inserted into the database for development and testing |
| **Offset pagination** | Pagination technique using `SKIP` and `TAKE` (LIMIT/OFFSET in SQL) |
| **AAA** | Testing pattern: Arrange (set up data) → Act (execute) → Assert (verify the result) |

[↑ Back to top](#taskflow-api--project-documentation)

---

*Last updated: 2026-07-16*