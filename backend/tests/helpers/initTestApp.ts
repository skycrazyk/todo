import { initApp, initDB } from '../../utils/index.ts'
import { user } from './user.ts'

// TODO добавить возможность слать запросы от имени разных пользователей
// для тестирования прав доступа и изоляции данных
export function initTestApp() {
  const db = initDB(':memory:')

  const app = initApp({
    db,
    authMiddleware: async (_c, next) => await next(),
    authApplyMiddleware: async (c, next) => {
      c.set('auth', user)

      return await next()
    }
  })

  return { app, db }
}
