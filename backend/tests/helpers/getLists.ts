import type { Database } from '@db/sqlite'
import type { List } from '../../api/list.ts'

export function getLists(db: Database, userId: number) {
  return db
    .prepare(
      `
        SELECT * 
        FROM lists 
        WHERE user_id = :user_id
    `
    )
    .all<List>({ user_id: userId })
}
