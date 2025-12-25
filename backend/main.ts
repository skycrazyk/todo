import { Hono, type Context } from 'hono'
import { cors } from 'hono/cors'
import todo from './api/todo.ts'
import todos from './api/todos.ts'
import list from './api/list.ts'
import lists from './api/lists.ts'
import { clerkMiddleware } from '@hono/clerk-auth'
import { userMiddleware, type ComboUser } from './middlewares/userMiddleware.ts'
import { authMiddleware } from './middlewares/authMiddleware.ts'
import { HTTPException } from 'hono/http-exception'
import type { ZError } from '@app/shared'

export type Env = {
  Variables: {
    // TODO вероятно можно глобально расширять типы Hono. см. clerkMiddleware
    user: ComboUser
  }
}

export type Ctx = Context<Env>

const app = new Hono<Env>()
  .use(
    cors({
      origin: '*', // Replace with the actual origin of your frontend application
      credentials: true // Set to true if you need to send cookies or authentication headers
    })
  )
  .use(
    '*',
    clerkMiddleware({
      secretKey: Deno.env.get('CLERK_SECRET_KEY'),
      publishableKey: Deno.env.get('CLERK_PUBLISHABLE_KEY')
    })
  )
  .use('*', authMiddleware)
  .use('*', userMiddleware)
  .route('/todo', todo)
  .route('/todos', todos)
  .route('/list', list)
  .route('/lists', lists)
  .onError((e, c) => {
    if (e instanceof HTTPException) {
      console.error('Error cause:', e.cause)
      // Get the custom response
      return e.getResponse()
    }

    return c.json(
      {
        name: 'AppError',
        message: 'Unknown server error'
      } satisfies ZError,
      500
    )
  })

export default app

export type AppType = typeof app

export type { Todo } from './api/todo.ts'
export type { List } from './api/list.ts'
