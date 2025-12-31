import { cors } from 'hono/cors'
import todo from './api/todo.ts'
import todos from './api/todos.ts'
import list from './api/list.ts'
import lists from './api/lists.ts'
import { userMiddleware } from './middlewares/userMiddleware.ts'
import { authApplyMiddleware } from './middlewares/authApplyMiddleware.ts'
import { authRequireMiddleware } from './middlewares/authRequireMiddleware.ts'
import { dbMiddleware } from './middlewares/dbMiddleware.ts'
import { clerkMiddleware } from './middlewares/clerkMiddleware.ts'
import { errorHandler } from './middlewares/errorHandler.ts'
import { factory } from './factory.ts'
import { createDB } from './database.ts'

const app = factory
  .createApp()
  .use(dbMiddleware(createDB('database.db')))
  .use(
    cors({
      origin: '*', // Replace with the actual origin of your frontend application
      credentials: true // Set to true if you need to send cookies or authentication headers
    })
  )
  .use(clerkMiddleware)
  .use(authApplyMiddleware)
  .use(authRequireMiddleware)
  .use(userMiddleware)
  .route('/todo', todo)
  .route('/todos', todos)
  .route('/list', list)
  .route('/lists', lists)
  .onError(errorHandler)

export default app

export type AppType = typeof app

export type { Todo } from './api/todo.ts'
export type { List } from './api/list.ts'
