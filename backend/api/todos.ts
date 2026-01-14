import { z } from 'zod'
import { zValidator, exception } from '../utils/index.ts'
import type { Todo } from './todo.ts'
import { factory } from '../factory.ts'

const zGet = z.object({
  list_id: z.coerce.number(),
  done: z.stringbool().optional()
})

const app = factory.createApp().get('/', zValidator('query', zGet), (c) => {
  const user = c.get('user')
  const query = c.req.valid('query')
  const db = c.get('db')

  const listStmt = db.prepare(`
    SELECT * 
    FROM lists 
    WHERE id = (:id) AND user_id = (:user_id)
  `)

  const list = listStmt.get({ id: query.list_id, user_id: user.id })

  if (!list) {
    exception(c, 404, 'List not found')
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
