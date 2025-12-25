import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../database.ts'
import { exception, success, zValidator } from '../utils/index.ts'
import type { Env } from '../main.ts'

export const zTodo = z.object({
  id: z.number(),
  title: z.string(),
  done: z.boolean(),
  list_id: z.number()
})

export type Todo = z.infer<typeof zTodo>

const zPost = zTodo.pick({ title: true, list_id: true })
const zDelete = zTodo.pick({ id: true, list_id: true })
const zPatch = zTodo.partial({ title: true, done: true })

const app = new Hono<Env>()
  .post('/', zValidator('json', zPost), (c) => {
    const data = c.req.valid('json')

    const result = db
      .prepare(
        `
      INSERT INTO todos(title, list_id) 
      VALUES (:title, :list_id)
    `
      )
      .run(data)

    if (!result) {
      exception(c, 500, 'Todo wasn`t created')
    }

    return success(c, 'Todo created successfully')
  })
  .patch('/', zValidator('json', zPatch), (c) => {
    const data = c.req.valid('json')

    const setClauses = Object.keys(data)
      .filter((c) => !['id', 'list_id'].includes(c))
      .map((c) => `${c} = (:${c})`)
      .join(', ')

    const result = db
      .prepare(
        `
      UPDATE todos 
      SET ${setClauses} 
      WHERE id = (:id) AND list_id = (:list_id)
    `
      )
      .run(data)

    if (!result) {
      exception(c, 500, "Todo wasn't updated")
    }

    return success(c, 'Todo updated successfully')
  })
  .delete('/', zValidator('json', zDelete), (c) => {
    const data = c.req.valid('json')

    const result = db
      .prepare(
        `
      DELETE FROM todos 
      WHERE id = (:id) AND list_id = (:list_id)
    `
      )
      .run(data)

    if (!result) {
      exception(c, 500, 'Todo wasn`t deleted')
    }

    return success(c, 'Todo deleted successfully')
  })

export default app
