import type { Context } from 'hono'
import { cors } from 'hono/cors'
import todo from './api/todo.ts'
import todos from './api/todos.ts'
import list from './api/list.ts'
import lists from './api/lists.ts'
import { clerkMiddleware } from '@hono/clerk-auth'
import { userMiddleware } from './middlewares/userMiddleware.ts'
import { authMiddleware } from './middlewares/authMiddleware.ts'
import { dbMiddleware } from './middlewares/dbMiddleware.ts'
import { HTTPException } from 'hono/http-exception'
import type { ZError } from '@app/shared'
import { factory, type Env } from './factory.ts'

export type Ctx = Context<Env>

const app = factory
  .createApp()
  .use(dbMiddleware)
  .use(
    cors({
      origin: '*', // Replace with the actual origin of your frontend application
      credentials: true // Set to true if you need to send cookies or authentication headers
    })
  )
  // TODO заменить на готовый middleware из hono
  .use(
    clerkMiddleware({
      secretKey: Deno.env.get('CLERK_SECRET_KEY'),
      publishableKey: Deno.env.get('CLERK_PUBLISHABLE_KEY')
    })
  )
  .use(authMiddleware)
  .use(userMiddleware)
  .route('/todo', todo)
  .route('/todos', todos)
  .route('/list', list)
  .route('/lists', lists)
  .onError((e, c) => {
    console.error('Error:', e)

    if (e instanceof HTTPException) {
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
