import { Hono } from 'hono'
import { cors } from 'hono/cors'
import todo from './api/todo.ts'
import todos from './api/todos.ts'
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
  // TODO удалить тестовый роут
  .get('/auth', (c) => {
    const auth = getAuth(c)

    if (!auth?.userId) {
      return c.json({
        message: 'You are not logged in.'
      })
    }

    return c.json({
      message: 'You are logged in!',
      auth: auth,
      user: c.get('user')
    })
  })
  .route('/todo', todo)
  .route('/todos', todos)

export default app

export type AppType = typeof app
