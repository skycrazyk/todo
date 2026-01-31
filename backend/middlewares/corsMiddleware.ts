import { env } from 'hono/adapter'
import { factory } from '../factory.ts'
import { cors } from 'hono/cors'

export const corsMiddleware = factory.createMiddleware((c, next) => {
  const { ALLOWED_ORIGINS } = env(c)

  return cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
  })(c, next)
})
