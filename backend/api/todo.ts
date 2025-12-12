import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../database.ts'
import type { CudRes } from '../common.ts'

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

const app = new Hono()
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

    return c.json<CudRes>(
      result
        ? {
            success: true,
            msg: 'Todo created successfully'
          }
        : {
            error: true,
            msg: 'Todo wasn`t created'
          }
    )
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

    return c.json<CudRes>(
      result
        ? { success: true, msg: 'Todo updated successfully' }
        : { error: true, msg: "Todo wasn't updated" }
    )
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

    return c.json<CudRes>(
      result
        ? { success: true, msg: 'Todo deleted successfully' }
        : { error: true, msg: 'Todo wasn`t deleted' }
    )
  })

export default app
