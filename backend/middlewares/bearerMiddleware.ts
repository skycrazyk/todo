import { getAuth } from '@hono/clerk-auth'
import { bearerAuth } from 'hono/bearer-auth'
import { createMiddleware } from 'hono/factory'
import type { Env } from '../main.ts'

export const bearerMiddleware = createMiddleware<Env>((c, next) => {
  const auth = getAuth(c)

  const bearer = bearerAuth({
    token: auth?.userId
      ? c.req.header('Authorization')?.replace('Bearer ', '') || ''
      : ''
  })

  return bearer(c, next)
})
