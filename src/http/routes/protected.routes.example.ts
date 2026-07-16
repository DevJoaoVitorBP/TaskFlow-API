import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authenticate } from '../middlewares/authenticate'
import { requireAuth } from '../middlewares/requireAuth'

/**
 * Exemplo de rotas protegidas por autenticação JWT
 *
 * Este arquivo demonstra como usar os middlewares authenticate() e requireAuth()
 * para proteger rotas, garantindo que apenas usuários autenticados possam acessá-las
 */

// Exemplo de controller para listar tarefas do usuário
async function listTasksController(request: FastifyRequest, _reply: FastifyReply) {
  const userId = request.userId // Disponível porque passou pelo middleware authenticate

  return {
    userId,
    tasks: [
      { id: 1, title: 'Tarefa 1', completed: false },
      { id: 2, title: 'Tarefa 2', completed: true },
    ],
  }
}

// Exemplo de controller para criar uma tarefa
async function createTaskController(request: FastifyRequest, _reply: FastifyReply) {
  const userId = request.userId

  return {
    id: 3,
    userId,
    title: request.body,
    completed: false,
  }
}

export async function taskRoutes(app: FastifyInstance) {
  /**
   * OPÇÃO 1: Proteger rotas individualmente com preHandler
   * Aplica o middleware apenas na rota específica
   */
  app.get('/tasks', { preHandler: authenticate }, listTasksController)

  /**
   * OPÇÃO 2: Proteger rotas com múltiplos middlewares
   * Ordem importa: authenticate() extrai o token
   * requireAuth() valida se está autenticado
   */
  app.post('/tasks', { preHandler: [authenticate, requireAuth] }, createTaskController)

  /**
   * OPÇÃO 3: Agrupar rotas protegidas
   * Todos os endpoints dentro deste bloco herdam os middlewares
   */
  app.register(async app => {
    // Aplicar middlewares globais a todas as rotas deste registro
    app.addHook('preHandler', authenticate)

    app.get('/tasks/summary', async (request: FastifyRequest, _reply: FastifyReply) => {
      const userId = request.userId
      return { userId, summary: 'Resumo de tarefas' }
    })

    app.delete('/tasks/:id', async (request: FastifyRequest, _reply: FastifyReply) => {
      const userId = request.userId
      const taskId = request.params.id

      return { message: `Tarefa ${taskId} deletada por usuário ${userId}` }
    })
  })
}

/**
 * COMO USAR NA PRÁTICA
 *
 * 1. Sem autenticação (falha):
 *    GET /tasks
 *    → 401 { error: "Missing authorization header" }
 *
 * 2. Com token expirado (falha):
 *    GET /tasks
 *    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *    → 401 { error: "Token has expired", code: "TOKEN_EXPIRED" }
 *
 * 3. Com token válido (sucesso):
 *    GET /tasks
 *    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *    → 200 { userId: "user-uuid", tasks: [...] }
 */
