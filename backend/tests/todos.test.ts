import { assertEquals } from '@std/assert'
import { initTestApp } from './helpers/initTestApp.ts'
import { addUser } from './helpers/addUser.ts'
import { user as testUser } from './helpers/user.ts'
import { addList } from './helpers/addList.ts'
import { addTodo } from './helpers/addTodo.ts'

Deno.test('GET /todos returns todos', async () => {
  const { app, db } = initTestApp()
  const user = addUser(db, testUser)
  const list = addList(db, { title: 'Test list', user_id: user.id })

  const todos = [
    { title: 'Todo 1', list_id: list.id, done: false },
    { title: 'Todo 2', list_id: list.id, done: true }
  ].map((t) => addTodo(db, t))

  const query = new URLSearchParams({ list_id: list.id.toString() })

  const res = await app.request(`todos?${query.toString()}`, {
    method: 'GET'
  })

  const data = await res.json()

  assertEquals(res.status, 200)
  assertEquals(data, todos)
})
