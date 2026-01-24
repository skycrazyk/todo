import type { ListRes } from './list.ts'
import { factory } from '../factory.ts'

const app = factory.createApp().get('/', (c) => {
  const user = c.get('user')

  const stmt = c.get('db').prepare(`
    SELECT id, title 
    FROM lists 
    WHERE user_id = (:user_id)
  `)

  const lists = stmt.all<ListRes>({ user_id: user.id })

  return c.json(lists)
})

export default app
