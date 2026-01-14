import type { Database } from '@db/sqlite'
import type { Todo } from '../../api/todo.ts'

export function addTodo(
  db: Database,
  payload: { title: string; done: boolean; list_id: number }
) {
  const todo = db
    .prepare(
      `
        INSERT INTO todos (title, done, list_id)
        VALUES (:title, :done, :list_id)
        RETURNING *
    `
    )
    .get<Todo>(payload)

  if (!todo) {
    throw new Error('Failed to add todo')
  }

  return todo
}
