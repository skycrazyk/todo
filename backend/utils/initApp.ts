import { logger } from 'hono/logger'
import todo from '../api/todo.ts'
import todos from '../api/todos.ts'
import list from '../api/list.ts'
import lists from '../api/lists.ts'
import { userMiddleware } from '../middlewares/userMiddleware.ts'
import { authRequireMiddleware } from '../middlewares/authRequireMiddleware.ts'
import { dbMiddleware } from '../middlewares/dbMiddleware.ts'
import { errorHandler } from '../middlewares/errorHandler.ts'
import { factory } from '../factory.ts'
import type { Database } from '@db/sqlite'
import type { MiddlewareHandler } from 'hono'
import { corsMiddleware } from '../middlewares/corsMiddleware.ts'

export const initApp = ({
  db,
  authMiddleware,
  authApplyMiddleware
}: {
  db: Database
  authMiddleware: MiddlewareHandler
  authApplyMiddleware: MiddlewareHandler
}) => {
  return factory
    .createApp()
    .use(logger())
    .use(dbMiddleware(db))
    .use(corsMiddleware)
    .use(authMiddleware)
    .use(authApplyMiddleware)
    .use(authRequireMiddleware)
    .use(userMiddleware)
    .route('/todo', todo)
    .route('/todos', todos)
    .route('/list', list)
    .route('/lists', lists)
    .onError(errorHandler)
}
