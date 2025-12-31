import { getAuth } from '@hono/clerk-auth'
import { factory } from '../factory.ts'

export const authApplyMiddleware = factory.createMiddleware(async (c, next) => {
  const auth = getAuth(c)

  if (
    auth?.sessionClaims?.iss &&
    typeof auth?.userId === 'string' &&
    typeof auth?.sessionClaims?.email === 'string'
  ) {
    c.set('auth', {
      sub: auth.userId,
      iss: auth.sessionClaims.iss,
      email: auth.sessionClaims.email
    })
  }

  return await next()
})
