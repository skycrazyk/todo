import type { Database } from '@db/sqlite'
import { initApp, initDB } from '../../utils/index.ts'
import { userFoo, type ZTestUser } from './user.ts'

export function initTestApp(user: ZTestUser = userFoo, db?: Database) {
  const resolvedDB = db || initDB(':memory:')

  const app = initApp({
    db: resolvedDB,
    authMiddleware: async (_c, next) => await next(),
    authApplyMiddleware: async (c, next) => {
      c.set('auth', user)

      return await next()
    }
  })

  return { app, db: resolvedDB }
}
