import type { Database } from '@db/sqlite'
import type { List } from '../../api/list.ts'

export function addList(db: Database, title: string, userId: number) {
  const list = db
    .prepare(
      `
        INSERT INTO lists (title, user_id)
        VALUES (:title, :user_id)
        RETURNING *
    `
    )
    .get<List>({
      title,
      user_id: userId
    })

  if (!list) {
    throw new Error('Failed to add list')
  }

  return list
}
