import { Hono } from 'hono'
import { cors } from 'hono/cors'
import todo from './todo.ts'
import todos from './todos.ts'

const app = new Hono()
  .use(
    cors({
      origin: '*', // Replace with the actual origin of your frontend application
      credentials: true // Set to true if you need to send cookies or authentication headers
    })
  )
  .route('/todo', todo)
  .route('/todos', todos)

export default app

export type AppType = typeof app
