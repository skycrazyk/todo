import { assertEquals } from '@std/assert'
import {
  initTestApp,
  addUser,
  userFoo,
  userBar,
  addList,
  addTodo
} from './helpers/index.ts'

Deno.test('GET /todos returns todos', async () => {
  const { app, db } = initTestApp()
  const user = addUser(db, userFoo)
  const list = addList(db, { title: 'Test list', user_id: user.id })

  const todos = [
    { title: 'Todo 1', list_id: list.id, done: 0 },
    { title: 'Todo 2', list_id: list.id, done: 1 }
  ].map((t) => addTodo(db, t))

  const query = new URLSearchParams({ list_id: list.id.toString() })

  const res = await app.request(`todos?${query.toString()}`, {
    method: 'GET'
  })

  const data = await res.json()

  assertEquals(res.status, 200)
  assertEquals(data, todos)
})

Deno.test('GET /todos userFoo cannot access userBar todos', async () => {
  const { db } = initTestApp(userBar)
  const userBarRecord = addUser(db, userBar)

  const listBar = addList(db, {
    title: 'UserBar list',
    user_id: userBarRecord.id
  })

  const _todosBar = [
    { title: 'UserBar Todo 1', list_id: listBar.id, done: 0 },
    { title: 'UserBar Todo 2', list_id: listBar.id, done: 1 }
  ].map((t) => addTodo(db, t))

  // Now switch to userFoo with the same database
  const { app: appFoo } = initTestApp(userFoo, db)
  addUser(db, userFoo)

  const query = new URLSearchParams({ list_id: listBar.id.toString() })

  const res = await appFoo.request(`todos?${query.toString()}`, {
    method: 'GET'
  })

  assertEquals(res.status, 404)
})
