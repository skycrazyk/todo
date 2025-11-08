import type { AppType } from '@app/backend'
import { hc } from 'hono/client'

export const client = hc<AppType>('http://localhost:8000')

// client.todo.$post({ json: { title: 'New Todo' } }).then(async (res) => {
//   console.log('Created Todo:', await res.json())
// })
