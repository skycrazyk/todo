import { Hono } from 'hono'
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../database.ts'
import type { Todo } from './todo.ts'
import type { Env } from '../main.ts'

const zGet = z.object({ list_id: z.number(), done: z.stringbool().optional() })

const app = new Hono<Env>().get('/', zValidator('query', zGet), (c) => {
  const user = c.get('user')
  const query = c.req.valid('query')

  const listStmt = db.prepare(`
    SELECT * 
    FROM lists 
    WHERE id = (:list_id) AND user_id = (:user_id)
  `)

  const list = listStmt.get({ id: query.list_id, user_id: user.id })

  if (!list) {
    return c.json<Todo[]>([])
  }

  const whereClauses = Object.keys(query)
    .map((c) => `${c} = (:${c})`)
    .join(' AND ')

  const todos = db.prepare(`
    SELECT * 
    FROM todos 
    ${whereClauses.length ? `WHERE ${whereClauses}` : ''}
  `)

  return c.json<Todo[]>(todos.all(query))
})

export default app
