import { assertEquals } from '@std/assert'
import { initTestApp } from './initTestApp.ts'

Deno.test('GET /lists returns empty list for new user', async () => {
  const { app } = initTestApp()

  const res = await app.request('/lists')
  const data = await res.json()

  assertEquals(res.status, 200)
  assertEquals(data, [])
})
