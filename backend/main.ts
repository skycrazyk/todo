import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { bearerAuth } from 'hono/bearer-auth'
import todo from './todo.ts'
import todos from './todos.ts'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import { db } from './database.ts'

// Добавить блокировку транзакций создания пользователя при необходимости

const iss = 'clerk' // TODO брать из запроса

const bearerMiddleware = createMiddleware((c, next) => {
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

  const stmtGetUser = db.prepare(`SELECT * FROM users
    INNER JOIN users_identities
    ON users.id = users_identities.user_id
    WHERE iss = (:iss) AND sub = (:sub)
  `)

  const user = stmtGetUser.get({
    iss,
    sub: auth?.userId
  })

  if (user) {
    c.set('user', user)
  } else {
    const stmtCreateUser = db.prepare(`INSERT INTO users(email)
      VALUES(:email)
      RETURNING *
    `)

    const newUser = stmtCreateUser.get({
      email: auth?.sessionClaims?.email as string // TODO need fix typings
    })

    const stmtCreateIdentity =
      db.prepare(`INSERT INTO users_identities(user_id, iss, sub)
      VALUES(:user_id, :iss, :sub)
    `)

    stmtCreateIdentity.run({
      user_id: newUser?.id as number,
      iss,
      sub: auth?.userId
    })

    c.set('user', newUser)
  }

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
  .use('*', bearerMiddleware)
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
      auth: auth,
      user: c.get('user')
    })
  })
  .route('/todo', todo)
  .route('/todos', todos)

export default app

export type AppType = typeof app
