import { Hono } from 'hono'
import { cors } from 'hono/cors'
import todo from './api/todo.ts'
import todos from './api/todos.ts'
import list from './api/list.ts'
import lists from './api/lists.ts'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { userMiddleware, type ComboUser } from './middlewares/userMiddleware.ts'
import { bearerMiddleware } from './middlewares/bearerMiddleware.ts'

export type Env = {
  Variables: {
    // TODO вероятно можно глобально расширять типы Hono. см. clerkMiddleware
    user: ComboUser
  }
}

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
  .use('*', bearerMiddleware)
  .use('*', userMiddleware)
  .route('/todo', todo)
  .route('/todos', todos)
  .route('/list', list)
  .route('/lists', lists)

export default app

export type AppType = typeof app
