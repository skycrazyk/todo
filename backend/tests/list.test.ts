import { assertEquals } from '@std/assert'
import type { ZDelete, ZPatch, ZPost } from '../api/list.ts'
import {
  initTestApp,
  getLists,
  addUser,
  userFoo,
  addList
} from './helpers/index.ts'

Deno.test('POST /list returns success message', async () => {
  const { app, db } = initTestApp()
  const user = addUser(db, userFoo)
  const title = 'Test list'

  const res = await app.request('/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title } satisfies ZPost)
  })

  const data = await res.json()
  const list = getLists(db, user.id)[0]

  assertEquals(res.status, 200)
  assertEquals(typeof data.message, 'string')
  assertEquals(list.title, title)
})

Deno.test('DELETE /list removes a list', async () => {
  const title = 'Test list'
  const { app, db } = initTestApp()
  const user = addUser(db, userFoo)
  const list = addList(db, { title, user_id: user.id })

  const res = await app.request('/list', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: list.id } satisfies ZDelete)
  })

  const data = await res.json()
  const lists = getLists(db, user.id)

  assertEquals(res.status, 200)
  assertEquals(typeof data.message, 'string')
  assertEquals(lists.length, 0)
})

Deno.test("PATCH /list changes list's title", async () => {
  const title = 'Test list'
  const newTitle = 'Updated title'
  const { app, db } = initTestApp()
  const user = addUser(db, userFoo)
  let list = addList(db, { title, user_id: user.id })

  const res = await app.request('/list', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: list.id,
      title: newTitle
    } satisfies ZPatch)
  })

  const data = await res.json()
  list = getLists(db, user.id)[0]

  assertEquals(res.status, 200)
  assertEquals(typeof data.message, 'string')
  assertEquals(list.title, newTitle)
})
