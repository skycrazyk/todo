import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../database.ts'
import type { CudRes } from '../common.ts'

export const zTodo = z.object({
  id: z.number(),
  title: z.string(),
  done: z.boolean()
})

export type Todo = z.infer<typeof zTodo>

const zPost = zTodo.pick({ title: true })
const zDelete = zTodo.pick({ id: true })
const zPatch = zTodo.partial({ title: true, done: true })

const app = new Hono()
  .post('/', zValidator('json', zPost), (c) => {
    const data = c.req.valid('json')
    const insert = db.prepare('INSERT INTO todos(title) VALUES (:title)')
    const result = insert.run(data)

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
      .filter((c) => c !== 'id')
      .map((c) => `${c} = (:${c})`)
      .join(', ')

    const patchRow = db.prepare(
      `UPDATE todos SET ${setClauses} WHERE id = (:id)`
    )

    const result = patchRow.run(data)

    return c.json<CudRes>(
      result
        ? { success: true, msg: 'Todo updated successfully' }
        : { error: true, msg: 'Todo wasn`t updated' }
    )
  })
  .delete('/', zValidator('json', zDelete), (c) => {
    const data = c.req.valid('json')
    const deleteRow = db.prepare('DELETE FROM todos WHERE id = (:id)')
    const result = deleteRow.run(data)

    return c.json<CudRes>(
      result
        ? { success: true, msg: 'Todo deleted successfully' }
        : { error: true, msg: 'Todo wasn`t deleted' }
    )
  })

export default app
