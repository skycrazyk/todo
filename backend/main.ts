import { initApp, initDB } from './utils/index.ts'
import { clerkMiddleware as authMiddleware } from './middlewares/clerkMiddleware.ts'
import { authApplyMiddleware } from './middlewares/authApplyMiddleware.ts'

const app = initApp({
  db: initDB('./database.db'),
  authMiddleware,
  authApplyMiddleware
})

export default app

export type AppType = typeof app
export type { Todo } from './api/todo.ts'
export type { ListRes as List } from './api/list.ts'
