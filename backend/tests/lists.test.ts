import { assertEquals } from '@std/assert'
import { initTestApp } from './initTestApp.ts'
import type { ZPost } from '../api/list.ts'

Deno.test('POST /list returns success message', async () => {
  const { app } = initTestApp()

  const res = await app.request('/list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'New List' } satisfies ZPost)
  })

  const data = await res.json()

  assertEquals(res.status, 200)
  assertEquals(typeof data.message, 'string')
})
