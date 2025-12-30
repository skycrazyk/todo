import { env } from 'hono/adapter'
import { factory } from '../factory.ts'
import { clerkMiddleware as _clerkMiddleware } from '@hono/clerk-auth'

export const clerkMiddleware = factory.createMiddleware((c, next) => {
  const { CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY } = env(c)

  return _clerkMiddleware({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLISHABLE_KEY
  })(c, next)
})
