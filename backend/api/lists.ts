import { Hono } from 'hono'
import { db } from '../database.ts'
import type { Env } from '../main.ts'
import type { List } from './list.ts'

const app = new Hono<Env>().get('/', (c) => {
  const user = c.get('user')

  const stmt = db.prepare(`
    SELECT * 
    FROM lists 
    WHERE user_id = (:user_id)
  `)

  const lists = stmt.all<List>({ user_id: user.id })

  return c.json(lists)
})

export default app
