import type { Database } from '@db/sqlite'
import type { Todo } from '../../api/todo.ts'

export function getTodos(db: Database, listId: number) {
  return db
    .prepare(
      `
        SELECT * 
        FROM todos 
        WHERE list_id = :list_id
    `
    )
    .all<Todo>({ list_id: listId })
}
