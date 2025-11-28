import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from './database.ts'
import type { Todo } from './todo.ts'

const zGet = z.object({ done: z.stringbool().optional() })

const app = new Hono().get('/', zValidator('query', zGet), (c) => {
  const data = c.req.valid('query')

  const whereClauses = Object.keys(data)
    .map((c) => `${c} = (:${c})`)
    .join(' AND ')

  const list = db.prepare(
    `SELECT * FROM todos ${whereClauses.length ? `WHERE ${whereClauses}` : ''}`
  )

  return c.json(list.all(data) as Todo[])
})

export default app
