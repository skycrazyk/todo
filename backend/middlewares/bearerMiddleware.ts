import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import type { Env } from '../main.ts'
import { exception } from '../utils/index.ts'

export const bearerMiddleware = createMiddleware<Env>(async (c, next) => {
  const auth = getAuth(c)

  if (!auth?.userId) {
    exception(c, 401, 'Unauthorized')
  }

  return await next()
})
