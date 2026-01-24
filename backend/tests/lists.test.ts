import { assertEquals } from '@std/assert'
import { addList, addUser, initTestApp } from './helpers/index.ts'
import { userBar, userFoo } from './helpers/user.ts'

Deno.test('GET /lists returns empty list for new user', async () => {
  const { app } = initTestApp()

  const res = await app.request('/lists')
  const data = await res.json()

  assertEquals(res.status, 200)
  assertEquals(data, [])
})

Deno.test('GET /lists returns user`s lists', async () => {
  const { app, db } = initTestApp()

  const userA = addUser(db, userFoo)
  const userB = addUser(db, userBar)

  const { user_id: _omit1, ...list1 } = addList(db, {
    title: 'List 1',
    user_id: userA.id
  })

  const { user_id: _omit2, ...list2 } = addList(db, {
    title: 'List 2',
    user_id: userA.id
  })

  addList(db, { title: 'List 3', user_id: userB.id })

  const res = await app.request('/lists')
  const data = await res.json()

  assertEquals(res.status, 200)
  assertEquals(data, [list1, list2])
  assertEquals(data.length, 2)
})
