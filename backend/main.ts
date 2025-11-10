import { Hono } from 'hono'
import { cors } from 'hono/cors'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from './database.ts'

const zPost = z.object({
  title: z.string()
})

const zDelete = z.object({
  id: z.number()
})

export const zTodo = z.object({
  id: z.number(),
  title: z.string(),
  done: z.boolean()
})

export type Todo = z.infer<typeof zTodo>

const zPatch = zTodo.partial({ title: true, done: true })
type CrudResp = {
  msg: string
} & ({ success: boolean; error?: never } | { success?: never; error: boolean })

const app = new Hono()
  .use(
    cors({
      origin: '*', // Replace with the actual origin of your frontend application
      credentials: true // Set to true if you need to send cookies or authentication headers
    })
  )
  .get('/todos', (c) => {
    const list = db.prepare('SELECT * FROM todos')
    return c.json(list.all() as Todo[])
  })
  .post('/todo', zValidator('json', zPost), (c) => {
    const data = c.req.valid('json')
    const insert = db.prepare('INSERT INTO todos(title) VALUES (:title)')
    const result = insert.run(data)

    return c.json<CrudResp>(
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
  .delete('/todo', zValidator('json', zDelete), (c) => {
    const data = c.req.valid('json')
    const deleteRow = db.prepare('DELETE FROM todos WHERE id = (:id)')
    const result = deleteRow.run(data)

    return c.json<CrudResp>(
      result
        ? { success: true, msg: 'Todo deleted successfully' }
        : { error: true, msg: 'Todo wasn`t deleted' }
    )
  })
  .patch('/todo', zValidator('json', zPatch), (c) => {
    const data = c.req.valid('json')

    const setClauses = Object.keys(data)
      .filter((c) => c !== 'id')
      .map((c) => `${c} = (:${c})`)
      .join(', ')

    console.log('REQUEST =============================')
    console.log(`UPDATE todos SET ${setClauses} WHERE id = (:id)`)
    console.log(data)

    const patchRow = db.prepare(
      `UPDATE todos SET ${setClauses} WHERE id = (:id)`
    )

    const result = patchRow.run(data)

    return c.json<CrudResp>(
      result
        ? { success: true, msg: 'Todo updated successfully' }
        : { error: true, msg: 'Todo wasn`t updated' }
    )
  })

export default app

export type AppType = typeof app
