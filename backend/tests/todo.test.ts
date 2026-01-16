import { assertEquals } from '@std/assert'
import {
  initTestApp,
  addUser,
  user as testUser,
  addList,
  addTodo,
  getTodos
} from './helpers/index.ts'

Deno.test('POST /todo creates a new todo', async () => {
  const { app, db } = initTestApp()
  const user = addUser(db, testUser)
  const list = addList(db, { title: 'Test list', user_id: user.id })
  const title = 'Test todo'

  const res = await app.request('/todo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, list_id: list.id })
  })

  const data = await res.json()
  const todos = getTodos(db, list.id)

  assertEquals(res.status, 200)
  assertEquals(typeof data.message, 'string')
  assertEquals(todos.length, 1)
  assertEquals(todos[0].title, title)
  assertEquals(todos[0].list_id, list.id)
})

Deno.test('DELETE /todo removes a todo', async () => {
  const { app, db } = initTestApp()
  const user = addUser(db, testUser)
  const list = addList(db, { title: 'Test list', user_id: user.id })
  const todo = addTodo(db, {
    title: 'Test todo',
    list_id: list.id,
    done: false
  })

  const res = await app.request('/todo', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: todo.id, list_id: list.id })
  })

  const data = await res.json()
  const todos = getTodos(db, list.id)

  assertEquals(res.status, 200)
  assertEquals(typeof data.message, 'string')
  assertEquals(todos.length, 0)
})

Deno.test("PATCH /todo changes todo's title and done status", async () => {
  const { app, db } = initTestApp()
  const user = addUser(db, testUser)
  const list = addList(db, { title: 'Test list', user_id: user.id })
  let todo = addTodo(db, { title: 'Test todo', list_id: list.id, done: false })
  const newTitle = 'Updated todo'

  const res = await app.request('/todo', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: todo.id,
      list_id: list.id,
      title: newTitle,
      done: true
    })
  })

  const data = await res.json()
  todo = getTodos(db, list.id)[0]

  assertEquals(res.status, 200)
  assertEquals(typeof data.message, 'string')
  assertEquals(todo.title, newTitle)
  // TODO ошибка типизации. Изменить тип поля в БД или изменить тип TODO.done на number
  assertEquals(todo.done, 1)
})
