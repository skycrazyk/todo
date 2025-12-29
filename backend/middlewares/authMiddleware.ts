import { getAuth } from '@hono/clerk-auth'
import { exception } from '../utils/index.ts'
import { factory } from '../factory.ts'

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const auth = getAuth(c)

  if (!auth?.userId) {
    exception(c, 401, 'Unauthorized')
  }

  return await next()
})
