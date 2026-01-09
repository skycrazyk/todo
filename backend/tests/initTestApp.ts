import { initApp, initDB } from '../utils/index.ts'

export function initTestApp() {
  const db = initDB(':memory:')

  const app = initApp({
    db,
    authMiddleware: async (_c, next) => await next(),
    authApplyMiddleware: async (c, next) => {
      c.set('auth', {
        sub: 'test-user-id',
        iss: 'test-issuer',
        email: 'test@example.com'
      })

      return await next()
    }
  })

  return { app, db }
}
