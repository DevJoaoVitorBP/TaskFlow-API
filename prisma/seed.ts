import { hash } from 'bcryptjs'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.info('🌱 Seeding database...')

  // Limpa os dados na ordem correta (respeita FK)
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  // ── Usuários ───────────────────────────────────────────────────────────────
  const passwordHash = await hash('123456', 10)

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Silva',
      email: 'alice@taskflow.dev',
      password: passwordHash,
    },
  })

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Souza',
      email: 'bob@taskflow.dev',
      password: passwordHash,
    },
  })

  // ── Tarefas da Alice ───────────────────────────────────────────────────────
  await prisma.task.createMany({
    data: [
      {
        title: 'Configurar ambiente de desenvolvimento',
        description: 'Instalar Node.js, Docker e configurar variáveis de ambiente.',
        status: 'DONE',
        priority: 'HIGH',
        userId: alice.id,
      },
      {
        title: 'Implementar autenticação JWT',
        description: 'Criar endpoints de login e registro com tokens JWT.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        userId: alice.id,
      },
      {
        title: 'Escrever testes de integração',
        description: 'Cobrir os principais endpoints com testes usando Vitest.',
        status: 'TODO',
        priority: 'MEDIUM',
        userId: alice.id,
      },
      {
        title: 'Configurar CI/CD',
        description: 'Pipeline no GitHub Actions para lint, testes e deploy.',
        status: 'TODO',
        priority: 'LOW',
        userId: alice.id,
      },
    ],
  })

  // ── Tarefas do Bob ─────────────────────────────────────────────────────────
  await prisma.task.createMany({
    data: [
      {
        title: 'Revisar pull requests pendentes',
        description: null,
        status: 'TODO',
        priority: 'HIGH',
        userId: bob.id,
      },
      {
        title: 'Atualizar documentação da API',
        description: 'Sincronizar Swagger com as últimas alterações dos endpoints.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        userId: bob.id,
      },
    ],
  })

  const userCount = await prisma.user.count()
  const taskCount = await prisma.task.count()

  console.info(`✅ Seed concluído: ${userCount} usuários e ${taskCount} tarefas criados.`)
}

main()
  .catch(err => {
    console.error('❌ Seed falhou:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
