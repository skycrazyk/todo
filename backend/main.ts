import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { bearerAuth } from 'hono/bearer-auth'
import todo from './todo.ts'
import todos from './todos.ts'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import { db } from './database.ts'

const authMiddleware = createMiddleware((c, next) => {
  const auth = getAuth(c)

  const bearer = bearerAuth({
    token: auth?.userId
      ? c.req.header('Authorization')?.replace('Bearer ', '') || ''
      : ''
  })

  return bearer(c, next)
})

const userMiddleware = createMiddleware(async (c, next) => {
  const auth = getAuth(c)

  // const stmtGetUser = db.prepare(`SELECT * FROM users
  //   INNER JOIN users_identities
  //   ON users.id = user_identities.user_id
  //   WHERE iss = (:iss) AND sub = (:sub)
  // `)

  // const user = stmtGetUser.get({
  //   iss: 'clerk',
  //   sub: auth?.userId
  // })

  // if (!user) {
  //   const stmtCreateUser = db.prepare(`INSERT INTO users()
  //     VALUES()
  //   `)
  // }

  await next()
})

const app = new Hono()
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
  .get('/auth', (c) => {
    const auth = getAuth(c)

    if (!auth?.userId) {
      return c.json({
        message: 'You are not logged in.'
      })
    }

    return c.json({
      message: 'You are logged in!',
      userId: auth
    })
  })
  .route('/todo', todo)
  .route('/todos', todos)

export default app

export type AppType = typeof app
