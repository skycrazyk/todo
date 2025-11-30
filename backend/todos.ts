import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from './database.ts'
import type { Todo } from './todo.ts'
import type { CudRes } from './common.ts'

const zGet = z.object({ done: z.stringbool().optional() })
const zPost = z.object({ title: z.string().optional() })

const app = new Hono()
  .get('/', zValidator('query', zGet), (c) => {
    const data = c.req.valid('query')

    const whereClauses = Object.keys(data)
      .map((c) => `${c} = (:${c})`)
      .join(' AND ')

    const list = db.prepare(
      `SELECT * FROM todos ${
        whereClauses.length ? `WHERE ${whereClauses}` : ''
      }`
    )

    return c.json(list.all(data) as Todo[])
  })
  .post('/', zValidator('json', zPost), (c) => {
    const data = c.req.valid('json')
    const insert = db.prepare('INSERT INTO lists(title) VALUES (:title)')
    const result = insert.run(data)

    return c.json<CudRes>(
      result
        ? { success: true, msg: 'List created successfully' }
        : { error: true, msg: 'List wasn`t created' }
    )
  })

export default app
